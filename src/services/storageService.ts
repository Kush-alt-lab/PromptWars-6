// ============================================================
// src/services/storageService.ts
// LocalStorage persistence service with defensive deserialization
// Per ARCHITECTURE_PATTERNS.md §1 & SECURITY_STANDARDS.md §3
// ============================================================

import {
  type UrbanZone,
  type PersonaProfile,
  type DailyRoutinePlan,
  type IAQRoomConfig,
  type CommunityPledge,
} from '@/types';
import {
  DEFAULT_ZONES,
  DEFAULT_PERSONAS,
  DEFAULT_ROOMS,
  DEFAULT_PLEDGES,
} from '@/lib/constants';

function safeParse<T>(raw: string | null, fallback: T): T {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

const STORAGE_KEYS = {
  ZONES: 'saansiq_zones_v1',
  SELECTED_ZONE: 'saansiq_selected_zone_id_v1',
  PERSONA: 'saansiq_active_persona_v1',
  ROUTINE: 'saansiq_routine_plan_v1',
  ROOMS: 'saansiq_iaq_rooms_v1',
  PLEDGES: 'saansiq_community_pledges_v1',
  LANGUAGE: 'saansiq_language_v1',
  ACCESSIBILITY_MODE: 'saansiq_accessibility_mode_v1',
  TOUR_SEEN: 'saansiq_tour_seen_v1',
} as const;

export const storageService = {
  getZones(): UrbanZone[] {
    if (typeof window === 'undefined') return DEFAULT_ZONES;
    return safeParse<UrbanZone[]>(localStorage.getItem(STORAGE_KEYS.ZONES), DEFAULT_ZONES);
  },

  saveZones(zones: UrbanZone[]): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEYS.ZONES, JSON.stringify(zones));
    } catch {
      // Storage quota or sandboxed iframe
    }
  },

  getSelectedZoneId(): string {
    if (typeof window === 'undefined') return DEFAULT_ZONES[0].zoneId;
    return safeParse<string>(localStorage.getItem(STORAGE_KEYS.SELECTED_ZONE), DEFAULT_ZONES[0].zoneId);
  },

  saveSelectedZoneId(zoneId: string): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEYS.SELECTED_ZONE, JSON.stringify(zoneId));
    } catch {
      // Ignored
    }
  },

  getActivePersona(): PersonaProfile {
    if (typeof window === 'undefined') return DEFAULT_PERSONAS[0];
    return safeParse<PersonaProfile>(localStorage.getItem(STORAGE_KEYS.PERSONA), DEFAULT_PERSONAS[0]);
  },

  saveActivePersona(persona: PersonaProfile): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEYS.PERSONA, JSON.stringify(persona));
    } catch {
      // Ignored
    }
  },

  getRoutinePlan(): DailyRoutinePlan | null {
    if (typeof window === 'undefined') return null;
    return safeParse<DailyRoutinePlan | null>(localStorage.getItem(STORAGE_KEYS.ROUTINE), null);
  },

  saveRoutinePlan(plan: DailyRoutinePlan | null): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEYS.ROUTINE, JSON.stringify(plan));
    } catch {
      // Ignored
    }
  },

  getRooms(): IAQRoomConfig[] {
    if (typeof window === 'undefined') return DEFAULT_ROOMS;
    return safeParse<IAQRoomConfig[]>(localStorage.getItem(STORAGE_KEYS.ROOMS), DEFAULT_ROOMS);
  },

  saveRooms(rooms: IAQRoomConfig[]): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEYS.ROOMS, JSON.stringify(rooms));
    } catch {
      // Ignored
    }
  },

  getPledges(): CommunityPledge[] {
    if (typeof window === 'undefined') return DEFAULT_PLEDGES;
    return safeParse<CommunityPledge[]>(localStorage.getItem(STORAGE_KEYS.PLEDGES), DEFAULT_PLEDGES);
  },

  savePledges(pledges: CommunityPledge[]): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEYS.PLEDGES, JSON.stringify(pledges));
    } catch {
      // Ignored
    }
  },

  hasSeenTour(): boolean {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem(STORAGE_KEYS.TOUR_SEEN) === 'true';
  },

  setSeenTour(seen = true): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEYS.TOUR_SEEN, seen ? 'true' : 'false');
    } catch {
      // Ignored
    }
  },
};
