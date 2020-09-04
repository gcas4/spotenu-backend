import { BaseDatabase } from "./BaseDatabase";
import { GenericError } from "../erros/GenericError";
import { Genre } from "../model/Genre";
import { NotFoundError } from "../erros/NotFoundError";

export class GenreDatabase extends BaseDatabase {
    private static TABLE_NAME = "Genre";

    async create(id: string, name: string): Promise<void> {
        try {
            await super.getConnection()
                .insert({ id, name })
                .into(GenreDatabase.TABLE_NAME);
        } catch (err) {
            throw new GenericError(err.sqlMessage || err.message);
        }
    }

    async getAllGenres(): Promise<Genre[]> {
        try {
            const result = await super.getConnection()
                .select("*")
                .from(GenreDatabase.TABLE_NAME);
            return result;
        } catch (err) {
            throw new GenericError(err.sqlMessage || err.message);
        }
    }

    async getGenreByName(name: string): Promise<Genre> {
        try {
            const result = await super.getConnection()
                .select("*")
                .from(GenreDatabase.TABLE_NAME)
                .where({ name });
            return Genre.toGenreModel(result[0]);
        } catch (err) {
            if (err.message === "Cannot read property 'id' of undefined") {
                throw new NotFoundError(`Genre ${name} does not exist in our database`)
            }
            throw new GenericError(err.sqlMessage || err.message);
        }
    }
}