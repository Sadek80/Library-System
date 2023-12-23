import { IRepository } from './IRepository'
import {Borrower} from 'Domain/Types/Borrower'
import {BorrowerDto}  from 'Domain/Dtos/BorrowerDto'

export interface IBorrowRepository extends IRepository<Borrower, BorrowerDto>
{
}