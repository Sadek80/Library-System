import { IPasswordHasher } from "Domain/IPasswordHasher";
import bcrypt from 'bcrypt'

export class PasswordHasher implements IPasswordHasher
{
    private readonly _roundSalt = 10;

    async hash(password: string): Promise<string> 
    {
        return await bcrypt.hash(password, this._roundSalt)
    }
    
}