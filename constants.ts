import { Mode } from "./types";

export const MODE_CONFIG = {
  [Mode.PLAN]: {
    label: 'Draft Plan',
    icon: '📅',
    description: 'Generate structured itineraries for trips or days.',
    model: 'gemini-3-flash-preview',
    color: 'text-emerald-400',
    borderColor: 'border-emerald-500/50',
    bgStart: 'from-emerald-900/20'
  },
  [Mode.EXPLORE]: {
    label: 'Find Places',
    icon: '📍',
    description: 'Discover restaurants, attractions, and gems nearby.',
    model: 'gemini-2.5-flash',
    color: 'text-amber-400',
    borderColor: 'border-amber-500/50',
    bgStart: 'from-amber-900/20'
  },
  [Mode.RESEARCH]: {
    label: 'Deep Search',
    icon: '🔍',
    description: 'Research topics with real-time web grounding.',
    model: 'gemini-3-flash-preview',
    color: 'text-indigo-400',
    borderColor: 'border-indigo-500/50',
    bgStart: 'from-indigo-900/20'
  }
};
