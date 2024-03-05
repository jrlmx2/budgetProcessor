import * as fs from "fs";

import { parseCSV } from '../../../util/csv_parse';
import {guessCategory} from "../../../util/spending";

class Investing implements Reader {
    file: string;
    source: string;
    data: Array<unknown> = [];
    parsedOutput: Array<CheckingEntry> = [];
    constructor(file: string, source: string) {
        this.file = file;
        this.source = source;
    }

    async read(): Promise<Array<CheckingEntry>> {

        return new Promise<Array<CheckingEntry>>( async (resolve, reject) => {
            await parseCSV(fs.createReadStream(this.file), true).then((data) => this.data = data);

            let headerMap = mapHeaders(this.data[0]);

            this.parsedOutput = this.data.map((record: any): CheckingEntry => {
                return {
                    details: record[headerMap.details],
                    type: record[headerMap.type],
                    checkNumber: headerMap.checkNumber ? record[headerMap.checkNumber] : null,
                    source: this.source,
                    value: record[headerMap.value],
                    desc: record[headerMap.desc],
                    category: guessCategory(headerMap ? record[headerMap.category] : record.join(" ")),
                    dateOfSpend: new Date(record[headerMap.dateOfSpend]),
                }
            });

            resolve(this.parsedOutput);
        });
    }
}

function mapHeaders(object: any): CheckingEntryMapping {
    // if (object instanceof Array) return null; // TODO, implement other potential non-header format of cSV?

    return {
        value: "Amount",
        type: "Type",
        details: "Details",
        desc: "Description",
        category: "Description",
        dateOfSpend: "Posting Date",
        checkNumber: "Balance\tCheck or Slip #",
    }
}