/**
 * Nearest Unit Service
 * Geospatial logic for finding the closest available units (Police or Electrical).
 */
class NearestUnitService {
  findNearestPoliceUnit(lat, lng, availableUnits) {
    if (!availableUnits || availableUnits.length === 0) return null;
    
    // Using a simple mock distance calculation for now instead of MongoDB $near
    // since some units might be mocked in memory for Sprint 15
    let nearest = availableUnits[0];
    let minDistance = this.calculateDistance(lat, lng, nearest.location[1], nearest.location[0]);

    for (let i = 1; i < availableUnits.length; i++) {
      let unit = availableUnits[i];
      let dist = this.calculateDistance(lat, lng, unit.location[1], unit.location[0]);
      if (dist < minDistance) {
        minDistance = dist;
        nearest = unit;
      }
    }
    
    return { ...nearest, distance: minDistance.toFixed(1) }; // km
  }

  // Simple Haversine approximation for mock data
  calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // km
    const x = (lon2 - lon1) * Math.cos((lat1 + lat2) / 2);
    const y = (lat2 - lat1);
    return Math.sqrt(x * x + y * y) * R;
  }
}

export const nearestUnitService = new NearestUnitService();
