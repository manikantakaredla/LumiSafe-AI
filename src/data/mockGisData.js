export const CITY_CENTER = [17.722, 83.315]

export const mockWards = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: { id: 'ward-1', name: "Ward 1 - Bheemili", safetyScore: 92, riskLevel: "low", pendingComplaints: 12 },
      geometry: { type: "Polygon", coordinates: [[[83.42, 17.88], [83.46, 17.83], [83.40, 17.82], [83.42, 17.88]]] }
    },
    {
      type: "Feature",
      properties: { id: 'ward-4', name: "Ward 4 - Madhurawada", safetyScore: 64, riskLevel: "high", pendingComplaints: 84 },
      geometry: { type: "Polygon", coordinates: [[[83.34, 17.83], [83.38, 17.79], [83.33, 17.75], [83.34, 17.83]]] }
    },
    {
      type: "Feature",
      properties: { id: 'ward-12', name: "Ward 12 - MVP Colony", safetyScore: 88, riskLevel: "medium", pendingComplaints: 34 },
      geometry: { type: "Polygon", coordinates: [[[83.32, 17.74], [83.34, 17.73], [83.31, 17.70], [83.32, 17.74]]] }
    },
    {
      type: "Feature",
      properties: { id: 'ward-14', name: "Ward 14 - Siripuram", safetyScore: 78, riskLevel: "medium", pendingComplaints: 45 },
      geometry: { type: "Polygon", coordinates: [[[83.30, 17.72], [83.32, 17.71], [83.29, 17.69], [83.30, 17.72]]] }
    },
    {
      type: "Feature",
      properties: { id: 'ward-20', name: "Ward 20 - Gajuwaka", safetyScore: 58, riskLevel: "high", pendingComplaints: 112 },
      geometry: { type: "Polygon", coordinates: [[[83.22, 17.68], [83.25, 17.66], [83.20, 17.62], [83.22, 17.68]]] }
    }
  ]
}

export const mockStreetLights = Array.from({ length: 150 }, (_, i) => ({
  id: `sl-${i}`,
  lat: CITY_CENTER[0] + (Math.random() - 0.5) * 0.15,
  lng: CITY_CENTER[1] + (Math.random() - 0.5) * 0.15,
  status: Math.random() > 0.85 ? 'failed' : 'operational',
  type: 'Street Light'
}))

export const mockRepairTeams = [
  { id: 'rt-1', name: 'Alpha Electrical', lat: 17.735, lng: 83.325, type: 'Repair Team' },
  { id: 'rt-2', name: 'Beta Civil', lat: 17.710, lng: 83.300, type: 'Repair Team' },
  { id: 'rt-3', name: 'Gamma Network', lat: 17.680, lng: 83.220, type: 'Repair Team' },
]

export const mockPolicePatrols = [
  { id: 'pp-1', name: 'Patrol Unit 12', lat: 17.728, lng: 83.320, type: 'Police Patrol' },
  { id: 'pp-2', name: 'Patrol Unit 8', lat: 17.705, lng: 83.290, type: 'Police Patrol' },
  { id: 'pp-3', name: 'Hawk Unit 1', lat: 17.675, lng: 83.210, type: 'Police Patrol' },
]

export const mockIncidents = [
  { id: 'inc-1', title: 'Dark Spot Reported', priority: 'medium', lat: 17.715, lng: 83.312, type: 'Complaint' },
  { id: 'inc-2', title: 'Women Safety SOS', priority: 'high', lat: 17.728, lng: 83.330, type: 'Incident' },
  { id: 'inc-3', title: 'Suspicious Activity', priority: 'high', lat: 17.678, lng: 83.215, type: 'Incident' },
  { id: 'inc-4', title: 'Broken Light Pole', priority: 'medium', lat: 17.730, lng: 83.340, type: 'Complaint' },
]
