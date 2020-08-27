import { IdGenerator } from "../services/IdGenerator";
import { UserDatabase } from "../data/UserDatabase";
import { LoginDTO, User, BandOutputDTO, BandApproveDTO, SignupInputDTO } from "../model/User";
import { HashManager } from "../services/HashManager";
import { Authenticator } from "../services/Authenticator";
import { InvalidInput } from "../erros/InvalidInput";
import { Unauthorized } from "../erros/Unauthorized";
import { GenericError } from "../erros/GenericError";
import { NotFoundError } from "../erros/NotFoundError";

export class UserBusiness {
    constructor(
        private userDatabase: UserDatabase,
        private hashManager: HashManager,
        private authenticator: Authenticator,
        private idGenerator: IdGenerator
    ) { }

    public async signup(input: SignupInputDTO, token?: string): Promise<void> {

        if (input.role === "ADMIN") {
            const tokenData = this.authenticator.getData(token!);
            if (tokenData.role !== "ADMIN") {
                throw new Unauthorized("Only admins can signup admins")
            }
        }

        if (!input.name) {
            throw new InvalidInput("Invalid name");
        }

        if (!input.nickname) {
            throw new InvalidInput("Invalid nickname");
        }

        if (!input.email || input.email.indexOf("@") === -1) {
            throw new InvalidInput("Invalid email");
        }

        if (input.role === "BAND" && !input.description) {
            throw new InvalidInput("Invalid description");
        }

        const permissions = roleManager(input.role)

        if (!permissions.isApproved && permissions.isBlocked) {
            throw new InvalidInput("Invalid role");
        }

        if ((input.role === "ADMIN" && input.password.length < 10) ||
            (input.role !== "ADMIN" && input.password.length < 6)) {
            throw new InvalidInput("Invalid password")
        }

        const id = this.idGenerator.generate();
        const hashPassword = await this.hashManager.hash(input.password)

        await this.userDatabase.signup(
            id,
            input.email,
            input.name,
            input.nickname,
            hashPassword,
            permissions.isApproved,
            permissions.isBlocked,
            input.role,
            input.description
        )
    }

    public async login(input: LoginDTO): Promise<string> {

        if (!input.nicknameOrEmail) {
            throw new InvalidInput("Invalid email or nickname");
        }

        const user: User = await this.userDatabase.getUserByNicknameOrEmail(input.nicknameOrEmail);
        const hashCompare = await this.hashManager.compare(input.password, user.getPassword());

        if (!hashCompare) {
            throw new InvalidInput("Invalid password!");
        }

        if (!user.getIsApproved()) {
            throw new Unauthorized("Not approved")
        }

        const accessToken = this.authenticator.generateToken({ id: user.getId(), role: user.getRole() });

        return accessToken;
    }

    public async getAllBands(token: string): Promise<BandOutputDTO[]> {

        const tokenData = this.authenticator.getData(token)

        if (tokenData.role !== "ADMIN") {
            throw new Unauthorized("Only admins can get bands")
        }

        const bands = await this.userDatabase.getAllBands();

        return bands;
    }

    public async toApprove(token: string, input: BandApproveDTO): Promise<void> {

        const nickname = input.nickname;
        const tokenData = this.authenticator.getData(token);

        if (tokenData.role !== "ADMIN") {
            throw new Unauthorized("Only admins can get bands");
        }

        const bands = await this.userDatabase.getAllBands();

        if (!nickname || bands
            .filter((b: any) => b.nickname === nickname).length === 0) {
            throw new NotFoundError("Invalid nickname");
        }

        const isApproved = bands
            .filter((b: any) => b.nickname === nickname)
            .map((b: any) => b.isApproved);

        //TODO: criar essa query para o banco
        if (isApproved[0]) {
            throw new GenericError("Band already approved");
        }

        await this.userDatabase.toApprove(nickname);
    }
}

const roleManager = (role: string): Permissions => {

    let isApproved: boolean = false;
    let isBlocked: boolean = true;

    switch (role) {
        case "ADMIN":
            isApproved = true;
            isBlocked = false;
            break;

        case "NORMAL":
            isApproved = true;
            isBlocked = false;
            break;

        case "PAYING":
            isApproved = true;
            isBlocked = false;
            break;

        case "BAND":
            isApproved = false;
            isBlocked = false;
            break;

        default:
            break;
    }

    return { isApproved, isBlocked }
}

interface Permissions {
    isApproved: boolean,
    isBlocked: boolean
}