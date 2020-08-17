import { IdGenerator } from "../services/IdGenerator";
import { UserDatabase } from "../data/UserDatabase";
import { LoginDTO, User } from "../model/User";
import { HashManager } from "../services/HashManager";

export class UserBusiness {
    public async signup(
        email: string,
        name: string,
        nickname: string,
        password: string,
        role: string,
        description?: string
    ): Promise<string> {

        const permissions = roleManager(role)

        const idGenerador = new IdGenerator();
        const id = idGenerador.generate();

        const userDatabase = new UserDatabase();
        await userDatabase.singup(
            id,
            email,
            name,
            nickname,
            password,
            permissions.isApproved,
            permissions.isBlocked,
            role,
            description
        )

        return id;
    }

    public async getUserByNicknameOrEmail(input: LoginDTO) {

        const userDatabase = new UserDatabase();
        const user: User = await userDatabase.getUserByNicknameOrEmail(input.nicknameOrEmail);

        const hashManager = new HashManager();
        const hashCompare = await hashManager.compare(input.password, user.getPassword());

        if(!hashCompare){
            throw new Error("Invalid password!");
        }

        return user;
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