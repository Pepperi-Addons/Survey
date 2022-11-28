
/*
The return object format MUST contain the field 'success':
{success:true}

If the result of your code is 'false' then return:
{success:false, erroeMessage:{the reason why it is false}}
The error Message is importent! it will be written in the audit log and help the user to understand what happen
*/

import { Client, Request } from '@pepperi-addons/debug-server'
import { AddonDataScheme, PapiClient, Relation } from '@pepperi-addons/papi-sdk'
import { SurveysConstants } from 'surveys-shared';
import semver from 'semver';

export async function install(client: Client, request: Request): Promise<any> 
{

	const papiClient = createPapiClient(client);
	try
	{
		// Create base survey template schema, from inner most to outer most.
		await createBaseSurveyTemplateQuestionsSchema(papiClient, client);
		await createBaseSurveyTemplateSectionsSchema(papiClient, client);
		await createBaseSurveyTemplatesSchema(papiClient, client);
		
		// Create base survey schemas.
		await createBaseSurveyAnswersSchema(papiClient, client);
		await createBaseSurveysSchema(papiClient, client);
		
		await createDimxRelations(client, papiClient);
	}
	catch(error)
	{
		if(error instanceof Error)
		{
			console.error(`Error during installation - ${error.message}.\n${error.stack ?? ''}`);
		}
		return { success: false, errorMessage: error instanceof Error ? error.message : "Unknown error occurred."};
	}
	
	return { success: true, resultObject: {} }
}

export async function uninstall(client: Client, request: Request): Promise<any> 
{

	const papiClient = createPapiClient(client);
	await removeDimxRelations(client, papiClient);
	return { success: true, resultObject: {} }
}

export async function upgrade(client: Client, request: Request): Promise<any> 
{
	if (request.body.FromVersion && semver.compare(request.body.FromVersion, '0.5.1') < 0) 
	{
		const errorMessage = `Upgrading from versions <= 0.5.0 to the requested ${request.body.ToVersion} is unsupported. Please uninstall your current version, and install the wanted version.`;
		return { success: false, errorMessage: errorMessage };
	}

	return {success:true,resultObject:{}}
}

export async function downgrade(client: Client, request: Request): Promise<any> 
{
	return { success: true, resultObject: {} }
}

function createPapiClient(Client: Client) 
{
	return new PapiClient({
		token: Client.OAuthAccessToken,
		baseURL: Client.BaseURL,
		addonUUID: Client.AddonUUID,
		addonSecretKey: Client.AddonSecretKey,
		actionUUID: Client.ActionUUID,
	});
}

async function createBaseSurveysSchema(papiClient: PapiClient, client: Client) 
{
	const schema: AddonDataScheme = {
		Name: SurveysConstants.schemaNames.BASE_SURVEYS,
		Type: 'abstract',
		AddonUUID: client.AddonUUID,
		DataSourceData: { // This property should be inherited from baseActivity. This is currently not implemented. https://pepperi.atlassian.net/browse/DI-21446
			IndexName: SurveysConstants.DATA_SOURCE_INDEX_NAME
		},
		SyncData: {
			Sync: true,
		},
		Extends:
		{
			AddonUUID: SurveysConstants.dependentAddonsUUIDs.BASE_ACTIVITIES,
			Name: SurveysConstants.schemaNames.BASE_ACTIVITIES
		},
		Fields:
		{
			ExternalID:
			{
				Type: 'String'
			},
			Template:
			{
				Type: 'Resource',
				Resource: SurveysConstants.schemaNames.BASE_SURVEY_TEMPLATES,
				AddonUUID: client.AddonUUID
			},
			Answers:
			{
				Type: 'Array',
				Items: {
					Type: 'ContainedResource',
					Resource: SurveysConstants.schemaNames.SURVEY_ANSWERS,
					AddonUUID: client.AddonUUID
				}

			},
		}
	} as any; // Waiting for papi-sdk that supports Extends: https://github.com/Pepperi-Addons/papi-sdk/pull/138

	await papiClient.addons.data.schemes.post(schema);
}

async function createBaseSurveyAnswersSchema(papiClient: PapiClient, client: Client) 
{
	const schema: AddonDataScheme = {
		Name: SurveysConstants.schemaNames.SURVEY_ANSWERS,
		Type: 'contained',
		AddonUUID: client.AddonUUID,
		Fields: {
			Key: {
				Type: 'Resource',
				Resource: SurveysConstants.schemaNames.SURVEY_TEMPLATE_QUESTIONS,
				AddonUUID: client.AddonUUID
			},
			Answer:
			{
				Type: "Object",
				Fields: {
				}
			}
		}

	}

	await papiClient.addons.data.schemes.post(schema);
}

async function createBaseSurveyTemplatesSchema(papiClient: PapiClient, client: Client) 
{
	const schema: AddonDataScheme = {
		Name: SurveysConstants.schemaNames.BASE_SURVEY_TEMPLATES,
		Type: 'abstract',
		AddonUUID: client.AddonUUID,
		SyncData:
			{	
				Sync: true,
			},
		Fields:
		{
			Name:
			{
				Type: 'String'
			},
			Description:
			{
				Type: 'String'
			},
			Active:
			{
				Type: 'Bool'
			},
			Sections:
			{
				Type: "Array",
				Items: {
					Type: 'ContainedResource',
					Resource: SurveysConstants.schemaNames.SURVEY_TEMPLATE_SECTIONS,
					AddonUUID: client.AddonUUID
				}
			},
		}
	}

	await papiClient.addons.data.schemes.post(schema);
}

async function createBaseSurveyTemplateSectionsSchema(papiClient: PapiClient, client: Client) 
{
	const schema: AddonDataScheme = {
		Name: SurveysConstants.schemaNames.SURVEY_TEMPLATE_SECTIONS,
		Type: 'contained',
		AddonUUID: client.AddonUUID,
		Fields:
		{
			Name:
			{
				Type: 'String'
			},
			Title:
			{
				Type: 'String'
			},
			Description:
			{
				Type: 'String'
			},
			Questions:
			{
				Type: "Array",
				Items: {
					Type: 'ContainedResource',
					Resource: SurveysConstants.schemaNames.SURVEY_TEMPLATE_QUESTIONS,
					AddonUUID: client.AddonUUID
				}
			},
		}
	}

	await papiClient.addons.data.schemes.post(schema);
}

async function createBaseSurveyTemplateQuestionsSchema(papiClient: PapiClient, client: Client) 
{
	const schema: AddonDataScheme = {
		Name: SurveysConstants.schemaNames.SURVEY_TEMPLATE_QUESTIONS,
		Type: 'contained',
		AddonUUID: client.AddonUUID,
		Fields:
		{
			Name:
			{
				Type: 'String'
			},
			Title:
			{
				Type: 'String'
			},
			Description:
			{
				Type: 'String'
			},
			Type:
			{
				Type: 'String'
			},
			Mandatory:
			{
				Type: 'Bool'
			}
		}
	}

	await papiClient.addons.data.schemes.post(schema);
}

async function createDimxRelations(client: Client, papiClient: PapiClient) 
{
	const isHidden = false;
	await postDimxRelations(client, isHidden, papiClient);
}

async function removeDimxRelations(client: Client, papiClient: PapiClient) 
{
	const isHidden = true;
	await postDimxRelations(client, isHidden, papiClient);
}

async function postDimxRelations(client: Client, isHidden: boolean, papiClient: PapiClient) 
{

	const importRelation: Relation = {
		RelationName: "DataImportResource",
		AddonUUID: client.AddonUUID,
		AddonRelativeURL: '',
		Name: SurveysConstants.schemaNames.BASE_SURVEYS,
		Type: 'AddonAPI',
		Source: 'adal',
		Hidden: isHidden
	};

	const exportRelation: Relation = {
		RelationName: "DataExportResource",
		AddonUUID: client.AddonUUID,
		AddonRelativeURL: '',
		Name: SurveysConstants.schemaNames.BASE_SURVEYS,
		Type: 'AddonAPI',
		Source: 'adal',
		Hidden: isHidden
	};

	await upsertRelation(papiClient, importRelation);
	await upsertRelation(papiClient, exportRelation);
}

async function upsertRelation(papiClient: PapiClient, relation: Relation) 
{
	return papiClient.post('/addons/data/relations', relation);
}

async function setSchemaSyncToTrue(papiClient: PapiClient, schemaName: string)
{
	const schema: AddonDataScheme = await papiClient.addons.data.schemes.name(schemaName).get();
	schema.SyncData = {Sync: true};

	await papiClient.addons.data.schemes.post(schema);
}
