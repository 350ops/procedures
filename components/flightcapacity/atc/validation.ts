import type {
  FlightCapacityFeedback,
  FlightCapacityPrompt,
} from "./types";

const DECIMAL_SEPARATOR = /,/g;
const WHITESPACE = /\s+/g;

function normalizePlainAnswer(rawAnswer: string) {
  return rawAnswer.trim().replace(WHITESPACE, " ");
}

function parseNumericAnswer(rawAnswer: string) {
  const cleaned = normalizePlainAnswer(rawAnswer)
    .replace(DECIMAL_SEPARATOR, ".")
    .replace(/[^0-9.-]/g, "");

  if (!cleaned) {
    return null;
  }

  const parsed = Number(cleaned);
  return Number.isFinite(parsed) ? parsed : null;
}

export function normalizeFrequencyAnswer(rawAnswer: string) {
  const cleaned = rawAnswer.trim().replace(WHITESPACE, "").replace(",", ".");
  const match = cleaned.match(/^(\d{3})(?:\.(\d{1,3}))?$/);
  if (!match) {
    return null;
  }

  const whole = match[1];
  const fraction = (match[2] ?? "").padEnd(3, "0");
  return `${whole}.${fraction}`;
}

const formatNumberForCoach = (value: number) => {
  const fixed = value.toFixed(1);
  return fixed.endsWith(".0") ? fixed.slice(0, -2) : fixed;
};

export function validateFlightCapacityAnswer(
  prompt: FlightCapacityPrompt,
  rawAnswer: string,
): FlightCapacityFeedback {
  const normalizedAnswer = normalizePlainAnswer(rawAnswer);

  switch (prompt.type) {
    case "descentTime": {
      const parsed = parseNumericAnswer(rawAnswer);
      const expectedMinutes = prompt.expectedAnswer as number;
      const correctAnswerText = `${formatNumberForCoach(expectedMinutes)} min`;

      if (parsed === null) {
        return {
          normalizedAnswer,
          correct: false,
          correctAnswerText,
          explanation:
            "Enter the descent time in minutes using altitude to lose divided by descent rate.",
        };
      }

      return {
        normalizedAnswer: formatNumberForCoach(parsed),
        correct: Math.abs(parsed - expectedMinutes) <= (prompt.tolerance ?? 0),
        correctAnswerText,
        explanation:
          "Time equals altitude to lose divided by the assigned descent rate.",
      };
    }
    case "topOfDescent": {
      const parsed = parseNumericAnswer(rawAnswer);
      const expectedNm = prompt.expectedAnswer as number;
      const correctAnswerText = `${formatNumberForCoach(expectedNm)} NM`;

      if (parsed === null) {
        return {
          normalizedAnswer,
          correct: false,
          correctAnswerText,
          explanation:
            "Enter the distance in nautical miles using the three-to-one rule.",
        };
      }

      return {
        normalizedAnswer: formatNumberForCoach(parsed),
        correct: Math.abs(parsed - expectedNm) <= (prompt.tolerance ?? 0),
        correctAnswerText,
        explanation:
          "Using the three-to-one rule, multiply thousands of feet to lose by three.",
      };
    }
    case "headingTurn": {
      const parsed = parseNumericAnswer(rawAnswer);
      const expectedDegrees = prompt.expectedAnswer as number;
      const correctAnswerText = `${Math.round(expectedDegrees)} deg`;

      if (parsed === null) {
        return {
          normalizedAnswer,
          correct: false,
          correctAnswerText,
          explanation:
            "Enter the turn size in whole degrees between present and assigned heading.",
        };
      }

      return {
        normalizedAnswer: Math.round(parsed).toString(),
        correct: Math.round(parsed) === Math.round(expectedDegrees),
        correctAnswerText,
        explanation:
          "Turn size is the exact number of degrees between the current heading and the assigned heading.",
      };
    }
    case "frequencyReadback": {
      const normalizedFrequency = normalizeFrequencyAnswer(rawAnswer);
      const expectedFrequency = String(prompt.expectedAnswer);

      if (normalizedFrequency === null) {
        return {
          normalizedAnswer,
          correct: false,
          correctAnswerText: expectedFrequency,
          explanation:
            "Type the assigned VHF frequency in decimal notation, for example 121.800.",
        };
      }

      return {
        normalizedAnswer: normalizedFrequency,
        correct: normalizedFrequency === expectedFrequency,
        correctAnswerText: expectedFrequency,
        explanation:
          "Frequency readback is correct only when the full normalized decimal frequency matches.",
      };
    }
    default: {
      const exhaustiveCheck: never = prompt.type;
      throw new Error(`Unsupported prompt type: ${exhaustiveCheck}`);
    }
  }
}
