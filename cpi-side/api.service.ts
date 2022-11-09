import { ADALGetParams, ADALUpsertParams } from "@pepperi-addons/client-api";
import { AddonData, FindOptions } from "@pepperi-addons/papi-sdk";
import { IApiService, Survey } from "surveys-shared";
import config from '../addon.config.json'

export class ApiService<T extends AddonData> implements IApiService<T>
{
    constructor(protected resourceName: string){}

    searchResources(body: any): Promise<T[]>
    {
        throw new Error("Method not implemented.");
    }
    async getResources(findOptions: FindOptions): Promise<Array<T>>
    {
        throw new Error("Method not implemented.");
    }

    async getResourceByKey(key: string): Promise<T>
    {
        const adalGetParams: ADALGetParams = {
            addon: config.AddonUUID,
            table: this.resourceName,
            key: key
        };
        return await (pepperi.api.adal.get(adalGetParams) as unknown as Promise<T>);
    }

    async getResourceByUniqueField(unique_field: string, value: any): Promise<T[]>
    {
        throw new Error("Method not implemented.");
    }

    async postResource(body: Survey): Promise<T> 
    {
        if(typeof body.Key === 'string')
        {
            const adalPostParams: ADALUpsertParams = {
                addon: config.AddonUUID,
                table: this.resourceName,
                object: body as any, // Survey.Key is string|undefined, but for all the validations I did, TS just didn't believe me,
                                     // and didn't want to accept the fact the it does in fact have a valid Key. So I used 'as any'...
                indexedField: 'Key'
            };

            return await (pepperi.api.adal['upsert'](adalPostParams) as unknown as Promise<T>);
        }
        else
        {
            const errorMessage = 'CPI - postSurvey - passed object for upsert is missing a Key parameter.'
            console.error(errorMessage);

            throw new Error(errorMessage);
        }
    }
}
