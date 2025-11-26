"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import ResultView from '@/components/test/ResultView';
import { toast } from 'sonner';

interface Question {
  id: number;
  text: string;
}

interface Domain {
  id: string;
  title: string;
  questions: Question[];
}

const domains: Domain[] = [
  {
    id: 'domain-1',
    title: 'DOMAIN 1: DOCUMENTATION',
    questions: [
      { id: 1, text: 'Do you have a complete and current set of policies for all your service lines?' },
      { id: 2, text: 'Have these policies been updated in the last 12 months?' },
      { id: 3, text: 'Do you maintain a formal version-control process?' },
      { id: 4, text: 'Are staff required to acknowledge new or updated policies?' },
    ],
  },
  {
    id: 'domain-2',
    title: 'DOMAIN 2: REGULATORY TRACKING',
    questions: [
      { id: 5, text: 'Do you monitor state-level changes relevant to your programs?' },
      { id: 6, text: 'Do you have a process to implement new regulations within 30 days?' },
      { id: 7, text: 'Have you had any findings or citations in the past 24 months?' },
    ],
  },
  {
    id: 'domain-3',
    title: 'DOMAIN 3: OPERATIONAL PROCESSES',
    questions: [
      { id: 8, text: 'Do all staff complete required annual trainings?' },
      { id: 9, text: 'Do you maintain required incident reporting and corrective action documentation?' },
      { id: 10, text: 'Do you have a formal audit or review every year?' },
    ],
  },
  {
    id: 'domain-4',
    title: 'DOMAIN 4: ACCREDITATION READINESS',
    questions: [
      { id: 11, text: 'Are your policies aligned to your accrediting body\'s latest standards?' },
      { id: 12, text: 'Can you produce required documents within 24 hours if requested?' },
      { id: 13, text: 'Did you have gaps during your last review or mock assessment?' },
      { id: 14, text: 'Do you have a central, organized repository for compliance documents?' },
    ],
  },
];

const optionalQuestion = {
  id: 15,
  text: 'Are key program handbooks (client rights, privacy, emergency procedures) up-to-date?',
};

export default function TestPage() {
  const [answers, setAnswers] = useState<Record<number, boolean | null>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams.get('view') === 'result') {
      setIsSubmitted(true);
    } else {
      setIsSubmitted(false);
      // Set start time when test page loads (not in result view)
      if (startTime === null) {
        setStartTime(Date.now());
      }
    }
  }, [searchParams, startTime]);

  const handleAnswer = (questionId: number, value: boolean) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  const calculateScore = () => {
    let score = 0;
    Object.values(answers).forEach((val) => {
      if (val === true) score++;
    });
    return score;
  };

  const handleSubmit = () => {
    // Get all question IDs (excluding optional)
    const allQuestionIds = domains.flatMap(domain => domain.questions.map(q => q.id));

    // Check if all required questions are answered
    const unansweredQuestions = allQuestionIds.filter(id => answers[id] === undefined || answers[id] === null);

    if (unansweredQuestions.length > 0) {
      toast.error('Please answer all questions before submitting.');
      return;
    }

    // Check if minimum time has elapsed (3 minutes = 180000 milliseconds)
    if (startTime) {
      const elapsedTime = Date.now() - startTime;
      const threeMinutes = 3 * 60 * 1000; // 3 minutes in milliseconds

      if (elapsedTime < threeMinutes) {
        const remainingSeconds = Math.ceil((threeMinutes - elapsedTime) / 1000);
        toast.warning(`Please take your time. You need at least ${remainingSeconds} more seconds to complete the test.`);
        return;
      }
    }

    // If all validations pass, proceed with submission
    const score = calculateScore();
    router.push('/test?view=result');
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <main className="flex-1 max-w-5xl w-full mx-auto p-8 md:p-12">
          <ResultView score={calculateScore()} answers={answers} />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <main className="flex-1 max-w-5xl w-full mx-auto p-8 md:p-12">
        <div className="bg-blue-50 border border-blue-100 rounded-lg p-6 mb-12 text-center">
          <h2 className="text-lg font-semibold text-gray-800">
            Core Questions (12–15 items, yes/no or multiple-choice)
          </h2>
        </div>

        <div className="space-y-12">
          {domains.map((domain) => (
            <div key={domain.id}>
              <h3 className="text-[#4E27F0] font-bold tracking-wider uppercase mb-6 text-sm">
                {domain.title}
              </h3>
              <div className="space-y-6">
                {domain.questions.map((q) => (
                  <div key={q.id} className="flex items-center justify-between border-b border-gray-100 pb-6 last:border-0">
                    <p className="text-gray-800 text-base max-w-3xl">{q.id}. {q.text}</p>
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleAnswer(q.id, true)}
                        className={`px-6 py-2 rounded border transition-colors ${answers[q.id] === true
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
                          }`}
                      >
                        Yes
                      </button>
                      <button
                        onClick={() => handleAnswer(q.id, false)}
                        className={`px-6 py-2 rounded border transition-colors ${answers[q.id] === false
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
                          }`}
                      >
                        No
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Optional Question Section */}
          <div>
            <h3 className="text-[#4E27F0] font-bold tracking-wider uppercase mb-6 text-sm">
              OPTIONAL
            </h3>
            <div className="flex items-center justify-between border-b border-gray-100 pb-6">
              <p className="text-gray-800 text-base max-w-3xl">{optionalQuestion.id}. {optionalQuestion.text}</p>
              <div className="flex gap-3">
                <button
                  onClick={() => handleAnswer(optionalQuestion.id, true)}
                  className={`px-6 py-2 rounded border transition-colors ${answers[optionalQuestion.id] === true
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
                    }`}
                >
                  Yes
                </button>
                <button
                  onClick={() => handleAnswer(optionalQuestion.id, false)}
                  className={`px-6 py-2 rounded border transition-colors ${answers[optionalQuestion.id] === false
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
                    }`}
                >
                  No
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 flex justify-center">
          <button
            onClick={handleSubmit}
            className="bg-[#0D25FF] hover:bg-[#0D25FF]/80 text-white font-bold py-4 px-24 rounded-lg text-lg transition-colors shadow-lg shadow-[#0D25FF]/20"
          >
            Submit
          </button>
        </div>
      </main>
    </div>
  );
}
