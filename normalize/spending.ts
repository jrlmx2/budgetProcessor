import { guess } from "./guess";

const SpendingMap: Map<Spending, string[]> = new Map<Spending, string[]>();

export enum Spending {
    GROCERY = "Grocery",
    ORDERED_FOOD = "Order Out",
    DINE_OUT = "Dine Out",
    SERVICES = "Services",
    REQUIRED = "Required",
    MISC = "Misc",
    PAY = "Pay",
}

SpendingMap.set(Spending.PAY, ['payroll']);
SpendingMap.set(Spending.GROCERY, ["lowe's foods", "kroger", "wegmans", "cosco", "food lion", "trader joe", "aldi"]);
SpendingMap.set(Spending.ORDERED_FOOD, ["doordash", "grubhub"]);
SpendingMap.set(Spending.DINE_OUT, ['restaurant', 'diner', 'shack']);
SpendingMap.set(Spending.REQUIRED, ["mortgage", "water", "insurance", "energy", "gas"]);

export const guessSpending = guess<Spending>(SpendingMap, Spending.MISC);