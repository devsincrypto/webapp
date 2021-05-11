import sqlite from 'better-sqlite3';
import * as path from 'path';

export const db = sqlite(path.join(process.cwd(), './cryptodevs.sqlite'));
