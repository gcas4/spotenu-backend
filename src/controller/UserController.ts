import { Request, Response } from 'express';
import { HashManager } from '../services/HashManager';
import { UserBusiness } from '../business/UserBusiness';
import { Authenticator } from '../services/Authenticator';
import { AdminInputDTO, ListenerInputDTO, BandInputDTO, LoginDTO } from '../model/User';
import { BaseDatabase } from '../data/BaseDatabase';
import { UserDatabase } from '../data/UserDatabase';

export class UserController {

    public async signupAdmin(req: Request, res: Response) {
        try {

            const authenticator = new Authenticator();
            const tokenData = authenticator.getData(req.headers.authorization!)

            if (tokenData.role !== "ADMIN") {
                throw new Error("Only admins can signup admins")
            }

            if (!req.body.name) {
                throw new Error("Invalid name");
            }

            if (!req.body.nickname) {
                throw new Error("Invalid nickname");
            }

            if (!req.body.email || req.body.email.indexOf("@") === -1) {
                throw new Error("Invalid email");
            }

            if (!req.body.password || req.body.password.length < 10) {
                throw new Error("Invalid password");
            }

            const input: AdminInputDTO = {
                email: req.body.email,
                name: req.body.name,
                nickname: req.body.nickname,
                password: req.body.password
            }

            const role = "ADMIN";

            const hashManager = new HashManager();
            const hashPassword = await hashManager.hash(input.password);

            const userBusiness = new UserBusiness();
            const userId = await userBusiness.signup(
                input.email,
                input.name,
                input.nickname,
                hashPassword,
                role
            );

            const accessToken = authenticator.generateToken({ id: userId, role: role });

            await BaseDatabase.destroyConnection();
            res.status(200).send({ token: accessToken });

        } catch (err) {
            await BaseDatabase.destroyConnection();
            res.status(400).send({ error: err.message });
        }
    }

    public async signupListener(req: Request, res: Response) {
        try {

            if (!req.body.name) {
                throw new Error("Invalid name");
            }

            if (!req.body.nickname) {
                throw new Error("Invalid nickname");
            }

            if (!req.body.email || req.body.email.indexOf("@") === -1) {
                throw new Error("Invalid email");
            }

            if (!req.body.password || req.body.password.length < 6) {
                throw new Error("Invalid password")
            }

            const role = req.body.role;

            if (!role || (role !== "PAYING" && role !== "NORMAL")) {
                throw new Error("Invalid role")
            }

            const input: ListenerInputDTO = {
                email: req.body.email,
                name: req.body.name,
                nickname: req.body.nickname,
                password: req.body.password,
                role: role
            }

            const hashManager = new HashManager();
            const hashPassword = await hashManager.hash(input.password);

            const userBusiness = new UserBusiness();
            const userId = await userBusiness.signup(
                input.email,
                input.name,
                input.nickname,
                hashPassword,
                input.role
            );

            const authenticator = new Authenticator();
            const accessToken = authenticator.generateToken({ id: userId, role: input.role });

            await BaseDatabase.destroyConnection();
            res.status(200).send({ token: accessToken });

        } catch (err) {
            await BaseDatabase.destroyConnection();
            res.status(400).send({ error: err.message });
        }
    }

    public async signupBand(req: Request, res: Response) {
        try {

            if (!req.body.name) {
                throw new Error("Invalid name");
            }

            if (!req.body.nickname) {
                throw new Error("Invalid nickname");
            }

            if (!req.body.description) {
                throw new Error("Invalid description");
            }

            if (!req.body.email || req.body.email.indexOf("@") === -1) {
                throw new Error("Invalid email");
            }

            if (!req.body.password || req.body.password.length < 6) {
                throw new Error("Invalid password")
            }

            const input: BandInputDTO = {
                email: req.body.email,
                name: req.body.name,
                nickname: req.body.nickname,
                description: req.body.description,
                password: req.body.password
            }

            const role = "BAND";

            const hashManager = new HashManager();
            const hashPassword = await hashManager.hash(input.password);

            const userBusiness = new UserBusiness();
            const userId = await userBusiness.signup(
                input.email,
                input.name,
                input.nickname,
                hashPassword,
                role,
                input.description
            );

            const authenticator = new Authenticator();
            const accessToken = authenticator.generateToken({ id: userId, role: role });

            await BaseDatabase.destroyConnection();
            res.status(200).send({ token: accessToken });

        } catch (err) {
            await BaseDatabase.destroyConnection();
            res.status(400).send({ error: err.message });
        }
    }

    public async login(req: Request, res: Response) {
        try {

            if (!req.body.nicknameOrEmail) {
                throw new Error("invalid email or nickname");
            }

            const input: LoginDTO = {
                nicknameOrEmail: req.body.nicknameOrEmail,
                password: req.body.password
            }

            const userBusiness = new UserBusiness();
            const user = await userBusiness.getUserByNicknameOrEmail(input);

            if (!user.getIsApproved()) {
                throw new Error("Not approved")
            }

            const authenticator = new Authenticator();
            const accessToken = authenticator.generateToken({ id: user.getId(), role: user.getRole() });

            await BaseDatabase.destroyConnection();
            res.status(200).send({ token: accessToken });

        } catch (err) {
            await BaseDatabase.destroyConnection();
            res.status(400).send({ error: err.message });
        }
    }

    public async bands(req: Request, res: Response) {
        try {

            const authenticator = new Authenticator();
            const tokenData = authenticator.getData(req.headers.authorization!)

            if (tokenData.role !== "ADMIN") {
                throw new Error("Only admins can get bands")
            }

            const userDatabase = new UserDatabase();
            const bands = await userDatabase.getAllBands();

            await BaseDatabase.destroyConnection();
            res.status(200).send({ bands })

        } catch (err) {
            await BaseDatabase.destroyConnection();
            res.status(400).send({ error: err.message });
        }
    }

    public async toApprove(req: Request, res: Response) {
        try {

            const authenticator = new Authenticator();
            const tokenData = authenticator.getData(req.headers.authorization!)

            if (tokenData.role !== "ADMIN") {
                throw new Error("Only admins can get bands")
            }

            const userDatabase = new UserDatabase();
            const bands = await userDatabase.getAllBands();

            if (!req.body.nickname || !bands.filter((b: any) => b.nickname === req.body.nickname)) {
                throw new Error("Invalid id")
            }

            const isApproved = bands
                .filter((b: any) => b.nickname === req.body.nickname)
                .map((b: any) => b.isApproved)

            if (isApproved[0]) {
                throw new Error("Band already approved");
            }

            await userDatabase.toApprove(req.body.nickname);

            await BaseDatabase.destroyConnection();
            res.status(200).send({ message: "Approved!" })

        } catch (err) {
            await BaseDatabase.destroyConnection();
            res.status(400).send({ error: err.message });
        }
    }

}