import { promises as fs } from 'fs';
import { FileMigrationProvider, Migrator } from 'kysely';
import { db } from './database';
import path from 'path';

export const migrator = new Migrator({
  db,
  provider: new FileMigrationProvider({
    fs,
    path,
    migrationFolder: './migrations'
  })
});
