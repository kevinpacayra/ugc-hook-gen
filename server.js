const dotenv = require("dotenv");
const result = dotenv.config();
console.log("Dotenv loaded, parsed keys:", Object.keys(result.parsed || {}));

const express = require("express");
const cors = require("cors");
const Anthropic = require("@anthropic-ai/sdk");

const app = express();

console.log("API Key available:", !!process.env.ANTHROPIC_API_KEY);
const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

// Retry logic
async function callClaudeWithRetry(prompt, maxRetries = 3) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const message = await client.messages.create({
        model: "claude-opus-4-6",
        max_tokens: 1024,
        messages: [{ role: "user", content: prompt }],
      });
      return message.content[0].text;
    } catch (error) {
      if (attempt === maxRetries) throw error;
      const delay = Math.pow(2, attempt - 1) * 1000; // Exponential backoff
      console.log(`Retry attempt ${attempt}/${maxRetries} after ${delay}ms`);
      await new Promise((res) => setTimeout(res, delay));
    }
  }
}

// API endpoint: Get angle samples
app.post("/api/angle-samples", async (req, res) => {
  const { productName, productDescription, targetAudience } = req.body;

  if (!productName || !productDescription) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const prompt = `You are a UGC advertising expert specializing in scroll-stopping hooks. For this product, create ONE compelling hook sample for each of these 5 creative angles. Make them authentic, specific, and proven to work on social media.

Product: ${productName}
Description: ${productDescription}
Target Audience: ${targetAudience || "General audiences"}

Format EXACTLY like this (one hook per line):
PROBLEM-FOCUSED: [hook text here]
BENEFIT-FOCUSED: [hook text here]
CURIOSITY: [hook text here]
OBJECTION-HANDLING: [hook text here]
COMPARISON: [hook text here]

Requirements for each hook:
- 5-15 words only
- Conversational, like a friend talking
- No product name
- Creates immediate interest
- Proven patterns from TikTok/Instagram

Make them SPECIFIC to the product, not generic.`;

    const hooksText = await callClaudeWithRetry(prompt);
    const angles = {};

    hooksText.split("\n").forEach((line) => {
      if (line.includes("PROBLEM-FOCUSED:")) {
        angles.problemFocused = line.split(":")[1]?.trim() || "I was struggling until I found this";
      } else if (line.includes("BENEFIT-FOCUSED:")) {
        angles.benefitFocused = line.split(":")[1]?.trim() || "This changed everything for me";
      } else if (line.includes("CURIOSITY:")) {
        angles.curiosity = line.split(":")[1]?.trim() || "Wait, how does this actually work?";
      } else if (line.includes("OBJECTION-HANDLING:")) {
        angles.objectionHandling = line.split(":")[1]?.trim() || "I was skeptical at first, but...";
      } else if (line.includes("COMPARISON:")) {
        angles.comparison = line.split(":")[1]?.trim() || "Better than the expensive alternative";
      }
    });

    res.json({ angles });
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ error: "Failed to generate samples. Please try again." });
  }
});

// API endpoint: Generate hooks for a specific angle
app.post("/api/generate-hooks", async (req, res) => {
  const { productName, productDescription, targetAudience, angle } = req.body;

  if (!productName || !productDescription || !angle) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const angleGuides = {
      problemFocused: {
        description: "hooks that start with a relatable pain point or frustration",
        examples:
          '"I was wasting 2 hours daily until..." / "The biggest mistake I was making..." / "Nobody talks about how..."',
      },
      benefitFocused: {
        description: "hooks that highlight transformation and concrete benefits",
        examples:
          '"I went from X to Y in just..." / "This one thing gave me back..." / "My productivity went 3x after..."',
      },
      curiosity: {
        description: "hooks that create intrigue and make people NEED to know more",
        examples:
          '"Wait, how is this even possible?" / "This should be illegal..." / "I did not expect this to work..."',
      },
      objectionHandling: {
        description: "hooks that address common doubts and build credibility",
        examples:
          '"I thought it was a scam until..." / "Worth the investment? Absolutely..." / "The quality is insane for the price..."',
      },
      comparison: {
        description: "hooks that compare to alternatives and show superiority",
        examples:
          '"Better than the $200 version..." / "I tried 5 competitors, this one wins..." / "This saves me money vs..."',
      },
    };

    const guide = angleGuides[angle] || angleGuides.problemFocused;

    const prompt = `You are a world-class UGC copywriter. Generate exactly 8 scroll-stopping hooks using the ${guide.description} angle.

Product: ${productName}
Details: ${productDescription}
Audience: ${targetAudience || "General"}

Angle Style: ${guide.description}
Example patterns: ${guide.examples}

CRITICAL REQUIREMENTS:
1. Each hook is 5-15 words MAX
2. First 2-3 words must grab attention (no fluffy openers)
3. Sound like a real person, not marketing
4. Never mention the product name
5. Specific to THIS product (not generic)
6. All 8 should use the SAME angle approach
7. Vary sentence structure but keep theme consistent
8. Make viewers stop scrolling immediately

Return ONLY the 8 hooks, one per line, numbered 1-8. No explanations, no extra text.`;

    const hooksText = await callClaudeWithRetry(prompt);
    const hooks = hooksText
      .split("\n")
      .filter((line) => line.trim().length > 0)
      .slice(0, 8);

    res.json({ hooks, angle });
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ error: "Failed to generate hooks. Please try again." });
  }
});

// API endpoint: Generate full script from a hook
app.post("/api/generate-script", async (req, res) => {
  const { productName, productDescription, hook, targetAudience } = req.body;

  if (!productName || !productDescription || !hook) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const prompt = `You are a UGC script expert. Turn this hook into a complete, filmable 15-30 second UGC video script.

Hook: "${hook}"
Product: ${productName}
Details: ${productDescription}
Audience: ${targetAudience || "General"}

Write the script in 4 clear sections with timing:

HOOK (0-3 sec): Deliver the hook naturally. Make it compelling and authentic.

PROBLEM (3-8 sec): Briefly establish why this matters. Keep it real, not preachy.

SOLUTION (8-15 sec): Show the product and explain the benefit. Demonstrate, don't lecture.

CTA (15-30 sec): Natural call-to-action. Examples: "Link in bio" / "Check the description" / "Try it for yourself"

STYLE GUIDELINES:
- Write like a real person speaking, not reading a script
- Use contractions (I'm, don't, it's)
- Short, punchy sentences
- Show > tell
- Assume sound is ON (use audio cues if relevant)
- End with confidence, not desperation

Make it FILMABLE by a real creator in one take.`;

    const scriptText = await callClaudeWithRetry(prompt);
    res.json({ script: scriptText });
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ error: "Failed to generate script. Please try again." });
  }
});

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "Server is running" });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`\nServer running on http://localhost:${PORT}`);
});
