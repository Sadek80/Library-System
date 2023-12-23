import { Container } from 'inversify'
import { IDatabaseService } from 'Domain/Abstractions/IDatabaseService'
import { DatabaseService } from 'Persistence/DatabaseService'
import { IBooksRepository } from 'Domain/Abstractions/Repositories/IBooksRepository'
import { BooksRepository } from 'Persistence/Repositories/BooksRepository'
import { IBorrowersRepository } from 'Domain/Abstractions/Repositories/IBorrowersRepository'
import { BorrowersRepository } from 'Persistence/Repositories/BorrowersRepository'
import { PasswordHasher } from 'Application/Helpers/PasswordHasher'
import { IPasswordHasher } from 'Domain/Abstractions/Helpers/IPasswordHasher'
import { IEmailValidator } from 'Domain/Abstractions/Helpers/IEmailValidator'
import { EmailValidator } from 'Application/Helpers/EmailValidator'
import { IBooksService } from 'Domain/Abstractions/Services/IBooksService'
import { BooksService } from 'Application/Services/BooksService'
import { IBorrowersService } from 'Domain/Abstractions/Services/IBorrowersService'
import { BorrowersService } from 'Application/Services/BorrowersService'

export const container = new Container({
  defaultScope: 'Singleton',
})

// Persistence
container.bind<IDatabaseService>("IDatabaseService").to(DatabaseService).inSingletonScope()
container.bind<IBooksRepository>("IBooksRepository").to(BooksRepository).inSingletonScope()
container.bind<IBorrowersRepository>("IBorrowersRepository").to(BorrowersRepository)

// Services
container.bind<IPasswordHasher>("IPasswordHasher").to(PasswordHasher)
container.bind<IEmailValidator>("IEmailValidator").to(EmailValidator)

container.bind<IBooksService>("IBooksService").to(BooksService)
container.bind<IBorrowersService>("IBorrowersService").to(BorrowersService)


