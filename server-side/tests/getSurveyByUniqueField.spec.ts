import 'mocha';
import chai, { expect } from 'chai';
import promised from 'chai-as-promised';
import PapiService from '../papi.service';
import { mockClient } from './consts';
import { Request } from "@pepperi-addons/debug-server";
import { PapiClient } from '@pepperi-addons/papi-sdk';
import  SurveyService from '../survey.service';
import { UNIQUE_FIELDS } from '../constants';

chai.use(promised);

describe('GET survey by unique fields', async () => {

    const papiClient = new PapiClient({
        baseURL: mockClient.BaseURL,
        token: mockClient.OAuthAccessToken,
        addonUUID: mockClient.AddonUUID,
        actionUUID: mockClient.ActionUUID,
    });

    const papiService = new PapiService(papiClient, mockClient);

    const request: Request = {
        method: 'GET',
        body: {},
        header: {},
        query:{}
    }

    it('Passing a Key should call getSurveyByKey with the key', async () => {

        const requestCopy = { ...request };
        requestCopy.query = {
            unique_field: 'Key',
            value: 'myKey'
        }
        const survey = new SurveyService(mockClient ,requestCopy, papiService);
        papiService.getSurveyByKey = async (key: string) => {
            expect(key).to.equal(requestCopy.query.value);

            //Don't care...
            return [];
        }

        await survey.getSurveyByUniqueField();
        
    });

    it('should throw a "The request query must contain a unique_field parameter." excpetion', async () => {

        const requestCopy = { ...request };
        requestCopy.query = {
            value: 'myKey'
        }
        const survey = new SurveyService(mockClient ,requestCopy, papiService);
        papiService.getSurveyByKey = async (key: string) => {
            throw new Error();
        }

        await expect(survey.getSurveyByUniqueField()).to.be.rejectedWith(`The request query must contain a unique_field parameter.`);
        
    });

    it('should throw a "The request query must contain a value parameter." excpetion', async () => {

        const requestCopy = { ...request };
        requestCopy.query = {
            unique_field: 'Key'
        }
        const survey = new SurveyService(mockClient ,requestCopy, papiService);

        await expect(survey.getSurveyByUniqueField()).to.be.rejectedWith(`The request query must contain a value parameter.`);
        
    });

    it('should throw a "The unique_field parameter must be one of the following" excpetion', async () => {

        const requestCopy = { ...request };
        requestCopy.query = {
            unique_field: 'UNSUPPORTED',
            value: "dont care..."
        }
        const survey = new SurveyService(mockClient ,requestCopy, papiService);

        await expect(survey.getSurveyByUniqueField()).to.be.rejectedWith(`The unique_field parameter must be one of the following: '${UNIQUE_FIELDS.join(', ')}'.`);
        
    });
});

