// Police Data Provider Interface
// Currently returns mock data. Will be replaced by actual backend API in Sprint 15.

export const policeProvider = {
  getPoliceUnits: async () => {
    // Simulated network delay
    await new Promise(r => setTimeout(r, 400));
    
    return [
      { id: 'PU-101', name: 'Patrol Alpha', status: 'ACTIVE', location: [83.31, 17.72], currentTask: 'Area Surveillance' },
      { id: 'PU-102', name: 'Patrol Beta', status: 'EN_ROUTE', location: [83.33, 17.74], currentTask: 'Responding to Crowd Gathering' },
      { id: 'PU-204', name: 'Interceptor 1', status: 'ACTIVE', location: [83.29, 17.71], currentTask: 'Traffic Checkpoint' },
      { id: 'PU-305', name: 'Patrol Gamma', status: 'STANDBY', location: [83.35, 17.76], currentTask: 'Available' },
      { id: 'PU-401', name: 'Night Hawk', status: 'ACTIVE', location: [83.32, 17.73], currentTask: 'Dark Street Patrol' }
    ];
  }
};
