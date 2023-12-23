import { IDatabaseService } from "Domain/Abstractions/IDatabaseService";
import { IBooksRepository } from "Domain/Abstractions/Repositories/IBooksRepository";
import { Pool } from 'mysql2/promise';
import { BookDto } from "Domain/Dtos/BookDto";
import { Book } from "Domain/Types/Book";

export class BooksRepository implements IBooksRepository{
    private readonly _dbConnection : Pool;

    constructor(private readonly _dbService : IDatabaseService)
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
        SELECT title, author, isbn, shelf_location, available_quantity 
        FROM books 
        WHERE id = ?
        `, [id]);

        return result[0];
    }

     async list(): Promise<BookDto[]> {
        const [result] : any = await this._dbConnection.query(`
        SELECT title, author, isbn, shelf_location, available_quantity 
        FROM books 
        `);

        return result;
    }

}