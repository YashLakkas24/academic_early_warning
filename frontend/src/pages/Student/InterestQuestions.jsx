import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, Sparkles, Mic, Check } from "lucide-react";

import "./InterestQuestions.css";

function InterestQuestions() {
  const navigate = useNavigate();
  const location = useLocation();

  const selectedInterests = location.state?.selectedInterests || [
    "public-speaking",
  ];

  const savedUser = (() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "{}");
    } catch {
      return {};
    }
  })();

  const studentId = savedUser.user_id || "STU001";

  const [currentInterestIndex, setCurrentInterestIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [selectedAnswer, setSelectedAnswer] = useState(null);

  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const currentInterest = selectedInterests[currentInterestIndex];

  // -------------------------------------------------------
  // GET NEXT AI QUESTION
  // -------------------------------------------------------

  const fetchNextQuestion = async (
    updatedAnswers = answers,
    interest = currentInterest,
  ) => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        "http://localhost:8000/api/ai/next-question",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            student_id: studentId,
            selected_interests: selectedInterests,
            answers: updatedAnswers,
            current_interest: interest,
          }),
        },
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));

        throw new Error(
          errorData.detail || "Unable to generate the next question.",
        );
      }

      const data = await response.json();

      setCurrentQuestion(data);

      // Restore answer if this question was already answered
      if (updatedAnswers[data.question_id] !== undefined) {
        setSelectedAnswer(updatedAnswers[data.question_id]);
      } else {
        setSelectedAnswer(null);
      }
    } catch (err) {
      console.error("AI question error:", err);
      setError(err.message || "Unable to load the question.");
    } finally {
      setLoading(false);
    }
  };

  // -------------------------------------------------------
  // INITIAL QUESTION
  // -------------------------------------------------------

  useEffect(() => {
    fetchNextQuestion({}, currentInterest);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // -------------------------------------------------------
  // SELECT OPTION
  // -------------------------------------------------------

  const handleOptionClick = (value) => {
    if (!currentQuestion) return;

    if (currentQuestion.type === "multiple") {
      setSelectedAnswer((current) => {
        const currentValues = Array.isArray(current) ? current : [];

        if (currentValues.includes(value)) {
          return currentValues.filter((item) => item !== value);
        }

        return [...currentValues, value];
      });

      return;
    }

    setSelectedAnswer(value);
  };

  // -------------------------------------------------------
  // NEXT
  // -------------------------------------------------------

  const handleNext = async () => {
    if (
      selectedAnswer === null ||
      (Array.isArray(selectedAnswer) && selectedAnswer.length === 0)
    ) {
      return;
    }

    const questionKey =
      currentQuestion.question_id ||
      currentQuestion.id ||
      `question_${Object.keys(answers).length + 1}`;

    const updatedAnswers = {
      ...answers,
      [questionKey]: selectedAnswer,
    };

    setAnswers(updatedAnswers);

    // AI says this Interest+ session is finished
    if (currentQuestion.is_final) {
      navigate("/student/interest/result", {
        state: {
          selectedInterests,
          answers: updatedAnswers,
        },
      });

      return;
    }

    // Ask AI for the next question
    await fetchNextQuestion(updatedAnswers, currentInterest);
  };

  // -------------------------------------------------------
  // BACK
  // -------------------------------------------------------

  const handleBack = () => {
    navigate("/student/interest");
  };

  // -------------------------------------------------------
  // LOADING
  // -------------------------------------------------------

  if (loading && !currentQuestion) {
    return (
      <div className="interest-questions-page">
        <header className="questions-header">
          <button className="questions-back" onClick={handleBack}>
            <ArrowLeft size={17} />
            Back
          </button>

          <div className="questions-brand">
            <Sparkles size={18} />
            Interest+
          </div>
        </header>

        <main className="questions-main">
          <section className="question-card">
            <h1>Preparing your questions...</h1>
            <p className="question-subtitle">
              The AI is adapting the discovery experience to your interests.
            </p>
          </section>
        </main>
      </div>
    );
  }

  // -------------------------------------------------------
  // ERROR
  // -------------------------------------------------------

  if (error && !currentQuestion) {
    return (
      <div className="interest-questions-page">
        <header className="questions-header">
          <button className="questions-back" onClick={handleBack}>
            <ArrowLeft size={17} />
            Back
          </button>

          <div className="questions-brand">
            <Sparkles size={18} />
            Interest+
          </div>
        </header>

        <main className="questions-main">
          <section className="question-card">
            <h1>Unable to load the question</h1>

            <p className="question-subtitle">{error}</p>

            <div className="question-actions">
              <button
                className="question-next"
                onClick={() => fetchNextQuestion(answers, currentInterest)}
              >
                Try Again
                <ArrowRight size={17} />
              </button>
            </div>
          </section>
        </main>
      </div>
    );
  }

  if (!currentQuestion) {
    return null;
  }

  const options = currentQuestion.options || [];

  const isSelected = (value) => {
    if (Array.isArray(selectedAnswer)) {
      return selectedAnswer.includes(value);
    }

    return selectedAnswer === value;
  };

  return (
    <div className="interest-questions-page">
      <header className="questions-header">
        <button className="questions-back" onClick={handleBack}>
          <ArrowLeft size={17} />
          Back
        </button>

        <div className="questions-brand">
          <Sparkles size={18} />
          Interest+
        </div>

        <span className="questions-counter">
          {loading ? "Thinking..." : "Adaptive Question"}
        </span>
      </header>

      <main className="questions-main">
        <div className="questions-progress">
          <div
            className="questions-progress-fill"
            style={{
              width: loading ? "60%" : "100%",
            }}
          />
        </div>

        <div className="interest-context">
          <div className="context-icon">
            <Mic size={20} />
          </div>

          <div>
            <span>EXPLORING</span>

            <strong>
              {currentInterest
                .replace("-", " ")
                .replace(/\b\w/g, (letter) => letter.toUpperCase())}
            </strong>
          </div>
        </div>

        <section className="question-card">
          <div className="question-number">
            {Object.keys(answers).length + 1 < 10
              ? `0${Object.keys(answers).length + 1}`
              : Object.keys(answers).length + 1}
          </div>

          <h1>{currentQuestion.question}</h1>

          <p className="question-subtitle">{currentQuestion.subtitle}</p>

          <div className="question-options">
            {options.map((option) => {
              const selected = isSelected(option.value);

              return (
                <button
                  key={option.value}
                  className={`question-option ${selected ? "selected" : ""}`}
                  onClick={() => handleOptionClick(option.value)}
                  disabled={loading}
                >
                  <span className="option-radio">
                    {selected && <Check size={14} />}
                  </span>

                  <span>{option.label}</span>
                </button>
              );
            })}
          </div>

          {currentQuestion.type === "multiple" && (
            <span className="multiple-hint">You can select more than one.</span>
          )}

          {error && <p className="question-subtitle">{error}</p>}

          <div className="question-actions">
            <button
              className="question-next"
              disabled={
                loading ||
                selectedAnswer === null ||
                (Array.isArray(selectedAnswer) && selectedAnswer.length === 0)
              }
              onClick={handleNext}
            >
              {loading
                ? "Generating..."
                : currentQuestion.is_final
                  ? "Complete"
                  : "Continue"}

              <ArrowRight size={17} />
            </button>
          </div>
        </section>

        <p className="adaptive-message">
          <Sparkles size={14} />
          Your next question changes based on your answers.
        </p>
      </main>
    </div>
  );
}

export default InterestQuestions;
