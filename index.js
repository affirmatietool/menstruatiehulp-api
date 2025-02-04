const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

const responses = [
  { feeling: "moe", response: "Het is begrijpelijk dat je moe bent. Je lichaam werkt hard tijdens je cyclus.", affirmation: "Ik geef mezelf toestemming om te rusten en mijn energie aan te vullen.", suggestion: "Neem een rustmoment met een warme kruik op je buik.", action: "Doe een korte ontspanningsmeditatie van 5 minuten." },
  { feeling: "pijn", response: "Pijn is zwaar om te dragen. Luister goed naar je lichaam en wees zacht voor jezelf.", affirmation: "Mijn lichaam weet hoe het moet genezen, en ik steun het met liefde.", suggestion: "Probeer een lichte buikmassage met warme olie.", action: "Ga liggen in de ‘child’s pose’ om je onderrug te ontspannen." },
  { feeling: "onzeker", response: "Onzekerheid mag er zijn, maar het definieert jou niet.", affirmation: "Ik ben prachtig en waardevol zoals ik ben.", suggestion: "Zet een zachte, rustgevende muziek op en schrijf drie dingen op die je mooi vindt aan jezelf.", action: "Sta voor de spiegel en zeg deze positieve dingen hardop tegen jezelf." }
];

app.post("/api/affirmations", (req, res) => {
  const { feeling } = req.body;
  
  const match = responses.find(r => feeling.toLowerCase().includes(r.feeling));
  
  if (!match) {
    return res.json({
      response: "Ik hoor je. Alles wat je voelt, mag er zijn. Geef jezelf toestemming om je emoties te voelen.",
      affirmation: "Mijn lichaam en geest werken samen in harmonie.",
      suggestion: "Neem een moment om diep adem te halen en jezelf een knuffel te geven.",
      action: "Doe drie diepe ademhalingen met je handen op je onderbuik."
    });
  }

  res.json({
    response: match.response,
    affirmation: match.affirmation,
    suggestion: match.suggestion,
    action: match.action
  });
});

app.listen(PORT, () => {
  console.log(`Server draait op poort ${PORT}`);
});
