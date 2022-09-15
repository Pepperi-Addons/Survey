// import { PapiClientOptions } from '@pepperi-addons/papi-sdk';

import { FindOptions } from "@pepperi-addons/papi-sdk";
import { IApiService, Survey } from "..";

export class MockApiService implements IApiService
{
    async getSurveys(findOptions: FindOptions): Promise<Survey[]> {
        return Promise.resolve([{}]);
    }
    getSurveyByKey(key: string): Promise<Survey> {
        return Promise.resolve({});
    }
    getSurveyByUniqueField(unique_field: string, value: any): Promise<Survey[]> {
        return Promise.resolve([{}]);
        
    }
    postSurvey(body: Survey): Promise<Survey> {
        return Promise.resolve({});
        
    }
}
