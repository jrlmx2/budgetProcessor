interface Entry {
    value: number;
    desc: string;
    category: Spending;
    dateOfSpend: Date;
    source: string;
    details: string;
    type: string;
    checkNumber?: number;
}

interface EntryMapping {
    value: string;
    desc: string;
    category: string;
    dateOfSpend: string;
    details: string;
    type: string;
    checkNumber?: string;
}