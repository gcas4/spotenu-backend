import { Request, Response } from "express"
import { AlbumBusiness } from "../business/AlbumBusiness"
import { AlbumDatabase } from "../data/AlbumDatabase"
import { Authenticator } from "../services/Authenticator"
import { IdGenerator } from "../services/IdGenerator"
import { AlbumInputDTO } from "../model/Album"
import { BaseDatabase } from "../data/BaseDatabase"
import { GenreDatabase } from "../data/GenreDatabase"

export class AlbumController {
    private static AlbumBusiness = new AlbumBusiness(
        new AlbumDatabase(),
        new GenreDatabase(),
        new Authenticator(),
        new IdGenerator()
    )

    async create(req: Request, res: Response) {
        try {
            const input: AlbumInputDTO = {
                name: req.body.name,
                genres: req.body.genres
            }
            const token = req.headers.authorization!;
            await AlbumController.AlbumBusiness.create(input, token);
            await BaseDatabase.destroyConnection();
            res.status(201).send({ message: "Album created!" });
        } catch (err) {
            await BaseDatabase.destroyConnection();
            res.status(err.statusCode || 400).send({ error: err.message });
        }
    }

    async getAllAlbums(req: Request, res: Response) {
        try {
            const token = req.headers.authorization!;
            const albums = await AlbumController.AlbumBusiness.getAllAlbums(token);
            await BaseDatabase.destroyConnection();
            res.status(201).send({ albums });
        } catch (err) {
            await BaseDatabase.destroyConnection();
            res.status(err.statusCode || 400).send({ error: err.message });
        }
    }

    async getBandAlbumsById(req: Request, res: Response) {
        try {
            const token = req.headers.authorization!;
            const albums = await AlbumController.AlbumBusiness.getBandAlbumsById(token);
            await BaseDatabase.destroyConnection();
            res.status(201).send({ albums });
        } catch (err) {
            await BaseDatabase.destroyConnection();
            res.status(err.statusCode || 400).send({ error: err.message });
        }
    }
}