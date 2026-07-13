// Função serverless: a chave da API fica AQUI (no servidor), nunca no navegador.
// Também aplica cache de prompt: o system prompt repetido custa ~10% nas próximas chamadas.

export default async (request) => {
  if (request.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: cors() });
  }
  if (request.method !== "POST") {
    return json({ error: { message: "Método não permitido" } }, 405);
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return json({ error: { message: "Chave da API não configurada no Netlify." } }, 500);
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: { message: "Requisição inválida" } }, 400);
  }

  const { system, messages, max_tokens } = body || {};
  if (!system || !Array.isArray(messages) || messages.length === 0) {
    return json({ error: { message: "Faltam system ou messages" } }, 400);
  }

  // Limite de segurança: evita respostas gigantes (output custa 5x o input)
  const maxTokens = Math.min(Number(max_tokens) || 900, 1500);

  try {
    const resp = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: maxTokens,
        // OTIMIZAÇÃO: cache_control marca o system prompt como cacheável.
        // A 1ª chamada escreve o cache; as seguintes leem por ~10% do preço.
        system: [
          { type: "text", text: String(system), cache_control: { type: "ephemeral" } },
        ],
        messages,
      }),
    });

    const data = await resp.json();
    if (!resp.ok) {
      return json({ error: { message: data?.error?.message || "Erro na API" } }, resp.status);
    }
    return json(data, 200);
  } catch (e) {
    return json({ error: { message: "Falha ao contatar a API" } }, 502);
  }
};

function cors() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
  };
}
function json(obj, status) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { "Content-Type": "application/json", ...cors() },
  });
}

export const config = { path: "/api/claude" };
