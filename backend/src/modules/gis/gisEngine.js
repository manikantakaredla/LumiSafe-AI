import { Ward } from '../../models/Ward.js';
import { StreetLight } from '../../models/StreetLight.js';
import PoliceUnit from '../../models/PoliceUnit.js';
import { RepairTeam } from '../../models/RepairTeam.js';

// Calculate Earth circle distance in meters between two [lng, lat] coords (Haversine Formula)
function calculateDistanceInMeters(coord1, coord2) {
  const [lng1, lat1] = coord1;
  const [lng2, lat2] = coord2;
  const R = 6371e3; // meters
  const phi1 = (lat1 * Math.PI) / 180;
  const phi2 = (lat2 * Math.PI) / 180;
  const deltaPhi = ((lat2 - lat1) * Math.PI) / 180;
  const deltaLambda = ((lng2 - lng1) * Math.PI) / 180;

  const a = Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
            Math.cos(phi1) * Math.cos(phi2) *
            Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

// Fallback Ray-Casting algorithm for mathematical Point-in-Polygon checking in JS
function isPointInPolygon(point, vs) {
  const x = point[0], y = point[1];
  let inside = false;
  for (let i = 0, j = vs.length - 1; i < vs.length; j = i++) {
    const xi = vs[i][0], yi = vs[i][1];
    const xj = vs[j][0], yj = vs[j][1];
    const intersect = ((yi > y) !== (yj > y)) &&
        (x < (xj - xi) * (y - yi) / (yj - yi + 0.000001) + xi);
    if (intersect) inside = !inside;
  }
  return inside;
}

class GisEngine {
  async analyzePoint(coordinates) {
    // coordinates: [longitude, latitude]
    const [lng, lat] = coordinates.map(Number);

    // 1. Point-in-Polygon Ward Query ($geoIntersects)
    let matchedWard = null;
    let matchMethod = 'Exact Spatial $geoIntersects (Point-in-Polygon)';

    try {
      matchedWard = await Ward.findOne({
        boundary: {
          $geoIntersects: {
            $geometry: {
              type: 'Point',
              coordinates: [lng, lat]
            }
          }
        }
      });
    } catch (err) {
      console.warn('[GIS Engine] $geoIntersects query issue, utilizing ray-casting fallback:', err.message);
    }

    // Fallback: If point is outside seeded polygons (e.g. click in unassigned street gap), find closest Ward
    if (!matchedWard) {
      const allWards = await Ward.find({});
      for (const ward of allWards) {
        if (ward.boundary?.coordinates?.[0]) {
          if (isPointInPolygon([lng, lat], ward.boundary.coordinates[0])) {
            matchedWard = ward;
            matchMethod = 'Ray-Casting Algorithm Polygon Match';
            break;
          }
        }
      }

      // If still no direct inclusion, find nearest centroid/boundary vertex
      if (!matchedWard && allWards.length > 0) {
        let minDist = Infinity;
        for (const ward of allWards) {
          if (ward.boundary?.coordinates?.[0]?.[0]) {
            const dist = calculateDistanceInMeters([lng, lat], ward.boundary.coordinates[0][0]);
            if (dist < minDist) {
              minDist = dist;
              matchedWard = ward;
            }
          }
        }
        matchMethod = `Nearest Ward Boundary ($nearSphere approximation: ${minDist} meters)`;
      }
    }

    // 2. Locate Nearest Streetlight Asset & Road Network Segment
    let nearestLight = null;
    let assetDistanceMeters = null;

    try {
      // Find nearest streetlight within 5 km
      const lights = await StreetLight.find({
        location: {
          $nearSphere: {
            $geometry: { type: 'Point', coordinates: [lng, lat] },
            $maxDistance: 5000 // 5km radius
          }
        }
      }).limit(1);

      if (lights && lights.length > 0) {
        nearestLight = lights[0];
        assetDistanceMeters = calculateDistanceInMeters([lng, lat], nearestLight.location.coordinates);
      }
    } catch (err) {
      // Fallback in case nearSphere index fails
      const allLights = await StreetLight.find({});
      if (allLights.length > 0) {
        let minLightDist = Infinity;
        for (const l of allLights) {
          if (l.location?.coordinates) {
            const d = calculateDistanceInMeters([lng, lat], l.location.coordinates);
            if (d < minLightDist) {
              minLightDist = d;
              nearestLight = l;
              assetDistanceMeters = d;
            }
          }
        }
      }
    }

    // 3. Locate nearest Police Patrol Unit and Repair Crew
    let nearestPolice = null;
    let policeDistanceMeters = null;
    const policeUnits = await PoliceUnit.find({ status: { $ne: 'OFF_DUTY' } });
    for (const u of policeUnits) {
      if (u.currentLocation?.coordinates) {
        const d = calculateDistanceInMeters([lng, lat], u.currentLocation.coordinates);
        if (policeDistanceMeters === null || d < policeDistanceMeters) {
          policeDistanceMeters = d;
          nearestPolice = u;
        }
      }
    }

    let nearestTeam = null;
    let teamDistanceMeters = null;
    const teams = await RepairTeam.find({ status: 'AVAILABLE' });
    for (const t of teams) {
      if (t.currentLocation?.coordinates) {
        const d = calculateDistanceInMeters([lng, lat], t.currentLocation.coordinates);
        if (teamDistanceMeters === null || d < teamDistanceMeters) {
          teamDistanceMeters = d;
          nearestTeam = t;
        }
      }
    }

    return {
      gps: { latitude: lat, longitude: lng },
      ward: matchedWard ? {
        id: matchedWard._id,
        name: matchedWard.name,
        zone: matchedWard.zone,
        safetyIndex: matchedWard.safetyIndex,
        criticalAssets: matchedWard.criticalAssets,
        matchMethod
      } : null,
      roadNetwork: {
        nearestAssetId: nearestLight ? nearestLight._id : null,
        poleId: nearestLight ? nearestLight.assetId : 'Unassigned Pole',
        roadName: nearestLight ? nearestLight.roadName : 'Visakhapatnam Urban Road Network',
        status: nearestLight ? nearestLight.status : 'Operational',
        voltage: nearestLight?.telemetry?.voltage || 230,
        distanceMeters: assetDistanceMeters || 12
      },
      dispatchUnits: {
        policeSector: nearestPolice ? {
          unitName: nearestPolice.unitName,
          vehicleNumber: nearestPolice.vehicleNumber,
          officerName: nearestPolice.officerInCharge?.name || 'Assigned Officer',
          distanceKm: (policeDistanceMeters / 1000).toFixed(1),
          estimatedResponseMins: Math.max(2, Math.round(policeDistanceMeters / 400))
        } : null,
        repairCrew: nearestTeam ? {
          teamName: nearestTeam.name,
          distanceKm: (teamDistanceMeters / 1000).toFixed(1),
          estimatedResponseMins: Math.max(5, Math.round(teamDistanceMeters / 300))
        } : null
      }
    };
  }

  async getAllWards() {
    return await Ward.find({});
  }
}

export const gisEngine = new GisEngine();
