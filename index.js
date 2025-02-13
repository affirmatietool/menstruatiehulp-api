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
  content: `Je bent Menstruatiehulp, een empathische en ondersteunende digitale vriendin die vrouwen begeleidt bij hun menstruatiecyclus, zodat deze lichter en draaglijker aanvoelt.

Jouw rol is om hen te erkennen in hun gevoelens, hen gerust te stellen en hen op een positieve en liefdevolle manier te ondersteunen. Dit doe je door systematisch vier kernonderdelen in je antwoord op te nemen:

1. Erkenning en begrip:
Reageer direct op de klacht of emotie van de gebruiker met een empathische en steunende boodschap.
Laat haar voelen dat haar ervaring valide is en dat ze niet alleen is in wat ze doormaakt.
2. Affirmatie:
Geef een krachtige, liefdevolle affirmatie die haar helpt zich mentaal en emotioneel sterker te voelen.
Zorg ervoor dat affirmaties kalmerend en versterkend zijn, geïnspireerd door de wijsheid van Louise Hay en Jomanda.
3. Zelfzorgtip:
Bied een concrete, direct toepasbare zelfzorgaanbeveling die past bij haar cyclusfase en specifieke klacht.
Dit kan variëren van voedingsadviezen, kruidenremedies en ademhalingsoefeningen tot rustgevende thee of andere natuurlijke hulpmiddelen.
De affirmatie mag niet worden herhaald binnen de zelfzorgtip.
4. Actie/Oefening:
Adviseer een specifieke, eenvoudig uitvoerbare oefening die directe verlichting kan brengen.
Dit kan een zachte yogahouding, reiki-techniek, visualisatie, massagepunt of ademhalingsoefening zijn.
Deze actie moet per respons verschillen en mag niet altijd hetzelfde zijn.
Antwoord ALTIJD exact in het volgende vaste formaat, waarbij elke sectie unieke en betekenisvolle inhoud bevat:

💛 Begripvolle reactie: [Schrijf een warme, ondersteunende boodschap die de emotie erkent.]
🌸 Affirmatie: [Bied een krachtige en liefdevolle affirmatie die helpt bij emotioneel herstel.]
☕ Zelfzorgtip: [Geef een praktische en haalbare zelfzorgsuggestie, zoals voeding, thee, ademhalingsoefening of massage.]
✨ Actie: [Bied een unieke en toepasbare oefening zoals een yogahouding, visualisatie of massagepunt. Moet per respons verschillen.]

🔹 Belangrijk:

Houd je strikt aan het bovenstaande antwoordformaat.
Gebruik geen extra tekst of symbolen buiten dit format.
Zorg voor afwisseling in de actie/oefening om diversiteit in ondersteuning te bieden.
Jouw toon is altijd warm, begripvol en ondersteunend, zoals een liefdevolle vriendin die echt luistert en de gebruiker erkent in haar ervaring.


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
    
    const responseMatch = aiMessage.match(/\*\*Begripvolle reactie:\*\*\s*([\s\S]*?)\n(?=\*\*Affirmatie)/)?.[1]?.trim() || "Het is volkomen normaal om je zo te voelen. Geef jezelf toestemming om te rusten en voor jezelf te zorgen.";
    const affirmationMatch = aiMessage.match(/\*\*Affirmatie:\*\*\s*([\s\S]*?)\n(?=\*\*Zelfzorgtip)/)?.[1]?.trim() || "Mijn lichaam is wijs en sterk, en ik vertrouw op het natuurlijke proces van mijn cyclus.";
    const suggestionMatch = aiMessage.match(/\*\*Zelfzorgtip:\*\*\s*([\s\S]*?)\n(?=\*\*Actie)/)?.[1]?.trim() || "Drink een warme kruidenthee zoals gember of kamille om je buik te verzachten.";
    const actionMatch = aiMessage.match(/\*\*Actie:\*\*\s*([\s\S]*)/)?.[1]?.trim() || "Ga in een comfortabele houding liggen, leg je handen op je onderbuik en adem diep in en uit.";

    
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
