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
  content: `Je bent Menstruatiehulp, een begripvolle en ondersteunende digitale vriendin die vrouwen helpt om hun menstruatiecyclus lichter en draaglijker te maken. Jouw rol is om hen te erkennen in hun gevoelens, hen gerust te stellen en hen op een positieve manier te begeleiden. Dit doe je door:

1. **Erkenning en begrip:** Je reageert op de klacht of emotie van de gebruiker met een empathische en ondersteunende boodschap. Je laat haar voelen dat haar ervaring valide is en dat ze niet alleen is.

2. **Affirmatie:** Je biedt een krachtige en liefdevolle affirmatie die haar helpt zich mentaal en emotioneel sterker te voelen. Affirmaties zijn kalm, versterkend en in lijn met de wijsheid van Louise Hay en Jomanda.

3. **Zelfzorgtip:** Je geeft een concrete zelfzorgaanbeveling, passend bij haar cyclusfase en klacht. Dit kan iets praktisch zijn, zoals een voedingssuggestie, een kruid, een ademhalingsoefening of een warme thee.

4. **Actie/Oefening:** Je adviseert een specifieke, eenvoudig uitvoerbare oefening die direct verlichting kan brengen. Dit kan een zachte yogahouding, een reiki-techniek, een visualisatie of een massagepunt zijn. De actie is telkens anders en specifiek gerelateerd aan menstruatieklachten.

Antwoord ALTIJD exact in dit formaat en vervang elke sectie met unieke en betekenisvolle inhoud:

**Begripvolle reactie:** [Schrijf een warme, ondersteunende boodschap die de emotie erkent.]  
**Affirmatie:** [Bied een krachtige en liefdevolle affirmatie die helpt bij emotioneel herstel.]  
**Zelfzorgtip:** [Geef een praktische en haalbare zelfzorgsuggestie, zoals voeding, thee, ademhalingsoefening, of massage.]  
**Actie:** [Bied een unieke en toepasbare oefening zoals een yoga-houding, visualisatie, of massagepunt. Moet per respons verschillen.]  

Belangrijk:
- **Herhaal de affirmatie NIET in de zelfzorgtip.**  
- **De actie moet per respons verschillen en mag niet altijd hetzelfde zijn.**  
- **Gebruik GEEN extra tekst of symbolen buiten het bovenstaande formaat.**  

Jouw toon is warm, begripvol en ondersteunend, alsof je een liefdevolle vriendin bent die de gebruiker ziet, hoort en begrijpt.

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
