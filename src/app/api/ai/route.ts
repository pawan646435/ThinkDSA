// src/app/api/ai/route.ts
// API route for AI explanations with Firestore caching

import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/ai
 * 
 * Handles AI explanation requests with a cache-first strategy.
 * Flow: Check Firestore cache → If miss, call OpenAI → Store result → Return
 * 
 * STRICT: max_tokens = 150, controlled prompts only.
 */
export async function POST(request: NextRequest) {
  try {
    const { prompt, cacheKey } = await request.json();

    if (!prompt || !cacheKey) {
      return NextResponse.json(
        { error: "Missing prompt or cacheKey" },
        { status: 400 }
      );
    }

    // Check Firestore cache first
    let cachedResult: string | null = null;
    try {
      const { db } = await import("@/lib/firebase");
      const { doc, getDoc } = await import("firebase/firestore");
      const cacheRef = doc(db, "ai_cache", cacheKey);
      const cacheDoc = await getDoc(cacheRef);
      
      if (cacheDoc.exists()) {
        cachedResult = cacheDoc.data().text;
      }
    } catch {
      // Firebase not configured — skip cache, proceed without it
      console.warn("Firebase cache unavailable, proceeding without cache");
    }

    if (cachedResult) {
      return NextResponse.json({ text: cachedResult, cached: true });
    }

    // Call OpenAI API if cache miss
    const openaiKey = process.env.OPENAI_API_KEY;
    
    if (!openaiKey) {
      // Fallback: provide a generic helpful response when AI is not configured
      const fallbackText = generateFallbackResponse(prompt);
      return NextResponse.json({ text: fallbackText, cached: false });
    }

    const aiResponse = await fetch(
      "https://api.openai.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${openaiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content:
                "You are a helpful DSA tutor. Keep explanations concise, clear, and beginner-friendly.",
            },
            { role: "user", content: prompt },
          ],
          max_tokens: 150,
          temperature: 0.7,
        }),
      }
    );

    if (!aiResponse.ok) {
      throw new Error("OpenAI API request failed");
    }

    const aiData = await aiResponse.json();
    const text = aiData.choices[0]?.message?.content || "No response generated.";

    // Store in Firestore cache
    try {
      const { db } = await import("@/lib/firebase");
      const { doc, setDoc } = await import("firebase/firestore");
      const cacheRef = doc(db, "ai_cache", cacheKey);
      await setDoc(cacheRef, {
        text,
        prompt,
        createdAt: new Date().toISOString(),
      });
    } catch {
      // Cache write failure is non-critical
      console.warn("Failed to write to Firestore cache");
    }

    return NextResponse.json({ text, cached: false });
  } catch (error) {
    console.error("AI API error:", error);
    return NextResponse.json(
      { error: "Failed to generate AI response" },
      { status: 500 }
    );
  }
}

/**
 * Generates a helpful fallback response when AI APIs are not configured.
 * This ensures the app still functions without API keys.
 */
function generateFallbackResponse(prompt: string): string {
  const lower = prompt.toLowerCase();

  if (lower.includes("explain") && lower.includes("simple")) {
    const topic = lower.replace(/explain|simple|terms|in|under|100|words|with|one|example/gi, "").trim();
    return `${topic} is a fundamental concept in computer science. To learn more, check out the detailed explanation in our learning module above, or explore resources like GeeksforGeeks and LeetCode.`;
  }

  if (lower.includes("hint")) {
    return "Think about what data structure would be most efficient here. Consider the time complexity requirements and try breaking the problem into smaller sub-problems.";
  }

  return "This is a great topic to explore! Check out the learning modules above for detailed explanations, visualizations, and practice problems.";
}
