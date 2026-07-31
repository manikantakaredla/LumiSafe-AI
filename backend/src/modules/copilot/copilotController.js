import { copilotEngine } from './CopilotEngine.js';

export const queryCopilot = async (req, res) => {
  try {
    const { query, context } = req.body;
    
    if (!query) {
      return res.status(400).json({ success: false, error: 'Query is required' });
    }

    const response = await copilotEngine.processQuery(query, context);
    
    res.status(200).json({
      success: true,
      data: response
    });
  } catch (error) {
    console.error('[CopilotController] Error processing query:', error);
    res.status(500).json({ success: false, error: 'Failed to process operational query' });
  }
};
