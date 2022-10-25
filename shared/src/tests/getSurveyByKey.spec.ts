import 'mocha';
import chai, { expect } from 'chai';
import promised from 'chai-as-promised';
import { MockApiService, MockGenericResourceServiceBuilder } from './consts';
import { Request } from "@pepperi-addons/debug-server";
import { GenericResourceService } from '..';

chai.use(promised);

describe('GET survey by key', async () => 
{


	const papiService = new MockApiService();

	const request: Request = {
		method: 'GET',
		body: {},
		header: {},
		query:{}
	}

	it('should call getSurveyByKey with a key', async () => 
	{

		const requestCopy = { ...request };
		requestCopy.query = {
			key:'myKey'
		}

		const mockServiceBuilder = new MockGenericResourceServiceBuilder(requestCopy, papiService);
		const survey = new GenericResourceService(mockServiceBuilder);

		papiService.getResourceByKey = async (key: string) => 
		{
			expect(key).to.equal(requestCopy.query.key);

			//Don't care...
			return [];
		}

		await survey.getResourceByKey();
        
	});

	it('should throw a "Could not find a survey with requested key" exception', async () => 
	{

		const requestCopy = { ...request };
		requestCopy.query = {
			key:'myKey'
		}
		const mockServiceBuilder = new MockGenericResourceServiceBuilder(requestCopy, papiService);
		const survey = new GenericResourceService(mockServiceBuilder);

		papiService.getResourceByKey = async (key: string) => 
		{
			throw new Error();
		}

		await expect(survey.getResourceByKey()).to.be.rejectedWith(`Could not find a survey with requested key '${requestCopy.query.key}'`);
        
	});

	it('should throw a "The request query must contain a key parameter." exception', async () => 
	{

		const requestCopy = { ...request };
		requestCopy.query = {}
		const mockServiceBuilder = new MockGenericResourceServiceBuilder(requestCopy, papiService);
		const survey = new GenericResourceService(mockServiceBuilder);

		await expect(survey.getResourceByKey()).to.be.rejectedWith(`The request query must contain a key parameter.`);
        
	});
});

