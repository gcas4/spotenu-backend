import express from 'express';
import { SongController } from '../controller/SongController';

export const songRouter = express.Router();

const songController = new SongController();

songRouter.post("/create", songController.create);
// songRouter.get("/song", songController.getAllsongs);