// Standardize all JSON responses
export const responseHandler = (req, res, next) => {
  const originalJson = res.json;

  res.json = function (body) {
    if (res.headersSent) return;

    // If body is already standardized, send it
    if (body && typeof body === 'object' && ('success' in body)) {
      return originalJson.call(this, body);
    }

    // Wrap normal responses in success object
    const standardized = {
      success: res.statusCode >= 200 && res.statusCode < 300,
      message: body.message || 'Operation successful',
      data: body.data !== undefined ? body.data : (body.message ? undefined : body),
      meta: {
        correlationId: req.id,
        timestamp: new Date().toISOString()
      }
    };

    return originalJson.call(this, standardized);
  };

  next();
};
