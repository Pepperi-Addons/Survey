// import { PapiClientOptions } from '@pepperi-addons/papi-sdk';

import { AddonData, FindOptions } from "@pepperi-addons/papi-sdk";
import { IApiService, ResourceServiceBuilder, SurveysConstants } from "..";
import { expect } from "chai";
import { Request } from "@pepperi-addons/debug-server";

export class MockApiService<T extends AddonData> implements IApiService<T>
{
	searchResources(body: T): Promise<{Objects: T[], Count?: number}>
	{
		return Promise.resolve({Objects: [{} as T]});
	}
	async getResources(findOptions: FindOptions): Promise<T[]>
	{
		return Promise.resolve([{} as T]);
	}
	async getResourceByKey(key: string): Promise<T>
	{
		return Promise.resolve({} as T);
	}
	async getResourceByUniqueField(unique_field: string, value: any): Promise<T[]>
	{
		return Promise.resolve([{} as T]);
	}
	async postResource(body: T): Promise<T> 
	{
		return Promise.resolve({} as T);
	}
}

export function validateArraysHaveSameObjects(fields: string[] | undefined, arg1: any)
{
	expect(fields?.every(field => arg1.includes(field))).to.be.true;
	expect(arg1.every(field => fields?.includes(field))).to.be.true;
}

export class MockGenericResourceServiceBuilder implements ResourceServiceBuilder
{
	constructor(public request: Request, public iApiService: IApiService<AddonData>)
	{

	}
	public resourceCreationMandatoryFields: string[] = SurveysConstants.MandatoryFields;
	public resourceUniqueFields: string[] = SurveysConstants.UNIQUE_FIELDS;
	public resourceName: string = 'survey';
	
}
