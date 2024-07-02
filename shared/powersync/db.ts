import {PowerSyncDatabase} from '@powersync/web';
import {AppSchema, Database} from '@shared/powersync/AppSchema';
import {wrapPowerSyncWithKysely} from '@powersync/kysely-driver';
import {Capacitor} from '@capacitor/core';
import {SupabaseConnector} from '@shared/powersync/connector';

const platform = Capacitor.getPlatform();
const isIOs = platform === 'ios';
// Web worker implementation does not work on iOS
const useWebWorker = !isIOs;
const enableMultiTabs = platform === 'web';

export const powerSync = new PowerSyncDatabase({
  schema: AppSchema,
  database:{
    dbFilename: `db_test.sqlite`,
  },
  flags: {
    disableSSRWarning: true,
    useWebWorker,
    enableMultiTabs,
  }
});


export const db = wrapPowerSyncWithKysely<Database>(powerSync);
export const connector = new SupabaseConnector();

export const setupPowerSync = async () => {
  try {
    await powerSync.init();
    await connector.init();
    await powerSync.connect(connector);
  } catch (error) {
    console.error('Error al inicializar PowerSync:', error);
  }
};
