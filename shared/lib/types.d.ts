import { AddonData } from "@pepperi-addons/papi-sdk";
export interface Survey extends AddonData {
    Key?: string;
    Status?: string;
    ExternalID?: string;
    Template?: string;
    Answers?: Answer[];
    Creator?: string;
    Account?: string;
}
export interface SurveyWithKey extends Survey {
    Key: string;
}
export interface Answer {
    Key: string;
    Value: any;
}
