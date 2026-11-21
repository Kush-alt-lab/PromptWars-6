// ============================================================
// src/types/tour.ts
// Guided tour step schema and interaction contracts
// ============================================================

import { TabId } from './telemetry';

export interface TourStep {
  id: string;
  stepNumber: number;
  totalSteps: number;
  title: string;
  tag: string;
  targetTab: TabId;
  targetTabLabel: string;
  description: string;
  highlights: string[];
  actionPrompt: string;
}
