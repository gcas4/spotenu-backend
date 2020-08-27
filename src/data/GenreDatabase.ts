import { BaseDatabase } from "./BaseDatabase";
import { GenericError } from "../erros/GenericError";
import { Genre } from "../model/Genre";

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
}