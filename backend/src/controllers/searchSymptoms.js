import Symptom from "../models/symptomsModel.js";

export const searchSymptom = async (req, res) => {
  const { q } = req.query;
  
  if (!q) {
    return res.status(400).json({ error: "Search query is required" });
  }
  
  try {
    const symptoms = await Symptom.find({
      $or: [
        { fullName: { $regex: q, $options: 'i' } },
        { howDoYouFeeling: { $regex: q, $options: 'i' } },
      ]
    }).limit(10);
    
    console.log(`Search for "${q}" returned ${symptoms.length} results`);
    res.json(symptoms);
  } catch (err) {
    console.error("Search error:", err);
    res.status(500).json({ error: "Server Error", details: err.message });
  }
};

export const getSymptomModel = async (req, res) => {
  try {
    const sample = await Symptom.findOne().lean();
    
    if (!sample) {
      return res.json({ message: "No symptoms found in database" });
    }
    const fields = Object.keys(sample).filter(key => key !== '_id' && key !== '__v');
    
    res.json({
      message: "Symptom model fields",
      fields,
      sampleData: sample
    });
  } catch (err) {
    console.error("Error getting model schema:", err);
    res.status(500).json({ error: "Server Error" });
  }
};
