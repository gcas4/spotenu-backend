import { GenreBusiness } from "../business/GenderBusiness";
import { GenreDatabase } from "../data/GenreDatabase";
import { Authenticator } from "../services/Authenticator";
import { IdGenerator } from "../services/IdGenerator";
import { Request, Response } from "express";
import { BaseDatabase } from "../data/BaseDatabase";
import { GenreInputDTO } from "../model/Genre";

export class GenreController {
    private static GenreBusiness = new GenreBusiness(
        new GenreDatabase(),
        new Authenticator(),
        new IdGenerator()
    )

    async create(req: Request, res: Response) {
        try {

            const input: GenreInputDTO = {
                name: req.body.name
            }

            const token = req.headers.authorization!;

            await GenreController.GenreBusiness.create(input, token);
            await BaseDatabase.destroyConnection();
            res.status(201).send({ message: "Genre created!" });

        } catch (err) {
            await BaseDatabase.destroyConnection();
            res.status(err.statusCode || 400).send({ error: err.message });
        }
    }

    async getAllGenres(req: Request, res: Response) {
        try {

            const token = req.headers.authorization!;

            const genres = await GenreController.GenreBusiness.getAllGenres(token);
            await BaseDatabase.destroyConnection();
            res.status(200).send({ genres });

        } catch (err) {
            await BaseDatabase.destroyConnection();
            res.status(err.statusCode || 400).send({ error: err.message });
        }
    }
}