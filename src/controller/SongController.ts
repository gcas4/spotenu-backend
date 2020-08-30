import { Request, Response } from "express"
import { SongBusiness } from "../business/SongBusiness";
import { Authenticator } from "../services/Authenticator";
import { IdGenerator } from "../services/IdGenerator";
import { AlbumDatabase } from "../data/AlbumDatabase";
import { SongDatabase } from "../data/SongDatabase";
import { SongInputDTO } from "../model/Song";
import { BaseDatabase } from "../data/BaseDatabase";

export class SongController {
    private static SongBusiness = new SongBusiness(
        new SongDatabase(),
        new AlbumDatabase(),
        new Authenticator(),
        new IdGenerator()
    )

    async create(req: Request, res: Response) {
        try {

            const input: SongInputDTO = {
                name: req.body.name,
                albumId: req.body.albumId
            }

            const token = req.headers.authorization!;

            await SongController.SongBusiness.create(input, token);
            await BaseDatabase.destroyConnection();
            res.status(201).send({ message: "Song created!" });

        } catch (err) {
            await BaseDatabase.destroyConnection();
            res.status(err.statusCode || 400).send({ error: err.message });
        }
    }

    async getAllSongs(req: Request, res: Response) {
        try {

            const token = req.headers.authorization!;

            const songs = await SongController.SongBusiness.getAllSongs(token);

            await BaseDatabase.destroyConnection();
            res.status(201).send({ songs });

        } catch (err) {
            await BaseDatabase.destroyConnection();
            res.status(err.statusCode || 400).send({ error: err.message });
        }
    }
}