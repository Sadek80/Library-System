import { IBooksRepository } from "Domain/Abstractions/Repositories/IBooksRepository";
import { Response } from "Domain/Dtos/Response";
import { StatusCodes } from "Domain/Abstractions/Helpers/StatusCodes";
import { IBooksService } from "Domain/Abstractions/Services/IBooksService";
import { BookDto } from "Domain/Dtos/Books/BookDto";
import {BookQueryParams} from 'Domain/Dtos/Books/BookQueryParams'
import { injectable, inject } from 'inversify';


@injectable()
export class BooksService implements IBooksService
{
    constructor(@inject("IBooksRepository") private readonly _booksRepository : IBooksRepository)
    {
    }

    async add(book: BookDto): Promise<Response<number>> 
    {
        if (!book.title || !book.author || !book.isbn || !book.available_quantity || !book.shelf_location) {
            return Response.createInstance<number>("Please Provide Valid Data!", StatusCodes.BadRequest);
        }

        let isBookExisted = await this._booksRepository.isBookExists(book.isbn, null);

        if(isBookExisted)
        {
            return Response.createInstance<number>("Book already exists.", StatusCodes.Conflict);
        }

        let result = await this._booksRepository.add(book);

        if(result > 0)
        {
            return Response.createInstance<number>(result, StatusCodes.Created, "Book Added Successfully!");
        }

        return Response.createInstance<number>("Error Happened!", StatusCodes.BadRequest);
    }

    async update(id: number, book: BookDto): Promise<Response<number>> {
        if (!book.title || !book.author || !book.isbn || !book.available_quantity || !book.shelf_location) {
            return Response.createInstance<number>("Please Provide Valid Data!", StatusCodes.BadRequest);
        }

        let isBookExisted = await this._booksRepository.isBookExists(book.isbn, id);

        if(isBookExisted)
        {
            return Response.createInstance<number>("There is another Book with the Same ISBN.", StatusCodes.Conflict);
        }

        let result = await this._booksRepository.update(id, book);

        if(result > 0)
        {
            return Response.createInstance<number>(result, StatusCodes.NoContent, "Book Updated Successfully!");
        }

        return Response.createInstance<number>("Book is Not Found!", StatusCodes.NotFound);   
    }

    async delete(id: number): Promise<Response<number>> {
        let result = await this._booksRepository.delete(id);

        if(result > 0)
        {
            return Response.createInstance<number>(result, StatusCodes.NoContent, "Book Deleted Successfully!");
        } 
        
        return Response.createInstance<number>("Book is Not Found or already deleted.", StatusCodes.NotFound);   
    }

    async get(id: number): Promise<Response<BookDto>> {
        let result = await this._booksRepository.get(id);

        if(result)
        {
            return Response.createInstance<BookDto>(result, StatusCodes.Ok);
        }

        return Response.createInstance<BookDto>("Book is Not Found", StatusCodes.NotFound);
    }

    async list(): Promise<Response<BookDto[]>> {
        let result = await this._booksRepository.list();
        return Response.createInstance<BookDto[]>(result, StatusCodes.Ok)
    }

    async search(bookQueryParams: BookQueryParams): Promise<Response<BookDto[]>>
    {
        let result = await this._booksRepository.search(bookQueryParams);
        return Response.createInstance<BookDto[]>(result, StatusCodes.Ok)
    }
}