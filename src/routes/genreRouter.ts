import express from 'express';
import { GenreController } from '../controller/GenreController';

export const genreRouter = express.Router();
const genreController = new GenreController();

genreRouter.post("/create", genreController.create);
genreRouter.get("/genres", genreController.getAllGenres);