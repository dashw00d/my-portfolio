import Head from 'next/head';
import Link from 'next/link';
import { FormEvent, useCallback, useEffect, useMemo, useState } from 'react';
import {
  AlertCircle,
  AlertTriangle,
  ArrowLeft,
  Crown,
  Flame,
  Info,
  Plus,
  Target,
  TrendingUp,
  X,
  Zap,
} from 'lucide-react';

interface BenchmarkScores {
  sweBench: number;
  longHorizon: number;
  aime2025: number;
  gpqaDiamond: number;
  liveCodeBench: number;
}

interface Model {
  id: string;
  name: string;
  provider: string;
  inputPricePerM: number | null;
  outputPricePerM: number | null;
  monthlyCostOverride?: number;
  isSubscription?: boolean;
  subscriptionCost?: number;
  benchmarks: BenchmarkScores;
  intelligenceScore: number;
}

type CompetitiveStatus =
  | 'SUBSIDY_BREAKER'
  | 'SEVERE_PRESSURE'
  | 'EMERGING_PRESSURE'
  | 'LOW_PRESSURE'
  | 'BASELINE';

interface ModelWithAnalysis extends Model {
  monthlyCost: number | null;
  costPerIntelligence: number | null;
  intelligenceRatio: number;
  costVsOpusRatio: number | null;
  pressureRatio: number | null;
  pressureValue: number | null;
  competitiveStatus: CompetitiveStatus;
}

const STORAGE_KEY = 'modelCalcModels';
const SUBSIDIZED_BASELINE_MIN = 3000;
const SUBSIDIZED_BASELINE_MAX = 5000;
const MIN_THREAT_INTELLIGENCE_RATIO = 0.9;
const SUBSIDY_BREAKER_MIN_PRESSURE_VALUE = 70;
const SEVERE_PRESSURE_MIN_PRESSURE_VALUE = 45;
const EMERGING_PRESSURE_MIN_PRESSURE_VALUE = 25;
const DEFAULT_INPUT_TOKENS = 100;
const DEFAULT_OUTPUT_TOKENS = 140;
const CUSTOM_MODEL_PREFIX = 'custom-';

const DEFAULT_MODELS: Model[] = [
  {
    id: 'codex-5-3',
    name: 'Codex 5.3',
    provider: 'OpenAI',
    inputPricePerM: 1.75,
    outputPricePerM: 14,
    monthlyCostOverride: 1400,
    benchmarks: {
      sweBench: 82.8,
      longHorizon: 84,
      aime2025: 87,
      gpqaDiamond: 84,
      liveCodeBench: 85,
    },
    intelligenceScore: 103,
  },
  {
    id: 'minimax-m2-5',
    name: 'MiniMax M2.5',
    provider: 'MiniMax',
    inputPricePerM: 0.3,
    outputPricePerM: 1.2,
    monthlyCostOverride: 240,
    benchmarks: {
      sweBench: 80.2,
      longHorizon: 82,
      aime2025: 84,
      gpqaDiamond: 82,
      liveCodeBench: 83,
    },
    intelligenceScore: 102,
  },
  {
    id: 'qwen-3-5',
    name: 'Qwen 3.5',
    provider: 'Alibaba',
    inputPricePerM: 0.25,
    outputPricePerM: 1,
    monthlyCostOverride: 190,
    benchmarks: {
      sweBench: 75.8,
      longHorizon: 77,
      aime2025: 79,
      gpqaDiamond: 76,
      liveCodeBench: 77,
    },
    intelligenceScore: 96.5,
  },
  {
    id: 'glm-5',
    name: 'GLM-5',
    provider: 'Zhipu AI',
    inputPricePerM: 1,
    outputPricePerM: 3.2,
    monthlyCostOverride: 720,
    benchmarks: {
      sweBench: 77.8,
      longHorizon: 79,
      aime2025: 81,
      gpqaDiamond: 78,
      liveCodeBench: 79,
    },
    intelligenceScore: 98,
  },
  {
    id: 'claude-sonnet-4-6',
    name: 'Claude Sonnet 4.6',
    provider: 'Anthropic',
    inputPricePerM: 3,
    outputPricePerM: 15,
    monthlyCostOverride: 2400,
    benchmarks: {
      sweBench: 79.6,
      longHorizon: 80,
      aime2025: 82,
      gpqaDiamond: 79,
      liveCodeBench: 80,
    },
    intelligenceScore: 100,
  },
  {
    id: 'grok-4-2',
    name: 'Grok 4.2',
    provider: 'xAI',
    inputPricePerM: 3,
    outputPricePerM: 15,
    monthlyCostOverride: 2400,
    benchmarks: {
      sweBench: 72.5,
      longHorizon: 74,
      aime2025: 76,
      gpqaDiamond: 73,
      liveCodeBench: 74,
    },
    intelligenceScore: 98,
  },
  {
    id: 'gemini-3-1-pro',
    name: 'Gemini 3.1 Pro',
    provider: 'Google',
    inputPricePerM: 2,
    outputPricePerM: 12,
    monthlyCostOverride: 1650,
    benchmarks: {
      sweBench: 81,
      longHorizon: 82,
      aime2025: 84,
      gpqaDiamond: 81,
      liveCodeBench: 82,
    },
    intelligenceScore: 100,
  },
  {
    id: 'gpt-5-2',
    name: 'GPT-5.2',
    provider: 'OpenAI',
    inputPricePerM: 1.75,
    outputPricePerM: 14,
    monthlyCostOverride: 1400,
    benchmarks: {
      sweBench: 73,
      longHorizon: 74,
      aime2025: 76,
      gpqaDiamond: 73,
      liveCodeBench: 74,
    },
    intelligenceScore: 96,
  },
  {
    id: 'claude-opus-4-6',
    name: 'Claude Opus 4.6',
    provider: 'Anthropic',
    inputPricePerM: 5,
    outputPricePerM: 25,
    benchmarks: {
      sweBench: 81.5,
      longHorizon: 82,
      aime2025: 84,
      gpqaDiamond: 81,
      liveCodeBench: 82,
    },
    intelligenceScore: 101,
  },
];

const BENCHMARK_FIELDS: Array<{ key: keyof BenchmarkScores; label: string }> = [
  { key: 'sweBench', label: 'SWE-Bench Verified' },
  { key: 'longHorizon', label: 'Long Horizon' },
  { key: 'aime2025', label: 'AIME 2025' },
  { key: 'gpqaDiamond', label: 'GPQA Diamond' },
  { key: 'liveCodeBench', label: 'LiveCodeBench' },
];

const statusRowClassNames: Record<CompetitiveStatus, string> = {
  SUBSIDY_BREAKER: 'bg-danger-50/80',
  SEVERE_PRESSURE: 'bg-warning-50/80',
  EMERGING_PRESSURE: 'bg-brand-100/70',
  LOW_PRESSURE: '',
  BASELINE: 'bg-warning-50/70',
};

function createEmptyModel(): Omit<Model, 'id'> {
  return {
    name: '',
    provider: '',
    inputPricePerM: 0,
    outputPricePerM: 0,
    benchmarks: {
      sweBench: 0,
      longHorizon: 0,
      aime2025: 0,
      gpqaDiamond: 0,
      liveCodeBench: 0,
    },
    intelligenceScore: 0,
  };
}

function asNumber(value: string): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function asPositiveNumber(value: string): number {
  return Math.max(0, asNumber(value));
}

function asPercent(value: string): number {
  return Math.min(100, Math.max(0, asNumber(value)));
}

function formatCurrency(value: number): string {
  return `$${value.toFixed(2)}`;
}

function formatPercent(value: number, decimals = 1): string {
  return `${(value * 100).toFixed(decimals)}%`;
}

function formatRatio(value: number, decimals = 2): string {
  return `${value.toFixed(decimals)}x`;
}

function BrainIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 36 36"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <path
        fill="#ea596e"
        d="M29.896 26.667c.003.283-.07.653-.146.958c-.531 2.145-2.889 4.552-6.208 4.333c-3.008-.198-5.458-1.642-5.458-3.667s2.444-3.667 5.458-3.667s6.335.018 6.354 2.043"
      />
      <path
        fill="#dd2e44"
        d="M23.542 24.964c-1.619 0-5.314.448-6.162.448c-1.498 0-2.713.94-2.713 2.1c0 .558.286 1.062.744 1.438c0 0 1.006 1.009 2.818.525c.793-.212 2.083-1.786 4.354-2.036c1.131-.125 3.25.75 6.974.771c.16-.344.193-.583.193-.583c0-2.027-3.194-2.663-6.208-2.663"
      />
      <path
        fill="#f4abba"
        d="M29.75 27.625s2.184-.443 3.542-2.229c1.583-2.083 1.375-4.312 1.375-4.312c1.604-3-.5-5.813-.5-5.813C33.958 12.104 32 10.792 32 10.792c-1.271-3.021-4.083-3.833-4.083-3.833c-2.208-2.583-6.125-2.5-6.125-2.5s-3.67-1.345-8.708.167c-.833.25-3.625.833-5.667 2.083C.981 10.649.494 16.793.584 17.792C1.083 23.375 5 24.375 7.5 24.958c.583 1.583 2.729 4.5 6.583 3.417c4.75-.833 6.75-2.25 7.917-2.25s4.417 1.25 7.75 1.5"
      />
      <g fill="#ea596e">
        <path d="M17.737 18.648c2.328-1.255 3.59-1.138 4.704-1.037c.354.032.689.057 1.028.055c1.984-.045 3.591-.881 4.302-1.69a.501.501 0 0 0-.752-.661c-.548.624-1.899 1.313-3.573 1.351c-.3.009-.601-.021-.913-.05c-1.195-.111-2.679-.247-5.271 1.152c-.665.359-1.577.492-2.565.592c-2.197-3.171-.875-5.933-.497-6.591c.037.002.073.014.111.014c.4 0 .802-.098 1.166-.304a.5.5 0 0 0-.492-.87a1.426 1.426 0 0 1-1.88-.467a.5.5 0 0 0-.841.539c.237.371.571.65.948.837c-.521 1.058-1.51 3.84.372 6.951c-1.324.13-2.65.317-3.688.986a7.2 7.2 0 0 0-1.878 1.791c-.629-.108-2.932-.675-3.334-3.231c.25-.194.452-.45.577-.766a.5.5 0 1 0-.93-.368a.77.77 0 0 1-.454.461a.78.78 0 0 1-.643-.07a.5.5 0 0 0-.486.874c.284.158.588.238.89.238c.037 0 .072-.017.109-.019c.476 2.413 2.383 3.473 3.732 3.794a3.7 3.7 0 0 0-.331 1.192a.5.5 0 0 0 .454.542l.045.002a.5.5 0 0 0 .498-.456c.108-1.213 1.265-2.48 2.293-3.145c.964-.621 2.375-.752 3.741-.879c1.325-.121 2.577-.237 3.558-.767m12.866-1.504a.5.5 0 0 0 .878.48c.019-.034 1.842-3.449-1.571-5.744a.5.5 0 0 0-.558.83c2.644 1.778 1.309 4.326 1.251 4.434M9.876 9.07a.5.5 0 0 0 .406-.208c1.45-2.017 3.458-1.327 3.543-1.295a.5.5 0 0 0 .345-.938c-.96-.356-3.177-.468-4.7 1.65a.5.5 0 0 0 .406.791m13.072-1.888c2.225-.181 3.237 1.432 3.283 1.508a.5.5 0 0 0 .863-.507c-.054-.091-1.34-2.218-4.224-1.998a.5.5 0 0 0 .078.997m9.15 14.611c-.246-.014-.517.181-.539.457c-.002.018-.161 1.719-1.91 2.294a.499.499 0 0 0 .157.975a.5.5 0 0 0 .156-.025c2.372-.778 2.586-3.064 2.594-3.161a.5.5 0 0 0-.458-.54" />
        <path d="M7.347 16.934a.5.5 0 1 0 .965.26a1.423 1.423 0 0 1 1.652-1.014a.5.5 0 0 0 .205-.979a2.35 2.35 0 0 0-1.248.086c-1.166-1.994-.939-3.96-.936-3.981a.5.5 0 0 0-.429-.562a.503.503 0 0 0-.562.427c-.013.097-.28 2.316 1.063 4.614a2.4 2.4 0 0 0-.71 1.149m11.179-2.47a1.07 1.07 0 0 1 1.455.015a.5.5 0 0 0 .707-.011a.5.5 0 0 0-.01-.707a2 2 0 0 0-.797-.465c.296-1.016.179-1.467-.096-2.312a21 21 0 0 1-.157-.498l-.03-.1c-.364-1.208-.605-2.005.087-3.13a.5.5 0 0 0-.852-.524c-.928 1.508-.587 2.637-.192 3.944l.03.1q.088.29.163.517c.247.761.322 1.016.02 1.936a2 2 0 0 0-1.01.504a.5.5 0 0 0 .682.731m6.365-2.985a2 2 0 0 0 .859-.191a.5.5 0 0 0-.426-.905a1.07 1.07 0 0 1-1.384-.457a.5.5 0 1 0-.881.472c.18.336.448.601.76.785c-.537 1.305-.232 2.691.017 3.426a.5.5 0 1 0 .947-.319c-.168-.498-.494-1.756-.002-2.826c.038.002.073.015.11.015m4.797 9.429a.497.497 0 0 0-.531-.467a1.825 1.825 0 0 1-1.947-1.703a.51.51 0 0 0-.533-.465a.5.5 0 0 0-.465.533c.041.59.266 1.122.608 1.555c-.804.946-1.857 1.215-2.444 1.284c-.519.062-.973.009-1.498-.053c-.481-.055-1.025-.118-1.698-.098l-.005.001c-.02-.286-.088-.703-.305-1.05a.501.501 0 0 0-.847.531c.134.215.159.558.159.725c-.504.181-.94.447-1.334.704c-.704.458-1.259.82-2.094.632c-.756-.173-1.513-.208-2.155-.118c-.1-.251-.258-.551-.502-.782a.5.5 0 0 0-.687.727c.086.081.154.199.209.317c-1.103.454-1.656 1.213-1.682 1.25a.499.499 0 0 0 .407.788a.5.5 0 0 0 .406-.205c.005-.008.554-.743 1.637-1.04c.56-.154 1.363-.141 2.146.037c.219.05.422.067.619.07c.093.218.129.477.134.573a.5.5 0 0 0 .499.472l.027-.001a.5.5 0 0 0 .473-.523a3 3 0 0 0-.13-.686c.461-.167.862-.428 1.239-.673c.572-.373 1.113-.726 1.82-.749c.592-.021 1.08.036 1.551.091c.474.055.94.091 1.454.061c.091.253.084.591.07.704a.503.503 0 0 0 .497.563a.5.5 0 0 0 .495-.435a2.9 2.9 0 0 0-.059-.981a4.67 4.67 0 0 0 2.345-1.471a2.8 2.8 0 0 0 1.656.413a.5.5 0 0 0 .465-.531" />
      </g>
    </svg>
  );
}

function MoneyIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 128 128"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <path
        fill="#ffca28"
        d="M93.46 39.45c6.71-1.49 15.45-8.15 16.78-11.43c.78-1.92-3.11-4.92-4.15-6.13c-2.38-2.76-1.42-4.12-.5-7.41c1.05-3.74-1.44-7.87-4.97-9.49s-7.75-1.11-11.3.47s-6.58 4.12-9.55 6.62c-2.17-1.37-5.63-7.42-11.23-3.49c-3.87 2.71-4.22 8.61-3.72 13.32c1.17 10.87 3.85 16.51 8.9 18.03c6.38 1.92 13.44.91 19.74-.49"
      />
      <path
        fill="#e2a610"
        d="M104.36 8.18c-.85 14.65-15.14 24.37-21.92 28.65l4.4 3.78s2.79.06 6.61-1.16c6.55-2.08 16.12-7.96 16.78-11.43c.97-5.05-4.21-3.95-5.38-7.94c-.61-2.11 2.97-6.1-.49-11.9m-24.58 3.91s-2.55-2.61-4.44-3.8c-.94 1.77-1.61 3.69-1.94 5.67c-.59 3.48 0 8.42 1.39 12.1c.22.57 1.04.48 1.13-.12c1.2-7.91 3.86-13.85 3.86-13.85"
      />
      <path
        fill="#ffca28"
        d="M61.96 38.16S30.77 41.53 16.7 68.61s-2.11 43.5 10.55 49.48s44.56 8.09 65.31 3.17s25.94-15.12 24.97-24.97c-1.41-14.38-14.77-23.22-14.77-23.22s.53-17.76-13.25-29.29c-12.23-10.24-27.55-5.62-27.55-5.62"
      />
      <path
        fill="#6b4b46"
        d="M74.76 83.73c-6.69-8.44-14.59-9.57-17.12-12.6c-1.38-1.65-2.19-3.32-1.88-5.39c.33-2.2 2.88-3.72 4.86-4.09c2.31-.44 7.82-.21 12.45 4.2c1.1 1.04.7 2.66.67 4.11c-.08 3.11 4.37 6.13 7.97 3.53c3.61-2.61.84-8.42-1.49-11.24c-1.76-2.13-8.14-6.82-16.07-7.56c-2.23-.21-11.2-1.54-16.38 8.31c-1.49 2.83-2.04 9.67 5.76 15.45c1.63 1.21 10.09 5.51 12.44 8.3c4.07 4.83 1.28 9.08-1.9 9.64c-8.67 1.52-13.58-3.17-14.49-5.74c-.65-1.83.03-3.81-.81-5.53c-.86-1.77-2.62-2.47-4.48-1.88c-6.1 1.94-4.16 8.61-1.46 12.28c2.89 3.93 6.44 6.3 10.43 7.6c14.89 4.85 22.05-2.81 23.3-8.42c.92-4.11.82-7.67-1.8-10.97"
      />
      <path
        fill="none"
        stroke="#6b4b46"
        strokeMiterlimit={10}
        strokeWidth={5}
        d="M71.16 48.99c-12.67 27.06-14.85 61.23-14.85 61.23"
      />
      <path
        fill="#6d4c41"
        d="M81.67 31.96c8.44 2.75 10.31 10.38 9.7 12.46c-.73 2.44-10.08-7.06-23.98-6.49c-4.86.2-3.45-2.78-1.2-4.5c2.97-2.27 7.96-3.91 15.48-1.47"
      />
      <path
        fill="#6b4b46"
        d="M81.67 31.96c8.44 2.75 10.31 10.38 9.7 12.46c-.73 2.44-10.08-7.06-23.98-6.49c-4.86.2-3.45-2.78-1.2-4.5c2.97-2.27 7.96-3.91 15.48-1.47"
      />
      <path
        fill="#e2a610"
        d="M96.49 58.86c1.06-.73 4.62.53 5.62 7.5c.49 3.41.64 6.71.64 6.71s-4.2-3.77-5.59-6.42c-1.75-3.35-2.43-6.59-.67-7.79"
      />
    </svg>
  );
}

function StatusBadge({ status }: { status: CompetitiveStatus }) {
  if (status === 'SUBSIDY_BREAKER') {
    return (
      <span className="inline-flex items-center gap-1 rounded-full border border-danger-300 bg-danger-100 px-2.5 py-1 text-xs font-semibold text-danger-700">
        <Flame className="h-3.5 w-3.5" />
        Breaker
      </span>
    );
  }

  if (status === 'SEVERE_PRESSURE') {
    return (
      <span className="inline-flex items-center gap-1 rounded-full border border-warning-300 bg-warning-100 px-2.5 py-1 text-xs font-semibold text-warning-800">
        <AlertTriangle className="h-3.5 w-3.5" />
        Severe
      </span>
    );
  }

  if (status === 'EMERGING_PRESSURE') {
    return (
      <span className="inline-flex items-center gap-1 rounded-full border border-brand-300 bg-brand-100 px-2.5 py-1 text-xs font-semibold text-brand-800">
        <Target className="h-3.5 w-3.5" />
        Emerging
      </span>
    );
  }

  if (status === 'BASELINE') {
    return (
      <span className="inline-flex items-center gap-1 rounded-full border border-warning-300 bg-warning-100 px-2.5 py-1 text-xs font-semibold text-warning-800">
        <Crown className="h-3.5 w-3.5" />
        Baseline
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-zinc-300 bg-zinc-100 px-2.5 py-1 text-xs font-semibold text-zinc-700">
      Low
    </span>
  );
}

export default function ModelCalcPage() {
  const [models, setModels] = useState<Model[]>(DEFAULT_MODELS);
  const [hasLoadedStorage, setHasLoadedStorage] = useState(false);

  const [inputTokens, setInputTokens] = useState<number>(DEFAULT_INPUT_TOKENS);
  const [outputTokens, setOutputTokens] = useState<number>(DEFAULT_OUTPUT_TOKENS);
  const [subscriptionCost, setSubscriptionCost] = useState<number>(200);

  const [isAddModelOpen, setIsAddModelOpen] = useState(false);
  const [newModel, setNewModel] = useState<Omit<Model, 'id'>>(createEmptyModel);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);

    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const customModels = (parsed as Model[]).filter(
            (model) => typeof model.id === 'string' && model.id.startsWith(CUSTOM_MODEL_PREFIX),
          );
          setModels([...DEFAULT_MODELS, ...customModels]);
        }
      } catch {
        setModels(DEFAULT_MODELS);
      }
    }

    setHasLoadedStorage(true);
  }, []);

  useEffect(() => {
    if (!hasLoadedStorage) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(models));
  }, [hasLoadedStorage, models]);

  useEffect(() => {
    if (!isAddModelOpen) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsAddModelOpen(false);
        setFormError(null);
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isAddModelOpen]);

  const calculateIntelligenceScore = useCallback((benchmarks: BenchmarkScores): number => {
    return (
      Math.round(
        (
          benchmarks.sweBench * 0.25 +
          benchmarks.longHorizon * 0.15 +
          benchmarks.aime2025 * 0.2 +
          benchmarks.gpqaDiamond * 0.15 +
          benchmarks.liveCodeBench * 0.25
        ) * 100,
      ) / 100
    );
  }, []);

  const baselineModel = useMemo(
    () => models.find((model) => model.id === 'claude-opus-4-6'),
    [models],
  );

  const baselineIntelligence = baselineModel?.intelligenceScore ?? 0;

  const trueAPIValue = useMemo(() => {
    if (!baselineModel) return 0;
    if (typeof baselineModel.monthlyCostOverride === 'number') {
      return baselineModel.monthlyCostOverride;
    }

    const inputPrice = baselineModel.inputPricePerM ?? 0;
    const outputPrice = baselineModel.outputPricePerM ?? 0;
    return inputPrice * inputTokens + outputPrice * outputTokens;
  }, [baselineModel, inputTokens, outputTokens]);

  const calculateMonthlyCost = useCallback(
    (model: Model): number | null => {
      if (typeof model.monthlyCostOverride === 'number') {
        return model.monthlyCostOverride;
      }

      if (model.isSubscription) {
        return model.subscriptionCost ?? subscriptionCost;
      }

      if (model.inputPricePerM === null || model.outputPricePerM === null) {
        return null;
      }

      return model.inputPricePerM * inputTokens + model.outputPricePerM * outputTokens;
    },
    [inputTokens, outputTokens, subscriptionCost],
  );

  const analyzeCompetitivePosition = useCallback(
    (
      model: Model,
      pressureValue: number | null,
    ): CompetitiveStatus => {
      if (!baselineModel || model.id === baselineModel.id) {
        return 'BASELINE';
      }

      if (model.isSubscription || pressureValue === null) {
        return 'LOW_PRESSURE';
      }

      if (pressureValue >= SUBSIDY_BREAKER_MIN_PRESSURE_VALUE) {
        return 'SUBSIDY_BREAKER';
      }

      if (pressureValue >= SEVERE_PRESSURE_MIN_PRESSURE_VALUE) {
        return 'SEVERE_PRESSURE';
      }

      if (pressureValue >= EMERGING_PRESSURE_MIN_PRESSURE_VALUE) {
        return 'EMERGING_PRESSURE';
      }

      return 'LOW_PRESSURE';
    },
    [baselineModel],
  );

  const analyzedModels: ModelWithAnalysis[] = useMemo(
    () =>
      models.map((model) => {
        const isBaseline = baselineModel?.id === model.id;
        const monthlyCost = calculateMonthlyCost(model);
        const intelligenceRatio =
          baselineIntelligence > 0 ? model.intelligenceScore / baselineIntelligence : 0;
        const costVsOpusRatio =
          monthlyCost !== null && trueAPIValue > 0 ? monthlyCost / trueAPIValue : null;
        const computedPressureRatio =
          monthlyCost !== null && subscriptionCost > 0 && intelligenceRatio > 0
            ? (monthlyCost / subscriptionCost) / intelligenceRatio
            : null;
        const pressureRatio = isBaseline ? null : computedPressureRatio;
        const intelligenceGate =
          intelligenceRatio <= MIN_THREAT_INTELLIGENCE_RATIO
            ? 0
            : Math.min(
                1,
                (intelligenceRatio - MIN_THREAT_INTELLIGENCE_RATIO) /
                  (1 - MIN_THREAT_INTELLIGENCE_RATIO),
              );
        const ratioThreatFactor =
          pressureRatio === null
            ? 0
            : Math.exp(-0.45 * Math.max(0, pressureRatio - 1));
        const computedPressureValue =
          isBaseline || model.isSubscription || pressureRatio === null
            ? null
            : Math.max(
                0,
                Math.min(
                  100,
                  ratioThreatFactor * intelligenceGate * 100,
                ),
              );
        const pressureValue = computedPressureValue;
        const costPerIntelligence =
          monthlyCost === null || model.intelligenceScore === 0
            ? null
            : monthlyCost / model.intelligenceScore;
        const competitiveStatus = analyzeCompetitivePosition(model, pressureValue);

        return {
          ...model,
          monthlyCost,
          costPerIntelligence,
          intelligenceRatio,
          costVsOpusRatio,
          pressureRatio,
          pressureValue,
          competitiveStatus,
        };
      }),
    [
      models,
      calculateMonthlyCost,
      analyzeCompetitivePosition,
      baselineModel,
      baselineIntelligence,
      subscriptionCost,
      trueAPIValue,
    ],
  );

  const subsidyBreakerModels = useMemo(
    () => analyzedModels.filter((model) => model.competitiveStatus === 'SUBSIDY_BREAKER'),
    [analyzedModels],
  );

  const severePressureModels = useMemo(
    () => analyzedModels.filter((model) => model.competitiveStatus === 'SEVERE_PRESSURE'),
    [analyzedModels],
  );

  const emergingPressureModels = useMemo(
    () => analyzedModels.filter((model) => model.competitiveStatus === 'EMERGING_PRESSURE'),
    [analyzedModels],
  );

  const sortedModels = useMemo(() => {
    const baselineId = baselineModel?.id;

    return [...analyzedModels].sort((a, b) => {
      if (baselineId && a.id === baselineId) return -1;
      if (baselineId && b.id === baselineId) return 1;

      const pressureValueA = a.pressureValue ?? -1;
      const pressureValueB = b.pressureValue ?? -1;

      if (pressureValueB !== pressureValueA) {
        return pressureValueB - pressureValueA;
      }

      if (a.pressureRatio !== null && b.pressureRatio !== null && a.pressureRatio !== b.pressureRatio) {
        return a.pressureRatio - b.pressureRatio;
      }

      return b.intelligenceRatio - a.intelligenceRatio;
    });
  }, [analyzedModels, baselineModel]);

  const lossBeingEaten = Math.max(0, trueAPIValue - subscriptionCost);
  const subsidyMultiplier = subscriptionCost > 0 ? trueAPIValue / subscriptionCost : 0;
  const isWithinSubsidizedRange =
    trueAPIValue >= SUBSIDIZED_BASELINE_MIN && trueAPIValue <= SUBSIDIZED_BASELINE_MAX;

  const closeAddModelDialog = () => {
    setIsAddModelOpen(false);
    setFormError(null);
  };

  const handleAddModel = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const modelName = newModel.name.trim();
    const providerName = newModel.provider.trim();

    if (!modelName || !providerName) {
      setFormError('Model name and provider are required.');
      return;
    }

    const modelToAdd: Model = {
      ...newModel,
      id: `${CUSTOM_MODEL_PREFIX}${Date.now()}`,
      name: modelName,
      provider: providerName,
      inputPricePerM: Math.max(0, newModel.inputPricePerM ?? 0),
      outputPricePerM: Math.max(0, newModel.outputPricePerM ?? 0),
      intelligenceScore:
        newModel.intelligenceScore || calculateIntelligenceScore(newModel.benchmarks),
    };

    setModels((previous) => [...previous, modelToAdd]);
    setNewModel(createEmptyModel());
    setFormError(null);
    setIsAddModelOpen(false);
  };

  const handleDeleteModel = (id: string) => {
    if (!id.startsWith(CUSTOM_MODEL_PREFIX)) return;
    setModels((previous) => previous.filter((model) => model.id !== id));
  };

  const handleReset = () => {
    setModels(DEFAULT_MODELS);
    window.localStorage.removeItem(STORAGE_KEY);
  };

  const updateBenchmark = (key: keyof BenchmarkScores, value: number) => {
    setNewModel((previous) => {
      const benchmarks = { ...previous.benchmarks, [key]: value };
      return {
        ...previous,
        benchmarks,
        intelligenceScore: calculateIntelligenceScore(benchmarks),
      };
    });
  };

  return (
    <>
      <Head>
        <title>Model Calc | API Competitive Analysis</title>
        <meta
          name="description"
          content="Compare model pricing and intelligence with pressure ratios to detect non-subsidized threats to a subsidized baseline."
        />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-brand-50 via-white to-accent-50/60">
        <header className="sticky top-0 z-40 border-b border-zinc-200 bg-white/85 backdrop-blur">
          <div className="mx-auto flex w-full max-w-7xl flex-wrap items-center justify-between gap-3 px-6 py-3">
            <div className="flex items-center gap-3">
              <Link
                href="/"
                className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-3 py-1.5 text-sm font-semibold text-zinc-700 shadow-sm transition hover:border-brand-200 hover:text-brand-700"
              >
                <ArrowLeft className="h-4 w-4" />
                Back home
              </Link>

              <div className="hidden h-6 w-px bg-zinc-200 sm:block" />

              <div className="flex items-center gap-2">
                <div className="relative">
                  <Target className="h-6 w-6 text-brand-700" />
                  <span className="absolute inset-0 rounded-full bg-brand-500/20 blur-sm" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-sm font-semibold uppercase tracking-wide text-brand-700">
                    Model Calc
                  </p>
                  <h1 className="text-lg font-bold text-zinc-900 sm:text-xl">
                    API Model Competitive Intelligence
                  </h1>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={handleReset}
              className="rounded-xl border border-zinc-300 bg-white px-4 py-2 text-sm font-semibold text-zinc-700 shadow-sm transition hover:border-warning-300 hover:bg-warning-50 hover:text-warning-800"
            >
              Reset data
            </button>
          </div>
        </header>

        <main className="mx-auto w-full max-w-7xl space-y-4 px-6 py-5">
          <section className="rounded-2xl border border-warning-200 bg-warning-50/80 p-4 shadow-sm">
            <div className="flex items-start gap-3">
              <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-warning-700" />
              <div>
                <p className="font-semibold text-warning-900">Market distortion warning</p>
                <p className="mt-1 text-sm text-warning-900/85">
                  The {formatCurrency(subscriptionCost)} Max plan is treated as a subsidized
                  baseline. Focus on pressure ratio:
                  {' '}
                  <span className="font-semibold">(cost vs Max plan) / (intelligence vs Opus)</span>.
                  Lower is more dangerous. High pressure now requires near-Opus intelligence and
                  API cost that is close to Max-plan economics.
                </p>
              </div>
            </div>
          </section>

          {subsidyBreakerModels.length > 0 && (
            <section className="rounded-2xl border border-danger-300 bg-danger-50 p-4 shadow-sm">
              <div className="flex items-start gap-3">
                <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-danger-700" />
                <div>
                  <p className="flex items-center gap-2 font-semibold text-danger-800">
                    <Flame className="h-4 w-4" />
                    Critical: {subsidyBreakerModels.length} model
                    {subsidyBreakerModels.length > 1 ? 's are' : ' is'} subsidy breaker risk
                  </p>
                  <p className="mt-1 text-sm text-danger-800/90">
                    {subsidyBreakerModels.map((model) => model.name).join(', ')} deliver near-
                    Opus intelligence at a tiny fraction of Opus-equivalent cost.
                  </p>
                </div>
              </div>
            </section>
          )}

          {subsidyBreakerModels.length === 0 && severePressureModels.length > 0 && (
            <section className="rounded-2xl border border-brand-200 bg-brand-50/80 p-4 shadow-sm">
              <p className="text-sm text-brand-900">
                {severePressureModels.length} model
                {severePressureModels.length > 1 ? 's are' : ' is'} in severe pressure territory.
                These are close enough to Opus intelligence with much better cost-intelligence
                ratio to threaten the subsidy strategy.
              </p>
            </section>
          )}

          {subsidyBreakerModels.length === 0 &&
            severePressureModels.length === 0 &&
            emergingPressureModels.length > 0 && (
              <section className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4 shadow-sm">
                <p className="text-sm text-zinc-700">
                  {emergingPressureModels.length} model
                  {emergingPressureModels.length > 1 ? 's are' : ' is'} on the watchlist. They are
                  not immediate subsidy breakers, but ratios are trending in that direction.
                </p>
              </section>
            )}

          <section className="grid gap-4 py-0 md:grid-cols-3">
            <article className="rounded-2xl border border-zinc-200 bg-white/90 p-4 shadow-sm">
              <p className="flex items-center gap-2 text-sm font-semibold text-zinc-600">
                <Info className="h-4 w-4 text-brand-700" />
                Claude Max subscription
              </p>
              <p className="mt-1.5 text-3xl font-bold text-brand-800">
                {formatCurrency(subscriptionCost)}/mo
              </p>
              <p className="mt-0.5 text-sm text-zinc-500">List price used as the subsidy anchor.</p>
            </article>

            <article className="rounded-2xl border border-zinc-200 bg-white/90 p-4 shadow-sm">
              <p className="flex items-center gap-2 text-sm font-semibold text-zinc-600">
                <TrendingUp className="h-4 w-4 text-success-700" />
                True API value
              </p>
              <p className="mt-1.5 text-3xl font-bold text-success-700">
                {formatCurrency(trueAPIValue)}
              </p>
              <p
                className={`mt-1 text-sm ${
                  isWithinSubsidizedRange ? 'text-success-700' : 'text-warning-700'
                }`}
              >
                Opus-equivalent range target: {formatCurrency(SUBSIDIZED_BASELINE_MIN)}-
                {formatCurrency(SUBSIDIZED_BASELINE_MAX)}.
              </p>
            </article>

            <article className="rounded-2xl border border-zinc-200 bg-white/90 p-4 shadow-sm">
              <p className="flex items-center gap-2 text-sm font-semibold text-zinc-600">
                <AlertTriangle className="h-4 w-4 text-danger-700" />
                Subsidy gap
              </p>
              <p className="mt-1.5 text-3xl font-bold text-danger-700">
                {formatCurrency(lossBeingEaten)}
              </p>
              <p className="mt-1 text-sm text-zinc-500">
                About {subsidyMultiplier.toFixed(1)}x the plan price in Opus API value.
              </p>
            </article>
          </section>

          <section className="rounded-2xl border border-zinc-200 bg-white/90 p-6 shadow-sm">
            <h2 className="flex items-center gap-2 text-lg font-bold text-zinc-900">
              <Zap className="h-5 w-5 text-brand-700" />
              Usage volume configuration
            </h2>
            <p className="mt-1 text-sm text-zinc-600">
              Token values are in millions per month and set the Opus reference spend.
              Flagship rows use fixed market-chart monthly values; custom rows use live token
              math.
            </p>

            <div className="mt-5 grid gap-4 md:grid-cols-3">
              <label className="space-y-2">
                <span className="text-sm font-semibold text-zinc-700">
                  Input tokens (millions/month)
                </span>
                <input
                  id="inputTokens"
                  type="number"
                  min={0}
                  step={0.01}
                  value={inputTokens}
                  onChange={(event) => setInputTokens(asPositiveNumber(event.target.value))}
                  className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2.5 text-sm text-zinc-900 shadow-sm transition focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100"
                />
              </label>

              <label className="space-y-2">
                <span className="text-sm font-semibold text-zinc-700">
                  Output tokens (millions/month)
                </span>
                <input
                  id="outputTokens"
                  type="number"
                  min={0}
                  step={0.01}
                  value={outputTokens}
                  onChange={(event) => setOutputTokens(asPositiveNumber(event.target.value))}
                  className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2.5 text-sm text-zinc-900 shadow-sm transition focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100"
                />
              </label>

              <label className="space-y-2">
                <span className="text-sm font-semibold text-zinc-700">Baseline subscription ($/month)</span>
                <input
                  id="subscriptionCost"
                  type="number"
                  min={0}
                  step={1}
                  value={subscriptionCost}
                  onChange={(event) => setSubscriptionCost(asPositiveNumber(event.target.value))}
                  className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2.5 text-sm text-zinc-900 shadow-sm transition focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100"
                />
              </label>
            </div>

            <p
              className={`mt-3 text-sm font-medium ${
                isWithinSubsidizedRange ? 'text-success-700' : 'text-warning-700'
              }`}
            >
              Current Opus-equivalent baseline is {formatCurrency(trueAPIValue)}
              {isWithinSubsidizedRange
                ? ' (within the $3,000-$5,000 subsidized range).'
                : ' (outside the $3,000-$5,000 subsidized range).'}
            </p>
          </section>

          <section className="rounded-2xl border border-zinc-200 bg-white/90 p-6 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-bold text-zinc-900">Model comparison matrix</h2>
                <p className="text-sm text-zinc-600">
                  Opus baseline is pinned first; all other rows are sorted by pressure value
                  (highest threat first).
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsAddModelOpen(true)}
                className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-brand-700"
              >
                <Plus className="h-4 w-4" />
                Add custom model
              </button>
            </div>

            <div className="mt-3 overflow-x-auto rounded-xl border border-zinc-200">
              <table className="w-full border-collapse text-sm">
                <thead className="bg-zinc-50">
                  <tr className="text-left text-[11px] uppercase tracking-wide text-zinc-600">
                    <th className="px-3 py-2.5 font-semibold">Model</th>
                    <th className="px-3 py-2.5 text-left font-semibold">I/O $/M</th>
                    <th className="px-3 py-2.5 text-left font-semibold">Monthly</th>
                    <th className="px-3 py-2.5 text-left font-semibold">Intel / SWE</th>
                    <th className="px-3 py-2.5 text-left font-semibold">vs Opus</th>
                    <th className="px-3 py-2.5 text-left font-semibold">Pressure</th>
                    <th className="px-3 py-2.5 text-left font-semibold">Status</th>
                    <th className="px-2 py-2.5 text-left font-semibold">&nbsp;</th>
                  </tr>
                </thead>

                <tbody>
                  {sortedModels.map((model) => (
                    <tr
                      key={model.id}
                      className={`border-t border-zinc-200 transition hover:bg-zinc-50 ${statusRowClassNames[model.competitiveStatus]}`}
                    >
                      <td className="px-3 py-2.5 align-top">
                        <div className="flex flex-col">
                          <span
                            className={`font-semibold ${
                              model.id === baselineModel?.id ? 'text-warning-800' : 'text-zinc-900'
                            }`}
                          >
                            {model.name}
                          </span>
                          <span className="text-[11px] text-zinc-500">{model.provider}</span>
                        </div>
                      </td>

                      <td className="px-3 py-2.5 text-left font-mono text-xs text-zinc-700">
                        {`${
                          model.inputPricePerM === null
                            ? '-'
                            : formatCurrency(model.inputPricePerM)
                        } / ${
                          model.outputPricePerM === null
                            ? '-'
                            : formatCurrency(model.outputPricePerM)
                        }`}
                      </td>

                      <td className="px-3 py-2.5 text-left font-mono text-xs">
                        {model.monthlyCost === null ? (
                          <span className="text-zinc-500">-</span>
                        ) : (
                          <>
                            <div
                              className={
                                model.costVsOpusRatio !== null && model.costVsOpusRatio <= 0.4
                                  ? 'text-success-800'
                                  : model.costVsOpusRatio !== null && model.costVsOpusRatio <= 0.65
                                    ? 'text-warning-800'
                                    : 'text-zinc-800'
                              }
                            >
                              {formatCurrency(model.monthlyCost)}
                            </div>
                            {model.costPerIntelligence !== null && (
                              <div className="text-[11px] text-zinc-500">
                                {formatCurrency(model.costPerIntelligence)}/intel
                              </div>
                            )}
                          </>
                        )}
                      </td>

                      <td className="px-3 py-2.5 text-left font-mono text-xs">
                        <div
                          className={
                            model.intelligenceRatio >= MIN_THREAT_INTELLIGENCE_RATIO
                              ? 'text-brand-800'
                              : 'text-zinc-700'
                          }
                        >
                          {model.intelligenceScore.toFixed(1)}
                        </div>
                        <div className="text-[11px] text-zinc-500">
                          {model.benchmarks.sweBench}% SWE
                        </div>
                      </td>

                      <td className="px-3 py-2.5 text-left text-xs">
                        <div className="flex flex-col gap-0.5">
                          <div className="inline-flex items-center gap-1.5 text-zinc-700">
                            <BrainIcon className="h-3.5 w-3.5" />
                            <span className="font-mono whitespace-nowrap">
                              {formatPercent(model.intelligenceRatio)}
                            </span>
                          </div>
                          <div
                            className={`inline-flex items-center gap-1.5 ${
                              model.costVsOpusRatio === null
                                ? 'text-zinc-500'
                                : model.costVsOpusRatio <= 0.4
                                  ? 'text-success-800'
                                  : model.costVsOpusRatio <= 0.65
                                    ? 'text-warning-800'
                                    : 'text-zinc-700'
                            }`}
                          >
                            <MoneyIcon className="h-3.5 w-3.5" />
                            <span className="font-mono whitespace-nowrap">
                              {model.costVsOpusRatio === null
                                ? '-'
                                : formatPercent(model.costVsOpusRatio)}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="px-3 py-2.5 text-left font-mono text-xs">
                        {model.pressureRatio === null ? (
                          <span className="text-zinc-500">-</span>
                        ) : (
                          <>
                            <div
                              className={
                                model.pressureValue !== null &&
                                model.pressureValue >= SUBSIDY_BREAKER_MIN_PRESSURE_VALUE
                                  ? 'text-danger-700'
                                  : model.pressureValue !== null &&
                                    model.pressureValue >= SEVERE_PRESSURE_MIN_PRESSURE_VALUE
                                    ? 'text-warning-800'
                                    : model.pressureValue !== null &&
                                      model.pressureValue >=
                                        EMERGING_PRESSURE_MIN_PRESSURE_VALUE
                                      ? 'text-brand-800'
                                      : 'text-zinc-700'
                              }
                            >
                              {formatRatio(model.pressureRatio)}
                            </div>
                            <div className="text-[11px] text-zinc-500">
                              score {model.pressureValue?.toFixed(1) ?? '-'}
                            </div>
                          </>
                        )}
                      </td>

                      <td className="px-3 py-2.5 text-left">
                        <StatusBadge status={model.competitiveStatus} />
                      </td>

                      <td className="px-2 py-2.5 text-left">
                        {model.id.startsWith(CUSTOM_MODEL_PREFIX) && (
                          <button
                            type="button"
                            onClick={() => handleDeleteModel(model.id)}
                            className="inline-flex h-7 w-7 items-center justify-center rounded-full text-zinc-500 transition hover:bg-danger-100 hover:text-danger-700"
                            aria-label={`Delete ${model.name}`}
                          >
                            <X className="h-4 w-4" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="rounded-2xl border border-zinc-200 bg-white/90 p-6 shadow-sm">
            <h2 className="text-sm font-bold uppercase tracking-wide text-zinc-700">Status legend</h2>
            <div className="mt-3 grid gap-3 md:grid-cols-2">
              <p className="flex items-center gap-2 text-sm text-zinc-700">
                <StatusBadge status="SUBSIDY_BREAKER" />
                Pressure value
                {` ${SUBSIDY_BREAKER_MIN_PRESSURE_VALUE}+ `}
                (highest threat).
              </p>
              <p className="flex items-center gap-2 text-sm text-zinc-700">
                <StatusBadge status="SEVERE_PRESSURE" />
                Pressure value 45-69.9 (serious threat).
              </p>
              <p className="flex items-center gap-2 text-sm text-zinc-700">
                <StatusBadge status="EMERGING_PRESSURE" />
                Pressure value 25-44.9 (watch closely).
              </p>
              <p className="flex items-center gap-2 text-sm text-zinc-700">
                <StatusBadge status="LOW_PRESSURE" />
                Either too expensive for the intelligence delivered or still too far from Opus.
              </p>
              <p className="flex items-center gap-2 text-sm text-zinc-700">
                <StatusBadge status="BASELINE" />
                Opus reference anchor.
              </p>
            </div>
          </section>

          <section className="rounded-2xl border border-zinc-200 bg-white/90 p-6 shadow-sm">
            <div className="flex items-start gap-2 text-sm text-zinc-600">
              <Info className="mt-0.5 h-4 w-4 shrink-0 text-brand-700" />
              <div>
                <p className="font-semibold text-zinc-800">Methodology notes</p>
                <ul className="mt-1 list-disc space-y-1 pl-5">
                  <li>
                    Subsidized baseline target is Opus-equivalent spend in the
                    $3,000-$5,000 range against the Max plan list price.
                  </li>
                  <li>
                    Pressure ratio = (model monthly cost / Max plan cost) /
                    (model intelligence / Opus intelligence).
                  </li>
                  <li>
                    Lower pressure ratio is stronger: 1.0x means near-Max-plan cost at Opus-level
                    intelligence.
                  </li>
                  <li>
                    Flagship rows use Feb 2026 reference monthly cost values from the provided
                    chart.
                  </li>
                  <li>
                    Pressure value uses an intelligence gate (must exceed 90% of Opus) multiplied
                    by an exponential cost penalty from pressure ratio.
                  </li>
                  <li>
                    Table is sorted by pressure value descending, with the Opus baseline pinned to
                    the first row.
                  </li>
                  <li>SWE-Bench remains visible as the direct coding benchmark.</li>
                  <li>
                    Intelligence score = weighted average (SWE 25%, Long Horizon 15%, AIME
                    20%, GPQA 15%, LiveCodeBench 25%).
                  </li>
                  <li>Cost per intelligence point = monthly cost / intelligence score.</li>
                </ul>
              </div>
            </div>
          </section>
        </main>

        <footer className="border-t border-zinc-200 py-6 text-center text-sm text-zinc-500">
          API Model Competitive Intelligence Tool
        </footer>

        {isAddModelOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <button
              type="button"
              className="absolute inset-0 bg-zinc-950/50 backdrop-blur-sm"
              onClick={closeAddModelDialog}
              aria-label="Close dialog"
            />

            <div className="relative z-10 w-full max-w-3xl overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-2xl">
              <div className="flex items-center justify-between border-b border-zinc-200 px-5 py-4">
                <h3 className="text-lg font-bold text-zinc-900">Add custom model</h3>
                <button
                  type="button"
                  onClick={closeAddModelDialog}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-full text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-700"
                  aria-label="Close dialog"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <form onSubmit={handleAddModel} className="max-h-[85vh] space-y-5 overflow-y-auto p-5">
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="space-y-2">
                    <span className="text-sm font-semibold text-zinc-700">Model name</span>
                    <input
                      type="text"
                      value={newModel.name}
                      onChange={(event) => {
                        setFormError(null);
                        setNewModel((previous) => ({ ...previous, name: event.target.value }));
                      }}
                      placeholder="e.g., GPT-5"
                      className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2.5 text-sm text-zinc-900 shadow-sm transition focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100"
                    />
                  </label>

                  <label className="space-y-2">
                    <span className="text-sm font-semibold text-zinc-700">Provider</span>
                    <input
                      type="text"
                      value={newModel.provider}
                      onChange={(event) => {
                        setFormError(null);
                        setNewModel((previous) => ({
                          ...previous,
                          provider: event.target.value,
                        }));
                      }}
                      placeholder="e.g., OpenAI"
                      className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2.5 text-sm text-zinc-900 shadow-sm transition focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100"
                    />
                  </label>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="space-y-2">
                    <span className="text-sm font-semibold text-zinc-700">Input $/M tokens</span>
                    <input
                      type="number"
                      min={0}
                      step={0.01}
                      value={newModel.inputPricePerM ?? 0}
                      onChange={(event) =>
                        setNewModel((previous) => ({
                          ...previous,
                          inputPricePerM: asPositiveNumber(event.target.value),
                        }))
                      }
                      className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2.5 text-sm text-zinc-900 shadow-sm transition focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100"
                    />
                  </label>

                  <label className="space-y-2">
                    <span className="text-sm font-semibold text-zinc-700">Output $/M tokens</span>
                    <input
                      type="number"
                      min={0}
                      step={0.01}
                      value={newModel.outputPricePerM ?? 0}
                      onChange={(event) =>
                        setNewModel((previous) => ({
                          ...previous,
                          outputPricePerM: asPositiveNumber(event.target.value),
                        }))
                      }
                      className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2.5 text-sm text-zinc-900 shadow-sm transition focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100"
                    />
                  </label>
                </div>

                <div>
                  <h4 className="text-sm font-semibold uppercase tracking-wide text-zinc-700">
                    Benchmark scores (%)
                  </h4>

                  <div className="mt-3 grid gap-4 sm:grid-cols-2">
                    {BENCHMARK_FIELDS.map(({ key, label }) => (
                      <label key={key} className="space-y-2">
                        <span className="text-sm font-semibold text-zinc-700">{label}</span>
                        <input
                          type="number"
                          min={0}
                          max={100}
                          value={newModel.benchmarks[key] ?? 0}
                          onChange={(event) => updateBenchmark(key, asPercent(event.target.value))}
                          className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2.5 text-sm text-zinc-900 shadow-sm transition focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100"
                        />
                      </label>
                    ))}

                    <label className="space-y-2">
                      <span className="text-sm font-semibold text-zinc-700">Overall intelligence (auto)</span>
                      <input
                        type="number"
                        value={newModel.intelligenceScore.toFixed(0)}
                        readOnly
                        className="w-full cursor-not-allowed rounded-xl border border-zinc-200 bg-zinc-100 px-3 py-2.5 text-sm font-semibold text-zinc-600"
                      />
                    </label>
                  </div>
                </div>

                {formError && <p className="text-sm text-danger-700">{formError}</p>}

                <div className="flex flex-wrap justify-end gap-3 border-t border-zinc-200 pt-4">
                  <button
                    type="button"
                    onClick={closeAddModelDialog}
                    className="rounded-xl border border-zinc-300 bg-white px-4 py-2 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700"
                  >
                    Add model
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
