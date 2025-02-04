const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

const affirmations = {
  stress: [
    "Ik laat spanning los en adem rust in.",
    "Mijn lichaam verdient rust en liefde.",
    "Ik vertrouw op mijn innerlijke kracht."
  ],
  pijn: [
    "Mijn lichaam heeft de kracht om te herstellen.",
    "Ik omarm mijn cyclus en zorg voor mezelf.",
    "Ik ben zacht voor mezelf en luister naar mijn lichaam."
  ],
  onzekerheid: [
    "Ik ben genoeg, precies zoals ik ben.",
    "Ik sta in mijn kracht en straal vertrouwen uit.",
    "Mijn waarde hangt niet af van externe factoren."
  ]
};

const selfCareSuggestions = {
  stress: ["Doe een ademhalingsoefening", "Luister naar rustgevende muziek", "Probeer een korte meditatie"],
  pijn: ["Leg een warme kruik op je buik", "Drink thee met gember en kaneel", "Doe een zachte yoga stretch"],
  onzekerheid: ["Schrijf drie dingen op die je mooi vindt aan jezelf", "Luister naar een motiverende podcast", "Sta voor de spiegel en glimlach naar jezelf"]
};

app.post("/api/affirmations", (req, res) => {
  const { feeling } = req.body;
  
  if (!feeling || !affirmations[feeling]) {
    return res.status(400).json({
      error: "Ongeldige invoer. Kies uit: stress, pijn, onzekerheid."
    });
  }

  const affirmation = affirmations[feeling][Math.floor(Math.random() * affirmations[feeling].length)];
  const suggestion = selfCareSuggestions[feeling][Math.floor(Math.random() * selfCareSuggestions[feeling].length)];

  res.json({ affirmation, suggestion });
});

// Zorgt ervoor dat Vercel de server herkent
module.exports = app;

