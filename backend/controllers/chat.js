const { GoogleGenerativeAI } = require("@google/generative-ai");
const util = require("util");
const db = require("../database");
const queryAsync = util.promisify(db.query).bind(db);

const API_KEY = process.env.GEMINI_API_KEY;
let genAI;

if (API_KEY) {
  genAI = new GoogleGenerativeAI(API_KEY);
}

exports.handleChat = async (req, res) => {
  try {
    const { text, history } = req.body;

    if (!text) {
      return res.status(400).json({ error: "Message text is required." });
    }

    if (!API_KEY || !genAI) {
      console.warn("GEMINI_API_KEY not configured.");
      return res.status(503).json({ 
        error: "Gemini API is not configured on the server." 
      });
    }

    const formattedHistory = [];
    if (history && Array.isArray(history)) {
      for (const msg of history) {
        if (msg.id === 'init') continue;
        if (msg.sender !== 'user' && msg.sender !== 'bot') continue;
        
        formattedHistory.push({
          role: msg.sender === 'bot' ? 'model' : 'user',
          parts: [{ text: msg.text }]
        });
      }
    }

    // Fetch live data from database
    let roomsText = "No rooms data available.";
    let packagesText = "No banquet packages available.";
    
    try {
      const rooms = await queryAsync("SELECT name, description, price, max_occupancy FROM rooms ORDER BY display_order ASC");
      if (rooms && rooms.length > 0) {
        roomsText = rooms.map(r => `- ${r.name}: LKR ${r.price}/night. ${r.max_occupancy ? 'Max guests: ' + r.max_occupancy + '. ' : ''}${r.description}`).join('\n');
      }
      
      const packages = await queryAsync("SELECT name, price, max_guests, highlights FROM banquet_packages ORDER BY display_order ASC");
      if (packages && packages.length > 0) {
        packagesText = packages.map(p => `- ${p.name}: LKR ${p.price}. ${p.max_guests ? 'Up to ' + p.max_guests + ' guests. ' : ''}${p.highlights ? 'Highlights: ' + p.highlights : ''}`).join('\n');
      }
    } catch (dbErr) {
      console.error("Failed to fetch live DB data for chatbot:", dbErr);
    }

    const dynamicSystemInstruction = `You are a helpful customer support concierge for Green Valley Resort in Sri Lanka. 
Your goal is to assist users with their inquiries politely and concisely based on the following real-time resort offerings.

Important Resort Information (Live Data):
--- ROOMS ---
${roomsText}

--- BANQUET PACKAGES ---
${packagesText}

--- POLICIES & INFO ---
- Check-in: 2:00 PM.
- Check-out: 11:00 AM.
- Booking: Users can book rooms via the Booking page or by contacting us.
- Support: For complex issues, tell the user to visit the Contact page.

Keep your answers friendly, short, and to the point. Suggest that users visit our specific pages (like Rooms, Banquet, Contact, or Booking) when relevant.
Do NOT output any markdown specifically formatting complex UI components unless asked.
Keep the tone welcoming and professional.`;

    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.5-flash", 
      systemInstruction: dynamicSystemInstruction 
    });

    const chatSession = model.startChat({
      history: formattedHistory,
    });

    const result = await chatSession.sendMessage(text);
    const responseText = result.response.text();

    return res.json({ response: responseText });

  } catch (error) {
    console.error("Gemini Chat Error:", error);
    res.status(500).json({ error: "Failed to process chat message." });
  }
};
