import 'mocha';
import chai, { expect } from 'chai';
import promised from 'chai-as-promised';
import { MockApiService, MockGenericResourceServiceBuilder } from './consts';
import { Request } from "@pepperi-addons/debug-server";
import { SurveysConstants, GenericResourceService  } from '..';


chai.use(promised);

describe('GET survey by unique fields', async () => 
{

	const papiService = new MockApiService();

	const request: Request = {
		method: 'GET',
		body: {},
		header: {},
		query:{}
	}

	it('Passing a Key should call getSurveyByKey with the key', async () => 
	{

		const requestCopy = { ...request };
		requestCopy.query = {
			unique_field: 'Key',
			value: 'myKey'
		}
		const mockServiceBuilder = new MockGenericResourceServiceBuilder(requestCopy, papiService);
		const survey = new GenericResourceService(mockServiceBuilder);

		papiService.getResourceByKey = async (key: string) => 
		{
			expect(key).to.equal(requestCopy.query.value);

			//Don't care...
			return [];
		}

		await survey.getResourceByUniqueField();
        
	});

	it('should throw a "The request query must contain a unique_field parameter." exception', async () => 
	{

		const requestCopy = { ...request };
		requestCopy.query = {
			value: 'myKey'
		}
		const mockServiceBuilder = new MockGenericResourceServiceBuilder(requestCopy, papiService);
		const survey = new GenericResourceService(mockServiceBuilder);

		papiService.getResourceByKey = async (key: string) => 
		{
			throw new Error();
		}

		await expect(survey.getResourceByUniqueField()).to.be.rejectedWith(`The request query must contain a unique_field parameter.`);
        
	});

	it('should throw a "The request query must contain a value parameter." exception', async () => 
	{

		const requestCopy = { ...request };
		requestCopy.query = {
			unique_field: 'Key'
		}
		const mockServiceBuilder = new MockGenericResourceServiceBuilder(requestCopy, papiService);
		const survey = new GenericResourceService(mockServiceBuilder);

		await expect(survey.getResourceByUniqueField()).to.be.rejectedWith(`The request query must contain a value parameter.`);
        
	});

	it('should throw a "The unique_field parameter must be one of the following" exception', async () => 
	{

		const requestCopy = { ...request };
		requestCopy.query = {
			unique_field: 'UNSUPPORTED',
			value: "dont care..."
		}
		const mockServiceBuilder = new MockGenericResourceServiceBuilder(requestCopy, papiService);
		const survey = new GenericResourceService(mockServiceBuilder);

		await expect(survey.getResourceByUniqueField()).to.be.rejectedWith(`The unique_field parameter must be one of the following: '${SurveysConstants.UNIQUE_FIELDS.join(', ')}'.`);
        
	});
});

