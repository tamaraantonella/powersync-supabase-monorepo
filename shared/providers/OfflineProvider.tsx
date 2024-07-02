import { PowerSyncContext } from '@powersync/react';
import React, { useEffect } from 'react';
import { SupabaseConnector } from '@shared/powersync/connector';
import { connector, powerSync, setupPowerSync } from '@shared/powersync/db';
import { Session } from '@supabase/supabase-js';

const SupabaseContext = React.createContext<SupabaseConnector | null>(null);
const useSupabase = () => {
  const context = React.useContext(SupabaseContext);
  if (!context) {
    throw new Error('useSupabase must be used within a SupabaseProvider');
  }
  return context;
};

const OfflineProvider = ({ children }: { children: React.ReactNode }) => {
  useEffect(() => {
    (async () => {
      const sessionResponse = await connector.client.auth.getSession();
      const session: Session | null = sessionResponse.data.session;
      if (session) {
        await setupPowerSync();
      } else {
        await powerSync.disconnectAndClear();
      }
    })();
  }, []);

  return (
    <PowerSyncContext.Provider value={powerSync}>
      <SupabaseContext.Provider value={connector}>
        {children}
      </SupabaseContext.Provider>
    </PowerSyncContext.Provider>
  );
};

export { OfflineProvider, useSupabase };
