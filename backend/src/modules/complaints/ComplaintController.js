import ComplaintService from './ComplaintService.js';

class ComplaintController {
  async submit(req, res, next) {
    try {
      const { category, description, lat, lng } = req.body;
      const idempotencyKey = req.headers['x-idempotency-key'];
      
      if (!category || !lat || !lng) {
        return res.status(400).json({ error: 'Missing required fields' }); // Note: will be replaced by express-validator
      }

      const complaint = await ComplaintService.submitReport({ category, description, lat, lng }, idempotencyKey, req.id);
      
      res.status(201).json({ 
        message: 'Report submitted successfully', 
        data: complaint 
      });
    } catch (err) {
      next(err);
    }
  }
}

export default new ComplaintController();
