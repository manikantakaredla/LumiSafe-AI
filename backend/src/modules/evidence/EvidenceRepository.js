import BaseRepository from '../../shared/BaseRepository.js';
import { Evidence } from '../../models/Evidence.js';

class EvidenceRepository extends BaseRepository {
  constructor() {
    super(Evidence);
  }
}

export default new EvidenceRepository();
