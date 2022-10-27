import { Client, Request } from '@pepperi-addons/debug-server'
import { Helper } from './helper';
import PapiService from './papi.service';
import { IApiService, SurveyService } from 'surveys-shared';

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

export async function get_surveys_by_key(client: Client, request: Request) 
{
	console.log(`Query received: ${JSON.stringify(request.query)}`);

	switch (request.method) 
	{
	case "GET":
	{
		const surveyService = getSurveyService(client, request);
		return surveyService.getSurveyByKey();
	}
	default:
	{
		throw new Error(`Unsupported method: ${request.method}`);
	}
	}
}

export async function get_surveys_by_unique_field(client: Client, request: Request) 
{
	console.log(`Query received: ${JSON.stringify(request.query)}`);

	switch (request.method) 
	{
	case "GET":
	{
		const surveyService = getSurveyService(client, request);
        return surveyService.getSurveyByUniqueField();
	}
	default:
	{
		throw new Error(`Unsupported method: ${request.method}`);
	}
	}
}

export async function surveys_search(client: Client, request: Request) 
{
	switch (request.method) 
	{
	case "POST":
	{
		const surveyService = getSurveyService(client, request);
        return surveyService.search();
	}
	default:
	{
		throw new Error(`Unsupported method: ${request.method}`);
	}
	}
}

function getSurveyService(client: Client, request: Request)
{
    const papiClient = Helper.getPapiClient(client);
    const papiService: IApiService = new PapiService(papiClient, client);
    const surveyService = new SurveyService(request, papiService);
    return surveyService;
}
