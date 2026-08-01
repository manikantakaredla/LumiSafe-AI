import { create } from 'zustand'

export const useAppStore = create((set) => ({
  // Auth & Role Switcher
  currentUser: JSON.parse(localStorage.getItem('lumi_user') || 'null'),
  authToken: localStorage.getItem('lumi_token') || null,
  currentRole: localStorage.getItem('lumi_role') || 'Commissioner',
  setAuth: (user, token) => {
    if (user && token) {
      localStorage.setItem('lumi_user', JSON.stringify(user));
      localStorage.setItem('lumi_token', token);
      localStorage.setItem('lumi_role', user.role);
      set({ currentUser: user, authToken: token, currentRole: user.role });
    } else {
      localStorage.removeItem('lumi_user');
      localStorage.removeItem('lumi_token');
      localStorage.removeItem('lumi_role');
      set({ currentUser: null, authToken: null, currentRole: 'Public' });
    }
  },
  setCurrentRole: (role) => {
    localStorage.setItem('lumi_role', role);
    set({ currentRole: role });
  },

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
    rightDrawer: { isOpen: true, title, entityType, entityId },
    copilotMode: false // Switch to entity view
  }),
  closeDrawer: () => set((state) => ({
    rightDrawer: { ...state.rightDrawer, isOpen: false }
  })),

  // Copilot State
  copilotMode: false,
  setCopilotMode: (isActive) => set((state) => ({ 
    copilotMode: isActive,
    // If activating copilot, ensure drawer is open
    rightDrawer: isActive ? { ...state.rightDrawer, isOpen: true, title: 'Operations Copilot' } : state.rightDrawer
  })),
  copilotHistory: [],
  addCopilotMessage: (msg) => set((state) => ({ copilotHistory: [...state.copilotHistory, msg] })),
  clearCopilotHistory: () => set({ copilotHistory: [] }),

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
