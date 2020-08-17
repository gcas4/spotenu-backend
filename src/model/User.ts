export class User {

    constructor(
        private id: string,
        private email: string,
        private name: string,
        private nickname: string,
        private description: string,
        private password: string,
        private isApproved: boolean,
        private isBlocked: boolean,
        private role: string
    ) { }

    getId = () => this.id;
    getEmail = () => this.email;
    getName = () => this.name;
    getNickname = () => this.nickname;
    getDescription = () => this.description;
    getPassword = () => this.password;
    getIsApproved = () => this.isApproved;
    getIsBlocked = () => this.isBlocked;
    getRole = () => this.role;

    setId = (id: string) => this.id = id;
    setEmail = (email: string) => this.email = email;
    setName = (name: string) => this.name = name;
    setNickname = (nickname: string) => this.nickname = nickname;
    setDescription = (description: string) => this.description = description;
    setPassword = (password: string) => this.password = password;
    setIsApproved = (isApproved: boolean) => this.isApproved = isApproved;
    setIsBlocked = (isBlocked: boolean) => this.isBlocked = isBlocked;
    setRole = (role: string) => this.role = role;

    public static toUserModel(object: any): User {
        
        return new User(
            object.id,
            object.email,
            object.name,
            object.nickname,
            object.description,
            object.password,
            object.is_approved,
            object.is_blocked,
            object.role,
        );
    }
}

export interface AdminInputDTO {
    email: string,
    name: string,
    nickname: string,
    password: string
}

export interface ListenerInputDTO {
    email: string,
    name: string,
    nickname: string,
    password: string,
    role: string
}

export interface BandInputDTO {
    email: string,
    name: string,
    nickname: string,
    description: string,
    password: string
}

export interface LoginDTO {
    nicknameOrEmail: string,
    password: string
}

export interface BandOutputDTO {
    email: string,
    name: string,
    nickname: string,
    isApproved: boolean
}