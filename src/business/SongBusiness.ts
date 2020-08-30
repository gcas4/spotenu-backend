import { SongDatabase } from "../data/SongDatabase";
import { Authenticator } from "../services/Authenticator";
import { IdGenerator } from "../services/IdGenerator";
import { SongInputDTO, Song } from "../model/Song";
import { Unauthorized } from "../erros/Unauthorized";
import { InvalidInput } from "../erros/InvalidInput";
import { AlbumDatabase } from "../data/AlbumDatabase";
import { NotFoundError } from "../erros/NotFoundError";
import { GenericError } from "../erros/GenericError";

export class SongBusiness {
    constructor(
        private songDatabase: SongDatabase,
        private albumDatabase: AlbumDatabase,
        private authenticator: Authenticator,
        private idGenerator: IdGenerator
    ) { }

    async create(input: SongInputDTO, token: string): Promise<void> {

        const tokenData = this.authenticator.getData(token);
        if (tokenData.role !== "BAND") {
            throw new Unauthorized("Only bands can create albums");
        }

        if (!input.name) {
            throw new InvalidInput("Invalid name");
        }

        if (!input.albumId) {
            throw new InvalidInput("Invalid album");
        }

        const bandAlbums = await this.albumDatabase.getBandAlbumsById(tokenData.id);
        if (bandAlbums.length === 0) {
            throw new NotFoundError("Album does not exist")
        }

        const song = await this.songDatabase.getSongByName(input.name, input.albumId);

        if (song.length !== 0) {
            throw new GenericError("Song already created in this album")
        }

        const id = this.idGenerator.generate();

        await this.songDatabase.create(id, input.name, input.albumId);
    }

    async getAllSongs(token: string): Promise<Song[]> {

        this.authenticator.getData(token);
        const result = await this.songDatabase.getAllSongs();

        return result;
    }
}