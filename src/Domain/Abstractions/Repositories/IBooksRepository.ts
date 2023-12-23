import { BookDto } from 'Domain/Dtos/BookDto'
import { IRepository } from './IRepository'
import {Book} from 'Domain/Types/Book'

export interface IBooksRepository extends IRepository<Book, BookDto>
{
}