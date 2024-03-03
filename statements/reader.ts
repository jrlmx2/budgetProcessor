interface Reader {
    read(): Promise<Array<Entry>>;
}