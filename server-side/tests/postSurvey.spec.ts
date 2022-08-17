import 'mocha';
import chai, { expect } from 'chai';
import promised from 'chai-as-promised';
import PapiService from '../papi.service';
import { mockClient } from './consts';
import { Request } from "@pepperi-addons/debug-server";
import { FindOptions, PapiClient } from '@pepperi-addons/papi-sdk';
import  SurveyService from '../survey.service';
import { Survey } from '../types';

chai.use(promised);

describe('POST survey', async () => {

    const papiClient = new PapiClient({
        baseURL: mockClient.BaseURL,
        token: mockClient.OAuthAccessToken,
        addonUUID: mockClient.AddonUUID,
        actionUUID: mockClient.ActionUUID,
    });

    const request: Request = {
        method: 'POST',
        body: {},
        header: {},
        query:{}
    }

    it('create a new survey', async () => {

        const requestCopy = { ...request };
        const papiService = new PapiService(papiClient, mockClient);

        requestCopy.body = {
            Key: '00000000-0000-0000-0000-000000000011',
            Creator: '00000000-0000-0000-0000-000000000011',
        }
        const survey = new SurveyService(mockClient ,requestCopy, papiService);
        
        
        papiService.postSurvey = async (body: Survey) => {
            expect(body.Key).to.equal(requestCopy.body.Key);
            expect(body.Creator).to.equal(requestCopy.body.Creator);
            // Don't care...
            return {};
        }

        await survey.postSurvey();
        
    });

    it('should throw a "The request body must contain a Key parameter." excpetion', async () => {

        
        const requestCopy = { ...request };
        requestCopy.body = {
            Creator: '00000000-0000-0000-0000-000000000011',
        }
        const papiService = new PapiService(papiClient, mockClient);

        const survey = new SurveyService(mockClient ,requestCopy, papiService);

        await expect(survey.postSurvey()).to.be.rejectedWith(`The request body must contain a Key parameter.`);
        
    });

    it('should throw a "creator field is mandatory on creation" excpetion', async () => {

        const requestCopy = { ...request };
        requestCopy.body = {
            Key: '00000000-0000-0000-0000-000000000011',
        }
        const papiService = new PapiService(papiClient, mockClient);
        const survey = new SurveyService(mockClient ,requestCopy, papiService);

        // postSurvey uses getSurveyByKey to check if a survey exists.
        // If no Creator is provided and the survey doesn't exist, it should throw an error.
        survey.getSurveyByKey = async (key: string) => {
            return Promise.reject();
        }

        await expect(survey.postSurvey()).to.be.rejectedWith(`The survey with key '${requestCopy.body.Key}' does not exist. The creator field is mandatory on creation.`);
        
    });
});

