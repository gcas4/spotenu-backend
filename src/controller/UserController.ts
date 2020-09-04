import { Request, Response } from 'express';
import { HashManager } from '../services/HashManager';
import { UserBusiness } from '../business/UserBusiness';
import { Authenticator } from '../services/Authenticator';
import { LoginInputDTO, BandApproveDTO, SignupInputDTO } from '../model/User';
import { BaseDatabase } from '../data/BaseDatabase';
import { UserDatabase } from '../data/UserDatabase';
import { IdGenerator } from '../services/IdGenerator';

export class UserController {
    private static UserBusiness = new UserBusiness(
        new UserDatabase(),
        new HashManager(),
        new Authenticator(),
        new IdGenerator()
    )

    async signup(req: Request, res: Response) {
        try {
            const input: SignupInputDTO = {
                email: req.body.email,
                name: req.body.name,
                nickname: req.body.nickname,
                password: req.body.password,
                role: req.body.role,
                description: req.body.description
            }
            const token = req.headers.authorization!;
            await UserController.UserBusiness.signup(input, token);
            await BaseDatabase.destroyConnection();
            res.status(201).send({ message: "User created!" });
        } catch (err) {
            await BaseDatabase.destroyConnection();
            res.status(err.statusCode || 400).send({ error: err.message });
        }
    }

    async login(req: Request, res: Response) {
        try {
            const input: LoginInputDTO = {
                nicknameOrEmail: req.body.nicknameOrEmail,
                password: req.body.password
            }
            const result = await UserController.UserBusiness.login(input);
            await BaseDatabase.destroyConnection();
            res.status(200).send({ token: result.accessToken, role: result.role });
        } catch (err) {
            await BaseDatabase.destroyConnection();
            res.status(err.statusCode || 400).send({ error: err.message });
        }
    }

    async getBands(req: Request, res: Response) {
        try {
            const bands = await UserController.UserBusiness
                .getAllBands(req.headers.authorization!);
            await BaseDatabase.destroyConnection();
            res.status(200).send({ bands });
        } catch (err) {
            await BaseDatabase.destroyConnection();
            res.status(err.statusCode || 400).send({ error: err.message });
        }
    }

    async toApprove(req: Request, res: Response) {
        try {
            const input: BandApproveDTO = {
                nickname: req.body.nickname
            }
            const token = req.headers.authorization!;
            await UserController.UserBusiness.toApprove(token, input);
            await BaseDatabase.destroyConnection();
            res.status(200).send({ message: "Band approved!" });
        } catch (err) {
            await BaseDatabase.destroyConnection();
            res.status(err.statusCode || 400).send({ error: err.message });
        }
    }
}