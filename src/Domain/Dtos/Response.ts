export class Response<T> {
    Succeeded: boolean;
    Data: T | null;
    Message: string | null;
    StatusCode: number;

    private constructor(succeeded: boolean, data: T | null, statusCode: number, message?: string | null) {
        this.Succeeded = succeeded;
        this.Data = data;
        this.Message = message || null;
        this.StatusCode = statusCode;
    }
    
    static createInstance<T>(data: T, statusCode: number, message?: string | null): Response<T>;
    static createInstance<T>(message: string | null, statusCode: number,): Response<T>;
    static createInstance<T>(dataOrMessage: T, statusCode: number, message?: string | null): Response<T> {

        if (typeof dataOrMessage === 'string' && message === undefined) {
            // Handle the case where only a message is provided
            return new Response<T>(false, null, statusCode, dataOrMessage);
        } else {
            // Handle the case where both data and message are provided
            return new Response<T>(true, dataOrMessage, statusCode, message || null);
        }
    }
}
