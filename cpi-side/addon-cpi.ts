import { Request } from '@pepperi-addons/debug-server'
import { IApiService, Survey, SurveysConstants, GenericResourceService, BaseSurveysServiceBuilder, BaseSurveyTemplatesServiceBuilder } from 'surveys-shared';
import { ApiService } from './api.service';
import '@pepperi-addons/cpi-node';

export const router = Router();

export async function load(configuration: any) {
}

//#region baseSurveys
router.get('/baseSurveys', async (req, res) => {
    const surveyService = getBaseSurveysService(req);
    const surveys = await surveyService.getResources();

    res.json(surveys);
});

router.post('/baseSurveys', async (req, res) => {
    const surveyService = getBaseSurveysService(req);
    const survey = await surveyService.postResource();

    res.json(survey);
});

router.get('/get_baseSurveys_by_key', async (req, res) => {
    const surveyService = getBaseSurveysService(req);
    const survey = await surveyService.getResourceByKey();

    res.json(survey);
});

router.get('/get_baseSurveys_by_unique_field', async (req, res) => {
    const surveyService = getBaseSurveysService(req);
    const surveys = await surveyService.getResourceByUniqueField();

    res.json(surveys);
});

function getBaseSurveysService(request: Request)
{
    const papiService: IApiService<Survey> = new ApiService<Survey>(SurveysConstants.schemaNames.BASE_SURVEYS);
    const baseSurveysServiceBuilder = new BaseSurveysServiceBuilder(request, papiService);
    const baseSurveyService = new GenericResourceService(baseSurveysServiceBuilder);
    return baseSurveyService;
}

//#endregion

//#region baseSurveyTemplates
router.get('/baseSurveyTemplates', async (req, res) => {
    const surveyService = getBaseSurveyTemplatesService(req);
    const surveys = await surveyService.getResources();

    res.json(surveys);
});

router.post('/baseSurveyTemplates', async (req, res) => {
    const surveyService = getBaseSurveyTemplatesService(req);
    const survey = await surveyService.postResource();

    res.json(survey);
});

router.get('/get_baseSurveyTemplates_by_key', async (req, res) => {
    const surveyService = getBaseSurveyTemplatesService(req);
    const survey = await surveyService.getResourceByKey();

    res.json(survey);
});

router.get('/get_baseSurveyTemplates_by_unique_field', async (req, res) => {
    const surveyService = getBaseSurveyTemplatesService(req);
    const surveys = await surveyService.getResourceByUniqueField();

    res.json(surveys);
});

function getBaseSurveyTemplatesService(request: Request)
{
    const papiService: IApiService<Survey> = new ApiService<Survey>(SurveysConstants.schemaNames.BASE_SURVEY_TEMPLATES);
    const baseSurveyTemplatesServiceBuilder = new BaseSurveyTemplatesServiceBuilder(request, papiService);
    const baseSurveyService = new GenericResourceService(baseSurveyTemplatesServiceBuilder);
    return baseSurveyService;
}
//#endregion
