import { create } from 'zustand';

import { SelectedLocation } from '@/types/location';

export interface MapBounds {
  center: [number, number];
  zoom: number;
  bounds: [[number, number], [number, number]];
}

interface AppState {
  selectedLocation: SelectedLocation | null;
  mapBounds: MapBounds | null;
  setSelectedLocation: (location: SelectedLocation | null) => void;
  setMapBounds: (bounds: MapBounds | null) => void;
}

// Function to get initial selectedLocation from localStorage or default to Chicago
const getInitialSelectedLocation = (): SelectedLocation | null => {
  if (typeof window !== 'undefined') { // Ensure this runs only on client-side
    try {
      const jsonValue = localStorage.getItem('user-preferences');
      if (jsonValue) {
        const preferences = JSON.parse(jsonValue);
        // Assuming preferences.default_location matches SelectedLocation interface
        if (preferences.default_location) {
          return preferences.default_location;
        }
      }
    } catch (error) {
      console.error('Error loading initial selected location from localStorage:', error);
    }
  }
  
  // Default to Chicago if no saved preference
  return {
    districtName: 'Chicago',
    latitude: 41.8781,
    longitude: -87.6298,
    provinceName: 'Illinois',
    regencyName: 'Cook County',
  };
};

export const useAppStore = create<AppState>((set) => ({
  selectedLocation: getInitialSelectedLocation(), // Initialize from localStorage
  mapBounds: null,
  setSelectedLocation: (location) => set({ selectedLocation: location }),
  setMapBounds: (bounds) => set({ mapBounds: bounds }),
}));