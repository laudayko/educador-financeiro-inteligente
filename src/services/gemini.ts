import type { FinancialData } from '../types/finance'
import { buildLocalInsights } from './finance'

export async function generateInsights(data: FinancialData): Promise<string[]> {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY

  if (!apiKey) {
    await new Promise((resolve) => setTimeout(resolve, 650))
    return buildLocalInsights(data)
  }

  try {
    const prompt = `
Você é um educador financeiro digital. Analise os dados abaixo e gere exatamente 4 recomendações curtas, objetivas, amigáveis e sem julgamentos.

Nome: ${data.name}
Renda mensal: R$ ${data.income}
Despesas fixas: R$ ${data.fixedExpenses}
Despesas variáveis: R$ ${data.variableExpenses}
Objetivo: ${data.goal}
Valor da meta: R$ ${data.goalAmount}

Regras:
- Responda em português do Brasil.
- Não use linguagem técnica.
- Não recomende investimentos específicos.
- Cada recomendação deve ter no máximo 2 frases.
- Retorne somente uma lista numerada de 1 a 4.
`

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      },
    )

    if (!response.ok) throw new Error('Falha na API do Gemini')

    const json = await response.json()
    const text =
      json?.candidates?.[0]?.content?.parts?.[0]?.text ?? ''

    const items = text
      .split('\n')
      .map((line: string) => line.replace(/^\s*\d+[\.\)]\s*/, '').trim())
      .filter(Boolean)
      .slice(0, 4)

    return items.length ? items : buildLocalInsights(data)
  } catch {
    return buildLocalInsights(data)
  }
}
