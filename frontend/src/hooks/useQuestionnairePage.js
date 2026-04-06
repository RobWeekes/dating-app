import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  getMyQuestionnaireResponse,
  getQuestionnaireTemplateByType,
  submitQuestionnaire,
} from '../services/api';

const sortQuestions = (questions = []) => {
  return [...questions].sort((a, b) => a.order - b.order);
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

const useQuestionnairePage = (type) => {
  const [questions, setQuestions] = useState([]);
  const [questionnaireId, setQuestionnaireId] = useState(null);
  const [initialValues, setInitialValues] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (!type) {
      setError('Questionnaire type is required');
      setLoading(false);
      return;
    }

    let isCurrent = true;

    const loadQuestionnaire = async () => {
      try {
        setLoading(true);
        setError(null);
        setSubmitted(false);

        const template = await getQuestionnaireTemplateByType(type);
        if (!isCurrent) {
          return;
        }

        const sortedQuestions = sortQuestions(template.Questions || []);
        setQuestions(sortedQuestions);
        setQuestionnaireId(template.id);

        try {
          const response = await getMyQuestionnaireResponse(template.id);
          if (!isCurrent) {
            return;
          }
          setInitialValues(mapAnswersToInitialValues(response.Answers || []));
        } catch (responseError) {
          if (!isCurrent) {
            return;
          }

          const noResponseMessage = 'No response found';
          if (responseError?.message === noResponseMessage) {
            setInitialValues({});
          } else {
            throw responseError;
          }
        }
      } catch (err) {
        if (!isCurrent) {
          return;
        }

        setError(err.message || 'Failed to load questionnaire');
      } finally {
        if (isCurrent) {
          setLoading(false);
        }
      }
    };

    loadQuestionnaire();

    return () => {
      isCurrent = false;
    };
  }, [type]);

  const submitAnswers = useCallback(async (values) => {
    try {
      setError(null);
      await submitQuestionnaire({ type, responses: values });
      setSubmitted(true);
      return { success: true };
    } catch (err) {
      setError(err.message || 'Failed to submit questionnaire');
      return { success: false };
    }
  }, [type]);

  return {
    error,
    initialValues,
    loading,
    questionnaireId,
    questions,
    submitAnswers,
    submitted,
    sectioned: useMemo(() => type === 'MVP', [type]),
  };
};

export default useQuestionnairePage;
