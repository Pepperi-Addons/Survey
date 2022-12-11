import { Client, Request } from '@pepperi-addons/debug-server'
import { Helper } from './helper';
import PapiService from './papi.service';
import { IApiService, Survey, SurveysConstants, GenericResourceService, BaseSurveysServiceBuilder, BaseSurveyTemplatesServiceBuilder, SurveyTemplate} from 'surveys-shared';
import { AddonData } from '@pepperi-addons/papi-sdk';

// #region base_surveys
export async function base_surveys(client: Client, request: Request) : Promise<AddonData | Array<AddonData>>
{
	const baseSurveysService = getBaseSurveysService(client, request);
	return await genericResourcesAdapter(request, baseSurveysService);
}

export async function get_base_surveys_by_key(client: Client, request: Request): Promise<AddonData>
{
	const baseSurveysService = getBaseSurveysService(client, request);
	return await getGenericResourceByKeyAdapter(request, baseSurveysService);
}

export async function get_base_surveys_by_unique_field(client: Client, request: Request) : Promise<AddonData>
{
	const baseSurveysService = getBaseSurveysService(client, request);
	return await getGenericResourceByUniqueFieldAdapter(request, baseSurveysService);
}

export async function base_surveys_search(client: Client, request: Request) : Promise<{Objects: AddonData[], Count?: number}>
{
	const baseSurveysService = getBaseSurveysService(client, request);
	return await genericResourceSearchAdapter(request, baseSurveysService);
}

function getBaseSurveysService(client: Client, request: Request)
{
	const papiClient = Helper.getPapiClient(client);
	const papiService: IApiService<Survey> = new PapiService(papiClient, client, SurveysConstants.schemaNames.BASE_SURVEYS);
	const baseSurveysServiceBuilder = new BaseSurveysServiceBuilder(request, papiService);
	const genericResourceService = new GenericResourceService(baseSurveysServiceBuilder);
	return genericResourceService;
}

// #endregion

// #region base_survey_templates

export async function base_survey_templates(client: Client, request: Request): Promise<AddonData | AddonData[]>
{
	const baseSurveyTemplatesService = getBaseSurveyTemplatesService(client, request);
	return await genericResourcesAdapter(request, baseSurveyTemplatesService);
}

export async function get_base_survey_templates_by_key(client: Client, request: Request): Promise<AddonData>
{
	const baseSurveyTemplatesService = getBaseSurveyTemplatesService(client, request);
	return await getGenericResourceByKeyAdapter(request, baseSurveyTemplatesService);
}

export async function get_base_survey_templates_by_unique_field(client: Client, request: Request) : Promise<AddonData>
{
	const baseSurveyTemplatesService = getBaseSurveyTemplatesService(client, request);
	return await getGenericResourceByUniqueFieldAdapter(request, baseSurveyTemplatesService);
}

export async function base_survey_templates_search(client: Client, request: Request): Promise<{Objects: AddonData[], Count?: number}>
{
	const baseSurveyTemplatesService = getBaseSurveyTemplatesService(client, request);
	return await genericResourceSearchAdapter(request, baseSurveyTemplatesService);
}

function getBaseSurveyTemplatesService(client: Client, request: Request)
{
	const papiClient = Helper.getPapiClient(client);
	const papiService: IApiService<SurveyTemplate> = new PapiService(papiClient, client, SurveysConstants.schemaNames.BASE_SURVEY_TEMPLATES);
	const baseSurveyTemplatesServiceBuilder = new BaseSurveyTemplatesServiceBuilder(request, papiService);
	const genericResourceService = new GenericResourceService(baseSurveyTemplatesServiceBuilder);
	return genericResourceService;
}

// #endregion

// #region adapters

async function genericResourcesAdapter(request: Request, genericResourceService: GenericResourceService)
{
	console.log(`Query received: ${JSON.stringify(request.query)}`);

	switch (request.method) 
	{
	case "GET":
	{
		return await genericResourceService.getResources();
	}
	case "POST":
	{
		return await genericResourceService.postResource();
	}
	default:
	{
		throw new Error(`Unsupported method: ${request.method}`);
	}
	}
}

async function getGenericResourceByKeyAdapter(request: Request, genericResourceService: GenericResourceService)
{
	console.log(`Query received: ${JSON.stringify(request.query)}`);

	switch (request.method) 
	{
	case "GET":
	{
		return await genericResourceService.getResourceByKey();
	}
	default:
	{
		throw new Error(`Unsupported method: ${request.method}`);
	}
	}
}

async function getGenericResourceByUniqueFieldAdapter(request: Request, genericResourceService: GenericResourceService)
{
	console.log(`Query received: ${JSON.stringify(request.query)}`);

	switch (request.method) 
	{
	case "GET":
	{
		return await genericResourceService.getResourceByUniqueField();
	}
	default:
	{
		throw new Error(`Unsupported method: ${request.method}`);
	}
	}
}

async function genericResourceSearchAdapter(request: Request, genericResourceService: GenericResourceService)
{
	switch (request.method) 
	{
	case "POST":
	{
		return await genericResourceService.search();
	}
	default:
	{
		throw new Error(`Unsupported method: ${request.method}`);
	}
	}
}

//#endregion