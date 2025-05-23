class ApiError extends Error{
    statusCode:number;
    message:string;
    errors:any;
    constructor(
        statusCode,
        message="Something went wrong",
        errors=[],
        stack=""
    ){
        super(message);
        this.statusCode = statusCode;
        this.message = message; 
        this.errors = errors;
        
        if(stack){
            this.stack = stack
        }else{
            Error.captureStackTrace(this , this.constructor)
        }
    }
     
}

export {ApiError}