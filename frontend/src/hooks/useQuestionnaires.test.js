import { act, renderHook, waitFor } from '@testing-library/react';
import {
  getMyQuestionnaireResponse,
  getMyQuestionnaireResponses,
  getQuestionnaires,
  getQuestionnaireTemplateByType,
  submitQuestionnaire,
} from '../services/api';
import useQuestionnaires from './useQuestionnaires';
import useQuestionnairePage from './useQuestionnairePage';

jest.mock('../services/api', () => ({
  getQuestionnaires: jest.fn(),
  getMyQuestionnaireResponses: jest.fn(),
  getQuestionnaireTemplateByType: jest.fn(),
  getMyQuestionnaireResponse: jest.fn(),
  submitQuestionnaire: jest.fn(),
}));

describe('questionnaire hooks', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('loads summary and computes completion count', async () => {
    getQuestionnaires.mockResolvedValueOnce([
      { id: 1, type: 'essential', title: 'Essential' },
      { id: 2, type: 'MVP', title: 'MVP' },
    ]);
    getMyQuestionnaireResponses.mockResolvedValueOnce([
      { questionnaireId: 1, status: 'completed' },
      { questionnaireId: 2, status: 'in_progress' },
    ]);

    const { result } = renderHook(() => useQuestionnaires());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.completedCount).toBe(1);
    expect(result.current.responseByQuestionnaireId[1].status).toBe('completed');
  });

  it('opens questionnaire and parses existing answers into initial values', async () => {
    getQuestionnaires.mockResolvedValueOnce([{ id: 10, type: 'essential', title: 'Essential' }]);
    getMyQuestionnaireResponses.mockResolvedValueOnce([]);

    getQuestionnaireTemplateByType.mockResolvedValueOnce({
      id: 10,
      type: 'essential',
      Questions: [
        { id: 201, order: 2, text: 'Q2' },
        { id: 200, order: 1, text: 'Q1' },
      ],
    });

    getMyQuestionnaireResponse.mockResolvedValueOnce({
      Answers: [
        { questionId: 200, value: '3' },
        { questionId: 201, value: '["A","B"]' },
      ],
    });

    const { result } = renderHook(() => useQuestionnaires());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    await act(async () => {
      await result.current.openQuestionnaire({ id: 10, type: 'essential' });
    });

    expect(result.current.selectedType).toBe('essential');
    expect(result.current.formQuestions.map((question) => question.id)).toEqual([200, 201]);
    expect(result.current.formInitialValues[200]).toBe(3);
    expect(result.current.formInitialValues[201]).toEqual(['A', 'B']);
  });

  it('loads standalone questionnaire page and submits successfully', async () => {
    getQuestionnaireTemplateByType.mockResolvedValueOnce({
      id: 88,
      type: 'MVP',
      Questions: [
        { id: 301, order: 1, text: 'Q1' },
      ],
    });

    getMyQuestionnaireResponse.mockRejectedValueOnce(new Error('No response found'));
    submitQuestionnaire.mockResolvedValueOnce({ success: true });

    const { result } = renderHook(() => useQuestionnairePage('MVP'));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.questions).toHaveLength(1);
    expect(result.current.sectioned).toBe(true);

    let submitResult;
    await act(async () => {
      submitResult = await result.current.submitAnswers({ 301: 5 });
    });

    expect(submitResult.success).toBe(true);
    expect(submitQuestionnaire).toHaveBeenCalledWith({ type: 'MVP', responses: { 301: 5 } });
    expect(result.current.submitted).toBe(true);
  });
});
