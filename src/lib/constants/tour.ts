// ============================================================
// src/lib/constants/tour.ts
// Guided tour interactive walkthrough steps and explanations
// Short, concise guidance directly anchored near highlighted tabs
// ============================================================

import { TabId, type TourStep } from '@/types';

export const TOUR_STEPS: TourStep[] = [
  {
    id: 'welcome',
    stepNumber: 1,
    totalSteps: 6,
    title: 'Welcome to SaansIQ 🛡️',
    tag: 'Overview',
    targetTab: TabId.Dashboard,
    targetTabLabel: 'Air Telemetry',
    description:
      'Real-time urban air intelligence and atmospheric exposure protection to shield you during winter smog.',
    highlights: ['Multi-source sensor telemetry', 'Thermal inversion detection', 'GenAI health schedules'],
    actionPrompt: 'Explore the live telemetry dashboard below.',
  },
  {
    id: 'telemetry',
    stepNumber: 2,
    totalSteps: 6,
    title: 'Hyperlocal Telemetry & Smog Heatmap 📡',
    tag: 'Live Telemetry',
    targetTab: TabId.Dashboard,
    targetTabLabel: 'Air Telemetry',
    description:
      'Live AQI, multi-pollutant telemetry, and spatial smog dispersion across municipal monitoring sectors.',
    highlights: ['24-hour forecast trendline', 'Five cross-checked sources', 'Interactive inversion simulation'],
    actionPrompt: 'Click any sector card or radar node to inspect micro-climates.',
  },
  {
    id: 'routine',
    stepNumber: 3,
    totalSteps: 6,
    title: 'GenAI Daily Routine Optimizer ⏰',
    tag: 'AI Health Engine',
    targetTab: TabId.Routine,
    targetTabLabel: 'Routine Optimizer',
    description:
      'Personalized hour-by-hour exposure schedules and safe outdoor windows calculated by Gemini AI.',
    highlights: ['Vulnerability risk profiles', 'Solar convection clearing windows', 'Particulate dose minimization'],
    actionPrompt: 'Choose your profile and generate tailored daily schedules.',
  },
  {
    id: 'transit',
    stepNumber: 4,
    totalSteps: 6,
    title: 'Clean-Corridor Transit Pathfinder 🚇',
    tag: 'Dijkstra Router',
    targetTab: TabId.Transit,
    targetTabLabel: 'Low-Emission Transit',
    description:
      'Dijkstra pathfinding favoring subterranean metro corridors over high-smog surface diesel traffic.',
    highlights: ['Subterranean route preference', 'Inhaled PM2.5 dose comparison', 'Transit carbon offsets'],
    actionPrompt: 'Select origin and destination to compute clean routes.',
  },
  {
    id: 'iaq',
    stepNumber: 5,
    totalSteps: 6,
    title: 'Room CADR & Low-Cost DIY Hacks 🌿',
    tag: 'Indoor Air Quality',
    targetTab: TabId.IAQ,
    targetTabLabel: 'Indoor Air & Hacks',
    description:
      'Hospital-grade 4 ACH room purification audits, inversion window latch schedules, and DIY HEPA box guides.',
    highlights: ['Room volume & CADR audit', 'Inversion window latch schedule', 'DIY Corsi-Rosenthal boxes'],
    actionPrompt: 'Adjust floor area sliders to audit your living spaces.',
  },
  {
    id: 'community',
    stepNumber: 6,
    totalSteps: 6,
    title: 'Collective Action & Multilingual Alerts 🤝',
    tag: 'Community Resilience',
    targetTab: TabId.Community,
    targetTabLabel: 'Community Action',
    description:
      'Neighborhood mitigation pledges curbing emissions by up to 28%, and emergency advisories in 4 languages.',
    highlights: ['Neighborhood pledges', 'Emergency alerts (EN, HI, AR, ES)', 'Collective emission offsets'],
    actionPrompt: 'Pledge your household to collective smog mitigation.',
  },
];
