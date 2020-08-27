import { CustomError } from "./base/CustomError";

export class GenericError extends CustomError {
    statusCode: number = 400;
}