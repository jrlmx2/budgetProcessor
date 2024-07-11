export type Guesser<T> = (transactionDetails: string[]) => T;

export const guess = <KeyEnum>(keywordMap: Map<KeyEnum, string[]>, def: KeyEnum, log: boolean = false): Guesser<KeyEnum> => {
    return ( transactionDetails: any[] ): KeyEnum => {
        for(let detail of transactionDetails) {
            if(log) console.log(detail)
            if (detail) {
                let lowerDetails = detail.toString().toLowerCase();

                    for ( const [target, keywords] of keywordMap.entries() ) {
                        if(log) console.log(target, JSON.stringify(keywords, null, 2), lowerDetails)
                        if ( hasAny(lowerDetails, keywords, log) )
                            return target;
                    }
            } else {
                //console.warn(`No details included using ${typeof def}.${def}`, JSON.stringify(detail,null,2))
            }
        }
        return def;
    }
}

export function hasAny( target: string, values: string[], log: boolean = false ): boolean {
    const out = values.some( (search) => target.includes(search.toLowerCase()) );
    if (log) console.log(`found ${out} for inputs ${target} in ${JSON.stringify(values, null,  2)}`)
    return out;
}