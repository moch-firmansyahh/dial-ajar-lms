/**
 * aiGenerator.js
 * Utilitas untuk memanggil API AI (Google Gemini) untuk membuat kuis otomatis.
 */
import { GoogleGenerativeAI } from "@google/generative-ai";

// Kunci API diambil dari file .env (wajib bernama VITE_GEMINI_API_KEY)
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "";

export const generateQuizWithAI = async (materiText) => {
  try {
    if (!API_KEY) {
      throw new Error(
        "Untuk menggunakan fitur ini, Anda harus mengatur VITE_GEMINI_API_KEY di file .env terlebih dahulu.",
      );
    }

    // Inisialisasi SDK resmi alih-alih menggunakan fetch manual
    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `
Teks berikut adalah dokumen yang berisi daftar soal kuis (pilihan ganda dan/atau essay):
"${materiText}"

Tugas Anda adalah membaca teks di atas, mengekstrak SEMUA soal yang ada, lalu memformatnya menjadi JSON murni (tanpa markdown backticks) dengan struktur berikut:
{
  "pilihan_ganda": [
    {
      "pertanyaan": "Pertanyaan 1...",
      "opsi": ["A. Opsi 1", "B. Opsi 2", "C. Opsi 3", "D. Opsi 4"],
      "jawaban_benar": 0
    }
  ],
  "essay": [
    {
      "pertanyaan": "Pertanyaan essay 1..."
    }
  ]
}
Ekstrak sebanyak mungkin soal yang Anda temukan di teks. Hanya kembalikan JSON, jangan ada teks pembuka atau penutup.
`;

    // Eksekusi request menggunakan SDK (otomatis menangani URL endpoint dan headers)
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.2,
        responseMimeType: "application/json", // Memaksa AI memberikan output berformat JSON
      },
    });

    const resultText = result.response.text();

    // Parse teks menjadi JSON Object
    try {
      const cleanText = resultText.replace(/```json\n?|```\n?/g, "").trim();
      return JSON.parse(cleanText);
    } catch (e) {
      throw new Error(
        "Gagal membaca struktur kuis dari AI (Format tidak sesuai JSON).",
      );
    }
  } catch (error) {
    console.error("AI Generation Error:", error.message);
    throw error;
  }
};
