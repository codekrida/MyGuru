
import { GoogleGenAI, Type } from "@google/genai";
import { Standard, Board, Subject } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const getTutorSystemInstruction = (standard: Standard, board: Board, subject: Subject) => {
  return `You are GuruAI, an expert Indian school teacher specializing in the ${subject} curriculum for ${standard} standard students under the ${board} board.
  Your goal is to explain complex concepts simply, using examples from the Indian context (e.g., using Indian names, currency, and local geography in word problems).
  Strictly follow the NCERT/standard curriculum for these grades.
  Break down long answers into bullet points. Use encouraging language.
  If the student asks something outside their syllabus, briefly explain it but bring them back to their core curriculum.
  For Mathematics, provide step-by-step solutions.
  Always ask if the student understood or if they want to try a practice question.`;
};

export const generateLessonResponse = async (
  prompt: string, 
  standard: Standard, 
  board: Board, 
  subject: Subject,
  history: { role: string; parts: { text: string }[] }[] = []
) => {
  const model = ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: [
        ...history,
        { role: 'user', parts: [{ text: prompt }] }
    ],
    config: {
      systemInstruction: getTutorSystemInstruction(standard, board, subject),
      temperature: 0.7,
    },
  });

  const response = await model;
  return response.text;
};

export const generateQuiz = async (topic: string, standard: Standard, subject: Subject) => {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Generate a 5-question MCQ quiz for a ${standard} student on the topic: "${topic}" in ${subject}. 
    Provide the output in JSON format.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            question: { type: Type.STRING },
            options: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING },
              description: "Array of exactly 4 options"
            },
            correctAnswer: { 
              type: Type.INTEGER, 
              description: "Index of the correct answer (0-3)"
            },
            explanation: { type: Type.STRING }
          },
          required: ["question", "options", "correctAnswer", "explanation"]
        }
      }
    }
  });

  return JSON.parse(response.text || "[]");
};

export const solveProblemFromImage = async (base64Image: string, prompt: string, standard: Standard) => {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: {
      parts: [
        { inlineData: { mimeType: 'image/jpeg', data: base64Image } },
        { text: `A ${standard} student needs help with this. Explain step-by-step: ${prompt}` }
      ]
    },
    config: {
        systemInstruction: "You are a visual aid teacher. Focus on clarity and explaining diagrams if present."
    }
  });
  return response.text;
};
