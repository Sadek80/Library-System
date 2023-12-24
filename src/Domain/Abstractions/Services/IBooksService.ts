import { BookDto } from "Domain/Dtos/Books/BookDto";
import { Response } from "../../Dtos/Response";
import {BookQueryParams} from 'Domain/Dtos/Books/BookQueryParams'
import { BorrowedBookDto } from "Domain/Dtos/Books/BorrowedBookDto";

export interface IBooksService
{
    /**
    * Add a Book
    */
    add(book : BookDto) : Promise<Response<number>>;
    
     /**
     * Update a Book
     */
    update(id : number, book : BookDto) : Promise<Response<number>>;

     /**
     * Delete a Book 
     */
    delete(id : number) : Promise<Response<number>>;

    /**
     * Get a Single Book
     */
    get(id : number) : Promise<Response<BookDto>>;

    /**
     * List All Books
     */
    list() : Promise<Response<BookDto[]>>;

    /**
     * Search for Books by title, author, and isbn
     */
    search(bookQueryParams: BookQueryParams): Promise<Response<BookDto[]>>;

    /**
     * Gets All overdue books
     */
    getOverDueBooks():  Promise<Response<BorrowedBookDto[]>>
}