

const fetch = (...args) => import("node-fetch").then(({ default: fetch }) => fetch(...args));

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";

const generateItinerary = async ({ city, days, budget, travelers, tripType, interests, subDestinations }) => {
  const placesList = subDestinations.map((p) => p.name).join(", ");
  const interestsList = interests.length > 0 ? interests.join(", ") : "general sightseeing";

  const prompt = `
You are a travel planning expert. Generate a detailed ${days}-day travel itinerary for ${city}, India.

Trip Details:
- City: ${city}
- Number of days: ${days}
- Total budget: ₹${budget} for ${travelers} traveler(s)
- Trip type: ${tripType}
- Interests: ${interestsList}
- Available places to visit: ${placesList}

Rules:
1. Use ONLY the places listed above.
2. Spread places across all ${days} days logically.
3. Each day must have morning, afternoon, and evening activities.
4. Include estimated time at each place.
5. Add a short travel tip for each day.

Respond ONLY with a valid JSON array. No explanation, no markdown, no backticks.
Format exactly like this:
[
  {
    "day": 1,
    "title": "Day title here",
    "tip": "One travel tip for this day",
    "morning": {
      "place": "Place name",
      "activity": "What to do here",
      "duration": "2 hours",
      "estimatedCost": 100
    },
    "afternoon": {
      "place": "Place name",
      "activity": "What to do here",
      "duration": "2 hours",
      "estimatedCost": 50
    },
    "evening": {
      "place": "Place name",
      "activity": "What to do here",
      "duration": "1.5 hours",
      "estimatedCost": 0
    }
  }
]`;

  const response = await fetch(GROQ_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",   // free model on Groq
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 2048,
    }),
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err?.error?.message || "Groq API call failed");
  }

  const data = await response.json();
  const raw = data?.choices?.[0]?.message?.content;

  if (!raw) throw new Error("No response from Groq");

  // Clean markdown if present
  const cleaned = raw.replace(/```json|```/g, "").trim();

  try {
    return JSON.parse(cleaned);
  } catch (e) {
    throw new Error("AI returned invalid JSON. Please try again.");
  }
};

module.exports = { generateItinerary };