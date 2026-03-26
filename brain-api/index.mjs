import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const context = JSON.parse(readFileSync(path.join(__dirname, "brain-context.json"), "utf8"));

function response(statusCode, body) {
  return {
    statusCode,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  };
}

function extractOutputText(payload) {
  if (typeof payload?.output_text === "string" && payload.output_text.trim()) {
    return payload.output_text.trim();
  }

  const segments = [];
  for (const outputItem of payload?.output || []) {
    for (const contentItem of outputItem?.content || []) {
      if (typeof contentItem?.text === "string" && contentItem.text.trim()) {
        segments.push(contentItem.text.trim());
      }
    }
  }

  return segments.join("\n\n").trim();
}

function buildSystemPrompt() {
  return [
    `You are the live portfolio brain for ${context.profile.name}.`,
    ...context.rules,
    "",
    "Portfolio context:",
    JSON.stringify(context, null, 2),
  ].join("\n");
}

function buildUserPrompt({ question, mode, page, history }) {
  const recentHistory = Array.isArray(history)
    ? history
        .slice(-6)
        .map((item) => `${item.role === "assistant" ? "Portfolio brain" : "Visitor"}: ${item.text}`)
        .join("\n")
    : "";

  return [
    `Current visitor mode: ${mode || "unknown"}`,
    `Current page: ${page || "unknown"}`,
    recentHistory ? `Recent conversation:\n${recentHistory}` : "",
    `Latest user question: ${question}`,
  ]
    .filter(Boolean)
    .join("\n\n");
}

function bulletList(items) {
  return items.map((item) => `- ${item}`).join("\n");
}

function buildLocalFallback(question) {
  const prompt = String(question || "").toLowerCase();
  const receiptPulse = context.projects.find((project) => project.name === "ReceiptPulse");
  const lumenStack = context.projects.find((project) => project.name === "LumenStack AI");

  if (
    prompt.includes("strongest project") ||
    prompt.includes("best project") ||
    prompt.includes("open first") ||
    prompt.includes("flagship")
  ) {
    return [
      `I would open ${receiptPulse.name} first.`,
      "",
      `It is my strongest proof of cloud and backend execution because it shows ${receiptPulse.proof.toLowerCase()}`,
      `Live: ${receiptPulse.live}`,
      `Repo: ${receiptPulse.repo}`,
    ].join("\n");
  }

  if (prompt.includes("aws") || prompt.includes("cloud")) {
    return [
      "My AWS-heavy work is centered around ReceiptPulse.",
      "",
      receiptPulse.proof,
      `Core stack: ${receiptPulse.stack.join(", ")}`,
      `Live: ${receiptPulse.live}`,
    ].join("\n");
  }

  if (prompt.includes("ai") || prompt.includes("codebase") || prompt.includes("diagram")) {
    return [
      "My strongest AI-focused project is LumenStack AI.",
      "",
      lumenStack.proof,
      `Core stack: ${lumenStack.stack.join(", ")}`,
      `Live: ${lumenStack.live}`,
    ].join("\n");
  }

  if (
    prompt.includes("role fit") ||
    prompt.includes("best role") ||
    prompt.includes("what role") ||
    prompt.includes("fit you")
  ) {
    return [
      "The roles that fit me best right now are:",
      bulletList(context.bestFit),
      "",
      "That is mainly because my strongest work combines AWS serverless systems, backend/API thinking, and product-style full-stack execution.",
    ].join("\n");
  }

  if (
    prompt.includes("learning") ||
    prompt.includes("build next") ||
    prompt.includes("planning") ||
    prompt.includes("next")
  ) {
    return [
      "Right now I am focused on:",
      bulletList(context.currentFocus),
      "",
      "The next things I want to build are:",
      bulletList(context.futureIdeas),
    ].join("\n");
  }

  if (prompt.includes("contact") || prompt.includes("reach") || prompt.includes("email")) {
    return [
      "You can reach me here:",
      `Email: ${context.profile.email}`,
      `GitHub: ${context.profile.github}`,
      `LinkedIn: ${context.profile.linkedin}`,
    ].join("\n");
  }

  return [
    `I build cloud systems, AI tools, and full-stack products.`,
    "",
    "The two strongest projects on this portfolio are:",
    `- ${receiptPulse.name}: ${receiptPulse.proof}`,
    `- ${lumenStack.name}: ${lumenStack.proof}`,
    "",
    "If you want, ask me about AWS work, AI projects, role fit, or what I am planning to build next.",
  ].join("\n");
}

function extractQuestionFromEvent(event) {
  try {
    const payload = JSON.parse(event?.body || "{}");
    return String(payload.question || "").trim();
  } catch {
    return "";
  }
}

export async function handler(event) {
  if (event?.requestContext?.http?.method === "OPTIONS" || event?.httpMethod === "OPTIONS") {
    return response(204, {});
  }

  try {
    const payload = JSON.parse(event?.body || "{}");
    const question = String(payload.question || "").trim();

    if (!question) {
      return response(400, { error: "Question is required." });
    }

    if (!process.env.OPENAI_API_KEY) {
      return response(
        200,
        {
          reply: buildLocalFallback(question),
          source: "local-fallback",
        }
      );
    }

    const openaiResponse = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || "gpt-5-mini",
        reasoning: {
          effort: "low",
        },
        max_output_tokens: 320,
        input: [
          {
            role: "developer",
            content: [
              {
                type: "input_text",
                text: buildSystemPrompt(),
              },
            ],
          },
          {
            role: "user",
            content: [
              {
                type: "input_text",
                text: buildUserPrompt(payload),
              },
            ],
          },
        ],
      }),
    });

    if (!openaiResponse.ok) {
      const errorText = await openaiResponse.text();
      console.warn("OpenAI portfolio brain fallback:", errorText.slice(0, 300));
      return response(
        200,
        {
          reply: buildLocalFallback(question),
          source: "local-fallback",
        }
      );
    }

    const result = await openaiResponse.json();
    const reply = extractOutputText(result);

    return response(
      200,
      {
        reply: reply || "I could not generate a useful answer from the portfolio context.",
        model: process.env.OPENAI_MODEL || "gpt-5-mini",
        source: "openai-responses-api",
      }
    );
  } catch (error) {
    console.warn("Portfolio brain fallback error:", error instanceof Error ? error.message : "Unknown error");
    return response(
      200,
      {
        reply: buildLocalFallback(extractQuestionFromEvent(event)),
        source: "local-fallback",
      }
    );
  }
}
