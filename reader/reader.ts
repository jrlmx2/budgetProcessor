import { ReadStream } from "node:fs";
import { RecordNormalizer } from "../normalize/normalize";
import { CsvReader } from "./csv";
import path from "path";
import EventEmitter from "node:events";

export interface Reader {
    read(id: symbol, file: ReadStream, normalizer: RecordNormalizer, emitter: EventEmitter): void;
}


const ReaderMap = new Map<string, Reader>();
ReaderMap.set(".csv", new CsvReader());

export const appropriateReader = ( filename: string ): Reader => {
    return ReaderMap.get(path.parse(filename).ext.toLowerCase())!;
}