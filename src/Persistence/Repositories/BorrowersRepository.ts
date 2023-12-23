import { IDatabaseService } from "Domain/Abstractions/IDatabaseService";
import { IBorrowersRepository } from "Domain/Abstractions/Repositories/IBorrowersRepository";
import { BorrowerDto } from "Domain/Dtos/Borrowers/BorrowerDto";
import { Borrower } from "Domain/Types/Borrower";
import { Pool } from 'mysql2/promise';

export class BorrowersRepository implements IBorrowersRepository{
    private readonly _dbConnection : Pool;

    constructor(private readonly _dbService : IDatabaseService)
    {
        this._dbConnection = _dbService.getConnection();
    }
    async add(borrower: Borrower): Promise<number> {
        const [result] : any = await this._dbConnection.query(`
            INSERT INTO borrowers (name, email, password_hash)
            VALUES (?, ?, ?)
            `, [borrower.name, borrower.email, borrower.password_hash]);

        return result.affectedRows;    
    }

    async update(id: number, borrower: Borrower): Promise<number> {
        const [result] : any = await this._dbConnection.query(`
            UPDATE borrowers 
            SET name = ?, email = ?,  password_hash = ? 
            WHERE id = ?
            `, [borrower.name, borrower.email, borrower.password_hash, id]);
            
        return result.affectedRows;       
    }

    async delete(id: number): Promise<number> {
        const [result] : any = await this._dbConnection.query(`
        DELETE 
        FROM borrowers 
        WHERE id = ?
        `, [id]);
        
        return result.affectedRows;      
    }

    async get(id: number): Promise<BorrowerDto> {
        const [result] : any = await this._dbConnection.query(`
        SELECT name, email
        FROM borrowers 
        WHERE id = ?
        `, [id]);

        return result[0];    
    }

    async list(): Promise<BorrowerDto[]> {
        const [result] : any = await this._dbConnection.query(`
        SELECT name, email
        FROM borrowers 
        `);

        return result;    
    }
}