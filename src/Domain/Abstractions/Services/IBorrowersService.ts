import { BorrowerQueryParams } from "Domain/Dtos/Borrowers/BorrowerQueryParams";
import { Response } from "../../Dtos/Response";
import { BorrowerDto } from "Domain/Dtos/Borrowers/BorrowerDto";
import { RegisterBorrowerDto } from "Domain/Dtos/Borrowers/RegisterBorrowerDto";

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

    search(BorrowerQueryParams: BorrowerQueryParams): Promise<Response<BorrowerDto[]>>;
}