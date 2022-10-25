import { AddonData } from "@pepperi-addons/papi-sdk";
import IApiService from "./iApiService";
import { Request } from '@pepperi-addons/debug-server';
export interface Survey extends AddonData {
    Key?: string;
    Status?: string;
    ExternalID?: string;
    Template?: string;
    Answers?: Answer[];
    Creator?: string;
    Account?: string;
}
export interface Survey extends AddonData {
    Key?: string;
    Status?: string;
    ExternalID?: string;
    Template?: string;
    Answers?: Answer[];
    Creator?: string;
    Account?: string;
}
export interface SurveyTemplate extends AddonData {
    Name?: string;
    Description?: string;
    Active?: string;
    Sections?: Array<SurveyTemplateSection>;
}
export interface SurveyTemplateSection {
    Name: string;
    Title: string;
    Description: string;
    Questions: Array<SurveyTemplateQuestion>;
}
export interface SurveyTemplateQuestion {
    Name: string;
    Title: string;
    Description: string;
    Type: string;
    Mandatory: boolean;
}
export interface Answer {
    Key: string;
    Value: any;
}
export interface ResourceServiceBuilder {
    resourceCreationMandatoryFields: string[];
    resourceUniqueFields: string[];
    request: Request;
    iApiService: IApiService<AddonData>;
    resourceName: string;
}
