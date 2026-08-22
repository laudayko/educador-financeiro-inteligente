# Educador Financeiro Inteligente

Projeto final desenvolvido para praticar conceitos de Front-End com **React**, **TypeScript**, persistência de dados no navegador e **IA Generativa**.

## Funcionalidades

- Formulário financeiro em etapas
- Registro de renda, despesas e objetivo
- Cálculo automático de saldo mensal
- Diagnóstico financeiro personalizado
- Recomendações inteligentes
- Histórico salvo com `localStorage`
- Tema claro e escuro
- Integração opcional com Google Gemini
- Fallback local quando não há chave de API

## Tecnologias

- React
- TypeScript
- Vite
- LocalStorage
- Lucide React
- Google Gemini (opcional)

## Como executar

```bash
npm install
npm run dev
```

Depois, abra a URL exibida pelo Vite.

## Gemini

O projeto funciona mesmo sem uma chave de API. Caso queira testar a integração:

1. Copie `.env.example` para `.env.local`
2. Preencha `VITE_GEMINI_API_KEY`
3. Reinicie `npm run dev`

> Observação: em aplicações reais, chaves de API não devem ficar expostas no frontend. Aqui a integração é apenas para fins acadêmicos/demonstração.
