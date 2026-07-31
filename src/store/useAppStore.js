import { create } from 'zustand'

export const useAppStore = create((set) => ({
  // Role Switcher
  currentRole: 'Commissioner',
  setCurrentRole: (role) => set({ currentRole: role }),

  // Sidebar State
  isSidebarCollapsed: false,
  toggleSidebar: () => set((state) => ({ isSidebarCollapsed: !state.isSidebarCollapsed })),

  // Command Palette
  isCommandPaletteOpen: false,
  setCommandPaletteOpen: (isOpen) => set({ isCommandPaletteOpen: isOpen }),
  toggleCommandPalette: () => set((state) => ({ isCommandPaletteOpen: !state.isCommandPaletteOpen })),

  // Universal Right Drawer
  rightDrawer: {
    isOpen: false,
    title: '',
    entityType: null,
    entityId: null,
  },
  openDrawer: (title, entityType, entityId) => set({
    rightDrawer: { isOpen: true, title, entityType, entityId }
  }),
  closeDrawer: () => set((state) => ({
    rightDrawer: { ...state.rightDrawer, isOpen: false }
  })),

  // GIS Workspace State
  presentationMode: false,
  togglePresentationMode: () => set((state) => ({ presentationMode: !state.presentationMode })),
  
  timeMode: 'current', // 'past', 'current', 'predicted'
  setTimeMode: (mode) => set({ timeMode: mode }),

  activeLayers: ['wards', 'streetLights', 'incidents', 'repairTeams', 'policePatrols', 'heatmap'],
  toggleLayer: (layerId) => set((state) => ({
    activeLayers: state.activeLayers.includes(layerId)
      ? state.activeLayers.filter(id => id !== layerId)
      : [...state.activeLayers, layerId]
  })),

  // Public Portal State
  publicReports: [],
  initPublicReport: (report) => set((state) => {
    // Initial barebones report structure. Fields will be progressively enriched by the AI Operations Engine.
    const newReport = {
      id: report.id,
      category: report.category,
      type: 'Complaint',
      status: 'Report Submitted',
      priority: 'Pending',
      lat: report.lat,
      lng: report.lng,
      timeline: [],
      ...report
    };
    return { publicReports: [newReport, ...state.publicReports] }
  }),
  updateReportState: (reportId, updates) => set((state) => ({
    publicReports: state.publicReports.map(rep => 
      rep.id === reportId ? { ...rep, ...updates } : rep
    )
  })),
  updateReportTimeline: (reportId, newEvent) => set((state) => ({
    publicReports: state.publicReports.map(rep => {
      if (rep.id !== reportId) return rep;
      // Prevent duplicate events
      if (rep.timeline.some(t => t.label === newEvent.label)) return rep;
      return { ...rep, timeline: [...rep.timeline, newEvent] }
    })
  })),

  // Notifications
  notifications: [
    { id: 1, title: 'New Complaint', message: 'Street light out in Ward 4', time: '2m ago', read: false },
    { id: 2, title: 'AI Recommendation', message: 'Re-route Alpha team to Sector 3', time: '15m ago', read: false }
  ],
  addNotification: (notification) => set((state) => ({
    notifications: [notification, ...state.notifications]
  })),
  markAllRead: () => set((state) => ({
    notifications: state.notifications.map(n => ({ ...n, read: true }))
  }))
}))
