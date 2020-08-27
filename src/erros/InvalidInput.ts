import { CustomError } from "./base/CustomError";

export class InvalidInput extends CustomError {
    statusCode: number = 421
}