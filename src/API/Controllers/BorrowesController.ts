import { IBorrowersService } from 'Domain/Abstractions/Services/IBorrowersService'
import { BorrowerQueryParams } from 'Domain/Dtos/Borrowers/BorrowerQueryParams'
import { RegisterBorrowerDto } from 'Domain/Dtos/Borrowers/RegisterBorrowerDto'
import { Request, Response } from 'express'
import { inject } from 'inversify'
import {
  controller,
  httpGet,
  httpPost,
  httpDelete,
  requestParam,
  queryParam,
  requestBody,
  httpPut,
} from 'inversify-express-utils'

@controller('/borrowers')
export class BorrowersController {
  constructor(@inject("IBorrowersService") private readonly _service: IBorrowersService ) {}

    @httpGet('/')
    async index(req: Request, res: Response) 
    {
        const books = await this._service.list()
        res.status(books.StatusCode).json(books)
    }

    @httpGet('/my-books/:id')
    async getBorrowerBooks(@requestParam('id') id: number, req: Request, res: Response) 
    {
        const books = await this._service.getMyBooks(id);
        res.status(books.StatusCode).json(books)
    }

    @httpGet('/search')
    async search(@queryParam() param: BorrowerQueryParams, req: Request, res: Response) 
    {
        const books = await this._service.search(param);
        res.status(books.StatusCode).json(books)
    }

    @httpGet('/:id')
    async getById(@requestParam("id") id: number, req: Request, res: Response) 
    {
        const books = await this._service.get(id);
        res.status(books.StatusCode).json(books)
    }

    @httpDelete('/:id')
    async delete(@requestParam("id") id: number, req: Request, res: Response) 
    {
        const books = await this._service.delete(id);
        res.status(books.StatusCode).json(books)
    }

    @httpPost('/')
    async add(@requestBody() body: RegisterBorrowerDto, req: Request, res: Response) 
    {
      const books = await this._service.add(body);
      res.status(books.StatusCode).json(books)
    }

    @httpPut('/:id')
    async update(@requestParam("id") id: number, @requestBody() body: RegisterBorrowerDto, req: Request, res: Response) 
    {
      const books = await this._service.update(id, body);
      res.status(books.StatusCode).json(books)
    }
}
