
import { GoogleGenAI, Type } from "@google/genai";

// Strictly initialize GoogleGenAI with named parameter using process.env.API_KEY || 'FAKE_API_KEY_FOR_DEVELOPMENT'
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || 'FAKE_API_KEY_FOR_DEVELOPMENT' });

export const getAITutoring = async (topic: string, subject: string, level: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Berikan penjelasan mendalam mengenai topik "${topic}" untuk mata pelajaran ${subject} pada jenjang ${level}. Gunakan pendekatan Kurikulum Merdeka yang menekankan pada pemahaman konsep dan aplikasi nyata di lingkungan Indonesia. Pastikan penjelasan ramah untuk siswa, akurat secara akademis, dan mudah dipahami.`,
      config: {
        systemInstruction: "Anda adalah tutor ahli dari Khan Academy Nusantara yang berdedikasi membantu siswa Indonesia memahami materi sekolah dengan sangat jelas dan komprehensif.",
        temperature: 0.7,
      }
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Maaf, sistem tutor sedang mengalami gangguan teknis. Mohon ulangi beberapa saat lagi.";
  }
};

export const getAIDiscussionInsight = async (topic: string, content: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Berikut adalah topik diskusi di forum sekolah: "${topic}". Isi diskusi: "${content}". Sebagai asisten ahli Khan Academy Nusantara, berikan tanggapan yang mendidik, menyemangati, dan berikan poin-poin kunci atau jawaban jika itu berupa pertanyaan akademis. Gunakan bahasa yang akrab bagi siswa Indonesia.`,
      config: {
        systemInstruction: "Anda adalah moderator forum pendidikan yang bijak dan ahli materi pelajaran sekolah di Indonesia.",
      }
    });
    return response.text;
  } catch (error) {
    return "AI sedang sibuk merenung, silakan coba lagi nanti.";
  }
};

export const generateReadingMaterial = async (topic: string, subject: string, level: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Buatlah materi bacaan lengkap untuk topik "${topic}" (${subject}) jenjang ${level}. Struktur materi harus terdiri dari: 1. Pendahuluan, 2. Konsep Utama (poin-poin), 3. Contoh Kasus di Indonesia, 4. Kesimpulan. Gunakan bahasa Indonesia yang formal namun mudah dimengerti.`,
      config: {
        systemInstruction: "Anda adalah penulis buku teks pendidikan profesional untuk Kurikulum Merdeka di Indonesia.",
      }
    });
    return response.text;
  } catch (error) {
    return "Gagal memuat materi bacaan.";
  }
};

export const generateConceptDeepDive = async (topic: string, subject: string, level: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Lakukan "Bedah Materi" secara mendalam untuk topik "${topic}" (${subject}) jenjang ${level}. Fokus pada: Kenapa ini penting? Bagaimana cara kerjanya secara mendetail? Analogi unik untuk mempermudah pemahaman, dan kesalahan umum yang sering dilakukan siswa.`,
      config: {
        systemInstruction: "Anda adalah ahli pedagogi yang mampu membedah konsep rumit menjadi sangat sederhana menggunakan analogi dan logika.",
      }
    });
    return response.text;
  } catch (error) {
    return "Gagal membedah materi.";
  }
};

export const generateQuizQuestions = async (topic: string, subject: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Buat 5 pertanyaan pilihan ganda yang menantang tentang ${topic} (${subject}) sesuai kurikulum sekolah di Indonesia. Pertanyaan harus mencakup berbagai tingkat kognitif (LOTS hingga HOTS). Format output harus JSON array of objects dengan properti: id (string), text (string), options (array of 4 strings), correctAnswer (index number 0-3).`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              text: { type: Type.STRING },
              options: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
              correctAnswer: { type: Type.INTEGER }
            },
            required: ["id", "text", "options", "correctAnswer"]
          }
        }
      }
    });
    const jsonStr = response.text?.trim();
    return JSON.parse(jsonStr || '[]');
  } catch (error) {
    console.error("Gemini Quiz Error:", error);
    return [];
  }
};
