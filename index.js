const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

const responses = {
  moe: {
    responses: [
      "Ik begrijp dat je moe bent. Je lichaam werkt hard tijdens je cyclus.",
      "Vermoeidheid is een teken dat je mag vertragen. Neem de tijd voor jezelf.",
      "Je energie is kostbaar, wees lief voor jezelf vandaag."
    ],
    affirmations: [
      "Ik geef mezelf toestemming om te rusten en mijn energie aan te vullen.",
      "Mijn lichaam verdient liefde en zorg, ik luister naar mijn behoeften.",
      "Rust is geen zwakte, het is zelfliefde."
    ],
    suggestions: [
      "Neem een rustmoment met een warme kruik op je buik.",
      "Drink een kopje kruidenthee en adem diep in en uit.",
      "Gun jezelf 10 minuten zonder schermen om volledig te ontspannen."
    ],
    actions: [
      "Doe een korte ontspanningsmeditatie van 5 minuten.",
      "Ga liggen in een comfortabele houding en focus op je ademhaling.",
      "Strek je lichaam zachtjes om spanning los te laten."
    ]
  },
  pijn: {
    responses: [
      "Pijn is zwaar om te dragen. Luister goed naar je lichaam en wees zacht voor jezelf.",
      "Menstruatiepijn is echt, en jij verdient extra zorg en rust.",
      "Het is oké om een stapje terug te doen. Jouw welzijn komt op de eerste plaats."
    ],
    affirmations: [
      "Mijn lichaam weet hoe het moet genezen, en ik steun het met liefde.",
      "Ik ben krachtig, zelfs als ik pijn ervaar.",
      "Mijn lichaam en ik zijn een team, en ik geef het de zorg die het nodig heeft."
    ],
    suggestions: [
      "Probeer een lichte buikmassage met warme olie.",
      "Neem een warm bad met magnesiumzout om je spieren te ontspannen.",
      "Leg een warme kruik op je buik en adem diep in en uit."
    ],
    actions: [
      "Ga liggen in de ‘child’s pose’ om je onderrug te ontspannen.",
      "Doe een zachte buikmassage met ronddraaiende bewegingen.",
      "Probeer een ademhalingsoefening: 4 seconden inademen, 6 seconden uitademen."
    ]
  }
};

const defaultResponses = {
  responses: [
    "Ik hoor je. Alles wat je voelt, mag er zijn. Geef jezelf toestemming om je emoties te voelen.",
    "Soms zijn gevoelens moeilijk onder woorden te brengen, en dat is helemaal oké. Ik ben hier om je te ondersteunen.",
    "Het is prima om niet precies te weten hoe je je voelt. We nemen dit samen stap voor stap."
  ],
  affirmations: [
    "Mijn lichaam en geest werken samen in harmonie.",
    "Ik ben zacht voor mezelf en omarm mijn gevoelens.",
    "Ik ben precies waar ik moet zijn en alles verloopt in het juiste ritme."
  ],
  suggestions: [
    "Neem een moment om diep adem te halen en jezelf een knuffel te geven.",
    "Schrijf een paar woorden op over hoe je je voelt, zonder oordeel.",
    "Luister naar een rustgevende melodie en laat je gedachten even los."
  ],
  actions: [
    "Doe drie diepe ademhalingen met je handen op je onderbuik.",
    "Sluit je ogen en voel waar in je lichaam je spanning vasthoudt.",
    "Maak een korte wandeling om frisse lucht te krijgen en je hoofd leeg te maken."
  ]
};

app.post("/api/affirmations", (req, res) => {
  const { feeling } = req.body;
  
  const match = Object.keys(responses).find(key => feeling.toLowerCase().includes(key));
  
  if (!match) {
    return res.json({
      response: defaultResponses.responses[Math.floor(Math.random() * defaultResponses.responses.length)],
      affirmation: defaultResponses.affirmations[Math.floor(Math.random() * defaultResponses.affirmations.length)],
      suggestion: defaultResponses.suggestions[Math.floor(Math.random() * defaultResponses.suggestions.length)],
      action: defaultResponses.actions[Math.floor(Math.random() * defaultResponses.actions.length)]
    });
  }

  const data = responses[match];

  res.json({
    response: data.responses[Math.floor(Math.random() * data.responses.length)],
    affirmation: data.affirmations[Math.floor(Math.random() * data.affirmations.length)],
    suggestion: data.suggestions[Math.floor(Math.random() * data.suggestions.length)],
    action: data.actions[Math.floor(Math.random() * data.actions.length)]
  });
});

app.listen(PORT, () => {
  console.log(`Server draait op poort ${PORT}`);
});
