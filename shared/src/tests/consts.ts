// import { PapiClientOptions } from '@pepperi-addons/papi-sdk';

import { AddonData, FindOptions } from "@pepperi-addons/papi-sdk";
import { IApiService } from "..";
import { expect } from "chai";

export class MockApiService<T extends AddonData> implements IApiService<T>
{
	searchResources(body: T): Promise<T[]>
	{
		return Promise.resolve([{} as T]);
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