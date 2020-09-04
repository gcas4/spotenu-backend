import { BaseDatabase } from "./BaseDatabase";
import { GenericError } from "../erros/GenericError";
import { Song } from "../model/Song";

export class SongDatabase extends BaseDatabase {
    private static TABLE_NAME = "Song";

    async create(id: string, name: string, album_id: string): Promise<void> {
        try {
            await super.getConnection()
                .insert({ id, name, album_id })
                .into(SongDatabase.TABLE_NAME);
        } catch (err) {
            throw new GenericError(err.sqlMessage || err.message)
        }
    }

    async getSongByName(name: string, album_id: string): Promise<Song[]> {
        try {
            const result = await super.getConnection()
                .select("*")
                .from(SongDatabase.TABLE_NAME)
                .where({ name })
                .andWhere({ album_id });
            return result;
        } catch (err) {
            throw new GenericError(err.sqlMessage || err.message)
        }
    }

    async getAllSongs(): Promise<Song[]> {
        try {
            const result = await super.getConnection()
                .select("*")
                .from(SongDatabase.TABLE_NAME);
            return result;
        } catch (err) {
            throw new GenericError(err.sqlMessage || err.message)
        }
    }
}