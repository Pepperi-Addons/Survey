import { Request } from '@pepperi-addons/debug-server'
import { IApiService, SurveyService } from 'surveys-shared';
import { ApiService } from './api.service';
import '@pepperi-addons/cpi-node';

export const router = Router();

export async function load(configuration: any) {
}

router.get('/surveys', async (req, res) => {
    const surveyService = getSurveyService(req);
    const surveys = await surveyService.getSurveys();

    res.json(surveys);
});

router.post('/surveys', async (req, res) => {
    const surveyService = getSurveyService(req);
    const survey = await surveyService.postSurvey();

    res.json(survey);
});

router.get('/get_surveys_by_key', async (req, res) => {
    const surveyService = getSurveyService(req);
    const survey = await surveyService.getSurveyByKey();

    res.json(survey);
});

router.get('/get_surveys_by_unique_field', async (req, res) => {
    const surveyService = getSurveyService(req);
    const surveys = await surveyService.getSurveyByUniqueField();

    res.json(surveys);
});

function getSurveyService(request: Request)
{
    const papiService: IApiService = new ApiService();
    const surveyService = new SurveyService(request, papiService);
    return surveyService;
}
