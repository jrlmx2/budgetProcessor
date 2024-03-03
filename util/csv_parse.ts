import csvParser from 'papaparse';
import {ReadStream} from "node:fs";


export const parseCSV = (data: File | ReadStream, header: boolean): Promise<Array<unknown>> => {
    return new Promise((resolve, reject): void => {
        csvParser.parse(data, {
            header,
            skipEmptyLines: true,
            error: (err: any) => { reject(err) },
            complete: (results) => {
                console.log(results);
                resolve(results.data);
            }
        });
    });
};