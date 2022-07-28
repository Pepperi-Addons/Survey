import SurveyService from './survey.service'
import { Client, Request } from '@pepperi-addons/debug-server'
import { Helper } from './helper';
import PapiService from './papi.service';

export async function surveys(client: Client, request: Request) 
{
	console.log(`Query received: ${JSON.stringify(request.query)}`);

	switch (request.method) 
	{
	case "GET":
	{
		const surveyService = getSurveyService(client, request);
        return surveyService.getSurveys();
	}
    case "POST":
	{
		const surveyService = getSurveyService(client, request);
        return surveyService.postSurvey();
	}
	default:
	{
		throw new Error(`Unsupported method: ${request.method}`);
	}
	}
}

function getSurveyService(client: Client, request: Request) {
    const papiClient = Helper.getPapiClient(client);
    const papiService = new PapiService(papiClient, client);
    const surveyService = new SurveyService(client, request, papiService);
    return surveyService;
}
