// ============================================================
// src/context/AppContext.tsx
// Cross-cutting global state management (Auth, Language, Zones, Tabs, Tour)
// Per CODING_CONVENTIONS.md §1 & ARCHITECTURE_PATTERNS.md §2.1
// ============================================================
/* oxlint-disable react/only-export-components */

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  type ReactNode,
} from 'react';
import {
  TabId,
  Language,
  AccessibilityMode,
  type UrbanZone,
  type PersonaProfile,
  type DailyRoutinePlan,
  type IAQRoomConfig,
  type CommunityPledge,
  type CommunityAlert,
} from '@/types';
import {
  DEFAULT_ZONES,
  DEFAULT_PERSONAS,
  DEFAULT_ALERTS,
  TOUR_STEPS,
} from '@/lib/constants';
import { storageService } from '@/services/storageService';
import type { AppContextValue } from './types';

const AppContext = createContext<AppContextValue | null>(null);

export function AppContextProvider({ children }: { children: ReactNode }) {
  const [activeTab, setActiveTabState] = useState<TabId>(TabId.Dashboard);
  const [zones, setZones] = useState<UrbanZone[]>(() => storageService.getZones());
  const [selectedZoneId, setSelectedZoneIdState] = useState<string>(() => storageService.getSelectedZoneId());
  const [activePersona, setActivePersonaState] = useState<PersonaProfile>(() => storageService.getActivePersona());
  const [language, setLanguageState] = useState<Language>(Language.English);
  const [accessibilityMode, setAccessibilityModeState] = useState<AccessibilityMode>(AccessibilityMode.Standard);
  const [routinePlan, setRoutinePlanState] = useState<DailyRoutinePlan | null>(() => storageService.getRoutinePlan());
  const [rooms, setRooms] = useState<IAQRoomConfig[]>(() => storageService.getRooms());
  const [pledges, setPledges] = useState<CommunityPledge[]>(() => storageService.getPledges());
  const [alerts, setAlerts] = useState<CommunityAlert[]>(DEFAULT_ALERTS);
  const [globalBanner, setGlobalBanner] = useState<string | null>(null);
  const [isTourOpen, setIsTourOpen] = useState<boolean>(false);
  const [tourStepIndex, setTourStepIndexState] = useState<number>(0);

  const selectedZone = useMemo(() => {
    return zones.find((z) => z.zoneId === selectedZoneId) || zones[0] || DEFAULT_ZONES[0];
  }, [zones, selectedZoneId]);

  const setActiveTab = useCallback((tab: TabId) => {
    setActiveTabState(tab);
  }, []);

  const setSelectedZoneId = useCallback((id: string) => {
    setSelectedZoneIdState(id);
    storageService.saveSelectedZoneId(id);
  }, []);

  const updateZone = useCallback((zoneId: string, updates: Partial<UrbanZone>) => {
    setZones((prev) => {
      const next = prev.map((z) => (z.zoneId === zoneId ? { ...z, ...updates, lastUpdated: Date.now() } : z));
      storageService.saveZones(next);
      return next;
    });
  }, []);

  const setActivePersona = useCallback((persona: PersonaProfile) => {
    setActivePersonaState(persona);
    storageService.saveActivePersona(persona);
  }, []);

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
  }, []);

  const setAccessibilityMode = useCallback((mode: AccessibilityMode) => {
    setAccessibilityModeState(mode);
  }, []);

  const setRoutinePlan = useCallback((plan: DailyRoutinePlan | null) => {
    setRoutinePlanState(plan);
    storageService.saveRoutinePlan(plan);
  }, []);

  const updateRoom = useCallback((roomId: string, updates: Partial<IAQRoomConfig>) => {
    setRooms((prev) => {
      const next = prev.map((r) => (r.roomId === roomId ? { ...r, ...updates } : r));
      storageService.saveRooms(next);
      return next;
    });
  }, []);

  const togglePledge = useCallback((pledgeId: string) => {
    setPledges((prev) => {
      const next = prev.map((p) => {
        if (p.id !== pledgeId) return p;
        const nowPledged = !p.userPledged;
        return {
          ...p,
          userPledged: nowPledged,
          currentParticipants: nowPledged ? p.currentParticipants + 1 : Math.max(0, p.currentParticipants - 1),
        };
      });
      storageService.savePledges(next);
      return next;
    });
  }, []);

  const dismissAlert = useCallback((id: string) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id));
  }, []);

  const openTour = useCallback((stepIdx = 0) => {
    const validIdx = Math.max(0, Math.min(stepIdx, TOUR_STEPS.length - 1));
    setTourStepIndexState(validIdx);
    setActiveTabState(TOUR_STEPS[validIdx].targetTab);
    setIsTourOpen(true);
  }, []);

  const closeTour = useCallback(() => {
    setIsTourOpen(false);
    storageService.setSeenTour(true);
  }, []);

  const setTourStepIndex = useCallback((idx: number) => {
    const validIdx = Math.max(0, Math.min(idx, TOUR_STEPS.length - 1));
    setTourStepIndexState(validIdx);
    setActiveTabState(TOUR_STEPS[validIdx].targetTab);
  }, []);

  const nextTourStep = useCallback(() => {
    setTourStepIndexState((prev) => {
      if (prev >= TOUR_STEPS.length - 1) {
        setIsTourOpen(false);
        storageService.setSeenTour(true);
        return prev;
      }
      const nextIdx = prev + 1;
      setActiveTabState(TOUR_STEPS[nextIdx].targetTab);
      return nextIdx;
    });
  }, []);

  const prevTourStep = useCallback(() => {
    setTourStepIndexState((prev) => {
      const prevIdx = Math.max(0, prev - 1);
      setActiveTabState(TOUR_STEPS[prevIdx].targetTab);
      return prevIdx;
    });
  }, []);

  const contextValue = useMemo<AppContextValue>(() => ({
    activeTab,
    setActiveTab,
    zones,
    selectedZoneId,
    selectedZone,
    setSelectedZoneId,
    updateZone,
    personas: DEFAULT_PERSONAS,
    activePersona,
    setActivePersona,
    language,
    setLanguage,
    accessibilityMode,
    setAccessibilityMode,
    routinePlan,
    setRoutinePlan,
    rooms,
    updateRoom,
    pledges,
    togglePledge,
    alerts,
    dismissAlert,
    globalBanner,
    setGlobalBanner,
    isTourOpen,
    openTour,
    closeTour,
    tourStepIndex,
    nextTourStep,
    prevTourStep,
    setTourStepIndex,
  }), [
    activeTab,
    setActiveTab,
    zones,
    selectedZoneId,
    selectedZone,
    setSelectedZoneId,
    updateZone,
    activePersona,
    setActivePersona,
    language,
    setLanguage,
    accessibilityMode,
    setAccessibilityMode,
    routinePlan,
    setRoutinePlan,
    rooms,
    updateRoom,
    pledges,
    togglePledge,
    alerts,
    dismissAlert,
    globalBanner,
    isTourOpen,
    openTour,
    closeTour,
    tourStepIndex,
    nextTourStep,
    prevTourStep,
    setTourStepIndex,
  ]);

  return <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>;
}

export function useAppContext(): AppContextValue {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppContextProvider');
  }
  return context;
}
