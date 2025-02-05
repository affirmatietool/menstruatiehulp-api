const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const axios = require("axios");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

app.post("/api/affirmations", async (req, res) => {
  const { feeling } = req.body;
  
  if (!feeling) {
    return res.status(400).json({ error: "Voer een emotie of gevoel in." });
  }

  try {
    console.log("Verstuur API-aanvraag naar OpenAI...");
    
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4o",
        messages: [
          { role: "system", content: "Je bent een begripvolle affirmatie-assistent die reageert als een ondersteunende vriendin, geïnspireerd door Louise L. Hay en Jomanda. Geef altijd een begripvolle reactie, een krachtige affirmatie, een praktische zelfzorgtip en een actie/oefening." },
          { role: "user", content: `Ik voel me ${feeling}.` }
        ],
        temperature: 0.7
      },
      {
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );
    
    console.log("OpenAI Response:", response.data);
    
    const aiResponse = response.data.choices[0].message.content.split("\n");
    
    res.json({
      response: aiResponse[0] || "Ik hoor je. Alles wat je voelt, mag er zijn. Geef jezelf toestemming om je emoties te voelen.",
      affirmation: aiResponse[1] || "Mijn lichaam en geest werken samen in harmonie.",
      suggestion: aiResponse[2] || "Neem een moment om diep adem te halen en jezelf een knuffel te geven.",
      action: aiResponse[3] || "Doe drie diepe ademhalingen met je handen op je onderbuik."
    });
  } catch (error) {
    console.error("Error bij OpenAI API-aanvraag:", error.response ? error.response.data : error.message);
    res.status(500).json({ error: "Er is een fout opgetreden bij het genereren van de affirmatie." });
  }
});

app.listen(PORT, () => {
  console.log(`Server draait op poort ${PORT}`);
});
