import { FindOptions } from '@pepperi-addons/papi-sdk';
import { Survey } from './types';
export interface IApiService {
    getSurveys(findOptions: FindOptions): Promise<Array<Survey>>;
    getSurveyByKey(key: string): Promise<Survey>;
    /**
     * Returns an *array* of surveys. It is up to the user to validate the response length.
     * @param unique_field The unique field to use for the search
     * @param value The value to search for
     * @returns An *array* of surveys that match the search
     */
    getSurveyByUniqueField(unique_field: string, value: any): Promise<Array<Survey>>;
    postSurvey(body: Survey): Promise<Survey>;
}
export default IApiService;
