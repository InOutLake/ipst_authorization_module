import {
  ColumnType,
  Generated,
  Insertable,
  Selectable,
  Updateable
} from 'kysely';

export interface Database {
  User: UserTable;
}

export interface UserTable {
  id: Generated<number>;
  name: string;
  surname: string;
  email: string;
  password: string;
  is_confirmed: boolean;
  middlename: string | null;
  username: string | null;
}
export type User = Selectable<UserTable>;
export type NewUser = Insertable<UserTable>;
export type UserUpdate = Updateable<UserTable>;
