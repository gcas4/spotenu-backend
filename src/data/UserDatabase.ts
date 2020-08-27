import { BaseDatabase } from "./BaseDatabase";
import { User, BandOutputDTO } from "../model/User";
import { NotFoundError } from "../erros/NotFoundError";
import { GenericError } from "../erros/GenericError";

export class UserDatabase extends BaseDatabase {

    private static TABLE_NAME = "User";

    async signup(
        id: string,
        email: string,
        name: string,
        nickname: string,
        password: string,
        is_approved: boolean,
        is_blocked: boolean,
        role: string,
        description?: string
    ): Promise<void> {
        try {
            await super.getConnection()
                .insert({ id, email, name, nickname, description, password, is_approved, is_blocked, role })
                .into(UserDatabase.TABLE_NAME);

        } catch (err) {
            throw new GenericError(err.sqlMessage || err.message);
        }
    }

    async getUserByNicknameOrEmail(nicknameOrEmail: string): Promise<User> {
        try {
            const result = await this.getConnection()
                .select("*")
                .from(UserDatabase.TABLE_NAME)
                .where({ email: nicknameOrEmail })
                .orWhere({ nickname: nicknameOrEmail });

            return User.toUserModel(result[0]);
            //TODO mudar is_approved e is_blocked para isApproved e isBlocked
            // mudar 0 ou 1 para false ou true
        } catch (err) {

            if (err.message === "Cannot read property 'id' of undefined") {
                throw new NotFoundError("Invalid nickname or email")
            }
            throw new GenericError(err.sqlMessage || err.message)
        }
    }

    async getAllBands(): Promise<BandOutputDTO[]> {
        try {

            const result = await this.getConnection()
                .select("name", "email", "nickname", "is_approved as isApproved")
                .from(UserDatabase.TABLE_NAME)
                .where({ role: "BAND" });

            return result.map((band: any) => {
                band.isApproved === 0 ? band.isApproved = false : band.isApproved = true;

                return band;
            });

        } catch (err) {
            throw new GenericError(err.sqlMessage || err.message)
        }
    }

    async toApprove(nickname: string) {
        try {

            await this.getConnection()
                .update({ is_approved: "1" })
                .from(UserDatabase.TABLE_NAME)
                .where({ nickname })

        } catch (err) {
            throw new GenericError(err.sqlMessage || err.message)
        }
    }
}