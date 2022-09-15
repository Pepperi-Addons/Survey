import 'mocha';
import chai, { expect } from 'chai';
import promised from 'chai-as-promised';
import { MockApiService } from './consts';
import { Request } from "@pepperi-addons/debug-server";
import { SurveyService } from '..';

chai.use(promised);

describe('GET survey by key', async () => {


    const papiService = new MockApiService();

    const request: Request = {
        method: 'GET',
        body: {},
        header: {},
        query:{}
    }

    it('should call getSurveyByKey with a key', async () => {

        const requestCopy = { ...request };
        requestCopy.query = {
            key:'myKey'
        }
        const survey = new SurveyService(requestCopy, papiService);
        papiService.getSurveyByKey = async (key: string) => {
            expect(key).to.equal(requestCopy.query.key);

            //Don't care...
            return [];
        }

        await survey.getSurveyByKey();
        
    });

    it('should throw a "Could not find a survey with requested key" exception', async () => {

        const requestCopy = { ...request };
        requestCopy.query = {
            key:'myKey'
        }
        const survey = new SurveyService(requestCopy, papiService);
        papiService.getSurveyByKey = async (key: string) => {
            throw new Error();
        }

        await expect(survey.getSurveyByKey()).to.be.rejectedWith(`Could not find a survey with requested key '${requestCopy.query.key}'`);
        
    });

    it('should throw a "The request query must contain a key parameter." exception', async () => {

        const requestCopy = { ...request };
        requestCopy.query = {}
        const survey = new SurveyService(requestCopy, papiService);

        await expect(survey.getSurveyByKey()).to.be.rejectedWith(`The request query must contain a key parameter.`);
        
    });
});

