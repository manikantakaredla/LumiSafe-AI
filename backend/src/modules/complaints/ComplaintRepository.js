import BaseRepository from '../../shared/BaseRepository.js';
import { Complaint } from '../../models/Complaint.js';

class ComplaintRepository extends BaseRepository {
  constructor() {
    super(Complaint);
  }
}

export default new ComplaintRepository();
