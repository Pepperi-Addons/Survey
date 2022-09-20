
/*
The return object format MUST contain the field 'success':
{success:true}

If the result of your code is 'false' then return:
{success:false, erroeMessage:{the reason why it is false}}
The error Message is importent! it will be written in the audit log and help the user to understand what happen
*/

import { Client, Request } from '@pepperi-addons/debug-server'
import { AddonDataScheme, PapiClient, Relation } from '@pepperi-addons/papi-sdk'
import { SCHEMA_NAME } from 'surveys-shared';


export async function install(client: Client, request: Request): Promise<any> 
{
    
	const papiClient = createPapiClient(client);
	await createSurveySchema(papiClient, client);
	await createDimxRelations(client, papiClient);
	return {success:true,resultObject:{}}
}

export async function uninstall(client: Client, request: Request): Promise<any> 
{

	const papiClient = createPapiClient(client);
	await removeDimxRelations(client, papiClient);
	return {success:true,resultObject:{}}
}

export async function upgrade(client: Client, request: Request): Promise<any> 
{
	return {success:true,resultObject:{}}
}

export async function downgrade(client: Client, request: Request): Promise<any> 
{
	return {success:true,resultObject:{}}
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

async function createSurveySchema(papiClient: PapiClient, client: Client)
{
	const schema: AddonDataScheme = {
		Name: SCHEMA_NAME,
		Type: 'data',
		AddonUUID: client.AddonUUID,
		"SyncData": { 
			"Sync": true,
		},
		Fields:
        {
        	Status: 
            {
            	Type: 'String'
            },
        	ExternalID: 
            {
            	Type: 'String'
            },
        	Template:
            {
            	Type: 'String'
            },
        	Answers:
            {
            	Type:'Array',
            	Items:{
            		Type:'Object',
            		Fields:{
            			Key:
                        {
                        	Type: 'String'
                        },
            			Value:
                        {
                        	Type: 'Object'
                        }
            		}
            	}
            },
        	Creator:
            {
            	Type: 'String'
            },
        	Account:
            {
            	Type: 'String'
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
			Name: SCHEMA_NAME,
			Type: 'AddonAPI',
			Source: 'adal',
			Hidden: isHidden
		};

		const exportRelation: Relation = {
			RelationName: "DataExportResource",
			AddonUUID: client.AddonUUID,
			AddonRelativeURL: '',
			Name: SCHEMA_NAME,
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
