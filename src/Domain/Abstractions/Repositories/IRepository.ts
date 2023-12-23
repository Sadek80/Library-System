/**
 * The Main Abstracted Repository
 */
export interface IRepository<TType, TDto>{
    
    /**
    * Add TType to The Database
    */
    add(type : TType) : Promise<number>;
    
     /**
     * Update TType in the Database
     */
    update(id : number, type : TType) : Promise<number>;

     /**
     * Delete TType from The Database
     */
    delete(id : number) : Promise<number>;

    /**
     * Get TType from The Database
     */
    get(id : number) : Promise<TDto>;

    /**
     * List All TType from The Database
     */
    list() : Promise<TDto[]>;
}