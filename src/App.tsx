import { useEffect, useMemo, useState } from 'react'
import {
  ArrowLeft,
  ArrowRight,
  BrainCircuit,
  CheckCircle2,
  CircleDollarSign,
  History,
  Landmark,
  Moon,
  PiggyBank,
  RotateCcw,
  Sparkles,
  Sun,
  Target,
  TrendingUp,
  WalletCards,
} from 'lucide-react'
import { MetricCard } from './components/MetricCard'
import { createResult, formatCurrency } from './services/finance'
import { generateInsights } from './services/gemini'
import type { FinancialData, FinancialResult } from './types/finance'

const initialData: FinancialData = {
  name: '',
  income: 0,
  fixedExpenses: 0,
  variableExpenses: 0,
  goal: '',
  goalAmount: 0,
}

const steps = ['Perfil', 'Finanças', 'Objetivo']

function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>(() =>
    (localStorage.getItem('efi-theme') as 'light' | 'dark') || 'dark',
  )
  const [step, setStep] = useState(0)
  const [data, setData] = useState<FinancialData>(() => {
    const saved = localStorage.getItem('efi-draft')
    return saved ? JSON.parse(saved) : initialData
  })
  const [result, setResult] = useState<FinancialResult | null>(null)
  const [history, setHistory] = useState<FinancialResult[]>(() => {
    const saved = localStorage.getItem('efi-history')
    return saved ? JSON.parse(saved) : []
  })
  const [loading, setLoading] = useState(false)
  const [view, setView] = useState<'form' | 'result' | 'history'>('form')

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    localStorage.setItem('efi-theme', theme)
  }, [theme])

  useEffect(() => {
    localStorage.setItem('efi-draft', JSON.stringify(data))
  }, [data])

  useEffect(() => {
    localStorage.setItem('efi-history', JSON.stringify(history))
  }, [history])

  const totalExpenses = useMemo(
    () => data.fixedExpenses + data.variableExpenses,
    [data.fixedExpenses, data.variableExpenses],
  )

  const update = (field: keyof FinancialData, value: string | number) => {
    setData((current) => ({ ...current, [field]: value }))
  }

  const canContinue = () => {
    if (step === 0) return data.name.trim().length >= 2
    if (step === 1) return data.income > 0
    return data.goal.trim().length >= 2
  }

  const analyze = async () => {
    setLoading(true)
    const insights = await generateInsights(data)
    const newResult = createResult(data, insights)
    setResult(newResult)
    setHistory((items) => [newResult, ...items].slice(0, 8))
    setLoading(false)
    setView('result')
  }

  const restart = () => {
    setData(initialData)
    localStorage.removeItem('efi-draft')
    setStep(0)
    setResult(null)
    setView('form')
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <button className="brand" onClick={() => setView('form')}>
          <span className="brand-mark"><Sparkles size={20} /></span>
          <span>
            <b>FinAI</b>
            <small>Educador Financeiro</small>
          </span>
        </button>

        <nav>
          <button
            className={view === 'form' ? 'nav-active' : ''}
            onClick={() => setView('form')}
          >
            Simulação
          </button>
          <button
            className={view === 'history' ? 'nav-active' : ''}
            onClick={() => setView('history')}
          >
            <History size={16} /> Histórico
          </button>
          <button
            className="icon-button"
            aria-label="Alternar tema"
            onClick={() => setTheme((current) => current === 'dark' ? 'light' : 'dark')}
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </nav>
      </header>

      <main>
        {view === 'form' && (
          <section className="hero-grid">
            <div className="intro">
              <span className="eyebrow"><BrainCircuit size={16} /> IA aplicada às suas finanças</span>
              <h1>Entenda seu dinheiro.<br />Planeje seus próximos passos.</h1>
              <p>
                Informe sua realidade financeira e receba um diagnóstico simples,
                personalizado e sem julgamentos.
              </p>

              <div className="benefits">
                <div><CheckCircle2 size={18} /> Análise em poucos minutos</div>
                <div><CheckCircle2 size={18} /> Dados salvos no navegador</div>
                <div><CheckCircle2 size={18} /> Recomendações personalizadas</div>
              </div>
            </div>

            <div className="form-card">
              <div className="steps">
                {steps.map((label, index) => (
                  <div className={`step ${index <= step ? 'step-active' : ''}`} key={label}>
                    <span>{index + 1}</span>
                    <small>{label}</small>
                  </div>
                ))}
              </div>

              {step === 0 && (
                <div className="form-section">
                  <div className="section-icon"><WalletCards /></div>
                  <h2>Vamos começar por você</h2>
                  <p>Como podemos personalizar sua experiência?</p>
                  <label>
                    Seu nome
                    <input
                      autoFocus
                      value={data.name}
                      onChange={(e) => update('name', e.target.value)}
                      placeholder="Ex.: Laura"
                    />
                  </label>
                </div>
              )}

              {step === 1 && (
                <div className="form-section">
                  <div className="section-icon"><CircleDollarSign /></div>
                  <h2>Como está seu mês?</h2>
                  <p>Use valores aproximados. Você pode ajustar depois.</p>

                  <div className="field-grid">
                    <label>
                      Renda mensal
                      <div className="money-input">
                        <span>R$</span>
                        <input
                          type="number"
                          min="0"
                          value={data.income || ''}
                          onChange={(e) => update('income', Number(e.target.value))}
                          placeholder="0"
                        />
                      </div>
                    </label>

                    <label>
                      Despesas fixas
                      <div className="money-input">
                        <span>R$</span>
                        <input
                          type="number"
                          min="0"
                          value={data.fixedExpenses || ''}
                          onChange={(e) => update('fixedExpenses', Number(e.target.value))}
                          placeholder="0"
                        />
                      </div>
                    </label>

                    <label className="full-field">
                      Despesas variáveis
                      <div className="money-input">
                        <span>R$</span>
                        <input
                          type="number"
                          min="0"
                          value={data.variableExpenses || ''}
                          onChange={(e) => update('variableExpenses', Number(e.target.value))}
                          placeholder="0"
                        />
                      </div>
                    </label>
                  </div>

                  <div className="preview-balance">
                    <span>Saldo estimado</span>
                    <strong>{formatCurrency(data.income - totalExpenses)}</strong>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="form-section">
                  <div className="section-icon"><Target /></div>
                  <h2>Qual é sua prioridade?</h2>
                  <p>Defina um objetivo para orientar as recomendações.</p>

                  <label>
                    Objetivo financeiro
                    <input
                      value={data.goal}
                      onChange={(e) => update('goal', e.target.value)}
                      placeholder="Ex.: montar uma reserva de emergência"
                    />
                  </label>

                  <label>
                    Valor da meta (opcional)
                    <div className="money-input">
                      <span>R$</span>
                      <input
                        type="number"
                        min="0"
                        value={data.goalAmount || ''}
                        onChange={(e) => update('goalAmount', Number(e.target.value))}
                        placeholder="0"
                      />
                    </div>
                  </label>
                </div>
              )}

              <div className="form-actions">
                {step > 0 ? (
                  <button className="secondary-button" onClick={() => setStep(step - 1)}>
                    <ArrowLeft size={18} /> Voltar
                  </button>
                ) : <span />}

                {step < 2 ? (
                  <button
                    className="primary-button"
                    disabled={!canContinue()}
                    onClick={() => setStep(step + 1)}
                  >
                    Continuar <ArrowRight size={18} />
                  </button>
                ) : (
                  <button
                    className="primary-button"
                    disabled={!canContinue() || loading}
                    onClick={analyze}
                  >
                    {loading ? 'Analisando...' : 'Gerar diagnóstico'}
                    {!loading && <Sparkles size={18} />}
                  </button>
                )}
              </div>
            </div>
          </section>
        )}

        {view === 'result' && result && (
          <section className="result-page">
            <div className="result-heading">
              <div>
                <span className="eyebrow"><Sparkles size={16} /> Diagnóstico concluído</span>
                <h1>Seu panorama financeiro, {result.data.name}.</h1>
                <p>Uma leitura simples do seu momento atual e dos próximos passos possíveis.</p>
              </div>
              <button className="secondary-button" onClick={restart}>
                <RotateCcw size={17} /> Nova simulação
              </button>
            </div>

            <div className="metrics">
              <MetricCard
                label="Renda mensal"
                value={formatCurrency(result.data.income)}
                helper="valor informado"
                icon={<Landmark />}
              />
              <MetricCard
                label="Despesas"
                value={formatCurrency(result.data.fixedExpenses + result.data.variableExpenses)}
                helper="fixas + variáveis"
                icon={<WalletCards />}
              />
              <MetricCard
                label="Saldo"
                value={formatCurrency(result.balance)}
                helper={result.balance >= 0 ? 'margem disponível' : 'déficit estimado'}
                icon={<PiggyBank />}
              />
              <MetricCard
                label="Potencial de economia"
                value={`${Math.max(0, result.savingsRate).toFixed(0)}%`}
                helper="da renda mensal"
                icon={<TrendingUp />}
              />
            </div>

            <div className="result-grid">
              <article className="insights-card">
                <div className="card-title">
                  <span className="section-icon small"><BrainCircuit /></span>
                  <div>
                    <span>Insights inteligentes</span>
                    <h2>Recomendações para você</h2>
                  </div>
                </div>

                <div className="insight-list">
                  {result.insights.map((insight, index) => (
                    <div className="insight-item" key={index}>
                      <span>{index + 1}</span>
                      <p>{insight}</p>
                    </div>
                  ))}
                </div>
              </article>

              <aside className="goal-card">
                <span>Seu objetivo</span>
                <h3>{result.data.goal}</h3>
                {result.data.goalAmount > 0 && (
                  <strong>{formatCurrency(result.data.goalAmount)}</strong>
                )}
                <p>
                  Pequenos ajustes consistentes costumam ser mais sustentáveis do que mudanças radicais.
                </p>
                <div className={`status-pill status-${result.status}`}>
                  {result.status === 'positivo' && 'Cenário positivo'}
                  {result.status === 'atenção' && 'Ponto de atenção'}
                  {result.status === 'crítico' && 'Prioridade: equilíbrio'}
                </div>
              </aside>
            </div>
          </section>
        )}

        {view === 'history' && (
          <section className="history-page">
            <div className="result-heading">
              <div>
                <span className="eyebrow"><History size={16} /> Persistência com LocalStorage</span>
                <h1>Histórico de simulações</h1>
                <p>As análises ficam salvas neste navegador para comparação.</p>
              </div>
            </div>

            {history.length === 0 ? (
              <div className="empty-state">
                <History size={42} />
                <h2>Nenhuma simulação salva</h2>
                <p>Faça sua primeira análise para visualizar o histórico.</p>
                <button className="primary-button" onClick={() => setView('form')}>
                  Criar simulação
                </button>
              </div>
            ) : (
              <div className="history-list">
                {history.map((item) => (
                  <button
                    key={item.id}
                    className="history-item"
                    onClick={() => {
                      setResult(item)
                      setView('result')
                    }}
                  >
                    <div>
                      <strong>{item.data.goal}</strong>
                      <span>{new Date(item.createdAt).toLocaleString('pt-BR')}</span>
                    </div>
                    <div>
                      <small>Saldo</small>
                      <strong>{formatCurrency(item.balance)}</strong>
                    </div>
                    <ArrowRight size={18} />
                  </button>
                ))}
              </div>
            )}
          </section>
        )}
      </main>

      <footer>
        <span>FinAI • Projeto acadêmico de Front-End</span>
        <span>React + TypeScript + IA Generativa</span>
      </footer>
    </div>
  )
}

export default App
