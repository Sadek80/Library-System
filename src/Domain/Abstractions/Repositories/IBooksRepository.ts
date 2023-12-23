import { BookDto } from 'Domain/Dtos/Books/BookDto'
import {BookQueryParams} from 'Domain/Dtos/Books/BookQueryParams'
import { IRepository } from './IRepository'
import {Book} from 'Domain/Types/Book'

export interface IBooksRepository extends IRepository<Book, BookDto>
{
    search(bookQueryParams: BookQueryParams) : Promise<BookDto[]>

    isBookExists(isbn: string, excludedId?: number) : Promise<boolean>
}