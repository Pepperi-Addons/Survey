export const SurveysConstants = 
{
	schemaNames: {
		BASE_ACTIVITIES: "base_activities",
		BASE_SURVEYS: "surveys",
		BASE_SURVEY_TEMPLATES: "survey_templates",
		SURVEY_ANSWERS: "surveyAnswers",
		SURVEY_TEMPLATE_SECTIONS: "surveyTemplateSections",
		SURVEY_TEMPLATE_QUESTIONS: "surveyTemplateQuestions"

	},
	dependentAddonsUUIDs: {
		BASE_ACTIVITIES: "92b9bd68-1660-4998-91bc-3b745b4bab11"
	},
	UNIQUE_FIELDS: ["Key"],
	DATA_SOURCE_INDEX_NAME: "baseActivities",
	UDC_INDEX_NAME: "122c0e9d-c240-4865-b446-f37ece866c22_data",
	MandatoryFields : ["Creator", "Template", "Account"]
}

export const SurveyTemplatesConstants = 
{
	UNIQUE_FIELDS: ["Key"],
	MandatoryFields : []

}
