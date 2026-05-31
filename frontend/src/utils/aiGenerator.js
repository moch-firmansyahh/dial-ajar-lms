/**
 * aiGenerator.js
 * Utilitas untuk memanggil API AI (Google Gemini) untuk membuat kuis otomatis.
 */

// Kunci API seharusnya diletakkan di .env (misal VITE_GEMINI_API_KEY)
// Untuk demo ini, kita asumsikan kosong dan akan menggunakan sistem Fallback Cerdas (Mock) 
// jika API key tidak tersedia atau request gagal.
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';

export const generateQuizWithAI = async (materiText, jumlahPg = 5, jumlahEssay = 2) => {
  const prompt = `
Buatkan kuis berdasarkan materi berikut:
"${materiText}"

Buatkan ${jumlahPg} soal pilihan ganda dan ${jumlahEssay} soal essay.
Format balasannya HARUS berupa JSON murni (tanpa markdown backticks) dengan struktur berikut:
{
  "pilihan_ganda": [
    {
      "pertanyaan": "Pertanyaan 1...",
      "opsi": ["A. Opsi 1", "B. Opsi 2", "C. Opsi 3", "D. Opsi 4"],
      "jawaban_benar": 0 // index dari opsi yang benar (0-3)
    }
  ],
  "essay": [
    {
      "pertanyaan": "Pertanyaan essay 1..."
    }
  ]
}
Hanya kembalikan JSON, jangan ada teks pembuka atau penutup.
`;

  try {
    if (!API_KEY) {
      throw new Error('API Key tidak ditemukan, beralih ke Fallback Mode.');
    }

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.2,
          responseMimeType: "application/json",
        }
      })
    });

    if (!response.ok) {
      throw new Error(`Gagal menghubungi API AI. Status: ${response.status}`);
    }

    const data = await response.json();
    if (!data.candidates || data.candidates.length === 0) {
      throw new Error('API tidak mengembalikan hasil yang valid.');
    }
    
    const resultText = data.candidates[0].content.parts[0].text;
    
    // Parse JSON
    try {
      // Membersihkan markdown backticks jika ada (terkadang AI tetap mereturn markdown)
      const cleanText = resultText.replace(/```json\n?|```\n?/g, '');
      return JSON.parse(cleanText);
    } catch (e) {
      throw new Error('Gagal membaca struktur kuis dari AI (Format tidak sesuai JSON).');
    }

  } catch (error) {
    console.error("AI Generation Error:", error.message);
    throw error;
  }
};
