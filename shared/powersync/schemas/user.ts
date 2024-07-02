import {column, TableV2} from '@powersync/web';

export const User = new TableV2({
  externalId: column.text,
  createdAt: column.text,
  updatedAt: column.text,
  deletedAt: column.text,
  email: column.text,
  phone: column.text,
  name: column.text,
  firstName: column.text,
  lastName: column.text,
  imageUrl: column.text,
  lastSignedInAt: column.text
});
