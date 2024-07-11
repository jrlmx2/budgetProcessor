import { ReadStream } from "node:fs";
import { RecordNormalizer } from "../normalize/normalize";
import csvParser from "papaparse";
import { Reader } from "./reader";
import EventEmitter from "node:events";
import { EntryEventMap } from "../normalize/entry";

export class CsvReader implements Reader {
    read( id: symbol, data: ReadStream, normalizer: RecordNormalizer, emitter: EventEmitter<EntryEventMap> ): void {
        emitter.emit('addListener', id);
        csvParser.parse(data, {
            worker: true,
            skipEmptyLines: true,
            dynamicTyping: true,
            error: (err: any) => {
                console.error("Failed to process file");
                console.error(err.stack);
            },
            complete: (results, file) => {
                // console.log("finished", JSON.stringify(results, null, 2));

                let headerSet = false;
                for ( let details of <string[][]>results.data ) {
                    // console.log(JSON.stringify(details, null, 2));
                    if( !headerSet ) {
                        headerSet = true;
                        normalizer.setHeader(details);
                        continue;
                    }
                    emitter.emit('read', { source: id, entry: normalizer.transform(details) });
                }

                emitter.emit('finished', id);

            }
        });
    };
}