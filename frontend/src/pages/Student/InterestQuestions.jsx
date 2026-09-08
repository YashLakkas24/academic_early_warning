import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Sparkles,
  Check,
  RotateCcw,
  Compass,
} from "lucide-react";
import {
  startInterestSession,
  submitInterestAnswer,
} from "../../services/studentService";

import "./InterestQuestions.css";

function InterestQuestions() {
  const navigate = useNavigate();
  const location = useLocation();

  const primaryInterest =
    location.state?.primaryInterest ||
    location.state?.selectedInterests?.[0] ||
    "Coding & Software";

  const interestName =
    typeof primaryInterest === "string" && primaryInterest.includes("-")
      ? primaryInterest
          .replace(/-/g, " ")
          .replace(/\b\w/g, (char) => char.toUpperCase())
      : primaryInterest || "Coding & Software";

  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [questionNumber, setQuestionNumber] = useState(1);
  const [totalQuestions, setTotalQuestions] = useState(5);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const getStudentId = () => {
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      // return user.student_id || user.user_id || "STU001";
      const studentId = user.student_id || user.user_id;

      if (!studentId) {
        throw new Error("Student ID not found. Please login again.");
      }

      return studentId;
    } catch {
      return "STU001";
    }
  };

  const studentId = getStudentId();

  /*
   * Initialize or resume the live AI Interest+ session on mount
   */
  const initSession = async (resetSession = false) => {
    try {
      setLoading(true);
      setError("");
      setSelectedAnswer(null);

      const response = await startInterestSession(
        studentId,
        interestName,
        resetSession,
      );

      if (response.completed) {
        // Assessment already finished, navigate to results
        navigate("/student/interest/result", {
          state: {
            selectedInterests: [interestName],
            primaryInterest: interestName,
            analysis: response.analysis,
          },
        });
        return;
      }

      if (response.next_question) {
        setCurrentQuestion(response.next_question);
        setQuestionNumber(response.question_number || 1);
        setTotalQuestions(response.total_questions || 5);
      } else {
        throw new Error("No question returned from the AI service.");
      }
    } catch (err) {
      console.error("Failed to start AI interest session:", err);
      setError(
        err.message ||
          "Could not connect to the AI service. Please check your backend connection.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    initSession(false);
  }, [studentId, interestName]);

  /*
   * Option selection handlers
   */
  const handleSingleSelect = (val) => {
    setSelectedAnswer(val);
  };

  const handleMultipleToggle = (val) => {
    setSelectedAnswer((prev) => {
      const arr = Array.isArray(prev) ? prev : [];
      if (arr.includes(val)) {
        return arr.filter((item) => item !== val);
      }
      return [...arr, val];
    });
  };

  const handleScaleSelect = (val) => {
    setSelectedAnswer(val);
  };

  const isSelected = (val) => {
    if (Array.isArray(selectedAnswer)) {
      return selectedAnswer.includes(val);
    }
    return selectedAnswer === val || String(selectedAnswer) === String(val);
  };

  /*
   * Submit student's answer and fetch next AI question or final analysis
   */
  const handleNext = async () => {
    if (
      selectedAnswer === null ||
      selectedAnswer === "" ||
      (Array.isArray(selectedAnswer) && selectedAnswer.length === 0)
    ) {
      return;
    }

    try {
      setSubmitting(true);
      setError("");

      const payload = {
        interest: interestName,
        question_id: currentQuestion.question_id || `q${questionNumber}`,
        question: currentQuestion.question || "",
        answer: selectedAnswer,
        question_order: questionNumber,
      };

      const response = await submitInterestAnswer(studentId, payload);

      if (response.completed) {
        // 5 Questions completed -> Assessment done!
        navigate("/student/interest/result", {
          state: {
            selectedInterests: [interestName],
            primaryInterest: interestName,
            analysis: response.analysis,
          },
        });
        return;
      }

      if (response.next_question) {
        setCurrentQuestion(response.next_question);
        setQuestionNumber(response.question_number || questionNumber + 1);
        setSelectedAnswer(null);
      }
    } catch (err) {
      console.error("Failed to submit answer to AI:", err);
      setError(
        err.message ||
          "Failed to process your response. Please try submitting again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const isNextDisabled =
    submitting ||
    selectedAnswer === null ||
    selectedAnswer === "" ||
    (Array.isArray(selectedAnswer) && selectedAnswer.length === 0);

  const progress = Math.min(
    100,
    Math.round((questionNumber / totalQuestions) * 100),
  );

  return (
    <div className="interest-questions-page">
      <header className="questions-header">
        <button
          className="questions-back"
          onClick={() => navigate("/student/interest")}
        >
          <ArrowLeft size={17} />
          Back
        </button>

        <div className="questions-brand">
          <Sparkles size={18} />
          Interest+
        </div>

        <span className="questions-counter">
          Question {questionNumber} of {totalQuestions}
        </span>
      </header>

      <main className="questions-main">
        {/* Progress Bar */}
        <div className="questions-progress">
          <div
            className="questions-progress-fill"
            style={{
              width: loading ? "60%" : "100%",
            }}
          />
        </div>

        {/* Exploring Context */}
        <div className="interest-context">
          <div className="context-icon">
            <Compass size={20} />
          </div>

          <div>
            <span>AI EXPLORATION</span>
            <strong>{interestName}</strong>
          </div>
        </div>

        {/* Error notification */}
        {error && (
          <div className="questions-error-banner">
            <span>{error}</span>
            <button onClick={() => initSession(true)}>
              <RotateCcw size={13} style={{ marginRight: "4px" }} />
              Restart Quiz
            </button>
          </div>
        )}

        {/* Question Card or Loader */}
        {loading ? (
          <section className="question-card questions-loading-card">
            <div className="ai-spinner" />
            <h2>Connecting with AI...</h2>
            <p className="question-subtitle">
              Generating your personalized adaptive questions for {interestName}
              .
            </p>
          </section>
        ) : currentQuestion ? (
          <section className="question-card">
            <div className="question-number">
              0{questionNumber} / 0{totalQuestions}
            </div>

            <h1>{currentQuestion.question}</h1>

            {/* Scale type question */}
            {currentQuestion.response_type === "scale" && (
              <div className="question-scale-grid">
                {[
                  { val: 1, label: "Low / None" },
                  { val: 2, label: "Slight" },
                  { val: 3, label: "Moderate" },
                  { val: 4, label: "High" },
                  { val: 5, label: "Very High" },
                ].map((scaleItem) => {
                  const selected =
                    selectedAnswer === scaleItem.val ||
                    selectedAnswer === String(scaleItem.val);
                  return (
                    <button
                      key={scaleItem.val}
                      type="button"
                      className={`scale-option-btn ${selected ? "selected" : ""}`}
                      onClick={() => handleScaleSelect(scaleItem.val)}
                    >
                      <strong>{scaleItem.val}</strong>
                      <span>{scaleItem.label}</span>
                    </button>
                  );
                })}
              </div>
            )}

            {/* Multiple Choice question */}
            {currentQuestion.response_type === "multiple_choice" && (
              <div className="question-options">
                {(currentQuestion.options || []).map((opt, idx) => {
                  const selected = isSelected(opt);
                  return (
                    <button
                      key={idx}
                      type="button"
                      className={`question-option ${selected ? "selected" : ""}`}
                      onClick={() => handleMultipleToggle(opt)}
                    >
                      <span className="option-radio">
                        {selected && <Check size={14} />}
                      </span>
                      <span>{opt}</span>
                    </button>
                  );
                })}
                <span className="multiple-hint">
                  You can select more than one option.
                </span>
              </div>
            )}

            {/* Single Choice question */}
            {currentQuestion.response_type === "single_choice" && (
              <div className="question-options">
                {(currentQuestion.options || []).map((opt, idx) => {
                  const selected = isSelected(opt);
                  return (
                    <button
                      key={idx}
                      type="button"
                      className={`question-option ${selected ? "selected" : ""}`}
                      onClick={() => handleSingleSelect(opt)}
                    >
                      <span className="option-radio">
                        {selected && <Check size={14} />}
                      </span>
                      <span>{opt}</span>
                    </button>
                  );
                })}
              </div>
            )}

            {/* Text question */}
            {currentQuestion.response_type === "text" && (
              <div style={{ marginTop: "16px" }}>
                <textarea
                  className="question-textarea"
                  rows={4}
                  placeholder="Type your response here..."
                  value={selectedAnswer || ""}
                  onChange={(e) => setSelectedAnswer(e.target.value)}
                />
              </div>
            )}

            {/* Default options fallback if response_type is undefined */}
            {!["scale", "multiple_choice", "single_choice", "text"].includes(
              currentQuestion.response_type,
            ) &&
              currentQuestion.options &&
              currentQuestion.options.length > 0 && (
                <div className="question-options">
                  {currentQuestion.options.map((opt, idx) => {
                    const selected = isSelected(opt);
                    return (
                      <button
                        key={idx}
                        type="button"
                        className={`question-option ${selected ? "selected" : ""}`}
                        onClick={() => handleSingleSelect(opt)}
                      >
                        <span className="option-radio">
                          {selected && <Check size={14} />}
                        </span>
                        <span>{opt}</span>
                      </button>
                    );
                  })}
                </div>
              )}

            <div className="question-actions">
              <button
                className="question-next"
                disabled={isNextDisabled}
                onClick={handleNext}
              >
                {submitting
                  ? questionNumber >= totalQuestions
                    ? "Generating AI Analysis..."
                    : "AI Thinking..."
                  : questionNumber >= totalQuestions
                    ? "Finish Assessment"
                    : "Continue"}
                <ArrowRight size={17} />
              </button>
            </div>
          </section>
        ) : null}

        <p className="adaptive-message">
          <Sparkles size={14} />
          Adaptive AI questions tailored in real time to your responses.
        </p>
      </main>
    </div>
  );
}

export default InterestQuestions;
