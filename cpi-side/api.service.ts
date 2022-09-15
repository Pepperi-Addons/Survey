import { ADALGetParams, ADALUpsertParams } from "@pepperi-addons/client-api";
import { FindOptions } from "@pepperi-addons/papi-sdk";
import { IApiService, SCHEMA_NAME, Survey } from "surveys-shared";
import config from '../addon.config.json'

class ApiService implements IApiService
{
    async getSurveys(findOptions: FindOptions): Promise<Array<Survey>>
    {
        throw new Error("Method not implemented.");
    }

    async getSurveyByKey(key: string): Promise<Survey>
    {
        const adalGetParams: ADALGetParams = {
            addon: config.AddonUUID,
            table: SCHEMA_NAME,
            key: key
        };
        return await pepperi.api.adal.get(adalGetParams);
    }

    async getSurveyByUniqueField(unique_field: string, value: any): Promise<Survey[]>
    {
        throw new Error("Method not implemented.");
    }

    async postSurvey(body: Survey): Promise<Survey> 
    {
        if(typeof body.Key === 'string')
        {
            const adalPostParams: ADALUpsertParams = {
                addon: config.AddonUUID,
                table: SCHEMA_NAME,
                object: body as any, // Survey.Key is string|undefined, but for all the validations I did, TS just didn't believe me,
                                     // and didn't want to accept the fact the it does in fact have a valid Key. So I used 'as any'...
                indexedField: 'Key'
            };

            return await pepperi.api.adal['upsert'](adalPostParams);
        }
        else
        {
            const errorMessage = 'CPI - postSurvey - passed object for upsert is missing a Key parameter.'
            console.error(errorMessage);

            throw new Error(errorMessage);
        }
    }
}
