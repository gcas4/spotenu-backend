export class Album {

    constructor(
        private id: string,
        private name: string,
        private bandId: string,
    ) { }

    getId = () => this.id;
    getName = () => this.name;
    getBandId = () => this.bandId;

    setId = (id: string) => this.id = id;
    setName = (name: string) => this.name = name;
    setBandId = (bandId: string) => this.bandId = bandId;

    static toAlbumModel(object: any): Album {

        return new Album(
            object.id,
            object.name,
            object.bandId
        );
    }
}

export interface AlbumInputDTO {
    name: string,
    genres: string[]
}