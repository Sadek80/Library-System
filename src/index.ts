import { Book } from "Domain/Types/Book";
import { DatabaseService } from "./Persistence/DatabaseService";
import {BooksRepository} from 'Persistence/Repositories/BooksRepository'

var service = new DatabaseService();
 await service.connect();

var bookRepo = new BooksRepository(service);


const book : Book = {
title: "19842",
author: "George Orwel",
isbn: "1234567891234",
shelf_location : "in the left most",
available_quantity : 10
};

// const num = await bookRepo.add(book);
// console.log(num)
const data = await bookRepo.get(3)

console.log(data.title)