class BaseRepository {
  constructor(model) {
    this.model = model;
  }

  async create(data) {
    return await this.model.create(data);
  }

  async findById(id) {
    return await this.model.findOne({ _id: id, isDeleted: { $ne: true } });
  }

  async find(query = {}, options = {}) {
    const { page = 1, limit = 20, sort = { createdAt: -1 } } = options;
    const skip = (page - 1) * limit;

    const data = await this.model.find({ ...query, isDeleted: { $ne: true } })
      .sort(sort)
      .skip(skip)
      .limit(Number(limit));

    const total = await this.model.countDocuments({ ...query, isDeleted: { $ne: true } });

    return {
      data,
      meta: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  async updateById(id, data) {
    return await this.model.findOneAndUpdate(
      { _id: id, isDeleted: { $ne: true } }, 
      data, 
      { new: true }
    );
  }

  async deleteById(id, deletedBy = 'system') {
    return await this.model.findByIdAndUpdate(id, {
      isDeleted: true,
      deletedAt: new Date(),
      deletedBy
    }, { new: true });
  }
}

export default BaseRepository;
