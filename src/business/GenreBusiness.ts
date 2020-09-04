import { GenreDatabase } from "../data/GenreDatabase";
import { Authenticator } from "../services/Authenticator";
import { IdGenerator } from "../services/IdGenerator";
import { GenreInputDTO, Genre } from "../model/Genre";
import { Unauthorized } from "../erros/Unauthorized";
import { InvalidInput } from "../erros/InvalidInput";

export class GenreBusiness {
    constructor(
        private genreDatabase: GenreDatabase,
        private authenticator: Authenticator,
        private idGenerator: IdGenerator
    ) { }

    async create(input: GenreInputDTO, token: string): Promise<void> {
        const tokenData = this.authenticator.getData(token);

        if (tokenData.role !== "ADMIN") {
            throw new Unauthorized("Only admins can create genres");
        }

        if (!input.name) {
            throw new InvalidInput("Invalid name");
        }

        const id = this.idGenerator.generate();
        await this.genreDatabase.create(id, input.name);
    }

    async getAllGenres(token: string): Promise<Genre[]> {
        const tokenData = this.authenticator.getData(token);
        
        if (tokenData.role !== "ADMIN" && tokenData.role !== "BAND") {
            throw new Unauthorized("Only admins or bands can get genres")
        }

        const genres = await this.genreDatabase.getAllGenres();
        return genres;
    }
}