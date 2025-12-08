import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../api/client';

interface Question {
  id: number;
  optionA: string;
  optionB: string;
  columnA: string;
  columnB: string;
}

interface Assessment {
  id: string;
  status: string;
  rhetiScores: Record<string, number> | null;
  topTypes: number[];
}

interface TopType {
  type: number;
  name: string;
  score: number;
}

export default function RhetiQuestionnaire() {
  const navigate = useNavigate();
  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [questionNumber, setQuestionNumber] = useState(1);
  const [totalQuestions] = useState(36);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [completed, setCompleted] = useState(false);
  const [answers, setAnswers] = useState<Record<number, 'A' | 'B'>>({});
  const [results, setResults] = useState<{
    rhetiScores: Record<string, number>;
    topTypesWithNames: TopType[];
  } | null>(null);

  // Start or resume assessment on mount
  useEffect(() => {
    startAssessment();
  }, []);

  const startAssessment = async () => {
    try {
      setIsLoading(true);
      const response = await api.innerDna.startAssessment();
      if (response.success) {
        setAssessment(response.data.assessment);
        setQuestionNumber(response.data.currentQuestion);
        setCurrentQuestion(response.data.question);
        
        // Check if already completed RHETI
        if (response.data.assessment.status !== 'STARTED') {
          setCompleted(true);
          setResults({
            rhetiScores: response.data.assessment.rhetiScores,
            topTypesWithNames: response.data.assessment.topTypes.map((t: number) => ({
              type: t,
              name: getTypeName(t),
              score: response.data.assessment.rhetiScores?.[`type${t}`] || 0,
            })),
          });
        }
      }
    } catch (err) {
      setError('Failed to start assessment');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const getTypeName = (type: number): string => {
    const names: Record<number, string> = {
      1: 'Reformer',
      2: 'Helper',
      3: 'Achiever',
      4: 'Individualist',
      5: 'Investigator',
      6: 'Sentinel',
      7: 'Enthusiast',
      8: 'Challenger',
      9: 'Peacemaker',
    };
    return names[type] || 'Unknown';
  };

  const handleSelectOption = async (option: 'A' | 'B') => {
    if (!assessment || isSubmitting) return;

    try {
      setIsSubmitting(true);
      const response = await api.innerDna.submitAnswer(
        assessment.id,
        questionNumber,
        option
      );

      if (response.success) {
        if (response.data.completed) {
          setCompleted(true);
          setResults({
            rhetiScores: response.data.rhetiScores,
            topTypesWithNames: response.data.topTypesWithNames,
          });
        } else {
          setQuestionNumber(response.data.nextQuestion);
          setCurrentQuestion(response.data.question);
        }
      }
    } catch (err) {
      setError('Failed to submit answer');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoBack = () => {
    if (questionNumber > 1) {
      const prevQuestion = questionNumber - 1;
      setQuestionNumber(prevQuestion);
      const q = {
        id: prevQuestion,
        optionA: "",
        optionB: "",
        columnA: "",
        columnB: ""
      };
      fetch(`http://localhost:3001/api/v1/inner-dna/rheti/question/${prevQuestion}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      })
        .then(r => r.json())
        .then(data => {
          if (data.success) setCurrentQuestion(data.data.question);
        });
    }
  };


  const handleContinueToHeroMoments = () => {
    navigate('/inner-dna/hero-moments');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#0a1628' }}>
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white">Loading assessment...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#0a1628' }}>
        <div className="text-center">
          <p className="text-red-400 mb-4">{error}</p>
          <button
            onClick={startAssessment}
            className="px-6 py-2 rounded-lg text-white"
            style={{ backgroundColor: '#5dade2' }}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (completed && results) {
    return (
      <div className="min-h-screen py-8 px-4" style={{ backgroundColor: '#0a1628' }}>
        <div className="max-w-2xl mx-auto">
          <div className="rounded-xl p-8 mb-6" style={{ backgroundColor: '#1a2332', border: '1px solid #2a3b52' }}>
            <h1 className="text-2xl font-bold text-white mb-2 text-center">Stage 1 Complete!</h1>
            <p className="text-gray-400 text-center mb-8">Your personality screening is complete</p>
            
            <h2 className="text-lg font-semibold text-white mb-4">Your Top 3 Types:</h2>
            <div className="space-y-3 mb-8">
              {results.topTypesWithNames.map((t, index) => (
                <div
                  key={t.type}
                  className="flex items-center justify-between p-4 rounded-lg"
                  style={{ backgroundColor: index === 0 ? '#1e3a5f' : '#0d1829', border: '1px solid #2a3b52' }}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className="w-8 h-8 rounded-full flex items-center justify-center font-bold"
                      style={{ backgroundColor: '#5dade2', color: '#0a1628' }}
                    >
                      {index + 1}
                    </span>
                    <div>
                      <p className="text-white font-medium">Type {t.type}: {t.name}</p>
                    </div>
                  </div>
                  <span className="text-cyan-400 font-semibold">{t.score} points</span>
                </div>
              ))}
            </div>

            <p className="text-gray-400 text-sm mb-6 text-center">
              Next, we'll use Hero Moments scenarios to narrow down your exact type with 90% confidence.
            </p>

            <button
              onClick={handleContinueToHeroMoments}
              className="w-full py-3 rounded-lg font-semibold text-white transition-colors"
              style={{ backgroundColor: '#5dade2' }}
            >
              Continue to Hero Moments →
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4" style={{ backgroundColor: '#0a1628' }}>
      <div className="max-w-2xl mx-auto">
        {/* Progress Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            {questionNumber > 1 && (<button onClick={handleGoBack} className="text-cyan-400 hover:text-cyan-300 text-sm flex items-center gap-1"><span>←</span> Back</button>)}<span className="text-gray-400 text-sm">Question {questionNumber} of {totalQuestions}</span>
            <span className="text-cyan-400 text-sm font-medium">
              {Math.round((questionNumber / totalQuestions) * 100)}%
            </span>
          </div>
          <div className="w-full h-2 rounded-full" style={{ backgroundColor: '#2a3b52' }}>
            <div
              className="h-2 rounded-full transition-all duration-300"
              style={{
                backgroundColor: '#5dade2',
                width: `${(questionNumber / totalQuestions) * 100}%`,
              }}
            ></div>
          </div>
        </div>

        {/* Question Card */}
        <div className="rounded-xl p-8" style={{ backgroundColor: '#1a2332', border: '1px solid #2a3b52' }}>
          <h1 className="text-xl font-bold text-white mb-2 text-center">
            Which statement describes you better?
          </h1>
          <p className="text-gray-400 text-center mb-8 text-sm">
            Choose the option that fits you most of the time
          </p>

          {currentQuestion && (
            <div className="space-y-4">
              {/* Option A */}
              <button
                onClick={() => handleSelectOption('A')}
                disabled={isSubmitting}
                className="w-full p-5 rounded-lg text-left transition-all duration-200 hover:scale-[1.02] disabled:opacity-50"
                style={{
                  backgroundColor: '#0d1829',
                  border: '2px solid #2a3b52',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#5dade2';
                  e.currentTarget.style.backgroundColor = '#1e3a5f';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#2a3b52';
                  e.currentTarget.style.backgroundColor = '#0d1829';
                }}
              >
                <div className="flex items-start gap-4">
                  <span
                    className="w-8 h-8 rounded-full flex items-center justify-center font-bold flex-shrink-0"
                    style={{ backgroundColor: '#5dade2', color: '#0a1628' }}
                  >
                    A
                  </span>
                  <p className="text-white">{currentQuestion.optionA}</p>
                </div>
              </button>

              {/* Option B */}
              <button
                onClick={() => handleSelectOption('B')}
                disabled={isSubmitting}
                className="w-full p-5 rounded-lg text-left transition-all duration-200 hover:scale-[1.02] disabled:opacity-50"
                style={{
                  backgroundColor: '#0d1829',
                  border: '2px solid #2a3b52',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#5dade2';
                  e.currentTarget.style.backgroundColor = '#1e3a5f';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#2a3b52';
                  e.currentTarget.style.backgroundColor = '#0d1829';
                }}
              >
                <div className="flex items-start gap-4">
                  <span
                    className="w-8 h-8 rounded-full flex items-center justify-center font-bold flex-shrink-0"
                    style={{ backgroundColor: '#5dade2', color: '#0a1628' }}
                  >
                    B
                  </span>
                  <p className="text-white">{currentQuestion.optionB}</p>
                </div>
              </button>
            </div>
          )}

          {isSubmitting && (
            <div className="flex justify-center mt-6">
              <div className="w-6 h-6 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
        </div>

        {/* Info */}
        <p className="text-gray-500 text-center text-sm mt-6">
          Stage 1 of 5 - Inner DNA Test
        </p>
      </div>
    </div>
  );
}
