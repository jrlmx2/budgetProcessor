const PAYROLL_KEYWORDS: Array<string> = ['payroll'];
const GROCERY_KEYWORDS: Array<string> = ["lowe's foods", "kroger", "wegmans", "cosco", "food lion", "trader joe", "aldi"];
const ORDERED_FOOD_KEYWORDS: Array<string> = ["doordash"];
const DINE_OUT_KEYWORDS: Array<string> = ['restaurant', 'diner', 'shack'];
const SERVICES_KEYWORDS: Array<string> = ["research", ];
const REQUIRED_KEYWORDS: Array<string> = ["mortgage", "water", "insurance"];

export const guessCategory = (transactionDetails: string): Spending => {
    let lowerDetails = transactionDetails.toLowerCase();

    if (hasAny(lowerDetails, PAYROLL_KEYWORDS)) {
        return Spending.PAY;
    }

    if (hasAny(lowerDetails, GROCERY_KEYWORDS)) {
        return Spending.GROCERY;
    }

    if (hasAny(lowerDetails, ORDERED_FOOD_KEYWORDS)) {
        return Spending.ORDERED_FOOD;
    }

    if (hasAny(lowerDetails, DINE_OUT_KEYWORDS)) {
        return Spending.DINE_OUT;
    }

    if (hasAny(lowerDetails, REQUIRED_KEYWORDS)) {
        return Spending.REQUIRED;
    }

    if (hasAny(lowerDetails, SERVICES_KEYWORDS)) {
        return Spending.SERVICES;
    }

    return Spending.MISC;
}

function hasAny(target: string, values: string[]): boolean {
    return values.some( (search) => target.includes(search) );
}