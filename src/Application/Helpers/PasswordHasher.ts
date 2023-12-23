import { IPasswordHasher } from "Domain/Abstractions/Helpers/IPasswordHasher";
import bcrypt from 'bcrypt'
import { injectable } from 'inversify';

@injectable()
export class PasswordHasher implements IPasswordHasher
{
    private readonly _roundSalt = 10;

    async hash(password: string): Promise<string> 
    {
        return await bcrypt.hash(password, this._roundSalt)
    }
    
}