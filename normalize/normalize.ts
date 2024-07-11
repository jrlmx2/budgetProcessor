import { Entry, EntryFactory } from "./entry";

const amounts = ['amount', 'debit'];
const descriptions = ['description'];
const transDate = ['Trans. Date', 'Date', 'Transaction Date', 'Posting Date'];
export class RecordNormalizer {
    protected readonly entryFactory: EntryFactory;

    constructor ( filename: string, tags?: Set<string> ) {
        this.entryFactory = new EntryFactory(filename, tags);
    }

    transform( results: string[] ): Entry {
        return this.entryFactory.entryFromCSV(results);
    }

    setHeader(headers :string[]) {
        const amountColumns: number[] = new Array<number>();
        const descColumns: number[] = new Array<number>();
        let transDatePos = 0;

        headers.forEach( (header, index) => {
            if( !header ) return;

            const lowerheader = header.toLowerCase();

            if(amounts.includes(lowerheader)) {
                amountColumns.push(index);
                return;
            }

            if(descriptions.includes(lowerheader)) {
                descColumns.push(index);
                return;
            }

            if(transDate.includes(lowerheader)) {
                transDatePos = index;
            }
        });

        this.entryFactory.columnPos(amountColumns, descColumns, transDatePos);
    }
}