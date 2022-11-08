import 'mocha';
import chai, { expect } from 'chai';
import promised from 'chai-as-promised';
import { MockApiService } from './consts';
import { Request } from "@pepperi-addons/debug-server";
import { Survey, SurveyService } from '..';
import { validate as uuidValidate } from 'uuid';

chai.use(promised);

describe('POST survey', async () => {

    const request: Request = {
        method: 'POST',
        body: {},
        header: {},
        query:{}
    }

    it('create a new survey', async () => {

        const requestCopy = { ...request };
        const papiService = new MockApiService();

        requestCopy.body = {
            Key: '00000000-0000-0000-0000-000000000011',
            Creator: '00000000-0000-0000-0000-000000000011',
        }
        const survey = new SurveyService(requestCopy, papiService);
        
        
        papiService.postSurvey = async (body: Survey) => {
            expect(body.Key).to.equal(requestCopy.body.Key);
            expect(body.Creator).to.equal(requestCopy.body.Creator);
            // Don't care...
            return {};
        }

        await survey.postSurvey();
        
    });

    it('create a new survey, creating a new Key automatically (POST doesn\'t include a key)', async () => {

        
        const requestCopy = { ...request };
        requestCopy.body = {
            Creator: '00000000-0000-0000-0000-000000000011',
        }
        const papiService = new MockApiService();

        const survey = new SurveyService(requestCopy, papiService);

        papiService.postSurvey = async (body: Survey) => {
            expect(uuidValidate(body.Key)).to.be.true;
            expect(body.Creator).to.equal(requestCopy.body.Creator);
            // Don't care...
            return {};
        }

        await survey.postSurvey();
        
    });

    it('should throw a "creator and template fields are mandatory on creation" exception', async () => {

        const requestCopy = { ...request };
        requestCopy.body = {
            Key: '00000000-0000-0000-0000-000000000011',
        }
        const papiService = new MockApiService();
        const survey = new SurveyService(requestCopy, papiService);

        // postSurvey uses getSurveyByKey to check if a survey exists.
        // If no Creator is provided and the survey doesn't exist, it should throw an error.
        survey.getSurveyByKey = async (key: string) => {
            return Promise.reject();
        }

        await expect(survey.postSurvey()).to.be.rejectedWith(`The survey with key '${requestCopy.body.Key}' does not exist. The Creator, Template and Account fields are mandatory on creation.`);
        
    });
});

