import {Schema} from '@powersync/web';
import {User} from '@shared/powersync/schemas';

export const AppSchema = new Schema({
  User,
});
export type Database = (typeof AppSchema)['types'];
export type UserDB = Database['User'];
