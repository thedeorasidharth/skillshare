const fs = require('fs');
const path = require('path');

const skillsDataPath = path.join(__dirname, '../data/skills.json');

// Helper to Load Dataset
const loadSkills = () => {
    try {
        const data = fs.readFileSync(skillsDataPath, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        console.error('Error loading skills data:', err);
        return [];
    }
};

const allSkills = loadSkills();

// @desc    Get popular skills for starter exploration
exports.getPopularSkills = (req, res) => {
    try {
        // Trending + Popular mix
        const trending = allSkills.filter(s => s.trending).slice(0, 6);
        const popular = allSkills
            .filter(s => s.popularity >= 8 && !s.trending)
            .sort((a, b) => b.popularity - a.popularity)
            .slice(0, 6);

        res.json({
            success: true,
            message: 'Curated starter skills fetched',
            data: [...trending, ...popular]
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error fetching skills' });
    }
};

// @desc    Smart Suggestion Engine (The core logic)
exports.smartSuggestSkills = (req, res) => {
    try {
        const { selectedSkills = [] } = req.body;
        const normalizedSelected = selectedSkills.map(s => s.toLowerCase());

        // Case 1: No skills selected
        if (normalizedSelected.length === 0) {
            const starter = [
                ...allSkills.filter(s => s.trending).slice(0, 4),
                ...allSkills.filter(s => s.popularity >= 9).slice(0, 4)
            ];
            // Shuffle a bit to feel dynamic
            return res.json({ success: true, data: starter.sort(() => 0.5 - Math.random()).slice(0, 8) });
        }

        // Case 2 & 3: Selection exists
        // Scoring model: score = common_relations + category_match_weight + popularity_weight
        const CAT_WEIGHT = 2.0;
        const POP_WEIGHT = 0.5;

        const selectedObjects = allSkills.filter(s => normalizedSelected.includes(s.name.toLowerCase()));
        const selectedCategories = [...new Set(selectedObjects.map(s => s.category))];
        const allRelatedNames = selectedObjects.flatMap(s => s.related);

        const candidates = allSkills.filter(s => !normalizedSelected.includes(s.name.toLowerCase()));

        const scoredCandidates = candidates.map(skill => {
            let score = 0;

            // 1. Common relations
            const relationMatch = allRelatedNames.filter(name => name.toLowerCase() === skill.name.toLowerCase()).length;
            score += relationMatch * 3.0; // Strong weight for direct relations

            // 2. Category match
            if (selectedCategories.includes(skill.category)) {
                score += CAT_WEIGHT;
            }

            // 3. Popularity weight
            score += (skill.popularity / 10) * POP_WEIGHT;

            // 4. Trending bonus
            if (skill.trending) score += 1.0;

            return { ...skill, score };
        });

        const sortedSuggestions = scoredCandidates
            .filter(s => s.score > 0)
            .sort((a, b) => b.score - a.score)
            .slice(0, 12);

        res.json({
            success: true,
            data: sortedSuggestions,
            message: `Smart recommendations based on ${selectedSkills.length} selection(s)`
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Recommendation engine error' });
    }
};

// @desc    Get related skills (Legacy support or simple drill-down)
exports.getRelatedSkills = (req, res) => {
    try {
        const { skill } = req.query;
        if (!skill) return res.status(400).json({ success: false, message: 'Skill identifier required' });

        const skillObj = allSkills.find(s => s.name.toLowerCase() === skill.toLowerCase());
        if (!skillObj) return res.json({ success: true, data: [] });

        const related = allSkills.filter(s => 
            skillObj.related.includes(s.name) || 
            (s.category === skillObj.category && s.name !== skillObj.name)
        ).slice(0, 8);

        res.json({ success: true, data: related });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error processing relations' });
    }
};

const { keywordMap } = require('../utils/skillKeywords');
const { fuzzyMatch } = require('../utils/fuzzySearch');

// @desc    Search skills in the dataset with keyword expansion and fuzzy matching
exports.searchSkills = (req, res) => {
    try {
        const { query } = req.body;
        if (!query) return res.json({ success: true, data: [] });

        const lowerQuery = query.toLowerCase();
        let expandedKeywords = [lowerQuery];

        // 1. Keyword Expansion
        if (keywordMap[lowerQuery]) {
            expandedKeywords.push(...keywordMap[lowerQuery]);
        }

        // 2. Filter with Fuzzy Match
        let results = allSkills.filter(skill => {
            const name = skill.name.toLowerCase();
            const category = skill.category.toLowerCase();

            return expandedKeywords.some(key =>
                fuzzyMatch(key, name) ||
                fuzzyMatch(key, category)
            );
        }).slice(0, 8);

        // 3. "Did you mean?" Suggestion Logic (Bonus)
        let suggestion = null;
        if (results.length === 0) {
            // Find a random popular skill or category as a fallback suggestion
            const fallback = allSkills.find(s => s.popularity >= 9 && !s.trending);
            suggestion = fallback ? fallback.name : "React";
            
            // Optionally provide some popular results even if search failed
            results = allSkills.filter(s => s.trending).slice(0, 4);
        }

        res.json({ 
            success: true, 
            data: results,
            suggestion: suggestion,
            isFallback: results.length > 0 && suggestion !== null
        });
    } catch (error) {
        console.error('Search Error:', error);
        res.status(500).json({ success: false, message: 'Search failure' });
    }
};
