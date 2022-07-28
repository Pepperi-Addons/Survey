import { FindOptions } from '@pepperi-addons/papi-sdk'
import { Client, Request } from '@pepperi-addons/debug-server';
import { SCHEMA_NAME, UNIQUE_FIELDS } from './constants';
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

    /**
     * 
     * @returns A survey by key
     */
    async getSurveyByKey(key?: string)
    {
        const requestedKey = key || this.request.query.key;
        this.validateGetSurveysByKeyRequest(requestedKey);

        let survey: Survey = {};
        try
        {
            survey = await this.papiService.getSurveyByKey(requestedKey);
        }
        catch(papiError)
        {
            if(papiError instanceof Error)
            {
                console.log(papiError);
                const error :any = new Error(`Could not find a survey with requested key '${requestedKey}'`);
                error.code = 404;

                throw error;
            }
        }
        return survey;
    }

    /**
     * Validate the request query for getSurveysByKey
     */
    validateGetSurveysByKeyRequest(key: string)
    {
        if(!key)
        {
            const errorMessage = `The request query must contain a key parameter.`;
            console.error(errorMessage);
            throw new Error(errorMessage);
        }
    }

    /**
     * 
     * @returns A survey by unique field
     */
    async getSurveyByUniqueField(): Promise<Survey>
    {
        this.validateGetSurveyByUniqueFieldRequest();

        if(this.request.query.unique_field === 'Key')
        {
            return this.getSurveyByKey(this.request.query.value);
        }
        else
        {
            const res: Array<Survey> = await this.papiService.getSurveyByUniqueField(this.request.query.unique_field, this.request.query.value);
            
            this.validateGetByUniqueFieldResult(res);

            return res[0];
        }
    }

    /**
     * Throws an exception in case the number of results is not 1.
     * @param res the list of results to validate
     */
    private validateGetByUniqueFieldResult(res: Survey[])
    {
        if (res.length === 0) {
            const errorMessage = `Could not find a survey with unique_field: '${this.request.query.unique_field}' and value '${this.request.query.value}'`;
            console.error(errorMessage);
            const error: any = new Error(errorMessage);
            error.code = 404;
            throw error;
        }

        if (res.length > 1) {
            // Something super strange happened...
            const errorMessage = `Found more than one survey with unique_field: '${this.request.query.unique_field}' and value '${this.request.query.value}'`;
            console.error(errorMessage);
            const error: any = new Error(errorMessage);
            error.code = 404;
            throw error;
        }
    }

    /**
     * Validate the request query for getSurveyByUniqueField 
     */
    validateGetSurveyByUniqueFieldRequest()
    {
        if(!this.request.query.unique_field)
        {
            const errorMessage = `The request query must contain a unique_field parameter.`;
            console.error(errorMessage);
            throw new Error(errorMessage);
        }

        if(!this.request.query.value)
        {
            const errorMessage = `The request query must contain a value parameter.`;
            console.error(errorMessage);
            throw new Error(errorMessage);
        }

        if(!UNIQUE_FIELDS.includes(this.request.query.unique_field))
        {
            const errorMessage = `The unique_field parameter must be one of the following: '${UNIQUE_FIELDS.join(', ')}'.`;
            console.error(errorMessage);
            throw new Error(errorMessage);
        }
    }

    postSurvey()
    {
        return this.papiService.postSurvey(this.request.body);
    }
}

export default SurveyService;