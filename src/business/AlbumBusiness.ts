import { AlbumDatabase } from "../data/AlbumDatabase";
import { Authenticator } from "../services/Authenticator";
import { IdGenerator } from "../services/IdGenerator";
import { AlbumInputDTO, Album } from "../model/Album";
import { Unauthorized } from "../erros/Unauthorized";
import { InvalidInput } from "../erros/InvalidInput";
import { GenreDatabase } from "../data/GenreDatabase";

export class AlbumBusiness {
    constructor(
        private albumDatabase: AlbumDatabase,
        private genreDatabase: GenreDatabase,
        private authenticator: Authenticator,
        private idGenerator: IdGenerator
    ) { }

    async create(input: AlbumInputDTO, token: string): Promise<void> {

        const tokenData = this.authenticator.getData(token);
        if (tokenData.role !== "BAND") {
            throw new Unauthorized("Only bands can create albums");
        }

        if (!input.name) {
            throw new InvalidInput("Invalid name");
        }

        if (!input.genres || input.genres.length === 0) {
            throw new InvalidInput("Invalid genre(s)");
        }

        // Checking if genres exist before creating the album
        for (let i of input.genres) {
            const genre = await this.genreDatabase.getGenreByName(i);
        }

        const id = this.idGenerator.generate();

        // Creating the album by inserting data into the Album and AlbumGenre tables
        await this.albumDatabase.create(id, input.name, tokenData.id);
        for (let i of input.genres) {
            const genre = await this.genreDatabase.getGenreByName(i);
            await this.albumDatabase.createAlbumGenre(id, genre.getId())
        }
    }

    async getAllAlbums(token: string): Promise<Album[]> {

        this.authenticator.getData(token);
        const result = await this.albumDatabase.getAllAlbums();

        return result;
    }

    async getBandAlbumsById(token: string): Promise<Album[]> {

        const tokenData = this.authenticator.getData(token);
        
        if(tokenData.role !== "BAND"){
            throw new Unauthorized("Only bands can get their albums")
        }
        const result = await this.albumDatabase.getBandAlbumsById(tokenData.id);

        return result;
    }
}