interface Entry {
    value: number;
    desc: string;
    category: Spending;
    dateOfSpend: Date;
    source: string;
}

interface EntryMapping {
    value: string;
    desc: string;
    category: string;
    dateOfSpend: string;
    details: string;
}