// import { PapiClientOptions } from '@pepperi-addons/papi-sdk';

import { FindOptions } from "@pepperi-addons/papi-sdk";
import { IApiService, Survey } from "..";
import { expect } from "chai";

export class MockApiService implements IApiService
{
    searchSurveys(body: any): Promise<Survey[]>
    {
        return Promise.resolve([{}]);
    }
    async getSurveys(findOptions: FindOptions): Promise<Survey[]>
    {
        return Promise.resolve([{}]);
    }
    async getSurveyByKey(key: string): Promise<Survey>
    {
        return Promise.resolve({});
    }
    async getSurveyByUniqueField(unique_field: string, value: any): Promise<Survey[]>
    {
        return Promise.resolve([{}]);
    }
    async postSurvey(body: Survey): Promise<Survey> {
        return Promise.resolve({});
    }
}

export function validateArraysHaveSameObjects(fields: string[] | undefined, arg1: any)
{
    expect(fields?.every(field => arg1.includes(field))).to.be.true;
    expect(arg1.every(field => fields?.includes(field))).to.be.true;
}