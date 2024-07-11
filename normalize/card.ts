import { guess } from "./guess";

export enum Card {
    CitiAAExecutive = 'CitiAAExecutive',
    CitiAAElite = 'CitiAAElite',
    DiscoverIt = 'DiscoverIt',
    ChaseAmazon = 'ChaseAmazon',
    ChaseChecking = 'ChaseChecking',
    Costco = 'Costco',
    UNKNOWN = 'UNKNOWN',
}

const CardMap = new Map<Card, string[]>();

CardMap.set(Card.CitiAAElite,['1481']);
CardMap.set(Card.CitiAAExecutive,['1916']);
CardMap.set(Card.DiscoverIt,['discover']);
CardMap.set(Card.ChaseAmazon,['6420']);
CardMap.set(Card.Costco,[]);
CardMap.set(Card.ChaseChecking, ['3194'])

export const guessCard = guess<Card>(CardMap, Card.UNKNOWN);