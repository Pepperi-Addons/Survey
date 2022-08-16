import { Client } from '@pepperi-addons/debug-server/dist';
import { FindOptions, PapiClient } from '@pepperi-addons/papi-sdk';
import { SCHEMA_NAME } from './constants';
import { Helper } from './helper';
import { Survey } from './types';

export class PapiService 
{
	constructor(protected papiClient: PapiClient, protected client: Client) 
	{}

	async getSurveys(findOptions: FindOptions): Promise<Array<Survey>>
	{
		return this.papiClient.addons.data.uuid(this.client.AddonUUID).table(SCHEMA_NAME).find(findOptions);
	}
}

export default PapiService;