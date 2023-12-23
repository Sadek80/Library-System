import { Response } from "Domain/Dtos/Response";
import { StatusCodes } from "Domain/Abstractions/Helpers/StatusCodes";
import { IBorrowersService } from "Domain/Abstractions/Services/IBorrowersService";
import { IBorrowersRepository } from "Domain/Abstractions/Repositories/IBorrowersRepository";
import { BorrowerDto } from "Domain/Dtos/Borrowers/BorrowerDto";
import { BorrowerQueryParams } from "Domain/Dtos/Borrowers/BorrowerQueryParams";
import { RegisterBorrowerDto } from "Domain/Dtos/Borrowers/RegisterBorrowerDto";
import { IPasswordHasher } from "Domain/Abstractions/Helpers/IPasswordHasher";
import { Borrower } from "Domain/Types/Borrower";
import { IEmailValidator } from "Domain/Abstractions/Helpers/IEmailValidator";

export class BorrowersService implements IBorrowersService
{
    constructor(private readonly _borrowersRepository : IBorrowersRepository,
                private readonly _passwordHasher: IPasswordHasher,
                private readonly _emailValidator: IEmailValidator)
    {
    }

    async add(borrower: RegisterBorrowerDto): Promise<Response<number>> 
    {
        if (!borrower.name || !borrower.email || !borrower.password) {
            return Response.createInstance<number>("Please Provide Valid Data!", StatusCodes.BadRequest);
        }

        let isEmailValid = this._emailValidator.isValid(borrower.email);

        if(!isEmailValid)
        {
            return Response.createInstance<number>("Email is not Correct.", StatusCodes.BadRequest);
        }

        let isBorrowerExisted = await this._borrowersRepository.isBorrowerExists(borrower.email, null);

        if(isBorrowerExisted)
        {
            return Response.createInstance<number>("Borrower already exists.", StatusCodes.Conflict);
        }

        let password_hash = await this._passwordHasher.hash(borrower.password);

        let newBorrower : Borrower = 
        {
            email: borrower.email,
            name: borrower.name,
            password_hash: password_hash
        } 

        let result = await this._borrowersRepository.add(newBorrower);

        if(result > 0)
        {
            return Response.createInstance<number>(result, StatusCodes.Created, "Registered Successfully!");
        }

        return Response.createInstance<number>("Error Happened!", StatusCodes.BadRequest);
    }

    async update(id: number, borrower: RegisterBorrowerDto): Promise<Response<number>>
    {
        if (!borrower.name || !borrower.email) 
        {
            return Response.createInstance<number>("Please Provide Valid Data!", StatusCodes.BadRequest);
        }

        let isBorrowerExisted = await this._borrowersRepository.isBorrowerExists(borrower.email, id);

        if(isBorrowerExisted)
        {
            return Response.createInstance<number>("There is another Borrower with the Same Email.", StatusCodes.Conflict);
        }

        let password_hash = await this._passwordHasher.hash(borrower.password);

        let updatedBorrower : Borrower = 
        {
            email: borrower.email,
            name: borrower.name,
            password_hash: password_hash
        } 

        let result = await this._borrowersRepository.update(id, updatedBorrower);

        if(result > 0)
        {
            return Response.createInstance<number>(result, StatusCodes.NoContent, "Borrower Updated Successfully!");
        }

        return Response.createInstance<number>("Borrower is Not Found!", StatusCodes.NotFound);   
    }

    async delete(id: number): Promise<Response<number>> 
    {
        let result = await this._borrowersRepository.delete(id);

        if(result > 0)
        {
            return Response.createInstance<number>(result, StatusCodes.NoContent, "Borrower Deleted Successfully!");
        } 
        
        return Response.createInstance<number>("Borrower is Not Found or already deleted.", StatusCodes.NotFound);   
    }

    async get(id: number): Promise<Response<BorrowerDto>> 
    {
        let result = await this._borrowersRepository.get(id);

        if(result)
        {
            return Response.createInstance<BorrowerDto>(result, StatusCodes.Ok);
        }

        return Response.createInstance<BorrowerDto>("Borrower is Not Found", StatusCodes.NotFound);
    }

    async list(): Promise<Response<BorrowerDto[]>> 
    {
        let result = await this._borrowersRepository.list();
        return Response.createInstance<BorrowerDto[]>(result, StatusCodes.Ok)
    }

    async search(borrowerQueryParams: BorrowerQueryParams): Promise<Response<BorrowerDto[]>>
    {
        let result = await this._borrowersRepository.search(borrowerQueryParams);
        return Response.createInstance<BorrowerDto[]>(result, StatusCodes.Ok)
    }
}