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

  // Notifications
  notifications: [
    { id: 1, title: 'New Complaint', message: 'Street light out in Ward 4', time: '2m ago', read: false },
    { id: 2, title: 'AI Alert', message: 'High anomaly detected in Traffic node 12', time: '1hr ago', read: false }
  ],
  markAllRead: () => set((state) => ({
    notifications: state.notifications.map(n => ({ ...n, read: true }))
  }))
}))
