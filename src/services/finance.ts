import type { FinancialData, FinancialResult } from '../types/finance'

export function buildLocalInsights(data: FinancialData): string[] {
  const totalExpenses = data.fixedExpenses + data.variableExpenses
  const balance = data.income - totalExpenses
  const savingsRate = data.income > 0 ? (balance / data.income) * 100 : 0
  const variableShare = totalExpenses > 0 ? (data.variableExpenses / totalExpenses) * 100 : 0

  const insights: string[] = []

  if (balance < 0) {
    insights.push(
      `Suas despesas ultrapassam sua renda em ${formatCurrency(Math.abs(balance))}. Priorize reduzir gastos variáveis antes de assumir novos compromissos.`
    )
  } else {
    insights.push(
      `Seu saldo estimado do mês é ${formatCurrency(balance)}. Esse valor pode ser direcionado para reserva, meta ou quitação de dívidas.`
    )
  }

  if (savingsRate >= 20) {
    insights.push(`Sua taxa potencial de economia é de ${savingsRate.toFixed(0)}%, um nível saudável para construir objetivos financeiros.`)
  } else if (savingsRate > 0) {
    insights.push(`Sua taxa potencial de economia é de ${savingsRate.toFixed(0)}%. Tente aproximá-la gradualmente de 20%, sem comprometer despesas essenciais.`)
  } else {
    insights.push('No cenário atual não há margem para poupar. O primeiro objetivo deve ser equilibrar renda e despesas.')
  }

  if (variableShare > 45) {
    insights.push('Uma parcela relevante das despesas está em gastos variáveis. Revisar lazer, delivery, compras e assinaturas pode gerar economia rápida.')
  } else {
    insights.push('Seus gastos variáveis estão relativamente controlados. Mantenha o acompanhamento para evitar aumento ao longo do mês.')
  }

  if (data.goalAmount > 0 && balance > 0) {
    const months = Math.max(1, Math.ceil(data.goalAmount / balance))
    insights.push(`Mantendo o saldo mensal atual, sua meta "${data.goal}" poderia ser alcançada em aproximadamente ${months} ${months === 1 ? 'mês' : 'meses'}.`)
  } else if (data.goal) {
    insights.push(`Sua meta principal é "${data.goal}". Transforme-a em pequenas metas mensais mensuráveis.`)
  }

  return insights
}

export function createResult(data: FinancialData, insights: string[]): FinancialResult {
  const totalExpenses = data.fixedExpenses + data.variableExpenses
  const balance = data.income - totalExpenses
  const savingsRate = data.income > 0 ? (balance / data.income) * 100 : 0

  let status: FinancialResult['status'] = 'positivo'
  if (balance < 0) status = 'crítico'
  else if (savingsRate < 10) status = 'atenção'

  return {
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    data,
    balance,
    savingsRate,
    status,
    insights,
  }
}

export function formatCurrency(value: number) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value || 0)
}
