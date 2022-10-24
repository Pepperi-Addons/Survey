import { Client, Request } from '@pepperi-addons/debug-server'
import { Helper } from './helper';
import PapiService from './papi.service';
import { IApiService, Survey, SurveysConstants, BaseSurveysService } from 'surveys-shared';

export async function baseSurveys(client: Client, request: Request) 
{
	console.log(`Query received: ${JSON.stringify(request.query)}`);

	switch (request.method) 
	{
	case "GET":
	{
		const baseSurveysService = getSurveyService(client, request);
		return baseSurveysService.getSurveys();
	}
	case "POST":
	{
		const baseSurveysService = getSurveyService(client, request);
		return baseSurveysService.postSurvey();
	}
	default:
	{
		throw new Error(`Unsupported method: ${request.method}`);
	}
	}
}

export async function get_baseSurveys_by_key(client: Client, request: Request) 
{
	console.log(`Query received: ${JSON.stringify(request.query)}`);

	switch (request.method) 
	{
	case "GET":
	{
		const baseSurveysService = getSurveyService(client, request);
		return baseSurveysService.getSurveyByKey();
	}
	default:
	{
		throw new Error(`Unsupported method: ${request.method}`);
	}
	}
}

export async function get_baseSurveys_by_unique_field(client: Client, request: Request) 
{
	console.log(`Query received: ${JSON.stringify(request.query)}`);

	switch (request.method) 
	{
	case "GET":
	{
		const baseSurveysService = getSurveyService(client, request);
		return baseSurveysService.getSurveyByUniqueField();
	}
	default:
	{
		throw new Error(`Unsupported method: ${request.method}`);
	}
	}
}

export async function baseSurveys_search(client: Client, request: Request) 
{
	switch (request.method) 
	{
	case "POST":
	{
		const baseSurveysService = getSurveyService(client, request);
		return baseSurveysService.search();
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
	const papiService: IApiService<Survey> = new PapiService(papiClient, client, SurveysConstants.schemaNames.BASE_SURVEYS);
	const baseSurveysService = new BaseSurveysService(request, papiService);
	return baseSurveysService;
}
