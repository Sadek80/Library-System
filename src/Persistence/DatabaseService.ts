import { IDatabaseService } from 'Domain/Abstractions/IDatabaseService';
import { Pool } from 'mysql2/promise';
import mysql from 'mysql2'
import dotenv from 'dotenv'
dotenv.config()

export class DatabaseService implements IDatabaseService
{
    private _pool: Pool | null = null;

    async connect() {
        this._pool = await mysql.createPool({
            host: process.env.MYSQL_HOST,
            user: process.env.MYSQL_USER,
            password: process.env.MYSQL_PASSWORD,
            database: process.env.MYSQL_DATABASE,
            port: parseInt(process.env.MYSQL_PORT)
        }).promise();
    }

    getConnection() : Pool {
        return this._pool;
    }

}