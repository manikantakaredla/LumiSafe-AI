import { io } from 'socket.io-client';
import { useAppStore } from '../store/useAppStore';

let socket;

export const initSocketClient = () => {
  if (socket) return socket;

  socket = io('http://localhost:5000'); // Note: move to env var in prod

  socket.on('connect', () => {
    console.log('[Socket] Connected to real-time operations engine');
  });

  socket.on('SYNC_STATE', (payload) => {
    console.log('[Socket] Received SYNC_STATE:', payload);
    const store = useAppStore.getState();

    // Porting DashboardSync logic to respond to Backend Events
    switch (payload.eventType) {
      case 'REPORT_CREATED': {
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
        break;
      }
      
      case 'REPORT_CLASSIFIED': {
        const { entityId, payload: data } = payload;
        store.updateReportState(entityId, { 
          status: 'AI Classified & Prioritized', 
          priority: data.priority 
        });
        break;
      }
      
      case 'WORKORDER_CREATED': {
        const { entityId, payload: data } = payload;
        store.updateReportState(entityId, {
          status: 'Assigned to Electrical Dept',
          assignedTeam: 'Alpha Team (Auto)',
          engineerStatus: 'Pending',
          inventoryRequired: data.inventory
        });
        break;
      }
      
      default:
        break;
    }
  });

  return socket;
};
