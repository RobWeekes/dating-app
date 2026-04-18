import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  getMyQuestionnaireResponse,
  getMyQuestionnaireResponses,
  getQuestionnaires,
  getQuestionnaireTemplateByType,
  submitQuestionnaire,
} from '../services/api';

// ⚠️ DEPRECATED: Don't modify this! Question counts are now computed from API.
// See backend:api:/questionnaires/metadata/:type
// If you need to change question counts, update backend/data/questionnaire-templates.js
const QUESTION_COUNTS = {
  essential: 27,
  essential2: 31,
  lifestyle: 21,
  MVP: 50,
  communication: 18,
  lifestage: 16,
  cultural: 19,
  romance: 17,
  future: 18,
};

// Fetch question count from API metadata endpoint
const getQuestionCountFromAPI = async (type) => {
  try {
    const response = await fetch(`/api/questionnaires/metadata/${type}`);
    if (response.ok) {
      const data = await response.json();
      return data.totalQuestions;
    }
  } catch (err) {
    console.warn(`Could not fetch metadata for ${type}, falling back to hardcoded count`);
  }
  // Fallback to hardcoded count if API fails
  return QUESTION_COUNTS[type] || null;
};

const parseAnswerValue = (rawValue) => {
  try {
    return JSON.parse(rawValue);
  } catch {
    const numericValue = parseInt(rawValue, 10);
    return Number.isNaN(numericValue) ? rawValue : numericValue;
  }
};

const mapAnswersToInitialValues = (answers = []) => {
  return answers.reduce((accumulator, answer) => {
    accumulator[answer.questionId] = parseAnswerValue(answer.value);
    return accumulator;
  }, {});
};

const sortQuestions = (questions = []) => {
  return [...questions].sort((a, b) => a.order - b.order);
};

const useQuestionnaires = () => {
  const [questionnaires, setQuestionnaires] = useState([]);
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedType, setSelectedType] = useState(null);
  const [selectedQuestionnaireId, setSelectedQuestionnaireId] = useState(null);
  const [formQuestions, setFormQuestions] = useState([]);
  const [formInitialValues, setFormInitialValues] = useState({});
  const [formLoading, setFormLoading] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const fetchSummary = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const [questionnaireData, responseData] = await Promise.all([
        getQuestionnaires(),
        getMyQuestionnaireResponses(),
      ]);

      setQuestionnaires(questionnaireData || []);
      setResponses(responseData || []);
    } catch (err) {
      setError(err.message || 'Failed to load questionnaires');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSummary();
  }, [fetchSummary]);

  const responseByQuestionnaireId = useMemo(() => {
    return responses.reduce((accumulator, response) => {
      accumulator[response.questionnaireId] = response;
      return accumulator;
    }, {});
  }, [responses]);

  const completedCount = useMemo(() => {
    return questionnaires.filter((questionnaire) => {
      const response = responseByQuestionnaireId[questionnaire.id];
      return response && response.status === 'completed';
    }).length;
  }, [questionnaires, responseByQuestionnaireId]);

  const openQuestionnaire = useCallback(async (questionnaire) => {
    try {
      setFormLoading(true);
      setSubmitError(null);
      setSelectedType(questionnaire.type);
      setSelectedQuestionnaireId(questionnaire.id);

      const template = await getQuestionnaireTemplateByType(questionnaire.type);
      setFormQuestions(sortQuestions(template.Questions || []));

      try {
        const existingResponse = await getMyQuestionnaireResponse(questionnaire.id);
        setFormInitialValues(mapAnswersToInitialValues(existingResponse.Answers || []));
      } catch (responseError) {
        const noResponseMessage = 'No response found';
        if (responseError?.message === noResponseMessage) {
          setFormInitialValues({});
        } else {
          throw responseError;
        }
      }
    } catch (err) {
      setSubmitError(err.message || 'Failed to load questionnaire');
      setSelectedType(null);
      setSelectedQuestionnaireId(null);
    } finally {
      setFormLoading(false);
    }
  }, []);

  const submitSelectedQuestionnaire = useCallback(async (values) => {
    if (!selectedType) {
      setSubmitError('Please select a questionnaire first');
      return { success: false };
    }

    try {
      setSubmitError(null);
      await submitQuestionnaire({ type: selectedType, responses: values });
      setSelectedType(null);
      setSelectedQuestionnaireId(null);
      await fetchSummary();
      return { success: true };
    } catch (err) {
      setSubmitError(err.message || 'Failed to submit questionnaire');
      return { success: false };
    }
  }, [fetchSummary, selectedType]);

  const closeQuestionnaire = useCallback(() => {
    setSelectedType(null);
    setSelectedQuestionnaireId(null);
    setSubmitError(null);
  }, []);

  return {
    completedCount,
    error,
    formInitialValues,
    formLoading,
    formQuestions,
    loading,
    openQuestionnaire,
    questionCounts: QUESTION_COUNTS,
    questionnaires,
    responseByQuestionnaireId,
    selectedQuestionnaireId,
    selectedType,
    submitError,
    submitSelectedQuestionnaire,
    closeQuestionnaire,
    refetchSummary: fetchSummary,
  };
};

export default useQuestionnaires;
