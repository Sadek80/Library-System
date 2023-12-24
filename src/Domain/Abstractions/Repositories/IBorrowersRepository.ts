import { IRepository } from './IRepository'
import {Borrower} from 'Domain/Types/Borrower'
import {BorrowerDto}  from 'Domain/Dtos/Borrowers/BorrowerDto'
import { BorrowerQueryParams } from 'Domain/Dtos/Borrowers/BorrowerQueryParams'
import { BorrowedBookDto } from 'Domain/Dtos/Books/BorrowedBookDto'
import { BorrowBookDto } from 'Domain/Dtos/Borrowers/BorrowBookDto'
import { ReturnBookDto } from 'Domain/Dtos/Borrowers/ReturnBookDto'

export interface IBorrowersRepository extends IRepository<Borrower, BorrowerDto>
{
    search(borrowerQueryParams: BorrowerQueryParams) : Promise<BorrowerDto[]>

    isBorrowerExists(email: string, excludedId?: number) : Promise<boolean>

    getMyBooks(id: number): Promise<BorrowedBookDto[]>;

    borrowBook(borrowBookDto: BorrowBookDto): Promise<boolean>;

    returnBook(returnBookDto: ReturnBookDto): Promise<boolean>;
}