
/*
The return object format MUST contain the field 'success':
{success:true}

If the result of your code is 'false' then return:
{success:false, erroeMessage:{the reason why it is false}}
The error Message is importent! it will be written in the audit log and help the user to understand what happen
*/

import { Client, Request } from '@pepperi-addons/debug-server'
import { AddonDataScheme, PapiClient } from '@pepperi-addons/papi-sdk'

export async function install(client: Client, request: Request): Promise<any> {
    
    const papiClient = createPapiClient(client);
    createSurveySchema(papiClient);
    return {success:true,resultObject:{}}
}

export async function uninstall(client: Client, request: Request): Promise<any> {

    const papiClient = createPapiClient(client);
    purgeSurveySchema(papiClient);
    return {success:true,resultObject:{}}
}

export async function upgrade(client: Client, request: Request): Promise<any> {
    return {success:true,resultObject:{}}
}

export async function downgrade(client: Client, request: Request): Promise<any> {
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

async function createSurveySchema(papiClient: PapiClient)
{
    const schema: AddonDataScheme = {
        Name: 'surveys',
        Type: 'data',
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
                Type:'Object',
                Fields:
                {
                    Key:
                    {
                        Type: 'String'
                    },
                    Value:
                    {
                        Type: 'Object'
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

async function purgeSurveySchema(papiClient: PapiClient)
{
    await papiClient.post('/addons/data/schemes/survey/purge');
}
