import express from 'express';
import { AlbumController } from '../controller/AlbumController';

export const albumRouter = express.Router();
const albumController = new AlbumController();

albumRouter.post("/create", albumController.create);
albumRouter.get("/albums", albumController.getAllAlbums);
albumRouter.get("/band/albums", albumController.getBandAlbumsById);