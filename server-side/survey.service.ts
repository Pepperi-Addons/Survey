import { FindOptions } from '@pepperi-addons/papi-sdk'
import { Client, Request } from '@pepperi-addons/debug-server';
import { Survey } from './types';
import PapiService from './papi.service';

class SurveyService 
{
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
	async getSurveyByKey(key?: string): Promise<Survey>
	{
		const getKey = key ?? this.request.query.key;
		this.validateGetSurveysByKeyRequest(getKey);

		let survey: Survey = {};
		try
		{
			survey = await this.papiService.getSurveyByKey(getKey);
		}
		catch(papiError)
		{
			if(papiError instanceof Error)
			{
				console.log(papiError);
				const error :any = new Error(`Could not find a survey with requested key '${getKey}'`);
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
             
	async postSurvey()
	{
		await this.validatePostMandatoryFields();
		return await this.papiService.postSurvey(this.request.body);
	}

	/**
     * throws an error if mandatory fields are missing from the request body
     */
	async validatePostMandatoryFields()
	{
		if(!this.request.body.Key)
		{
			const errorMessage = `The request body must contain a Key parameter.`;
			console.error(errorMessage);
			throw new Error(errorMessage);
		}

		if(!this.request.body.Creator)
		{
			// Creator field is mandatory on creation. Ensure a survey exists, else throw an error.
			try
			{
				await this.getSurveyByKey(this.request.body.Key);
			}
			catch(error)
			{
				// Survey not found and creator field is mandatory. Throw an error.
				const errorMessage = `The survey with key '${this.request.body.Key}' does not exist. The creator field is mandatory on creation.`;
				console.error(errorMessage);
				throw new Error(errorMessage);
			}
		}
	}
}

export default SurveyService;
