class StorageService {
  async upload(file) {
    // Placeholder: In the future, this will push to Cloudinary or S3.
    // For now, it could save locally or just return a mock URL.
    return {
      url: `https://mock-storage.lumisafe.ai/evidence/${Date.now()}-${file.name}`,
      publicId: `mock-id-${Date.now()}`
    };
  }

  async delete(publicId) {
    console.log(`[StorageService] Deleted file ${publicId}`);
    return true;
  }
}

export default new StorageService();
