import 'mocha';
import chai, { expect } from 'chai';
import promised from 'chai-as-promised';
import PapiService from '../papi.service';
import { mockClient, validateArraysHaveSameObjects } from './consts';
import { Request } from "@pepperi-addons/debug-server";
import { FindOptions, PapiClient } from '@pepperi-addons/papi-sdk';
import  SurveyService from '../survey.service';

chai.use(promised);

describe('GET surveys', async () => {

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

    it('should call getSurveys with a valid FindOptions', async () => {

        const requestCopy = { ...request };
        requestCopy.query = {
            page: 1,
            page_size: 10,
            fields: 'UUID,ExternalID,CreationDateTime,Hidden',
            include_deleted: true,
            where: 'ExternalID = "test"'
        }
        const survey = new SurveyService(mockClient ,requestCopy, papiService);
        papiService.getSurveys = async (findOptions: FindOptions) => {
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
