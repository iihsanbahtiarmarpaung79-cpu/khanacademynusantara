
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const getAITutoring = async (topic: string, subject: string, level: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Jelaskan topik "${topic}" untuk mata pelajaran ${subject} pada jenjang ${level} dengan cara yang mudah dimengerti anak sekolah. Gunakan bahasa Indonesia yang ramah dan edukatif.`,
      config: {
        systemInstruction: "Anda adalah tutor ahli dari Khan Academy Nusantara yang membantu siswa memahami pelajaran sekolah Indonesia.",
        temperature: 0.7,
      }
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Maaf, AI Tutor sedang istirahat. Silakan coba lagi nanti.";
  }
};

export const generateQuizQuestions = async (topic: string, subject: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Buat 5 pertanyaan pilihan ganda tentang ${topic} (${subject}) dalam format JSON array of objects dengan properti: id (string), text (string), options (array of 4 strings), correctAnswer (index number 0-3).`,
      config: {
        responseMimeType: "application/json",
      }
    });
    return JSON.parse(response.text || '[]');
  } catch (error) {
    console.error("Gemini Quiz Error:", error);
    return [];
  }
};
