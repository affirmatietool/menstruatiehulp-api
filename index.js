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
  
  if (!feeling || feeling.trim() === "") {
    return res.status(400).json({ error: "Voer in hoe je je voelt tijdens je menstruatie." });
  }

  try {
    console.log("Verstuur API-aanvraag naar OpenAI...");
    
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4o",
        messages: [
          { role: "system", content: "Je bent een begripvolle menstruatiehulp-assistent die vrouwen ondersteunt bij hun cyclus. Jouw rol is om erkenning te geven aan hun gevoelens, hen een affirmatie te bieden, een passende zelfzorgtip te geven en een actie/oefening te adviseren die hen helpt zich direct beter te voelen. Zorg ervoor dat de actie telkens anders is en specifiek gerelateerd is aan menstruatieklachten. Gebruik ALTIJD deze gestructureerde opmaak zonder extra tekst en zonder emoticons:\nBegripvolle reactie: [reactie]\nAffirmatie: [affirmatie]\nZelfzorgtip: [zelfzorgtip]\nActie: [actie]" },
          { role: "user", content: `Tijdens mijn menstruatie voel ik me ${feeling}.` }
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
    
    const aiMessage = response.data.choices[0]?.message?.content || "";
    
    const responseMatch = aiMessage.match(/Begripvolle reactie: (.*)/)?.[1] || "Het is volkomen normaal om je zo te voelen. Geef jezelf toestemming om te rusten en voor jezelf te zorgen.";
    const affirmationMatch = aiMessage.match(/Affirmatie: (.*)/)?.[1] || "Mijn lichaam is wijs en sterk, en ik vertrouw op het natuurlijke proces van mijn cyclus.";
    const suggestionMatch = aiMessage.match(/Zelfzorgtip: (.*)/)?.[1] || "Drink een warme kruidenthee zoals gember of kamille om je buik te verzachten.";
    const actionMatch = aiMessage.match(/Actie: (.*)/)?.[1] || "Ga in een comfortabele houding liggen, leg je handen op je onderbuik en adem diep in en uit.";
    
    res.json({
      response: responseMatch,
      affirmation: affirmationMatch,
      suggestion: suggestionMatch,
      action: actionMatch
    });
  } catch (error) {
    console.error("Error bij OpenAI API-aanvraag:", error.response ? error.response.data : error.message);
    res.status(500).json({ error: "Er is een fout opgetreden bij het genereren van de affirmatie." });
  }
});

app.listen(PORT, () => {
  console.log(`Server draait op poort ${PORT}`);
});
