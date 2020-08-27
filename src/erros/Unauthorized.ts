import { CustomError } from "./base/CustomError";

export class Unauthorized extends CustomError {
    statusCode: number = 401;
}