const axios = require('axios');

// Controller untuk mendapatkan AI response dari GitHub Models
const getAIResponse = async (req, res) => {
  try {
    const { message, conversationHistory = [] } = req.body;

    // Validasi input
    if (!message || !message.trim()) {
      return res.status(400).json({
        success: false,
        error: 'Message is required'
      });
    }

    // Cek GitHub token
    const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
    if (!GITHUB_TOKEN) {
      console.error('❌ GITHUB_TOKEN not found in .env');
      return res.status(500).json({
        success: false,
        error: 'GitHub token not configured on server'
      });
    }

    const API_ENDPOINT = 'https://models.inference.ai.azure.com/chat/completions';
    const MODEL = 'gpt-4o';

    console.log('📨 Sending message to GitHub Models:', message);

    // Siapkan messages untuk API
    const messages = [
      {
        role: 'system',
        content: `Anda adalah konsultan kesehatan mental yang empati, profesional, dan berpengalaman. 
        
Tugas Anda:
- Mendengarkan dengan penuh empati
- Memberikan saran konstruktif untuk masalah kesehatan mental
- Mendorong individu untuk mencari bantuan profesional jika diperlukan
- Menggunakan bahasa yang sensitif dan mendukung
- Memberikan informasi akurat tentang kesehatan mental

Ingat: Anda bukan pengganti psikolog profesional, tapi sahabat yang supportif.`
      },
      ...conversationHistory,
      {
        role: 'user',
        content: message
      }
    ];

    // Call GitHub Models API
    const response = await axios.post(
      API_ENDPOINT,
      {
        model: MODEL,
        messages: messages,
        temperature: 0.7,
        max_tokens: 500,
        top_p: 1
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${GITHUB_TOKEN}`
        },
        timeout: 30000
      }
    );

    const aiResponse = response.data.choices[0].message.content;
    console.log('✅ AI Response received:', aiResponse.substring(0, 50) + '...');

    res.json({
      success: true,
      response: aiResponse,
      timestamp: new Date()
    });
  } catch (error) {
    console.error('❌ Error calling GitHub Models API:', error.response?.data || error.message);
    
    const errorMessage = error.response?.data?.error?.message || error.message || 'Failed to get AI response';
    
    res.status(error.response?.status || 500).json({
      success: false,
      error: errorMessage
    });
  }
};

module.exports = {
  getAIResponse
};