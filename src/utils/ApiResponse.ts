class ApiResponse{
    statusCode: number;
    data:any;
    message:string;

    constructor(
        statusCode ,
        data,
        message="Success"
    ){
      this.statusCode = statusCode;
      this.data = data;
      this.message = message
    }
}
export {ApiResponse}