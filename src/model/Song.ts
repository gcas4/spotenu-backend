export class Song {
    constructor(
        private id: string,
        private name: string,
        private albumId: string,
    ) { }

    getId = () => this.id;
    getName = () => this.name;
    getAlbumId = () => this.albumId;

    setId = (id: string) => this.id = id;
    setName = (name: string) => this.name = name;
    setAlbumId = (albumId: string) => this.albumId = albumId;

    static toSongModel(object: any): Song {
        return new Song(
            object.id,
            object.name,
            object.albumId
        );
    }
}

export interface SongInputDTO {
    name: string,
    albumId: string
}