import dayjs, { Dayjs } from 'dayjs';
import { guessSpending, Spending } from "./spending";
import { guessIndustry, guessSubIndustry, ProviderIndustry, ProviderSubIndustry } from "./provider";
import { Card, guessCard } from "./card";
import path from "path";

export interface EntryEvent {
    entry: Entry,
    source: symbol;
}
export interface EntryEventMap {
    "read": EntryEvent[];
    "addListener": symbol[],
    "finished": symbol[]
}

interface IEntry {
    cost: number,
    when: Dayjs,
    provider: string,
    spend: Spending,
    card: Card,
    industry: ProviderIndustry,
    subindustry: ProviderSubIndustry,
    other: Set<string>
}

type EntryFields = keyof IEntry;

const entryFields: EntryFields[] = [
    'when',
    'card',
    'cost',
    'spend',
    'provider',
    'industry',
    'subindustry',
    'other'
]

export class Entry implements IEntry {
    constructor(
        public readonly cost: number,
        public readonly when: Dayjs,
        public readonly provider: string,
        public readonly spend: Spending,
        public readonly card: Card,
        public readonly industry: ProviderIndustry = ProviderIndustry.Other,
        public readonly subindustry: ProviderSubIndustry = ProviderSubIndustry.Entertainment,
        public readonly other: Set<string> = new Set<string>() )
    {}

    *write(): Generator<any> {
        for( let field of entryFields ) {
            if (field === 'other') {
                const collection = new Array<String>();
                for (let tag of this[field]) {
                    collection.push(tag);
                }
                yield collection.sort().join(', ');
            } else if (field === 'when') {
                yield dayjs(this[field]).format("MM/DD/YYYY")
            } else if (field === 'cost') {
                yield this[field];
            }else yield this[field]?.toString();
        }
    }

    static fromDetails(details: string[]): Entry {
        return new Entry(
            guessCost(details, []),
            guessWhen(details, 0),
            guessWhere(details, []),
            guessSpending(details),
            guessCard(details),
            guessIndustry(details),
            guessSubIndustry(details),
            guessOther(details)
        );
    }

    static headers(): string[] {
        return entryFields;
    }
}


const guessCost = (details: string[], amountColumns: number[]): number => {
    return Math.abs(amountColumns.reduce( (sum, current) => {
        if(current) {
            const num = Number.parseFloat(details[current]);
            if ( !isNaN(num) )
                return sum + num;
        }

        return sum;
    }, 0));
}

const guessWhen = (details: string[], transDate: number): dayjs.Dayjs => {
    for(let detail of details) {
        if (detail) {
            let day = dayjs(detail);

            if (day.isValid())
                return day;
        }
    }
    return dayjs( 'invalid' );
}

const guessWhere = (details: string[], descColumns: number[]): string => {
    const collector = new Array<string>();
    return descColumns.reduce((val, ind) => {
        val.push(details[ind])
        return val;
    }, collector).join(', ');
}

const guessOther = (details: string[]): Set<string> => {
    return new Set<string>();
}

export class EntryFactory {
    private card: Card;
    private other = new Set<string>();
    private amountColumns: number[] = new Array<number>();
    private descColumns: number[] = new Array<number>();
    private transDate: number = 0;
    constructor(
        filename: string,
        otherAlways?: Set<string>
    ) {
        if (otherAlways) this.other = otherAlways;
        this.other.add(path.parse(filename.toLowerCase()).name);
        this.card = guessCard([filename]);
    }

    columnPos(amountColumns: number[], descColumns: number[], transDate: number) {
        this.amountColumns = amountColumns;
        this.descColumns = descColumns;
        this.transDate = transDate;
    }

    entryFromCSV( details: string[] ): Entry {
        return new Entry(
            guessCost(details, this.amountColumns),
            guessWhen(details, this.transDate),
            guessWhere(details, this.descColumns),
            guessSpending(details),
            this.card,
            guessIndustry(details),
            guessSubIndustry(details),
            this.setOther( guessOther(details) ),
        );
    }

    newEntry(
        cost: number,
        when: Dayjs,
        provider: string,
        spend: Spending,
        industry?: ProviderIndustry,
        subindustry?: ProviderSubIndustry,
        other?: Set<string>
    ): Entry {

        return new Entry(cost, when, provider, spend, this.card, industry, subindustry, this.setOther(other));
    }

    private setOther( inputOther?: Set<string> ): Set<string> {
        let newOther: Set<string> = new Set<string>();
        if( inputOther !== undefined )
            newOther = inputOther;

        this.other.forEach(item => {
            newOther.add(item);
        });

        return newOther
    }
}