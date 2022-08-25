import { Client } from '@pepperi-addons/debug-server/dist';
import { FindOptions, PapiClient } from '@pepperi-addons/papi-sdk';
import { SCHEMA_NAME } from './constants';
import { Survey } from './types';

export class PapiService 
{
	constructor(protected papiClient: PapiClient, protected client: Client) 
	{}

	async getSurveys(findOptions: FindOptions): Promise<Array<Survey>>
	{
		return this.papiClient.addons.data.uuid(this.client.AddonUUID).table(SCHEMA_NAME).find(findOptions);
	}

	async getSurveyByKey(key: any): Promise<Survey>
	{
		return this.papiClient.addons.data.uuid(this.client.AddonUUID).table(SCHEMA_NAME).key(key).get();
	}

    /**
     * Returns an *array* of surveys. It is up to the user to validate the response length.
     * @param unique_field The unique field to use for the search
     * @param value The value to search for
     * @returns An *array* of surveys that match the search
     */
    async getSurveyByUniqueField(unique_field: string, value: any): Promise<Array<Survey>>
    {
        const findOptions: FindOptions = 
        {
            where: `${unique_field} = '${value}'`,
        }
        
        return this.papiClient.addons.data.uuid(this.client.AddonUUID).table(SCHEMA_NAME).find(findOptions);
    }

    postSurvey(body: Survey): Promise<Survey>
    {
		return this.papiClient.addons.data.uuid(this.client.AddonUUID).table(SCHEMA_NAME).upsert(body);
    }
}

export default PapiService;