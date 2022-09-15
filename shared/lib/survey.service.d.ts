import { Request } from '@pepperi-addons/debug-server';
import { Survey } from './types';
import IApiService from './iApiService';
export declare class SurveyService {
    private request;
    private iApiService;
    constructor(request: Request, iApiService: IApiService);
    /**
     * Get surveys
     * @returns An array of surveys
     */
    getSurveys(): Promise<Array<Survey>>;
    /**
     * Build a FindOptions object from the request query
     * @returns FindOptions object from request query
     */
    private buildFindOptionsFromRequestQuery;
    /**
     *
     * @returns A survey by key
     */
    getSurveyByKey(key?: string): Promise<Survey>;
    /**
     * Validate the request query for getSurveysByKey
     */
    validateGetSurveysByKeyRequest(key: string): void;
    /**
     *
     * @returns A survey by unique field
     */
    getSurveyByUniqueField(): Promise<Survey>;
    /**
     * Throws an exception in case the number of results is not 1.
     * @param res the list of results to validate
     */
    private validateGetByUniqueFieldResult;
    /**
     * Validate the request query for getSurveyByUniqueField
     */
    validateGetSurveyByUniqueFieldRequest(): void;
    postSurvey(): Promise<Survey>;
    /**
     * throws an error if mandatory fields are missing from the request body
     */
    validatePostMandatoryFields(): Promise<void>;
}
export default SurveyService;
