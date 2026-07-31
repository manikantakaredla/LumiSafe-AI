import { create } from 'zustand';

export const useOperationsStore = create((set) => ({
  // Map Layers
  layers: {
    streetLights: true,
    repairTeams: true,
    police: true,
    complaints: true,
    heatmap: false
  },
  toggleLayer: (layerName) => set((state) => ({
    layers: { ...state.layers, [layerName]: !state.layers[layerName] }
  })),

  // Map Intelligence (Selection)
  selectedEntity: null, // { type: 'COMPLAINT', id: '123' }
  setSelectedEntity: (entity) => set({ selectedEntity: entity }),
  
  // Playback Mode
  playbackMode: 'LIVE', // 'LIVE', 'LAST_HOUR', 'LAST_DAY'
  setPlaybackMode: (mode) => set({ playbackMode: mode }),

  // Operations Filters
  filters: {
    electrical: true,
    police: true,
    citizen: true,
    ai: true,
    verification: true,
    manualReview: true
  },
  toggleFilter: (filterName) => set((state) => ({
    filters: { ...state.filters, [filterName]: !state.filters[filterName] }
  })),

  // AI Focus Mode
  focusMode: null, // null, 'MANUAL_REVIEWS', 'CRITICAL_INCIDENTS', 'SLA_VIOLATIONS'
  setFocusMode: (mode) => set({ focusMode: mode })
}));
