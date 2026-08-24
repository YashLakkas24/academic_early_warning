import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { ArrowLeft, ArrowRight, Sparkles, Mic, Check } from "lucide-react";

import "./InterestQuestions.css";

function InterestQuestions() {
  const navigate = useNavigate();
  const location = useLocation();

  const selectedInterests = location.state?.selectedInterests || [
    "public-speaking",
  ];

  const [currentInterestIndex, setCurrentInterestIndex] = useState(0);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [selectedAnswer, setSelectedAnswer] = useState(null);

  const currentInterest = selectedInterests[currentInterestIndex];

  /*
   * Temporary question engine.
   *
   * Later:
   *
   * React → FastAPI → AI Question Engine
   *
   * The AI will decide what question comes next.
   */

  const getQuestions = (interest) => {
    if (interest === "public-speaking") {
      return [
        {
          id: "interest-level",
          question: "How interested are you in Public Speaking?",
          subtitle:
            "Think about how much you genuinely enjoy speaking, presenting or expressing ideas.",
          type: "scale",
          options: [
            { value: 1, label: "Not interested" },
            { value: 2, label: "Slightly interested" },
            { value: 3, label: "Moderately interested" },
            { value: 4, label: "Very interested" },
            { value: 5, label: "Extremely interested" },
          ],
        },

        {
          id: "ability",
          question: "How would you rate your current Public Speaking ability?",
          subtitle:
            "Be honest. This is about your current ability, not where you want to be.",
          type: "scale",
          options: [
            { value: 1, label: "Beginner" },
            { value: 2, label: "Developing" },
            { value: 3, label: "Average" },
            { value: 4, label: "Good" },
            { value: 5, label: "Very confident" },
          ],
        },

        {
          id: "experience",
          question:
            "Have you ever participated in activities involving Public Speaking?",
          subtitle: "Select the experiences that apply to you.",
          type: "multiple",
          options: [
            { value: "presentation", label: "Classroom presentations" },
            { value: "debate", label: "Debates" },
            { value: "mun", label: "MUN" },
            { value: "anchoring", label: "Anchoring / Hosting" },
            { value: "competition", label: "Speaking competitions" },
            { value: "none", label: "None so far" },
          ],
        },

        {
          id: "mun-experience",
          question: "What did you enjoy most about your MUN experience?",
          subtitle:
            "Your previous answer tells us you have tried MUN. Let's understand what attracted you to it.",
          type: "single",
          condition: (previousAnswers) =>
            previousAnswers.experience?.includes("mun"),
          options: [
            { value: "speaking", label: "Speaking and presenting" },
            { value: "debate", label: "Debate and argumentation" },
            { value: "research", label: "Research and preparation" },
            { value: "negotiation", label: "Negotiation" },
            { value: "teamwork", label: "Team interaction" },
          ],
        },

        {
          id: "speaking-confidence",
          question:
            "How comfortable are you speaking without preparing beforehand?",
          subtitle:
            "For example, answering a question unexpectedly in front of a group.",
          type: "scale",
          options: [
            { value: 1, label: "Very uncomfortable" },
            { value: 2, label: "Uncomfortable" },
            { value: 3, label: "Neutral" },
            { value: 4, label: "Comfortable" },
            { value: 5, label: "Very comfortable" },
          ],
        },
      ];
    }

    return [
      {
        id: "general-interest",
        question: `How interested are you in ${interest.replace("-", " ")}?`,
        subtitle: "Tell us how strongly this area interests you.",
        type: "scale",
        options: [
          { value: 1, label: "Not interested" },
          { value: 2, label: "Slightly interested" },
          { value: 3, label: "Moderately interested" },
          { value: 4, label: "Very interested" },
          { value: 5, label: "Extremely interested" },
        ],
      },
    ];
  };

  const allQuestions = getQuestions(currentInterest);

  /*
   * Remove conditional questions that don't apply.
   */
  const questions = allQuestions.filter((question) => {
    if (!question.condition) {
      return true;
    }

    return question.condition(answers);
  });

  const currentQuestion = questions[questionIndex];

  const handleOptionClick = (value) => {
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

  const handleNext = () => {
    if (
      selectedAnswer === null ||
      (Array.isArray(selectedAnswer) && selectedAnswer.length === 0)
    ) {
      return;
    }

    const updatedAnswers = {
      ...answers,
      [currentQuestion.id]: selectedAnswer,
    };

    setAnswers(updatedAnswers);

    if (questionIndex < questions.length - 1) {
      setQuestionIndex(questionIndex + 1);
      setSelectedAnswer(
        updatedAnswers[questions[questionIndex + 1]?.id] || null,
      );

      return;
    }

    /*
     * Current interest finished.
     */
    if (currentInterestIndex < selectedInterests.length - 1) {
      setCurrentInterestIndex(currentInterestIndex + 1);
      setQuestionIndex(0);
      setSelectedAnswer(null);

      return;
    }

    /*
     * Temporary result.
     * Later this will call the backend/AI.
     */
    console.log("Interest+ answers:", updatedAnswers);

    navigate("/student/interest/result", {
      state: {
        selectedInterests,
        answers: updatedAnswers,
      },
    });
  };

  const handleBack = () => {
    if (questionIndex > 0) {
      setQuestionIndex(questionIndex - 1);

      const previousQuestion = questions[questionIndex - 1];

      setSelectedAnswer(answers[previousQuestion.id] || null);

      return;
    }

    navigate("/student/interest");
  };

  const isSelected = (value) => {
    if (Array.isArray(selectedAnswer)) {
      return selectedAnswer.includes(value);
    }

    return selectedAnswer === value;
  };

  const progress = ((questionIndex + 1) / questions.length) * 100;

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
          Question {questionIndex + 1} of {questions.length}
        </span>
      </header>

      <main className="questions-main">
        <div className="questions-progress">
          <div
            className="questions-progress-fill"
            style={{ width: `${progress}%` }}
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
          <div className="question-number">0{questionIndex + 1}</div>

          <h1>{currentQuestion.question}</h1>

          <p className="question-subtitle">{currentQuestion.subtitle}</p>

          <div className="question-options">
            {currentQuestion.options.map((option) => {
              const selected = isSelected(option.value);

              return (
                <button
                  key={option.value}
                  className={`question-option ${selected ? "selected" : ""}`}
                  onClick={() => handleOptionClick(option.value)}
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

          <div className="question-actions">
            <button
              className="question-next"
              disabled={
                selectedAnswer === null ||
                (Array.isArray(selectedAnswer) && selectedAnswer.length === 0)
              }
              onClick={handleNext}
            >
              {questionIndex === questions.length - 1 &&
              currentInterestIndex === selectedInterests.length - 1
                ? "Complete"
                : "Continue"}

              <ArrowRight size={17} />
            </button>
          </div>
        </section>

        <p className="adaptive-message">
          <Sparkles size={14} />
          Your next question can change based on your answer.
        </p>
      </main>
    </div>
  );
}

export default InterestQuestions;
