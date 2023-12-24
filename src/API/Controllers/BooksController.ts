import { IBooksService } from 'Domain/Abstractions/Services/IBooksService'
import { BookDto } from 'Domain/Dtos/Books/BookDto'
import { BookQueryParams } from 'Domain/Dtos/Books/BookQueryParams'
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

@controller('/books')
export class BooksController {
  constructor(@inject("IBooksService") private readonly _service: IBooksService ) {}

    @httpGet('/')
    async index(req: Request, res: Response) 
    {
        const books = await this._service.list()
        res.status(books.StatusCode).json(books)
    }

    @httpGet('/search')
    async search(@queryParam() param: BookQueryParams, req: Request, res: Response) 
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
    async add(@requestBody() body: BookDto, req: Request, res: Response) 
    {
      const books = await this._service.add(body);
      res.status(books.StatusCode).json(books)
    }

    @httpPut('/:id')
    async update(@requestParam("id") id: number, @requestBody() body: BookDto, req: Request, res: Response) 
    {
      const books = await this._service.update(id, body);
      res.status(books.StatusCode).json(books)
    }
}
