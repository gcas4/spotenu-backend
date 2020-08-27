export class Genre {

    constructor(
        private id: string,
        private name: string
    ) { }

    getId = () => this.id;
    getName = () => this.name;

    setId = (id: string) => this.id = id;
    setName = (name: string) => this.name = name;

    static toGenreModel(object: any): Genre {

        return new Genre(
            object.id,
            object.name
        );
    }
}

export interface GenreInputDTO {
    name: string
}