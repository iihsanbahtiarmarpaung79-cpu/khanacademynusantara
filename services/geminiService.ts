import { GoogleGenAI, Type } from "@google/genai";

// Fungsi helper untuk mendapatkan instance AI dengan API Key terbaru
const getAIInstance = () => {
  const apiKey = process.env.API_KEY;
  return new GoogleGenAI({ apiKey: apiKey || "" });
};

export interface GeneratedContent {
  id: string;
  subject: string;
  topic: string;
  level: string;
  kelas: string;
  material: string;
  quiz: {
    text: string;
    options: string[];
    correctAnswer: number;
  }[];
  createdAt: number;
}

/**
 * Menyimpan konten ke library lokal untuk caching
 */
export const saveContentToLibrary = (content: GeneratedContent) => {
  try {
    const library = JSON.parse(localStorage.getItem('ka_library') || '[]');
    const filtered = library.filter((c: GeneratedContent) => 
      !(c.subject.toLowerCase() === content.subject.toLowerCase() && 
        c.kelas === content.kelas && 
        c.level === content.level)
    );
    filtered.push(content);
    if (filtered.length > 20) filtered.shift();
    localStorage.setItem('ka_library', JSON.stringify(filtered));
  } catch (e) {
    console.error("Gagal menyimpan ke cache:", e);
  }
};

/**
 * Mengambil konten yang sudah ada dari library lokal
 */
export const getContentForStudent = (subject: string, level: string, kelas: string): GeneratedContent | null => {
  try {
    const library = JSON.parse(localStorage.getItem('ka_library') || '[]');
    return library.find((c: GeneratedContent) => 
      c.subject.toLowerCase() === subject.toLowerCase() && 
      c.level === level && 
      c.kelas === kelas
    ) || null;
  } catch (e) {
    return null;
  }
};

/**
 * Fungsi utama untuk menghasilkan konten edukasi mendalam menggunakan Gemini 3 Pro
 */
export const generateEducationContent = async (topic: string, subject: string, level: string, kelas: string): Promise<GeneratedContent> => {
  const ai = getAIInstance();
  
  const systemInstruction = `Anda adalah Pakar Kurikulum Merdeka Kemdikbudristek RI dengan gelar Profesor Pendidikan. 
  Tugas Anda adalah merancang modul pembelajaran Nusantara yang prestisius.
  Materi harus mendalam, menggunakan bahasa Indonesia yang formal namun inspiratif.
  Kuis harus menantang dan mencakup soal HOTS (Higher Order Thinking Skills).`;

  const prompt = `Buatlah Modul Pembelajaran Lengkap untuk:
  - Mata Pelajaran: ${subject}
  - Topik: ${topic}
  - Jenjang: ${level} (${kelas})

  WAJIB MEMENUHI KRITERIA:
  1. MATERI: Tulis minimal 1000 kata dalam format Markdown. Gunakan struktur: ## Pendahuluan, ## Pembahasan Mendalam (analisis konsep), ## Relevansi di Indonesia (konteks lokal), ## Rangkuman & Kesimpulan.
  2. KUIS: Buat tepat 30 soal pilihan ganda (A, B, C, D).
     - 10 Soal Level Mudah (Ingatan/Pemahaman)
     - 10 Soal Level Sedang (Aplikasi/Analisis)
     - 10 Soal Level HOTS (Evaluasi/Kreasi)
  
  Format output HARUS JSON murni sesuai schema.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        thinkingConfig: { thinkingBudget: 4000 },
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            material: { 
              type: Type.STRING,
              description: "Materi lengkap dalam format Markdown minimal 1000 kata."
            },
            quiz: {
              type: Type.ARRAY,
              description: "Daftar 30 soal pilihan ganda.",
              items: {
                type: Type.OBJECT,
                properties: {
                  text: { type: Type.STRING },
                  options: { 
                    type: Type.ARRAY, 
                    items: { type: Type.STRING },
                    minItems: 4,
                    maxItems: 4
                  },
                  correctAnswer: { 
                    type: Type.INTEGER,
                    description: "Index jawaban benar (0-3)"
                  }
                },
                required: ["text", "options", "correctAnswer"]
              }
            }
          },
          required: ["material", "quiz"]
        }
      }
    });

    const textOutput = response.text;
    if (!textOutput) throw new Error("AI tidak memberikan respon teks.");

    const result = JSON.parse(textOutput);
    
    return {
      ...result,
      id: `MOD-${Math.random().toString(36).substr(2, 7).toUpperCase()}`,
      subject,
      topic,
      level,
      kelas,
      createdAt: Date.now()
    };
  } catch (error: any) {
    console.error("Gemini Generation Error:", error);
    if (!process.env.API_KEY) {
      throw new Error("API_KEY belum dikonfigurasi di variabel lingkungan Netlify.");
    }
    throw new Error(`Gagal menyusun modul ${subject}. Silakan coba beberapa saat lagi.`);
  }
};