import 'mocha';
import chai, { expect } from 'chai';
import promised from 'chai-as-promised';
import { MockApiService } from './consts';
import { validateArraysHaveSameObjects } from './consts';
import { Request } from "@pepperi-addons/debug-server";
import { FindOptions } from '@pepperi-addons/papi-sdk';
import { BaseSurveysService } from '..';


chai.use(promised);

describe('GET surveys', async () => 
{

	const papiService = new MockApiService();

	const request: Request = {
		method: 'GET',
		body: {},
		header: {},
		query:{}
	}

	it('should call getSurveys with a valid FindOptions', async () => 
	{

		const requestCopy = { ...request };
		requestCopy.query = {
			page: 1,
			page_size: 10,
			fields: 'UUID,ExternalID,CreationDateTime,Hidden',
			include_deleted: true,
			where: 'ExternalID = "test"'
		}
		const survey = new BaseSurveysService(requestCopy, papiService);
		papiService.getResources = async (findOptions: FindOptions) => 
		{
			expect(findOptions.page).to.equal(requestCopy.query.page);
			expect(findOptions.page_size).to.equal(requestCopy.query.page_size);
			validateArraysHaveSameObjects(findOptions.fields, requestCopy.query.fields.split(','));
			expect(findOptions.include_deleted).to.equal(requestCopy.query.include_deleted);
			expect(findOptions.where).to.equal(requestCopy.query.where);

			// Don't care...
			return [];
		}

		await survey.getSurveys();
        
	});
});
