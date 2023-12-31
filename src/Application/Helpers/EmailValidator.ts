import { IEmailValidator } from "Domain/Abstractions/Helpers/IEmailValidator";
import { injectable } from 'inversify';

@injectable()
export class EmailValidator implements IEmailValidator
{
    isValid(input: string): boolean {
        const emailRegex: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(input);    
    }
    
}