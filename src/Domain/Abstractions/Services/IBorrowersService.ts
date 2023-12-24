import { BorrowerQueryParams } from "Domain/Dtos/Borrowers/BorrowerQueryParams";
import { Response } from "../../Dtos/Response";
import { BorrowerDto } from "Domain/Dtos/Borrowers/BorrowerDto";
import { RegisterBorrowerDto } from "Domain/Dtos/Borrowers/RegisterBorrowerDto";
import { BorrowedBookDto } from "Domain/Dtos/Books/BorrowedBookDto";

export interface IBorrowersService
{
    /**
    * Add a Borrower
    */
    add(borrower : RegisterBorrowerDto) : Promise<Response<number>>;
    
     /**
     * Update a Borrower
     */
    update(id : number, Borrower : RegisterBorrowerDto) : Promise<Response<number>>;

     /**
     * Delete a Borrower 
     */
    delete(id : number) : Promise<Response<number>>;

    /**
     * Get a Single Borrower
     */
    get(id : number) : Promise<Response<BorrowerDto>>;

    /**
     * List All Borrowers
     */
    list() : Promise<Response<BorrowerDto[]>>;

    /**
     * Search over All Borrowers by email
     */
    search(BorrowerQueryParams: BorrowerQueryParams): Promise<Response<BorrowerDto[]>>;

    /**
     * Get All the current Borrower books
     */
    getMyBooks(id: number): Promise<Response<BorrowedBookDto[]>>;
}