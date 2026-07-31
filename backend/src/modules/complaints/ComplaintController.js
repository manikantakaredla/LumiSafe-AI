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
  async getAll(req, res, next) {
    try {
      // Import the model locally to avoid circular dependencies if needed, or import at top
      const { Complaint } = await import('../../models/Complaint.js');
      const complaints = await Complaint.find({ isDeleted: false }).sort({ createdAt: -1 });
      res.status(200).json({ data: complaints });
    } catch (err) {
      next(err);
    }
  }

  async getById(req, res, next) {
    try {
      const { Complaint } = await import('../../models/Complaint.js');
      const complaint = await Complaint.findOne({ complaintId: req.params.id, isDeleted: false });
      if (!complaint) return res.status(404).json({ error: 'Complaint not found' });
      res.status(200).json({ data: complaint });
    } catch (err) {
      next(err);
    }
  }

  async updateStatus(req, res, next) {
    try {
      const { Complaint } = await import('../../models/Complaint.js');
      const { status } = req.body;
      const complaint = await Complaint.findOneAndUpdate(
        { complaintId: req.params.id },
        { status, $push: { timeline: { status, timestamp: new Date() } } },
        { new: true }
      );
      if (!complaint) return res.status(404).json({ error: 'Complaint not found' });
      res.status(200).json({ data: complaint, message: 'Status updated' });
    } catch (err) {
      next(err);
    }
  }
}

export default new ComplaintController();
