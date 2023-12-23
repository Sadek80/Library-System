import { IRepository } from './IRepository'
import {Borrower} from 'Domain/Types/Borrower'
import {BorrowerDto}  from 'Domain/Dtos/BorrowerDto'

export interface IBorrowersRepository extends IRepository<Borrower, BorrowerDto>
{
}