import { FindOptions } from '@pepperi-addons/papi-sdk'
import { Client, Request } from '@pepperi-addons/debug-server';
import { SCHEMA_NAME } from './constants';
import { Survey } from './types';
import PapiService from './papi.service';

class SurveyService {

    constructor(private client: Client, private request: Request, private papiService: PapiService)
    {

    }

    /**
     * Get surveys from PAPI
     * @returns An array of surveys
     */
    getSurveys(): Promise<Array<Survey>>
    {
        const findOptions: FindOptions = this.buildFindOptionsFromRequestQuery();

        return this.papiService.getSurveys(findOptions);
    }

    /**
     * Build a FindOptions object from the request query
     * @returns FindOptions object from request query
     */
    private buildFindOptionsFromRequestQuery(): FindOptions
    {
        return {
            fields: this.request.query.fields ? this.request.query.fields.split(',') : undefined,
            where: this.request.query.where,
            order_by: this.request.query.order_by,
            page: this.request.query.page,
            page_size: this.request.query.page_size,
            include_deleted: this.request.query.include_deleted,
        };
    }
}

export default SurveyService;