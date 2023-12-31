import { IDatabaseService } from "Domain/Abstractions/IDatabaseService";
import { IBorrowersRepository } from "Domain/Abstractions/Repositories/IBorrowersRepository";
import { BorrowerDto } from "Domain/Dtos/Borrowers/BorrowerDto";
import { BorrowerQueryParams } from "Domain/Dtos/Borrowers/BorrowerQueryParams";
import { Borrower } from "Domain/Types/Borrower";
import { Pool } from 'mysql2/promise';
import { inject, injectable } from 'inversify';
import { BorrowedBookDto } from "Domain/Dtos/Books/BorrowedBookDto";
import { BorrowBookDto } from "Domain/Dtos/Borrowers/BorrowBookDto";
import { ReturnBookDto } from "Domain/Dtos/Borrowers/ReturnBookDto";

@injectable()
export class BorrowersRepository implements IBorrowersRepository{
    private readonly _dbConnection : Pool;

    constructor(@inject("IDatabaseService") private readonly _dbService : IDatabaseService)
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
        SELECT id, name, email
        FROM borrowers 
        WHERE id = ?
        `, [id]);

        return result[0];    
    }

    async list(): Promise<BorrowerDto[]> {
        const [result] : any = await this._dbConnection.query(`
        SELECT id, name, email
        FROM borrowers 
        `);

        return result;    
    }

    async search(borrowerQueryParams: BorrowerQueryParams): Promise<BorrowerDto[]> 
    {
        let query = `
        SELECT id, name, email
        FROM borrowers 
        WHERE 1 = 1
        `;
        const values = [];

        if (borrowerQueryParams.name) {
            query += ' AND name LIKE ?';
            values.push(`%${borrowerQueryParams.name}%`);
        }

        if (borrowerQueryParams.email) {
            query += ' AND email LIKE ?';
            values.push(`%${borrowerQueryParams.email}%`);
        }
        
        const [result] : any = await this._dbConnection.query(query, values);

        return result;
    }

    async isBorrowerExists(email: string, excludedId?: number): Promise<boolean> {
        let query = `
        SELECT 1
        FROM borrowers 
        WHERE email = ?
        `;

        const values = [];

        values.push(email);

        if (excludedId) {
            query += ' AND id <> ?';
            values.push(excludedId);
        }

        const [result] : any = await this._dbConnection.query(query, values);

        if(result[0])
            return true

        return false;    
    }

    async getMyBooks(id: number): Promise<BorrowedBookDto[]> 
    {
        const [result] : any = await this._dbConnection.query(`
        SELECT book.id AS book_id, borrowed.id AS borrowed_book_id, book.title, borrowed.borrow_date, borrowed.due_date, borrowed.borrower_id, borrower.email AS borrower_email
        FROM borrowed_books borrowed
        JOIN books book ON borrowed.book_id = book.id
        JOIN borrowers borrower ON borrowed.borrower_id = borrower.id
        WHERE borrowed.is_returned = FALSE AND borrowed.borrower_id = ?;
        `, [id]);

        return result;    
    }

    async borrowBook(borrowBookDto: BorrowBookDto): Promise<boolean> 
    {
        const [result] : any = await this._dbConnection.query(`
        CALL BorrowBook(?, ?, ?, ?)
        `, [borrowBookDto.book_id, borrowBookDto.borrower_id, borrowBookDto.borrow_date, borrowBookDto.due_date]);

        return result[0][0].succeeded;        
    }

    async returnBook(returnBookDto: ReturnBookDto): Promise<boolean> {
        const [result] : any = await this._dbConnection.query(`
        CALL ReturnBook(?, ?, ?)
        `, [returnBookDto.book_id, returnBookDto.borrowed_book_id, returnBookDto.return_date]);

        return result[0][0].succeeded;            
    }
}