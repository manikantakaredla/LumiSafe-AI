import { gisEngine } from './gisEngine.js';

class GisController {
  async spatialLookup(req, res, next) {
    try {
      const { latitude, longitude, lat, lng } = req.body;
      const targetLat = parseFloat(lat ?? latitude);
      const targetLng = parseFloat(lng ?? longitude);

      if (isNaN(targetLat) || isNaN(targetLng)) {
        return res.status(400).json({
          success: false,
          message: 'Valid GPS latitude and longitude parameters are required for Point-in-Polygon spatial query.'
        });
      }

      const gisIntelligence = await gisEngine.analyzePoint([targetLng, targetLat]);

      res.status(200).json({
        success: true,
        message: 'Spatial Point-in-Polygon query resolved successfully',
        data: gisIntelligence
      });
    } catch (err) {
      next(err);
    }
  }

  async getWards(req, res, next) {
    try {
      const wards = await gisEngine.getAllWards();
      res.status(200).json({
        success: true,
        count: wards.length,
        data: wards
      });
    } catch (err) {
      next(err);
    }
  }
}

export default new GisController();
