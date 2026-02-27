import { useState, useEffect, useMemo } from 'react';
import Button from './Button';
import '../styles/questionnaire-form.css';

/**
 * QuestionnaireForm - Generic, reusable questionnaire renderer.
 * Renders any questionnaire from API question data.
 */
function QuestionnaireForm({ questions, initialValues, onSubmit, onCancel, sectioned }) {
  const [values, setValues] = useState({});
  const [errors, setErrors] = useState({});
  const [currentSection, setCurrentSection] = useState(0);

  // Group questions by section, preserving order
  const sections = useMemo(() => {
    const map = new Map();
    questions.forEach(q => {
      const key = q.section || 'General';
      if (!map.has(key)) {
        map.set(key, { title: key, description: q.sectionDescription || '', questions: [] });
      }
      map.get(key).questions.push(q);
    });
    return Array.from(map.values());
  }, [questions]);

  // Build a lookup from order -> questionId for conditional logic
  const orderToId = useMemo(() => {
    const map = {};
    questions.forEach(q => { map[q.order] = q.id; });
    return map;
  }, [questions]);

  // Initialize form state from initialValues or defaults
  useEffect(() => {
    const init = {};
    questions.forEach(q => {
      const type = q.type;
      if (initialValues && initialValues[q.id] !== undefined) {
        init[q.id] = initialValues[q.id];
      } else if (type === 'multi') {
        init[q.id] = [];
      } else if (type === 'slider') {
        init[q.id] = Math.floor((q.options.min + q.options.max) / 2);
      } else if (type === 'range') {
        init[q.id] = { min: '', max: '' };
      } else {
        init[q.id] = '';
      }
    });
    setValues(init);
  }, [questions, initialValues]);

  // Check whether a question is visible based on its conditional rule
  const isVisible = (question) => {
    if (!question.conditional) return true;
    const parentId = orderToId[question.conditional.questionOrder];
    if (parentId === undefined) return true;
    const parentVal = values[parentId];
    return question.conditional.values.includes(parentVal);
  };

  // Clear hidden question answers when parent value changes
  useEffect(() => {
    setValues(prev => {
      let changed = false;
      const next = { ...prev };
      questions.forEach(q => {
        if (q.conditional && !isVisible(q)) {
          const type = q.type;
          const blank = type === 'multi' ? [] : type === 'range' ? { min: '', max: '' } : '';
          if (JSON.stringify(next[q.id]) !== JSON.stringify(blank)) {
            next[q.id] = blank;
            changed = true;
          }
        }
      });
      return changed ? next : prev;
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values, questions]);

  const handleChange = (questionId, value) => {
    setValues(prev => ({ ...prev, [questionId]: value }));
    if (errors[questionId]) {
      setErrors(prev => {
        const updated = { ...prev };
        delete updated[questionId];
        return updated;
      });
    }
  };

  const handleCheckboxChange = (questionId, opt) => {
    setValues(prev => {
      const current = prev[questionId] || [];
      const next = current.includes(opt)
        ? current.filter(v => v !== opt)
        : [...current, opt];
      return { ...prev, [questionId]: next };
    });
    if (errors[questionId]) {
      setErrors(prev => {
        const updated = { ...prev };
        delete updated[questionId];
        return updated;
      });
    }
  };

  // Validate a set of questions; returns error map
  const validateQuestions = (questionsList) => {
    const newErrors = {};
    questionsList.forEach(q => {
      if (!q.required || !isVisible(q)) return;
      const type = q.type;
      const val = values[q.id];

      if (type === 'multi') {
        if (!Array.isArray(val) || val.length === 0) newErrors[q.id] = 'Required';
      } else if (type === 'range') {
        if (!val || val.min === '' || val.max === '') {
          newErrors[q.id] = 'Both min and max are required';
        } else if (val.min < q.options.min) {
          newErrors[q.id] = `Min must be at least ${q.options.min}`;
        } else if (val.max < val.min) {
          newErrors[q.id] = 'Max must be greater than or equal to min';
        }
      } else if (val === '' || val === null || val === undefined) {
        newErrors[q.id] = 'Required';
      }
    });
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validateQuestions(questions);
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    onSubmit(values);
  };

  const handleNext = () => {
    const sectionQs = sections[currentSection].questions;
    const errs = validateQuestions(sectionQs);
    setErrors(prev => ({ ...prev, ...errs }));
    if (Object.keys(errs).length > 0) return;
    setCurrentSection(prev => prev + 1);
  };

  const handlePrev = () => {
    setCurrentSection(prev => prev - 1);
  };

  // Progress calculation
  const answeredCount = questions.filter(q => {
    if (!isVisible(q)) return true;
    const type = q.type;
    const val = values[q.id];
    if (type === 'multi') return Array.isArray(val) && val.length > 0;
    if (type === 'range') return val && val.min !== '' && val.max !== '';
    return val !== '' && val !== null && val !== undefined;
  }).length;
  const progressPct = questions.length > 0 ? Math.round((answeredCount / questions.length) * 100) : 0;

  // Render a single question
  const renderQuestion = (question) => {
    const type = question.type;
    const opts = question.options;

    switch (type) {
      case 'single':
        return (
          <div className="radio-group">
            {opts.map(opt => (
              <label key={opt} className="radio-option">
                <input type="radio" name={`q-${question.id}`} value={opt}
                  checked={values[question.id] === opt}
                  onChange={() => handleChange(question.id, opt)} />
                <span>{opt}</span>
              </label>
            ))}
          </div>
        );

      case 'likert':
        return (
          <div className="radio-group likert-group">
            {opts.map((label, idx) => (
              <label key={idx} className="radio-option">
                <input type="radio" name={`q-${question.id}`} value={idx + 1}
                  checked={values[question.id] === idx + 1}
                  onChange={() => handleChange(question.id, idx + 1)} />
                <span>{label}</span>
              </label>
            ))}
          </div>
        );

      case 'slider':
        return (
          <div className="slider-container">
            <input type="range" className="slider"
              min={opts.min} max={opts.max}
              value={values[question.id] ?? Math.floor((opts.min + opts.max) / 2)}
              onChange={(e) => handleChange(question.id, parseInt(e.target.value))} />
            <div className="slider-labels">
              <span>{opts.labels[0]}</span>
              <span>{opts.labels[1]}</span>
              <span>{opts.labels[2]}</span>
            </div>
          </div>
        );

      case 'range':
        return (
          <div className="range-inputs">
            <div className="range-field">
              <label>Min:</label>
              <input type="number" className="form-input"
                min={opts.min} max={opts.max}
                value={values[question.id]?.min ?? ''}
                onChange={(e) => handleChange(question.id, { ...values[question.id], min: parseInt(e.target.value) || '' })} />
            </div>
            <div className="range-field">
              <label>Max:</label>
              <input type="number" className="form-input"
                min={opts.min} max={opts.max}
                value={values[question.id]?.max ?? ''}
                onChange={(e) => handleChange(question.id, { ...values[question.id], max: parseInt(e.target.value) || '' })} />
            </div>
          </div>
        );

      case 'multi':
        return (
          <div className="checkbox-group">
            {opts.map(opt => (
              <label key={opt} className="checkbox-option">
                <input type="checkbox"
                  checked={(values[question.id] || []).includes(opt)}
                  onChange={() => handleCheckboxChange(question.id, opt)} />
                <span>{opt}</span>
              </label>
            ))}
          </div>
        );

      case 'text':
        return (
          <textarea className="form-input"
            value={values[question.id] || ''}
            onChange={(e) => handleChange(question.id, e.target.value)}
            rows={3} />
        );

      default:
        return <p>Unsupported question type: {type}</p>;
    }
  };

  const renderSectionContent = (section) => (
    <div key={section.title}>
      <div className="section-header">
        {sectioned ? <h2>{section.title}</h2> : <h3>{section.title}</h3>}
        {section.description && <p>{section.description}</p>}
      </div>
      <div className="questions-container">
        {section.questions.map(q => {
          if (!isVisible(q)) return null;
          return (
            <div key={q.id} className="question-block">
              <label className="question-label">
                {q.text}
                {q.critical && <span className="critical-badge">Important</span>}
              </label>
              {renderQuestion(q)}
              {errors[q.id] && <span className="error-text">{errors[q.id]}</span>}
            </div>
          );
        })}
      </div>
    </div>
  );

  // Sectioned mode: one section at a time with navigation
  if (sectioned) {
    const isLast = currentSection === sections.length - 1;
    const isFirst = currentSection === 0;

    return (
      <div className="questionnaire-form">
        <div className="progress-bar-container">
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progressPct}%` }} />
          </div>
          <span className="progress-text">{answeredCount} / {questions.length} answered</span>
        </div>

        <form onSubmit={handleSubmit}>
          {renderSectionContent(sections[currentSection])}

          <div className="form-actions">
            {!isFirst && (
              <Button className="btn-secondary" onClick={handlePrev}>
                Previous
              </Button>
            )}
            {!isLast ? (
              <Button className="btn-primary" onClick={handleNext}>
                Next
              </Button>
            ) : (
              <Button className="btn-primary" type="submit">
                Submit
              </Button>
            )}
          </div>
        </form>
      </div>
    );
  }

  // Non-sectioned mode: all sections at once
  return (
    <div className="questionnaire-form">
      <form onSubmit={handleSubmit}>
        {sections.map(section => renderSectionContent(section))}

        <div className="form-actions">
          {onCancel && (
            <Button className="btn-secondary" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button className="btn-primary" type="submit">
            Submit
          </Button>
        </div>
      </form>
    </div>
  );
}

export default QuestionnaireForm;
