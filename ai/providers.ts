import { wrapLanguageModel, customProvider, extractReasoningMiddleware, gateway } from 'ai';

import { createOpenAI, openai } from '@ai-sdk/openai';
import { xai } from '@ai-sdk/xai';
import { groq } from '@ai-sdk/groq';
import { mistral } from '@ai-sdk/mistral';
import { google } from '@ai-sdk/google';
import { anthropic } from "@ai-sdk/anthropic";
import { cohere } from '@ai-sdk/cohere';

const middleware = extractReasoningMiddleware({
  tagName: 'think',
});

const middlewareWithStartWithReasoning = extractReasoningMiddleware({
  tagName: 'think',
  startWithReasoning: true,
});

// Helper to check if API key is valid (not a placeholder)
const isValidApiKey = (key: string | undefined): boolean => {
  if (!key) return false;
  if (key.includes('placeholder')) return false;
  if (key.includes('test-key')) return false;
  if (key === 'your-key-here') return false;
  return true;
};

const huggingface = createOpenAI({
  baseURL: 'https://router.huggingface.co/v1',
  apiKey: process.env.HF_TOKEN,
});

const azure = createOpenAI({
  baseURL: 'https://kamesh6592-7068-resource.cognitiveservices.azure.com/openai/responses?api-version=2025-04-01-preview',
  apiKey: process.env.AZURE_API_KEY,
});

const azureGpt4oMini = createOpenAI({
  baseURL: 'https://kamesh6592-7068-resource.cognitiveservices.azure.com/openai/deployments/gpt-4o-mini/chat/completions?api-version=2025-01-01-preview',
  apiKey: process.env.AZURE_API_KEY,
});

const zhipuai = createOpenAI({
  baseURL: 'https://api.z.ai/api/paas/v4',
  apiKey: process.env.ZHIPUAI_API_KEY,
});

const azureGrok = createOpenAI({
  baseURL: 'https://kamesh6592-7068-resource.services.ai.azure.com/openai/v1',
  apiKey: process.env.AZURE_API_KEY,
});

const azureDeepSeekV31 = createOpenAI({
  baseURL: 'https://kamesh6592-2021-resource.services.ai.azure.com/models/chat/completions?api-version=2024-05-01-preview',
  apiKey: process.env.AZURE_API_KEY,
});

const anannas = process.env.ANANNAS_API_KEY ? createOpenAI({
  baseURL: 'https://api.anannas.ai/v1',
  apiKey: process.env.ANANNAS_API_KEY,
  headers: {
    'HTTP-Referer': 'https://ajstudioz.co.in',
    'X-Title': 'AJ STUDIOZ',
    'Content-Type': 'application/json',
  },
}) : null;

// DeepInfra - Cheapest provider with many models
const deepinfra = createOpenAI({
  baseURL: 'https://api.deepinfra.com/v1/openai',
  apiKey: process.env.DEEPINFRA_API_KEY,
});

// Cerebras - Fastest inference in the world
const cerebras = createOpenAI({
  baseURL: 'https://api.cerebras.ai/v1',
  apiKey: process.env.CEREBRAS_API_KEY,
});

// Fireworks AI - Fast and optimized
const fireworks = createOpenAI({
  baseURL: 'https://api.fireworks.ai/inference/v1',
  apiKey: process.env.FIREWORKS_API_KEY,
});

export const scira = customProvider({
  languageModels: {
    // Default model - Use Gemini 2.5 Flash (user requested)
    'scira-default': isValidApiKey(process.env.GOOGLE_GENERATIVE_AI_API_KEY) 
      ? google('gemini-2.5-flash')
      : isValidApiKey(process.env.GROQ_API_KEY)
      ? groq('llama-3.3-70b-versatile')
      : isValidApiKey(process.env.ANTHROPIC_API_KEY)
      ? anthropic('claude-sonnet-4-20250514')
      : google('gemini-2.5-flash'), // Final fallback
    
    'scira-nano': isValidApiKey(process.env.GROQ_API_KEY)
      ? groq('llama-3.3-70b-versatile')
      : xai('grok-4-latest'),
    
    'scira-name': isValidApiKey(process.env.GROQ_API_KEY)
      ? groq('llama-3.3-70b-versatile')
      : xai('grok-4-latest'),
    
    'scira-grok-3-mini': isValidApiKey(process.env.XAI_API_KEY) ? xai('grok-3-mini') : xai('grok-4-latest'),
    'scira-grok-3': isValidApiKey(process.env.XAI_API_KEY) ? xai('grok-3') : xai('grok-4-latest'),
    'scira-grok-4': isValidApiKey(process.env.XAI_API_KEY) ? xai('grok-4-latest') : anthropic('claude-sonnet-4-20250514'),
    'scira-grok-code-fast': isValidApiKey(process.env.XAI_API_KEY) ? xai('grok-code-fast-1') : xai('grok-4-latest'),
    'scira-grok-4-fast-reasoning': isValidApiKey(process.env.XAI_API_KEY) ? xai('grok-4-fast-reasoning') : xai('grok-4-latest'),
    'scira-grok-4-fast-non-reasoning': isValidApiKey(process.env.XAI_API_KEY) ? xai('grok-4-fast-non-reasoning') : xai('grok-4-latest'),
    'scira-grok-4-fast': isValidApiKey(process.env.GROQ_API_KEY) ? groq('llama-3.3-70b-versatile') : anthropic('claude-sonnet-4-20250514'),
    'scira-grok-4-fast-think': isValidApiKey(process.env.GROQ_API_KEY) ? groq('llama-3.3-70b-versatile') : anthropic('claude-sonnet-4-20250514'),
    'scira-code': isValidApiKey(process.env.XAI_API_KEY) ? xai('grok-4-latest') : anthropic('claude-sonnet-4-20250514'),
    'scira-enhance': isValidApiKey(process.env.GOOGLE_GENERATIVE_AI_API_KEY) ? google('gemini-2.5-flash') : xai('grok-4-latest'),
    'scira-follow-up': isValidApiKey(process.env.XAI_API_KEY)
      ? xai('grok-4-latest')
      : isValidApiKey(process.env.GROQ_API_KEY)
      ? groq('llama-3.3-70b-versatile')
      : xai('grok-4-latest'),
    'scira-qwen-4b': isValidApiKey(process.env.GROQ_API_KEY) ? groq('llama-3.3-70b-versatile') : anthropic('claude-sonnet-4-20250514'),
    'scira-qwen-4b-thinking': wrapLanguageModel({
      model: huggingface.chat('Qwen/Qwen2.5-7B-Instruct'),
      middleware: [middlewareWithStartWithReasoning],
    }),
    // GPT models - Using OpenAI API key
    'scira-gpt-4o-mini': isValidApiKey(process.env.OPENAI_API_KEY) ? openai('gpt-4o-mini') : google('gemini-2.5-flash'),
    'scira-gpt-4o': isValidApiKey(process.env.OPENAI_API_KEY) ? openai('gpt-4o') : google('gemini-2.5-flash'),
    'scira-o1-mini': isValidApiKey(process.env.OPENAI_API_KEY) ? openai('o1-mini') : google('gemini-2.5-flash'),
    'scira-o1': isValidApiKey(process.env.OPENAI_API_KEY) ? openai('o1') : google('gemini-2.5-flash'),
    'scira-glm-4-flash': isValidApiKey(process.env.ZHIPUAI_API_KEY) ? zhipuai.chat('glm-4.5-flash') : google('gemini-2.5-flash'),
    // Free tier models - 6 unique model families
    'scira-deepinfra-free': isValidApiKey(process.env.DEEPINFRA_API_KEY) ? deepinfra.chat('deepseek-ai/DeepSeek-V3') : google('gemini-2.5-flash'),
    'scira-cerebras-free': isValidApiKey(process.env.CEREBRAS_API_KEY) ? cerebras.chat('llama3.1-8b') : groq('llama-3.3-70b-versatile'),
    'scira-fireworks-free': isValidApiKey(process.env.FIREWORKS_API_KEY) ? fireworks.chat('accounts/fireworks/models/llama-v3p3-70b-instruct') : google('gemini-2.5-flash'),
    'scira-qwen-32b': wrapLanguageModel({
      model: isValidApiKey(process.env.GROQ_API_KEY) ? groq('llama-3.3-70b-versatile') : anthropic('claude-sonnet-4-20250514'),
      middleware,
    }),
    'scira-gpt-oss-20': wrapLanguageModel({
      model: isValidApiKey(process.env.GROQ_API_KEY) ? groq('llama-3.3-70b-versatile') : anthropic('claude-sonnet-4-20250514'),
      middleware,
    }),
    'scira-gpt-oss-120': wrapLanguageModel({
      model: isValidApiKey(process.env.GROQ_API_KEY) ? groq('llama-3.3-70b-versatile') : anthropic('claude-sonnet-4-20250514'),
      middleware,
    }),
    // DeepSeek models - Only via DeepInfra (Azure account has issues)
    'scira-deepseek-chat': isValidApiKey(process.env.DEEPINFRA_API_KEY) ? deepinfra.chat('deepseek-ai/DeepSeek-V3') : google('gemini-2.5-flash'),
    'scira-deepseek-r1': wrapLanguageModel({
      model: isValidApiKey(process.env.DEEPINFRA_API_KEY) ? deepinfra.chat('deepseek-ai/DeepSeek-R1') : google('gemini-2.5-flash'),
      middleware,
    }),
    // DeepInfra models (other providers)
    'scira-deepinfra-llama-33': isValidApiKey(process.env.DEEPINFRA_API_KEY) ? deepinfra.chat('meta-llama/Llama-3.3-70B-Instruct') : groq('llama-3.3-70b-versatile'),
    'scira-deepinfra-qwen-72b': isValidApiKey(process.env.DEEPINFRA_API_KEY) ? deepinfra.chat('Qwen/Qwen2.5-72B-Instruct') : google('gemini-2.5-flash'),
    // Cerebras models - Super fast
    'scira-cerebras-llama-33': isValidApiKey(process.env.CEREBRAS_API_KEY) ? cerebras.chat('llama-3.3-70b') : groq('llama-3.3-70b-versatile'),
    'scira-cerebras-llama-8b': isValidApiKey(process.env.CEREBRAS_API_KEY) ? cerebras.chat('llama3.1-8b') : groq('llama-3.3-70b-versatile'),
    // Fireworks models
    'scira-fireworks-llama-33': isValidApiKey(process.env.FIREWORKS_API_KEY) ? fireworks.chat('accounts/fireworks/models/llama-v3p3-70b-instruct') : groq('llama-3.3-70b-versatile'),
    'scira-fireworks-qwen-coder': isValidApiKey(process.env.FIREWORKS_API_KEY) ? fireworks.chat('accounts/fireworks/models/qwen2p5-coder-32b-instruct') : groq('llama-3.3-70b-versatile'),
    'scira-qwen-coder': huggingface.chat('Qwen/Qwen3-Coder-480B-A35B-Instruct:cerebras'),
    'scira-qwen-30': huggingface.chat('Qwen/Qwen3-30B-A3B-Instruct-2507:nebius'),
    'scira-qwen-30-think': wrapLanguageModel({
      model: huggingface.chat('Qwen/Qwen3-30B-A3B-Thinking-2507:nebius'),
      middleware,
    }),
    'scira-qwen-3-next': huggingface.chat('Qwen/Qwen3-Next-80B-A3B-Instruct:hyperbolic'),
    'scira-qwen-3-next-think': wrapLanguageModel({
      model: huggingface.chat('Qwen/Qwen3-Next-80B-A3B-Thinking:hyperbolic'),
      middleware: [middlewareWithStartWithReasoning],
    }),
    'scira-qwen-3-max': isValidApiKey(process.env.HF_TOKEN) ? huggingface.chat('Qwen/Qwen3-Max-70B-A22B-Instruct:nebius') : groq('llama-3.3-70b-versatile'),
    'scira-qwen-3-max-preview': isValidApiKey(process.env.HF_TOKEN) ? huggingface.chat('Qwen/Qwen3-Max-70B-A22B-Instruct:nebius') : groq('llama-3.3-70b-versatile'),
    'scira-qwen-235': huggingface.chat('Qwen/Qwen3-235B-A22B-Instruct-2507:fireworks-ai'),
    'scira-qwen-235-think': wrapLanguageModel({
      model: huggingface.chat('Qwen/Qwen3-235B-A22B-Thinking-2507:fireworks-ai'),
      middleware: [middlewareWithStartWithReasoning],
    }),
    'scira-glm-air': isValidApiKey(process.env.HF_TOKEN) ? huggingface.chat('zai-org/GLM-4.6:novita') : groq('llama-3.3-70b-versatile'),
    'scira-glm': wrapLanguageModel({
      model: isValidApiKey(process.env.HF_TOKEN) ? huggingface.chat('zai-org/GLM-4.6:novita') : groq('llama-3.3-70b-versatile'),
      middleware,
    }),
    'scira-glm-4.6': wrapLanguageModel({
      model: huggingface.chat('zai-org/GLM-4.6:novita'),
      middleware,
    }),
    'scira-cmd-a': cohere('command-a-03-2025'),
    'scira-cmd-a-think': cohere('command-a-reasoning-08-2025'),
    'scira-kimi-k2-v2': isValidApiKey(process.env.GROQ_API_KEY) ? groq('moonshotai/kimi-k2-instruct-0905') : openai('gpt-4o'),
    'scira-haiku': anthropic('claude-3-5-haiku-20241022'), // Changed from Anannas to direct Anthropic
    'scira-mistral-medium': mistral('mistral-medium-2508'),
    'scira-magistral-small': mistral('magistral-small-2509'),
    'scira-magistral-medium': mistral('magistral-medium-2509'),
    'scira-google-lite': google('gemini-2.5-flash'),
    'scira-google': google('gemini-2.5-flash'),
    'scira-google-think': google('gemini-2.5-flash'),
    'scira-google-pro': google('gemini-2.5-pro'),
    'scira-google-pro-think': google('gemini-2.5-pro'),
    'scira-anthropic': anthropic('claude-sonnet-4-5'),
  },
});

interface ModelParameters {
  temperature?: number;
  topP?: number;
  topK?: number;
  minP?: number;
  frequencyPenalty?: number;
}

interface Model {
  value: string;
  label: string;
  description: string;
  vision: boolean;
  reasoning: boolean;
  experimental: boolean;
  category: string;
  pdf: boolean;
  pro: boolean;
  requiresAuth: boolean;
  freeUnlimited: boolean;
  maxOutputTokens: number;
  extreme?: boolean;
  fast?: boolean;
  isNew?: boolean;
  parameters?: ModelParameters;
}

export const models: Model[] = [
  // Default model
  {
    value: 'scira-default',
    label: 'Gemini 2.5 Flash (Preview)',
    description: "Google's advanced small LLM - Default model",
    vision: true,
    reasoning: false,
    experimental: false,
    category: 'Free',
    pdf: true,
    pro: false,
    requiresAuth: false,
    freeUnlimited: false,
    maxOutputTokens: 10000,
    extreme: true,
    fast: true,
    isNew: true,
  },
  // Free models - Only Qwen 3 4B
  {
    value: 'scira-qwen-4b',
    label: 'Qwen 3 4B',
    description: "Alibaba's small base LLM",
    vision: false,
    reasoning: false,
    experimental: false,
    category: 'Free',
    pdf: false,
    pro: false,
    requiresAuth: true,
    maxOutputTokens: 16000,
    freeUnlimited: false,
    parameters: {
      temperature: 0.7,
      topP: 0.8,
      topK: 20,
      minP: 0,
    },
  },
  {
    value: 'scira-qwen-4b-thinking',
    label: 'Qwen 3 4B Thinking',
    description: "Alibaba's small base LLM with reasoning",
    vision: false,
    reasoning: true,
    experimental: false,
    category: 'Free',
    pdf: false,
    pro: false,
    requiresAuth: true,
    maxOutputTokens: 16000,
    freeUnlimited: false,
    parameters: {
      temperature: 0.6,
      topP: 0.95,
      topK: 20,
      minP: 0,
    },
  },
  {
    value: 'scira-gpt-4o-mini',
    label: 'GPT-4o Mini (Azure)',
    description: "OpenAI's efficient small model via Azure",
    vision: true,
    reasoning: false,
    experimental: false,
    category: 'Free',
    pdf: false,
    pro: false,
    requiresAuth: true,
    freeUnlimited: false,
    maxOutputTokens: 16384,
    fast: true,
    isNew: true,
  },
  {
    value: 'scira-glm-4-flash',
    label: 'GLM 4.5 Flash',
    description: "Zhipu AI's fast efficient LLM",
    vision: false,
    reasoning: false,
    experimental: false,
    category: 'Free',
    pdf: false,
    pro: false,
    requiresAuth: true,
    freeUnlimited: false,
    maxOutputTokens: 8000,
    fast: true,
    isNew: true,
  },
  {
    value: 'scira-deepinfra-free',
    label: 'DeepSeek V3',
    description: "DeepSeek's V3 - Advanced reasoning - DeepInfra $10 credits",
    vision: false,
    reasoning: true,
    experimental: false,
    category: 'Free',
    pdf: false,
    pro: false,
    requiresAuth: true,
    freeUnlimited: false,
    maxOutputTokens: 64000,
    fast: true,
    isNew: true,
  },
  {
    value: 'scira-cerebras-free',
    label: 'Llama 3.1 8B',
    description: "Meta's Llama 3.1 8B - Ultra-fast lightweight - Cerebras unlimited free",
    vision: false,
    reasoning: false,
    experimental: false,
    category: 'Free',
    pdf: false,
    pro: false,
    requiresAuth: true,
    freeUnlimited: true,
    maxOutputTokens: 8192,
    extreme: true,
    fast: true,
    isNew: true,
  },
  {
    value: 'scira-fireworks-free',
    label: 'Llama 3.3 70B',
    description: "Meta's Llama 3.3 via Fireworks - Fast inference - $10 free credits",
    vision: false,
    reasoning: false,
    experimental: false,
    category: 'Free',
    pdf: false,
    pro: false,
    requiresAuth: true,
    freeUnlimited: false,
    maxOutputTokens: 32768,
    fast: true,
    isNew: true,
  },
  // Pro models - xAI Grok (reverted to original)
  {
    value: 'scira-grok-3-mini',
    label: 'Grok 3 Mini',
    description: "xAI's recent smallest LLM",
    vision: false,
    reasoning: true,
    experimental: false,
    category: 'Pro',
    pdf: false,
    pro: true,
    requiresAuth: true,
    freeUnlimited: false,
    maxOutputTokens: 16000,
  },
  {
    value: 'scira-grok-3',
    label: 'Grok 3',
    description: "xAI's recent smartest LLM",
    vision: false,
    reasoning: false,
    experimental: false,
    category: 'Pro',
    pdf: false,
    pro: true,
    requiresAuth: true,
    freeUnlimited: false,
    maxOutputTokens: 16000,
  },
  {
    value: 'scira-grok-4',
    label: 'Grok 4',
    description: "xAI's most intelligent LLM",
    vision: true,
    reasoning: true,
    experimental: false,
    category: 'Pro',
    pdf: false,
    pro: true,
    requiresAuth: true,
    freeUnlimited: false,
    maxOutputTokens: 16000,
  },
  {
    value: 'scira-grok-code-fast',
    label: 'Grok Code Fast',
    description: "xAI's specialized coding model - $0.20/1M tokens",
    vision: false,
    reasoning: false,
    experimental: false,
    category: 'Pro',
    pdf: false,
    pro: true,
    requiresAuth: true,
    freeUnlimited: false,
    maxOutputTokens: 256000,
    fast: true,
    isNew: true,
  },
  {
    value: 'scira-grok-4-fast-reasoning',
    label: 'Grok 4 Fast Reasoning',
    description: "xAI's fast reasoning model - $0.20/1M tokens",
    vision: false,
    reasoning: true,
    experimental: false,
    category: 'Pro',
    pdf: false,
    pro: true,
    requiresAuth: true,
    freeUnlimited: false,
    maxOutputTokens: 2000000,
    fast: true,
    isNew: true,
  },
  {
    value: 'scira-grok-4-fast-non-reasoning',
    label: 'Grok 4 Fast (No Reasoning)',
    description: "xAI's fastest model without reasoning - $0.20/1M tokens",
    vision: false,
    reasoning: false,
    experimental: false,
    category: 'Pro',
    pdf: false,
    pro: true,
    requiresAuth: true,
    freeUnlimited: false,
    maxOutputTokens: 2000000,
    extreme: true,
    fast: true,
    isNew: true,
  },
  {
    value: 'scira-grok-4-fast-think',
    label: 'Grok 4 Fast Thinking',
    description: "xAI's fastest multimodel reasoning LLM",
    vision: true,
    reasoning: true,
    experimental: false,
    category: 'Pro',
    pdf: false,
    pro: true,
    requiresAuth: true,
    freeUnlimited: false,
    maxOutputTokens: 16000,
    extreme: true,
    fast: true,
    isNew: true,
  },
  // Pro model - GPT-5 Mini via Azure
  {
    value: 'scira-gpt-5-mini',
    label: 'GPT-5 Mini (Azure)',
    description: "OpenAI's GPT-5 Mini via Azure Cognitive Services",
    vision: true,
    reasoning: true,
    experimental: false,
    category: 'Pro',
    pdf: true,
    pro: true,
    requiresAuth: true,
    freeUnlimited: false,
    maxOutputTokens: 16384,
    fast: true,
    isNew: true,
  },
  // Pro models - DeepInfra (Cheapest option)
  {
    value: 'scira-deepinfra-llama-33',
    label: 'Llama 3.3 70B (DeepInfra)',
    description: "Meta's Llama 3.3 via DeepInfra - $0.07/1M tokens",
    vision: false,
    reasoning: false,
    experimental: false,
    category: 'Pro',
    pdf: false,
    pro: true,
    requiresAuth: true,
    freeUnlimited: false,
    maxOutputTokens: 32000,
    fast: true,
    isNew: true,
  },
  {
    value: 'scira-deepinfra-qwen-72b',
    label: 'Qwen 2.5 72B (DeepInfra)',
    description: "Alibaba's Qwen 2.5 72B via DeepInfra - Super cheap",
    vision: false,
    reasoning: false,
    experimental: false,
    category: 'Pro',
    pdf: false,
    pro: true,
    requiresAuth: true,
    freeUnlimited: false,
    maxOutputTokens: 32000,
    fast: true,
    isNew: true,
  },
  // Pro models - DeepSeek via DeepInfra only (consolidated)
  {
    value: 'scira-deepseek-r1',
    label: 'DeepSeek R1',
    description: "DeepSeek R1 reasoning model via DeepInfra - $0.14/1M tokens",
    vision: false,
    reasoning: true,
    experimental: false,
    category: 'Pro',
    pdf: false,
    pro: true,
    requiresAuth: true,
    freeUnlimited: false,
    maxOutputTokens: 64000,
    fast: true,
    isNew: true,
  },
  {
    value: 'scira-deepseek-chat',
    label: 'DeepSeek V3',
    description: "DeepSeek V3 chat model via DeepInfra - $0.14/1M tokens",
    vision: false,
    reasoning: true,
    experimental: false,
    category: 'Pro',
    pdf: false,
    pro: true,
    requiresAuth: true,
    freeUnlimited: false,
    maxOutputTokens: 64000,
    fast: true,
    isNew: true,
  },
  // Pro models - Cerebras (Fastest)
  {
    value: 'scira-cerebras-llama-33',
    label: 'Llama 3.3 70B (Cerebras)',
    description: "Meta's Llama 3.3 via Cerebras - World's fastest",
    vision: false,
    reasoning: false,
    experimental: false,
    category: 'Pro',
    pdf: false,
    pro: true,
    requiresAuth: true,
    freeUnlimited: false,
    maxOutputTokens: 8192,
    extreme: true,
    fast: true,
    isNew: true,
  },
  {
    value: 'scira-cerebras-llama-8b',
    label: 'Llama 3.1 8B (Cerebras)',
    description: "Meta's Llama 3.1 8B via Cerebras - Ultra fast",
    vision: false,
    reasoning: false,
    experimental: false,
    category: 'Pro',
    pdf: false,
    pro: true,
    requiresAuth: true,
    freeUnlimited: false,
    maxOutputTokens: 8192,
    extreme: true,
    fast: true,
    isNew: true,
  },
  // Pro models - Fireworks (Optimized)
  {
    value: 'scira-fireworks-llama-33',
    label: 'Llama 3.3 70B (Fireworks)',
    description: "Meta's Llama 3.3 via Fireworks - Optimized inference",
    vision: false,
    reasoning: false,
    experimental: false,
    category: 'Pro',
    pdf: false,
    pro: true,
    requiresAuth: true,
    freeUnlimited: false,
    maxOutputTokens: 8192,
    fast: true,
    isNew: true,
  },
  {
    value: 'scira-fireworks-qwen-coder',
    label: 'Qwen 2.5 Coder 32B (Fireworks)',
    description: "Alibaba's Qwen Coder via Fireworks - Best for coding",
    vision: false,
    reasoning: false,
    experimental: false,
    category: 'Pro',
    pdf: false,
    pro: true,
    requiresAuth: true,
    freeUnlimited: false,
    maxOutputTokens: 32000,
    fast: true,
    isNew: true,
  },

  {
    value: 'scira-code',
    label: 'Grok Code',
    description: "xAI's advanced coding LLM",
    vision: false,
    reasoning: true,
    experimental: false,
    category: 'Pro',
    pdf: false,
    pro: true,
    requiresAuth: true,
    freeUnlimited: false,
    maxOutputTokens: 16000,
    fast: true,
  },
  {
    value: 'scira-mistral-medium',
    label: 'Mistral Medium',
    description: "Mistral's medium multi-modal LLM",
    vision: true,
    reasoning: false,
    experimental: false,
    category: 'Pro',
    pdf: true,
    pro: true,
    requiresAuth: true,
    freeUnlimited: false,
    maxOutputTokens: 16000,
    isNew: true,
  },
  {
    value: 'scira-magistral-small',
    label: 'Magistral Small',
    description: "Mistral's small reasoning LLM",
    vision: true,
    reasoning: true,
    experimental: false,
    category: 'Pro',
    pdf: true,
    pro: true,
    requiresAuth: true,
    freeUnlimited: false,
    maxOutputTokens: 16000,
    isNew: true,
  },
  {
    value: 'scira-magistral-medium',
    label: 'Magistral Medium',
    description: "Mistral's medium reasoning LLM",
    vision: true,
    reasoning: true,
    experimental: false,
    category: 'Pro',
    pdf: true,
    pro: true,
    requiresAuth: true,
    freeUnlimited: false,
    maxOutputTokens: 16000,
    isNew: true,
  },
  {
    value: 'scira-gpt-oss-120',
    label: 'GPT OSS 120B',
    description: "OpenAI's advanced OSS LLM",
    vision: false,
    reasoning: false,
    experimental: false,
    category: 'Pro',
    pdf: false,
    pro: true,
    requiresAuth: true,
    freeUnlimited: false,
    maxOutputTokens: 16000,
    fast: true,
  },

  {
    value: 'scira-gpt-4.1',
    label: 'GPT 4.1',
    description: "OpenAI's LLM",
    vision: true,
    reasoning: true,
    experimental: false,
    category: 'Pro',
    pdf: true,
    pro: true,
    requiresAuth: true,
    freeUnlimited: false,
    maxOutputTokens: 16000,
    extreme: true,
    fast: false,
    isNew: true,
  },
  {
    value: 'scira-gpt5-mini',
    label: 'GPT 5 Mini',
    description: "OpenAI's small flagship LLM",
    vision: true,
    reasoning: true,
    experimental: false,
    category: 'Pro',
    pdf: true,
    pro: true,
    requiresAuth: true,
    freeUnlimited: false,
    maxOutputTokens: 16000,
    extreme: true,
    fast: false,
    isNew: true,
  },
  {
    value: 'scira-gpt5',
    label: 'GPT 5',
    description: "OpenAI's flagship LLM",
    vision: true,
    reasoning: true,
    experimental: false,
    category: 'Pro',
    pdf: true,
    pro: true,
    requiresAuth: true,
    freeUnlimited: false,
    maxOutputTokens: 16000,
    extreme: true,
    fast: false,
    isNew: true,
  },
  {
    value: 'scira-o4-mini',
    label: 'o4 mini',
    description: "OpenAI's recent mini reasoning LLM",
    vision: true,
    reasoning: true,
    experimental: false,
    category: 'Pro',
    pdf: true,
    pro: true,
    requiresAuth: true,
    freeUnlimited: false,
    maxOutputTokens: 16000,
    fast: false,
    isNew: true,
  },
  {
    value: 'scira-o3',
    label: 'o3',
    description: "OpenAI's advanced LLM",
    vision: true,
    reasoning: true,
    experimental: false,
    category: 'Pro',
    pdf: true,
    pro: true,
    requiresAuth: true,
    freeUnlimited: false,
    maxOutputTokens: 16000,
    fast: false,
    isNew: true,
  },
  {
    value: 'scira-gpt5-medium',
    label: 'GPT 5 Medium',
    description: "OpenAI's latest flagship reasoning LLM",
    vision: true,
    reasoning: true,
    experimental: false,
    category: 'Pro',
    pdf: true,
    pro: true,
    requiresAuth: true,
    freeUnlimited: false,
    maxOutputTokens: 16000,
    extreme: true,
    fast: false,
    isNew: true,
  },
  {
    value: 'scira-gpt5-codex',
    label: 'GPT 5 Codex',
    description: "OpenAI's advanced coding LLM",
    vision: true,
    reasoning: true,
    experimental: false,
    category: 'Pro',
    pdf: true,
    pro: true,
    requiresAuth: true,
    freeUnlimited: false,
    maxOutputTokens: 16000,
    extreme: true,
    fast: false,
    isNew: true,
  },
  {
    value: 'scira-cmd-a',
    label: 'Command A',
    description: "Cohere's advanced command LLM",
    vision: false,
    reasoning: false,
    experimental: false,
    category: 'Pro',
    pdf: false,
    pro: true,
    requiresAuth: true,
    freeUnlimited: false,
    maxOutputTokens: 16000,
    isNew: true,
  },
  {
    value: 'scira-cmd-a-think',
    label: 'Command A Thinking',
    description: "Cohere's advanced command LLM with thinking",
    vision: false,
    reasoning: true,
    experimental: false,
    category: 'Pro',
    pdf: false,
    pro: true,
    requiresAuth: true,
    freeUnlimited: false,
    maxOutputTokens: 16000,
    isNew: true,
  },


  {
    value: 'scira-qwen-3-max',
    label: 'Qwen 3 Max',
    description: "Qwen's advanced instruct LLM",
    vision: false,
    reasoning: false,
    experimental: false,
    category: 'Pro',
    pdf: false,
    pro: true,
    requiresAuth: true,
    freeUnlimited: false,
    maxOutputTokens: 10000,
    isNew: true,
  },
  {
    value: 'scira-qwen-3-max-preview',
    label: 'Qwen 3 Max Preview',
    description: "Qwen's advanced instruct LLM",
    vision: false,
    reasoning: false,
    experimental: false,
    category: 'Pro',
    pdf: false,
    pro: true,
    requiresAuth: true,
    freeUnlimited: false,
    maxOutputTokens: 10000,
    isNew: true,
  },

  {
    value: 'scira-kimi-k2-v2',
    label: 'Kimi K2 Latest',
    description: "MoonShot AI's advanced base LLM",
    vision: false,
    reasoning: false,
    experimental: false,
    category: 'Pro',
    pdf: false,
    pro: true,
    requiresAuth: true,
    freeUnlimited: false,
    maxOutputTokens: 10000,
    fast: true,
    parameters: {
      temperature: 0.6,
    },
  },
  {
    value: 'scira-glm-4.6',
    label: 'GLM 4.6',
    description: "Zhipu AI's advanced reasoning LLM",
    vision: false,
    reasoning: true,
    experimental: false,
    category: 'Pro',
    pdf: false,
    pro: true,
    requiresAuth: true,
    freeUnlimited: false,
    maxOutputTokens: 130000,
    isNew: true,
    parameters: {
      temperature: 1,
      topP: 0.95,
    },
  },
  {
    value: 'scira-glm-air',
    label: 'GLM 4.5 Air',
    description: "Zhipu AI's efficient base LLM",
    vision: false,
    reasoning: true,
    experimental: false,
    category: 'Pro',
    pdf: false,
    pro: true,
    requiresAuth: true,
    freeUnlimited: false,
    maxOutputTokens: 130000,
  },
  {
    value: 'scira-glm',
    label: 'GLM 4.5',
    description: "Zhipu AI's previous advanced LLM",
    vision: false,
    reasoning: true,
    experimental: false,
    category: 'Pro',
    pdf: false,
    pro: true,
    requiresAuth: true,
    freeUnlimited: false,
    maxOutputTokens: 13000,
  },

];

// Helper functions for model access checks
export function getModelConfig(modelValue: string) {
  return models.find((model) => model.value === modelValue);
}

export function requiresAuthentication(modelValue: string): boolean {
  const model = getModelConfig(modelValue);
  return model?.requiresAuth || false;
}

export function requiresProSubscription(modelValue: string): boolean {
  const model = getModelConfig(modelValue);
  return model?.pro || false;
}

export function isFreeUnlimited(modelValue: string): boolean {
  const model = getModelConfig(modelValue);
  return model?.freeUnlimited || false;
}

export function hasVisionSupport(modelValue: string): boolean {
  const model = getModelConfig(modelValue);
  return model?.vision || false;
}

export function hasPdfSupport(modelValue: string): boolean {
  const model = getModelConfig(modelValue);
  return model?.pdf || false;
}

export function hasReasoningSupport(modelValue: string): boolean {
  const model = getModelConfig(modelValue);
  return model?.reasoning || false;
}

export function isExperimentalModel(modelValue: string): boolean {
  const model = getModelConfig(modelValue);
  return model?.experimental || false;
}

export function getMaxOutputTokens(modelValue: string): number {
  const model = getModelConfig(modelValue);
  return model?.maxOutputTokens || 8000;
}

export function getModelParameters(modelValue: string): ModelParameters {
  const model = getModelConfig(modelValue);
  return model?.parameters || {};
}

// Access control helper
export function canUseModel(modelValue: string, user: any, isProUser: boolean): { canUse: boolean; reason?: string } {
  const model = getModelConfig(modelValue);

  if (!model) {
    return { canUse: false, reason: 'Model not found' };
  }

  // Check if model requires authentication
  if (model.requiresAuth && !user) {
    return { canUse: false, reason: 'authentication_required' };
  }

  // Check if model requires Pro subscription
  if (model.pro && !isProUser) {
    return { canUse: false, reason: 'pro_subscription_required' };
  }

  return { canUse: true };
}

// Helper to check if user should bypass rate limits
export function shouldBypassRateLimits(modelValue: string, user: any): boolean {
  const model = getModelConfig(modelValue);
  return Boolean(user && model?.freeUnlimited);
}

// Get acceptable file types for a model
export function getAcceptedFileTypes(modelValue: string, isProUser: boolean): string {
  const model = getModelConfig(modelValue);
  if (model?.pdf && isProUser) {
    return 'image/*,.pdf';
  }
  return 'image/*';
}

// Check if a model supports extreme mode
export function supportsExtremeMode(modelValue: string): boolean {
  const model = getModelConfig(modelValue);
  return model?.extreme || false;
}

// Get models that support extreme mode
export function getExtremeModels(): Model[] {
  return models.filter((model) => model.extreme);
}

// Restricted regions for OpenAI and Anthropic models
const RESTRICTED_REGIONS = ['CN', 'KP', 'RU']; // China, North Korea, Russia

// Models that should be filtered in restricted regions
const OPENAI_MODELS = [
  'scira-gpt5',
  'scira-gpt5-mini',
  'scira-gpt5-nano',
  'scira-o3',
  'scira-gpt-oss-20',
  'scira-gpt-oss-120',
];

const ANTHROPIC_MODELS = ['scira-haiku', 'scira-anthropic'];

// Check if a model should be filtered based on region
export function isModelRestrictedInRegion(modelValue: string, countryCode?: string): boolean {
  if (!countryCode) return false;

  const isRestricted = RESTRICTED_REGIONS.includes(countryCode.toUpperCase());
  if (!isRestricted) return false;

  const isOpenAI = OPENAI_MODELS.includes(modelValue);
  const isAnthropic = ANTHROPIC_MODELS.includes(modelValue);

  return isOpenAI || isAnthropic;
}

// Filter models based on user's region
export function getFilteredModels(countryCode?: string): Model[] {
  if (!countryCode || !RESTRICTED_REGIONS.includes(countryCode.toUpperCase())) {
    return models;
  }

  return models.filter((model) => !isModelRestrictedInRegion(model.value, countryCode));
}

// Legacy arrays for backward compatibility (deprecated - use helper functions instead)
export const authRequiredModels = models.filter((m) => m.requiresAuth).map((m) => m.value);
export const proRequiredModels = models.filter((m) => m.pro).map((m) => m.value);
export const freeUnlimitedModels = models.filter((m) => m.freeUnlimited).map((m) => m.value);
