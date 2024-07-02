import {
  AbstractPowerSyncDatabase,
  BaseObserver,
  CrudEntry,
  PowerSyncBackendConnector,
  UpdateType
} from '@powersync/web';
import { Session, SupabaseClient, createClient } from '@supabase/supabase-js';

export type SupabaseConfig = {
  supabaseUrl: string;
  supabaseAnonKey: string;
  powersyncUrl: string;
};

export type SupabaseConnectorListener = {
  initialized: () => void;
  sessionStarted: (session: Session) => void;
};

/// Postgres Response codes that we cannot recover from by retrying.
const FATAL_RESPONSE_CODES = [
  new RegExp('^22...$'),
  new RegExp('^23...$'),
  new RegExp('^42501$')
];

export class SupabaseConnector
  extends BaseObserver<SupabaseConnectorListener>
  implements PowerSyncBackendConnector
{
  readonly client: SupabaseClient;
  readonly config: SupabaseConfig;
  ready: boolean = false;
  currentSession: Session | null = null;

  constructor() {
    super();
    this.config = {
      supabaseUrl: import.meta.env.VITE_SUPABASE_URL,
      powersyncUrl: import.meta.env.VITE_POWERSYNC_URL,
      supabaseAnonKey: import.meta.env.VITE_SUPABASE_ANON_KEY
    };
    this.client = createClient(
      this.config.supabaseUrl,
      this.config.supabaseAnonKey,
      { auth: { persistSession: true } }
    );
  }

  async init() {
    if (this.ready) {
      return;
    }

    const sessionResponse = await this.client.auth.getSession();
    this.updateSession(sessionResponse.data.session);

    this.ready = true;
    this.iterateListeners((cb) => cb.initialized?.());
  }

  async getLoggedInUser() {
    const {
      data: { user },
      error
    } = await this.client.auth.getUser();
    return { user, error };
  }

  async register(username: string, password: string) {
    const {
      data: { user, session },
      error
    } = await this.client.auth.signUp({
      email: username,
      password
    });
    if (error) {
      console.error('SupabaseConnector ~ register ~ error:', error);
    }
    if (session) {
      this.updateSession(session);
    }
    return {
      user,
      session,
      error
    };
  }

  async login(username: string, password: string) {
    try {
      const {
        data: { session },
        error
      } = await this.client.auth.signInWithPassword({
        email: username,
        password
      });
      if (error) {
        console.error('SupabaseConnector ~ login ~ error:', error);
      }
      if (session) {
        this.updateSession(session);
      }
      return {
        session,
        error
      };
    } catch (error) {
      return {
        error: new Error('Error al iniciar sesión')
      };
    }
  }

  async logout() {
    const { error } = await this.client.auth.signOut();
    if (error) {
      console.error('SupabaseConnector ~ logout ~ error:', error);
    }
    this.updateSession(null);
  }

  async createNewUser(email: string, password: string) {
    const { data, error } = await this.client.auth.signUp({
      email,
      password
    });
    return { user: data.user, error };
  }

  async fetchCredentials() {
    const {
      data: { session },
      error
    } = await this.client.auth.getSession();
    if (!session || error) {
      console.error(`Could not fetch Supabase credentials: ${error}`);
      return null;
    }

    console.debug('session expires at', session.expires_at);

    return {
      client: this.client,
      endpoint: this.config.powersyncUrl,
      token: session.access_token ?? '',
      expiresAt: session.expires_at
        ? new Date(session.expires_at * 1000)
        : undefined
    };
  }

  async uploadData(database: AbstractPowerSyncDatabase): Promise<void> {
    const transaction = await database.getNextCrudTransaction();
    if (!transaction) {
      return;
    }

    let lastOp: CrudEntry | null = null;
    try {
      for (const op of transaction.crud) {
        lastOp = op;
        const table = this.client.from(op.table);

        let result: unknown;
        switch (op.op) {
          case UpdateType.PUT:
            // eslint-disable-next-line no-case-declarations
            const record = { ...op.opData, id: op.id };
            result = await table.upsert(record);
            break;
          case UpdateType.PATCH:
            result = await table.update(op.opData).eq('id', op.id);
            break;
          case UpdateType.DELETE:
            result = await table.delete().eq('id', op.id);
            break;
        }

        if (
          result &&
          typeof result === 'object' &&
          'error' in result &&
          result.error
        ) {
          console.error(result.error);
          throw new Error(
            `Could not update Supabase. Received error: ${result.error}`
          );
        }
      }

      await transaction.complete();
    } catch (ex: unknown) {
      console.debug(ex);
      if (
        ex &&
        typeof ex === 'object' &&
        'code' in ex &&
        typeof ex.code === 'string' &&
        FATAL_RESPONSE_CODES.some((regex) => regex.test(ex.code as string))
      ) {
        console.error(`Data upload error - discarding ${lastOp}`, ex);
        await transaction.complete();
      } else {
        throw ex;
      }
    }
  }

  private updateSession(session: Session | null) {
    this.currentSession = session;
    if (!session) {
      return;
    }
    this.iterateListeners((cb) => cb.sessionStarted?.(session));
  }
}
