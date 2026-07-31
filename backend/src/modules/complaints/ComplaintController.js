import ComplaintService from './ComplaintService.js';

class ComplaintController {
  async submit(req, res) {
    try {
      const { category, description, lat, lng } = req.body;
      
      if (!category || !lat || !lng) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      const complaint = await ComplaintService.submitReport({ category, description, lat, lng });
      
      res.status(201).json({ 
        message: 'Report submitted successfully', 
        data: complaint 
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Server error processing complaint' });
    }
  }
}

export default new ComplaintController();
