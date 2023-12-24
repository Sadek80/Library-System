import { IDatabaseService } from "Domain/Abstractions/IDatabaseService";
import { IBooksRepository } from "Domain/Abstractions/Repositories/IBooksRepository";
import { Pool } from 'mysql2/promise';
import { BookDto } from "Domain/Dtos/Books/BookDto";
import {BookQueryParams} from 'Domain/Dtos/Books/BookQueryParams'
import { Book } from "Domain/Types/Book";
import { inject, injectable } from 'inversify';
import { BorrowedBookDto } from "Domain/Dtos/Books/BorrowedBookDto";

@injectable()
export class BooksRepository implements IBooksRepository{
    private readonly _dbConnection : Pool;

    constructor(@inject("IDatabaseService") private readonly _dbService : IDatabaseService)
    {
        this._dbConnection = _dbService.getConnection();
    }
   
    async add(book: Book): Promise<number> {
         const [result] : any = await this._dbConnection.query(`
            INSERT INTO books (title, author, isbn, available_quantity, shelf_location)
            VALUES (?, ?, ?, ?, ? )
            `, [book.title, book.author, book.isbn, book.available_quantity, book.shelf_location]);

        return result.affectedRows;
    }

    async update(id: number, book: Book): Promise<number> {
        const [result] : any = await this._dbConnection.query(`
            UPDATE books 
            SET title = ?, author = ?, isbn = ?, available_quantity = ?, shelf_location = ? 
            WHERE id = ?
            `, [book.title, book.author, book.isbn, book.available_quantity, book.shelf_location, id]);
            
        return result.affectedRows;   
     }

    async delete(id: number): Promise<number> {
        const [result] : any = await this._dbConnection.query(`
        DELETE 
        FROM books 
        WHERE id = ?
        `, [id]);
        
    return result.affectedRows;       
    }

    async get(id: number): Promise<BookDto> {
        const [result] : any = await this._dbConnection.query(`
        SELECT id, title, author, isbn, shelf_location, available_quantity 
        FROM books 
        WHERE id = ?
        `, [id]);

        return result[0];
    }

     async list(): Promise<BookDto[]> {
        const [result] : any = await this._dbConnection.query(`
        SELECT id, title, author, isbn, shelf_location, available_quantity 
        FROM books 
        `);

        return result;
    }

    async search(bookQueryParams: BookQueryParams): Promise<BookDto[]> {
        let query = `
        SELECT id, title, author, isbn, shelf_location, available_quantity 
        FROM books 
        WHERE 1 = 1
        `;
        const values = [];

        if (bookQueryParams.title) {
            query += ' AND title LIKE ?';
            values.push(`%${bookQueryParams.title}%`);
        }

        if (bookQueryParams.author) {
            query += ' AND author LIKE ?';
            values.push(`%${bookQueryParams.author}%`);
        }
        
        if (bookQueryParams.isbn) {
            query += ' AND ISBN LIKE ?';
            values.push(`%${bookQueryParams.isbn}%`);
        }

        const [result] : any = await this._dbConnection.query(query, values);

        return result;
    }

    async isBookExists(isbn: string, excludedId?: number): Promise<boolean> {
        let query = `
        SELECT 1
        FROM books 
        WHERE isbn = ?
        `;

        const values = [];

        values.push(isbn);

        if (excludedId) {
            query += ' AND id <> ?';
            values.push(excludedId);
        }

        const [result] : any = await this._dbConnection.query(query, values);

        if(result[0])
            return true

        return false;
    }

    async getOverDueBooks(): Promise<BorrowedBookDto[]> 
    {
        const [result] : any = await this._dbConnection.query(`
        SELECT book.id AS book_id, borrowed.id AS borrowed_book_id, book.title, borrowed.borrow_date, borrowed.due_date, borrowed.borrower_id, borrower.email AS borrower_email
        FROM borrowed_books borrowed
        JOIN books book ON borrowed.book_id = book.id
        JOIN borrowers borrower ON borrowed.borrower_id = borrower.id
        WHERE borrowed.is_returned = FALSE AND CURDATE() > borrowed.due_date;
        `);

        return result;
    }
}