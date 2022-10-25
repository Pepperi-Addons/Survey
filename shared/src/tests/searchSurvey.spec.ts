import 'mocha';
import chai, { expect } from 'chai';
import promised from 'chai-as-promised';
import { MockApiService, MockGenericResourceServiceBuilder, validateArraysHaveSameObjects } from './consts';
import { Request } from "@pepperi-addons/debug-server";
import { SurveysConstants } from '../constants';
import GenericResourceService from '../genericResource.service';

chai.use(promised);

describe('Search Survey', async () => 
{

	const request: Request = {
		method: 'GET',
		body: {},
		header: {},
		query:{}
	}

	const papiService = new MockApiService();


	it('should call Search with same body', async () => 
	{

		const requestCopy = { ...request };
		requestCopy.body = {
			Where: 'where...',
			Page: 2,
			PageSize: 10,
			KeyList: ['key1', 'key2'],
			Fields: ['field1', 'field2'],
		}
		
		const mockServiceBuilder = new MockGenericResourceServiceBuilder(requestCopy, papiService);
		const survey = new GenericResourceService(mockServiceBuilder);

		papiService.searchResources = async (body: any) => 
		{
			expect(body.Where).to.equal(requestCopy.body.Where);
			expect(body.Page).to.equal(requestCopy.body.Page);
			expect(body.PageSize).to.equal(requestCopy.body.PageSize);
			validateArraysHaveSameObjects(body.KeyList, requestCopy.body.KeyList);
			validateArraysHaveSameObjects(body.Fields, requestCopy.body.Fields);


			//Don't care...
			return [];
		}

		await survey.search();
        
	});

	it('should throw a "The passed UniqueFieldID is not supported:" exception', async () => 
	{

		const requestCopy = { ...request };
		requestCopy.body = {
			UniqueFieldID: 'UNSUPPORTED',
		}

		const mockServiceBuilder = new MockGenericResourceServiceBuilder(requestCopy, papiService);
		const survey = new GenericResourceService(mockServiceBuilder);

		await expect(survey.search()).to.be.rejectedWith(`The passed UniqueFieldID is not supported: '${requestCopy.body.UniqueFieldID}'. Supported UniqueFieldID values are: ${JSON.stringify(SurveysConstants.UNIQUE_FIELDS)}`);

	});

	it('should throw a "Sending both KeyList and UniqueFieldList is not supported." exception', async () => 
	{

		const requestCopy = { ...request };
		requestCopy.body = {
			UniqueFieldList: ['key1', 'key2'],
			KeyList: ['key1', 'key2'],
		}
		
		const mockServiceBuilder = new MockGenericResourceServiceBuilder(requestCopy, papiService);
		const survey = new GenericResourceService(mockServiceBuilder);

		await expect(survey.search()).to.be.rejectedWith(`Sending both KeyList and UniqueFieldList is not supported.`);
        
	});

	it('should throw a "Missing UniqueFieldID parameter." exception', async () => 
	{

		const requestCopy = { ...request };
		requestCopy.body = {
			UniqueFieldList: ['key1', 'key2'],
		}
		
		const mockServiceBuilder = new MockGenericResourceServiceBuilder(requestCopy, papiService);
		const survey = new GenericResourceService(mockServiceBuilder);

		await expect(survey.search()).to.be.rejectedWith(`Missing UniqueFieldID parameter.`);
        
	});
});

