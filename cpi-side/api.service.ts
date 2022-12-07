import { AddonsDataSearchParams } from "@pepperi-addons/cpi-node/build/cpi-side/client-api";
import { AddonData, FindOptions } from "@pepperi-addons/papi-sdk";
import { IApiService, Survey } from "surveys-shared";
import config from '../addon.config.json'

export class ApiService<T extends AddonData> implements IApiService<T>
{
    constructor(protected resourceName: string){}

    async searchResources(body: any): Promise<{Objects: T[], Count?: number}>
    {
        return await (pepperi.addons.data.uuid(config.AddonUUID).table(this.resourceName).search(body) as Promise<{Objects: T[], Count?: number}>);
    }
    async getResources(findOptions: FindOptions): Promise<Array<T>>
    {
        // No need to support this on cpi-side. Cpi-side uses Search only.
        throw new Error("Method not implemented.");
    }

    async getResourceByKey(key: string): Promise<T>
    {
        return await pepperi.addons.data.uuid(config.AddonUUID).table(this.resourceName).key(key).get();
    }

    async getResourceByUniqueField(unique_field: string, value: any): Promise<T[]>
    {
        const dataSearchParams: AddonsDataSearchParams = 
        {
        	Where: `${unique_field} = '${value}'`,
        }

        return (await pepperi.addons.data.uuid(config.AddonUUID).table(this.resourceName).search(dataSearchParams)).Objects as T[];
    }

    async postResource(body: Survey): Promise<T> 
    {
        return await pepperi.addons.data.uuid(config.AddonUUID).table(this.resourceName).upsert(body);
    }
}
