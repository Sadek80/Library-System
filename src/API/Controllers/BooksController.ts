import { IBooksService } from 'Domain/Abstractions/Services/IBooksService'
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
} from 'inversify-express-utils'
import { title } from 'process'

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
    async search(req: Request, res: Response) 
    {
        var params : BookQueryParams = {
          title: req.query.title as string,
          author: req.query.author as string,
          isbn: req.query.isbn as string
        } 

        console.log(params)
        const books = await this._service.search(params);
        res.status(books.StatusCode).json(books)
    }

    @httpGet('/:id')
    async getById(@requestParam("id") id: number, req: Request<any, {}, {}, {}>, res: Response) 
    {
        const books = await this._service.get(id);
        res.status(books.StatusCode).json(books)
    }
}
