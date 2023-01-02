import { Request } from '@pepperi-addons/debug-server'
import { IApiService, Survey, SurveysConstants, GenericResourceService, BaseSurveysServiceBuilder, BaseSurveyTemplatesServiceBuilder } from 'surveys-shared';
import { ApiService } from './api.service';
import '@pepperi-addons/cpi-node';

export const router = Router();

export async function load(configuration: any) {
}

//#region surveys
router.get('/surveys', async (req, res) => {
    const surveyService = getBaseSurveysService(req);
    const surveys = await surveyService.getResources();

    res.json(surveys);
});

router.post('/surveys', async (req, res) => {
    const surveyService = getBaseSurveysService(req);
    const survey = await surveyService.postResource();

    res.json(survey);
});

router.get('/surveys/key/:key', async (req, res) => {
    // SurveyService works with a request's query, not params.
    req.query.key = req.params.key;
    const surveyService = getBaseSurveysService(req);
    const survey = await surveyService.getResourceByKey();

    res.json(survey);
});

router.get('/surveys/unique/:fieldID/:fieldValue', async (req, res) => {
    // SurveyService works with a request's query, not params.
    req.query.unique_field = req.params.fieldID;
    req.query.value = req.params.fieldValue;

    const surveyService = getBaseSurveysService(req);
    const surveys = await surveyService.getResourceByUniqueField();

    res.json(surveys);
});

router.post('/surveys/search', async (req, res) => {
    const surveyService = getBaseSurveysService(req);
    const surveys = await surveyService.search();

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

//#region survey_templates
router.get('/survey_templates', async (req, res) => {
    const surveyService = getBaseSurveyTemplatesService(req);
    const surveys = await surveyService.getResources();

    res.json(surveys);
});

router.post('/survey_templates', async (req, res) => {
    const surveyService = getBaseSurveyTemplatesService(req);
    const survey = await surveyService.postResource();

    res.json(survey);
});

router.get('/survey_templates/key/:key', async (req, res) => {
    // SurveyTemplatesService works with a request's query, not params.
    req.query.key = req.params.key;
    const surveyService = getBaseSurveyTemplatesService(req);
    const survey = await surveyService.getResourceByKey();

    res.json(survey);
});

router.get('/survey_templates/unique/:fieldID/:fieldValue', async (req, res) => {
    // SurveyService works with a request's query, not params.
    req.query.unique_field = req.params.fieldID;
    req.query.value = req.params.fieldValue;

    const surveyService = getBaseSurveyTemplatesService(req);
    const surveys = await surveyService.getResourceByUniqueField();

    res.json(surveys);
});

router.post('/survey_templates/search', async (req, res) => {
    const surveyService = getBaseSurveysService(req);
    const surveys = await surveyService.search();

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
