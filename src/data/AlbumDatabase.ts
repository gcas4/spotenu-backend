import { BaseDatabase } from "./BaseDatabase";
import { GenericError } from "../erros/GenericError";
import { Album } from "../model/Album";

export class AlbumDatabase extends BaseDatabase {

    private static TABLE_NAME = "Album";
    private static AUXILIAR_TABLE_NAME = "AlbumGenre";

    async create(id: string, name: string, band_id: string): Promise<void> {
        try {
            await super.getConnection()
                .insert({ id, name, band_id })
                .into(AlbumDatabase.TABLE_NAME);

        } catch (err) {
            throw new GenericError(err.sqlMessage || err.message)
        }
    }

    async createAlbumGenre(album_id: string, genre_id: string): Promise<void> {
        try {
            await super.getConnection()
                .insert({ album_id, genre_id })
                .into(AlbumDatabase.AUXILIAR_TABLE_NAME);

        } catch (err) {
            throw new GenericError(err.sqlMessage || err.message)
        }
    }

    async getAllAlbums(): Promise<Album[]> {
        try {
            const result = await super.getConnection()
                .select("*")
                .from(AlbumDatabase.TABLE_NAME);

            return result;

        } catch (err) {
            throw new GenericError(err.sqlMessage || err.message)
        }
    }

    async getBandAlbumsById(band_id: string): Promise<Album[]> {
        try {
            const result = await super.getConnection()
                .select("*")
                .from(AlbumDatabase.TABLE_NAME)
                .where({ band_id });

            return result;

        } catch (err) {
            throw new GenericError(err.sqlMessage || err.message)
        }
    }
}