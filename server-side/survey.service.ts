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
            ...(this.request.query.fields && {fields: this.request.query.fields.split(',')}),
            ...(this.request.query.where && {where: this.request.query.where}),
            ...(this.request.query.order_by && {order_by: this.request.query.order_by}),
            ...(this.request.query.page && {page: this.request.query.page}),
            ...(this.request.query.page_size && {page_size: this.request.query.page_size}),
            ...(this.request.query.include_deleted && {include_deleted: this.request.query.include_deleted}),
        };
    }

    postSurvey()
    {
        return this.papiService.postSurvey(this.request.body);
    }
}

export default SurveyService;