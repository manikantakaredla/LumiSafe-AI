import { io } from 'socket.io-client';
import { useAppStore } from '../store/useAppStore';

let socket;

export const initSocketClient = () => {
  if (socket) return socket;

  socket = io('http://localhost:5000'); // Note: move to env var in prod

  socket.on('connect', () => {
    console.log('[Socket] Connected to real-time operations engine');
  });

  socket.on('complaint.created', (payload) => {
    console.log('[Socket] complaint.created:', payload);
    const store = useAppStore.getState();
    const { entityId, payload: data } = payload;
    store.initPublicReport({
      id: entityId,
      complaintId: data.complaintId,
      category: data.category,
      status: 'Report Submitted',
      priority: 'Pending',
      timestamp: new Date().toISOString(),
      lat: data.lat,
      lng: data.lng
    });
  });

  socket.on('complaint.updated', (payload) => {
    console.log('[Socket] complaint.updated:', payload);
    if (payload.eventType === 'REPORT_CLASSIFIED') {
      const store = useAppStore.getState();
      const { entityId, payload: data } = payload;
      store.updateReportState(entityId, { 
        status: 'AI Classified & Prioritized', 
        priority: data.priority 
      });
    }
  });

  socket.on('workorder.created', (payload) => {
    console.log('[Socket] workorder.created:', payload);
    const store = useAppStore.getState();
    const { entityId, payload: data } = payload;
    store.updateReportState(entityId, {
      status: 'Assigned to Electrical Dept',
      assignedTeam: 'Alpha Team (Auto)',
      engineerStatus: 'Pending',
      inventoryRequired: data.inventory
    });
  });

  socket.on('timeline.updated', (payload) => {
    console.log('[Socket] timeline.updated:', payload);
    const store = useAppStore.getState();
    const { entityId, payload: data } = payload;
    store.updateReportTimeline(entityId, {
      label: data.status,
      time: new Date().toISOString() // Or payload.timestamp if passed
    });
  });

  socket.on('notification.created', (payload) => {
    console.log('[Socket] notification.created:', payload);
    const store = useAppStore.getState();
    const { payload: data } = payload;
    store.addNotification({
      id: Math.random(),
      title: data.title,
      message: data.message,
      time: 'Just now',
      read: false,
      type: data.type
    });
  });

  return socket;
};
