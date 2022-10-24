import { Client } from '@pepperi-addons/debug-server/dist';
import { AddonData, FindOptions, PapiClient } from '@pepperi-addons/papi-sdk';
import { IApiService, Survey } from 'surveys-shared';

export class PapiService<T extends AddonData> implements IApiService<T>
{
	constructor(protected papiClient: PapiClient, protected client: Client, protected resourceName: string) 
	{}

	async getResources(findOptions: FindOptions): Promise<Array<T>>
	{
		return await (this.papiClient.addons.data.uuid(this.client.AddonUUID).table(this.resourceName).find(findOptions) as Promise<Array<T>>);
	}

	async getResourceByKey(key: any): Promise<T>
	{
		return await (this.papiClient.addons.data.uuid(this.client.AddonUUID).table(this.resourceName).key(key).get() as Promise<T>);
	}

	/**
     * Returns an *array* of surveys. It is up to the user to validate the response length.
     * @param unique_field The unique field to use for the search
     * @param value The value to search for
     * @returns An *array* of surveys that match the search
     */
	async getResourceByUniqueField(unique_field: string, value: any): Promise<Array<T>>
	{
		const findOptions: FindOptions = 
        {
        	where: `${unique_field} = '${value}'`,
        }
        
		return await (this.papiClient.addons.data.uuid(this.client.AddonUUID).table(this.resourceName).find(findOptions) as Promise<Array<T>>);
	}

	async postResource(body: Survey): Promise<T>
	{
		return await (this.papiClient.addons.data.uuid(this.client.AddonUUID).table(this.resourceName).upsert(body) as Promise<T>);
	}

	async searchResources(body: any): Promise<Array<T>>
	{
		return await (this.papiClient.post(`/addons/data/search/${this.client.AddonUUID}/${this.resourceName}`, body) as Promise<Array<T>>);
	}
}

export default PapiService;