import fs from "fs/promises";
import { appropriateReader, Reader } from "./reader";
import { RecordNormalizer } from "../normalize/normalize";
import { open } from "node:fs/promises";
import EventEmitter from "node:events";
import path from "path";

async function walk(dir: string): Promise<string[]> {
    const entries = await fs.readdir(dir);
    let ret: string[] = [];
    for (const entry of entries) {
        const fullpath = path.resolve(dir, entry);
        const info = await fs.stat(fullpath);
        if (info.isDirectory()) {
            ret = [...ret, ...(await walk(fullpath))];
        } else {
            ret = [...ret, fullpath];
        }
    }
    return ret;
}

export const readAll = async (emitter: EventEmitter): Promise<void> => {
    const paths = await walk(`${__dirname}${path.sep}..${path.sep}data`);

    for(let filename of paths) {
        const reader: Reader = appropriateReader( filename );

        if( reader ) {
            open(filename).then(handle => {
                const id = Symbol.for(filename);
                reader.read(id, handle.createReadStream(), new RecordNormalizer(filename), emitter);
            });
        }
    }
};