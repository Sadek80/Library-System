/**
 * The Main Database Abstracted Interface
 */
export interface IDatabaseService
{
/**
 * Connect to the Database
 */
connect() : Promise<void>;

/**
 * Get Connection Instance of the Database 
 */
getConnection() : any;    

}