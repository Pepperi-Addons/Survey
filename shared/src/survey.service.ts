import { FindOptions } from '@pepperi-addons/papi-sdk'
import { Request } from '@pepperi-addons/debug-server';
import { UNIQUE_FIELDS } from './constants';
import { Survey } from './types';
import IApiService from './iApiService';
import { v4 as uuid } from 'uuid';

export class SurveyService 
{
	constructor(private request: Request, private iApiService: IApiService)
	{

	}

	/**
     * Get surveys
     * @returns An array of surveys
     */
	getSurveys(): Promise<Array<Survey>>
	{
		const findOptions: FindOptions = this.buildFindOptionsFromRequestQuery();

		return this.iApiService.getSurveys(findOptions);
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
        const requestedKey = key ?? this.request.query.key;
        this.validateGetSurveysByKeyRequest(requestedKey);

        let survey: Survey = {};
        try
        {
            survey = await this.iApiService.getSurveyByKey(requestedKey);
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
            const res: Array<Survey> = await this.iApiService.getSurveyByUniqueField(this.request.query.unique_field, this.request.query.value);
            
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
             
	async postSurvey()
	{
		this.createKeyIfMissing()
        await this.validatePostMandatoryFields();
		return await this.iApiService.postSurvey(this.request.body);
	}

    createKeyIfMissing()
    {
        this.request.body.Key = this.request.body.Key ? this.request.body.Key : uuid();
    }

	/**
     * throws an error if mandatory fields are missing from the request body
     */
	async validatePostMandatoryFields()
	{
		if(!this.request.body.Creator || !this.request.body.Template || !this.request.body.Account)
		{
			// Creator, Template and Account fields are mandatory on creation. Ensure a survey exists, else throw an error.
			try
			{
				await this.getSurveyByKey(this.request.body.Key);
			}
			catch(error)
			{
				// Survey not found and Creator, Template and Account fields are mandatory. Throw an error.
				const errorMessage = `The survey with key '${this.request.body.Key}' does not exist. The Creator, Template and Account fields are mandatory on creation.`;
				console.error(errorMessage);
				throw new Error(errorMessage);
			}
		}
	}

    
    /**
     * Similar to getSurveys 
     * @returns An array of surveys that match the parametesr of the request body
     */
     search()
     {
         this.validateSearchRequest();
         return this.iApiService.searchSurveys(this.request.body);
     }
 
     validateSearchRequest() {
         if(this.request.body.UniqueFieldID && !UNIQUE_FIELDS.includes(this.request.body.UniqueFieldID))
         {
             const errorMessage = `The passed UniqueFieldID is not supported: '${this.request.body.UniqueFieldID}'. Supported UniqueFieldID values are: ${JSON.stringify(UNIQUE_FIELDS)}`;
             console.error(errorMessage);
             throw new Error(errorMessage);
         }
 
         if(this.request.body.KeyList && (this.request.body.UniqueFieldID || this.request.body.UniqueFieldList))
         {
             const errorMessage = `Sending both KeyList and UniqueFieldList is not supported.`;
             console.error(errorMessage);
             throw new Error(errorMessage);
         }
 
         if(this.request.body.UniqueFieldList && !this.request.body.UniqueFieldID)
         {
             const errorMessage = `Missing UniqueFieldID parameter.`;
             console.error(errorMessage);
             throw new Error(errorMessage);
         }
     }
}

export default SurveyService;
