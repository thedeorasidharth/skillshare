const OpenAI = require('openai');
const fs = require('fs');
const path = require('path');

const openai = process.env.OPENAI_API_KEY ? new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
}) : null;

// Load global dataset
const skillsDataPath = path.join(__dirname, '../data/skills.json');
let allSkills = [];
try {
    allSkills = JSON.parse(fs.readFileSync(skillsDataPath, 'utf-8'));
} catch (e) {
    console.error("Error loading skills dataset for AI controller");
}

exports.suggestSkills = async (req, res) => {
  try {
    const { skill } = req.body;
    
    if (!skill) {
      return res.status(400).json({ success: false, message: 'Skill input is required', data: null });
    }

    // 1. Check local dataset first for high-fidelity matches
    const localMatch = allSkills.find(s => 
        s.name.toLowerCase() === skill.toLowerCase() || 
        s.id.toLowerCase() === skill.toLowerCase()
    );

    let localRelated = localMatch ? localMatch.related : [];

    // 2. Fallback or Enhance with AI
    if (!process.env.OPENAI_API_KEY || !req.dbConnected) {
      // Mock / Local logic enhancement
      const defaultSuggestions = ["Web Development", "Software Engineering", "Product Design"];
      const suggestions = localRelated.length > 0 ? localRelated : defaultSuggestions;
      
      return res.json({
        success: true,
        message: localRelated.length > 0 ? 'Skills curated from SwapSkill Directory' : 'Mock skill suggestions fetched',
        data: { suggestions: suggestions.slice(0, 5) }
      });
    }

    // Call OpenAI API
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are a helpful assistant that suggests 3 complementary skills for someone looking to learn or teach a specific subject. Reply with a comma separated list of the 3 skills." },
        { role: "user", content: `I have a skill: ${skill}. What are 3 related skills?` }
      ],
      max_tokens: 50
    });

    const suggestionsRes = response.choices[0].message.content;
    const suggestions = suggestionsRes.split(',').map(s => s.trim());

    res.json({
      success: true,
      message: 'AI skill suggestions fetched',
      data: { suggestions }
    });
  } catch (error) {
    console.error('OpenAI Error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch AI suggestions', data: null });
  }
};
