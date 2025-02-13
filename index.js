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
          {
            role: "system",
            content: `Je bent Menstruatiehulp, een begripvolle en ondersteunende digitale vriendin die vrouwen helpt om hun menstruatiecyclus lichter en draaglijker te maken. Jouw rol is om hen te erkennen in hun gevoelens, hen gerust te stellen en hen op een positieve manier te begeleiden. 

Antwoord ALTIJD exact in dit formaat:

**Begripvolle reactie:** [Schrijf een warme, ondersteunende boodschap die de emotie erkent.]  
**Affirmatie:** [Bied een krachtige en liefdevolle affirmatie die helpt bij emotioneel herstel.]  
**Zelfzorgtip:** [Geef een praktische en haalbare zelfzorgsuggestie, zoals voeding, thee, ademhalingsoefening, of massage.]  
**Actie:** [Bied een unieke en toepasbare oefening zoals een yoga-houding, visualisatie, of massagepunt. Moet per respons verschillen.]  

De gebruiker zegt: "Tijdens mijn menstruatie voel ik me ${feeling}."`
          }
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

    // Extract correct information using regex
    const responseMatch = aiMessage.match(/\*\*Begripvolle reactie:\s*([\s\S]*?)\n(?=\*\*Affirmatie)/)?.[1]?.trim() 
      || "Het is volkomen normaal om je zo te voelen. Geef jezelf toestemming om te rusten en voor jezelf te zorgen.";

    const affirmationMatch = aiMessage.match(/\*\*Affirmatie:\s*([\s\S]*?)\n(?=\*\*Zelfzorgtip)/)?.[1]?.trim() 
      || "Mijn lichaam is wijs en sterk, en ik vertrouw op het natuurlijke proces van mijn cyclus.";

    const suggestionMatch = aiMessage.match(/\*\*Zelfzorgtip:\*\*\s*([\s\S]*?)\n(?=\*\*Actie)/)?.[1]?.trim() 
      || "Drink een warme kruidenthee zoals gember of kamille om je buik te verzachten.";

    const actionMatch = aiMessage.match(/\*\*Actie:\*\*\s*([\s\S]*)/)?.[1]?.trim() 
      || "Ga in een comfortabele houding liggen, leg je handen op je onderbuik en adem diep in en uit.";

    // Create properly formatted HTML response
    const formattedResponse = `
      <strong>✨ Jouw krachtboodschap:</strong><br><br>
      🫂 ${responseMatch}<br><br>
      🌿💖 <strong>Affirmatie:</strong> ${affirmationMatch}<br>
      ☕🫖 <strong>Zelfzorgtip:</strong> ${suggestionMatch}<br>
      🧘‍♀️🌀 <strong>Actie:</strong> ${actionMatch}
    `;

    res.json({ response: formattedResponse });

  } catch (error) {
    console.error("Error bij OpenAI API-aanvraag:", error.response ? error.response.data : error.message);
    res.status(500).json({ error: "Er is een fout opgetreden bij het genereren van de affirmatie." });
  }
});

app.listen(PORT, () => {
  console.log(`Server draait op poort ${PORT}`);
});
