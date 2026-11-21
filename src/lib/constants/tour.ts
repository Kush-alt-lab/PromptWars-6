// ============================================================
// src/lib/constants/tour.ts
// Guided tour interactive walkthrough steps and explanations
// ============================================================

import { TabId, type TourStep } from '@/types';

export const TOUR_STEPS: TourStep[] = [
  {
    id: 'welcome',
    stepNumber: 1,
    totalSteps: 6,
    title: 'Welcome to SaansIQ 🛡️',
    tag: 'Platform Overview',
    targetTab: TabId.Dashboard,
    targetTabLabel: 'Air Telemetry',
    description:
      'SaansIQ is an intelligent urban air quality and smog resilience assistant designed to shield families, vulnerable citizens, and commuters during acute winter pollution episodes.',
    highlights: [
      'Real-time Hyperlocal Telemetry & Inversion Traps',
      'Gemini AI Vulnerability Exposure Scheduling',
      'Hospital-Grade CADR Blueprints & Clean Metro Routing',
    ],
    actionPrompt: 'Click Next to explore live municipal air monitoring.',
  },
  {
    id: 'telemetry',
    stepNumber: 2,
    totalSteps: 6,
    title: 'Hyperlocal Telemetry & Smog Heatmap 📡',
    tag: 'Air Telemetry',
    targetTab: TabId.Dashboard,
    targetTabLabel: 'Air Telemetry',
    description:
      'Inspect zone-by-zone AQI, multi-pollutant breakdowns (PM2.5, PM10, NO2, CO, O3), and the spatial smog dispersion grid. Use the simulation buttons to test temperature inversions.',
    highlights: [
      'Spatial SVG Radar Heatmap with Screen-Reader Twins',
      'Boundary-Layer Inversion Trap Detection',
      'Interactive Winter Smog Spike Simulation Engine',
    ],
    actionPrompt: 'Click any sector card or heatmap node to inspect micro-climates.',
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
      'Personalize your day according to respiratory vulnerability profiles. Gemini AI computes hour-by-hour exposure schedules and pinpoints safe outdoor windows.',
    highlights: [
      'Target Vulnerability Profiles (Infant, Asthmatic, Elderly)',
      'Solar Convection Boundary Clearing Windows',
      'Pulmonary Particulate Intake Minimization',
    ],
    actionPrompt: 'Select your profile and generate tailored daily schedules.',
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
      'Avoid high-smog traffic bottlenecks with Dijkstra pathfinding that favors subterranean metro lines and clean green corridors over surface diesel exhaust traps.',
    highlights: [
      'Subterranean Route Optimization',
      'Inhaled PM2.5 Dose (µg) Modal Comparisons',
      'Transit Mode Carbon Abatement Metrics',
    ],
    actionPrompt: 'Select commute origin and destination to compute clean routes.',
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
      'Calculate required Clean Air Delivery Rates (4 ACH hospital standard) for your rooms, follow inversion-aware window latch schedules, and build DIY Corsi-Rosenthal boxes.',
    highlights: [
      'Interactive Room Volume & CADR Calculator',
      'Meteorological Inversion Window Lock Schedule',
      '$40 Low-Cost DIY HEPA Filter Blueprints',
    ],
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
      'Join collective neighborhood pledges to curb local emissions by up to 28%, and receive automated public safety broadcast advisories in 4 languages.',
    highlights: [
      'Neighborhood Emission Reduction Pledges',
      'Multilingual Safety Broadcasts (EN, HI, AR, ES)',
      'Real-time Collective CO2 & PM2.5 Offset Metrics',
    ],
    actionPrompt: 'Pledge your household to collective smog mitigation.',
  },
];
