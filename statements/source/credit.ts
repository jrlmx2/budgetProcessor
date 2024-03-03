class Credit implements Reader {
    file: string;
    source: string;

    constructor(file: string, source: string) {
    }
    read(): Promise<Array<Entry>> {
        return Promise.resolve(undefined);
    }

}