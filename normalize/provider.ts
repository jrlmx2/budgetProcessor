import { guess } from "./guess";

const IndustryMap: Map<ProviderIndustry, string[]> = new Map<ProviderIndustry, string[]>();

export enum ProviderIndustry {
    Utility = 'Utilities',
    Service = 'Service',
    Loan = 'Loan',
    Charity = 'Charity',
    Retirement = 'Retirement',
    Insurance = 'Insurance',
    Other = 'Other'
}

IndustryMap.set(ProviderIndustry.Utility, ['duke', 'dominion', 'lumos', 'trash', 'sewer', 'water', 't-mobile', 'att', 'verizon']);
IndustryMap.set(ProviderIndustry.Service, ["jetbrains", "spotify", "idea", "rocket", "razors", "grub", "dash"]);
IndustryMap.set(ProviderIndustry.Loan, ["movement", 'dividend']);
IndustryMap.set(ProviderIndustry.Charity, ['young', 'campus', 'bradford', 'grace']);
IndustryMap.set(ProviderIndustry.Retirement, ["granite"]);
IndustryMap.set(ProviderIndustry.Insurance, ["erie"])

export const guessIndustry = guess<ProviderIndustry>(IndustryMap, ProviderIndustry.Other);

const SubIndustryMap: Map<ProviderSubIndustry, string[]> = new Map<ProviderSubIndustry, string[]>();

export enum ProviderSubIndustry {
    Internet = 'Internet',
    Phone = 'Phone',
    Gas = 'Gas',
    Fuel = 'Fuel',
    Electricity = 'Electricity',
    Entertainment = 'Entertainment',
    Productivity = 'Productivity',
    Auto = 'Auto',
    Home = 'Home',
    Shopping = 'Shopping',
}

SubIndustryMap.set(ProviderSubIndustry.Internet, ['payroll']);
SubIndustryMap.set(ProviderSubIndustry.Phone, ['t-mobile', 'att', 'verizon']);
SubIndustryMap.set(ProviderSubIndustry.Gas, ["dominion"]);
SubIndustryMap.set(ProviderSubIndustry.Electricity, ['duke']);
SubIndustryMap.set(ProviderSubIndustry.Fuel, ['shell', 'tommy', 'hess']);
SubIndustryMap.set(ProviderSubIndustry.Productivity, ['jetbrains', 'idea', 'harvard', 'office']);
SubIndustryMap.set(ProviderSubIndustry.Shopping, ['target', 'walmart', 'amazon']);
SubIndustryMap.set(ProviderSubIndustry.Home, ['depot', 'lowe' ]);
SubIndustryMap.set(ProviderSubIndustry.Auto, ['kia', 'toyota', 'autozone', 'napa']);

export const guessSubIndustry = guess<ProviderSubIndustry>(SubIndustryMap, ProviderSubIndustry.Entertainment);