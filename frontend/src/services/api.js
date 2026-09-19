import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const client = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

export const apiService = {
  async checkHealth() {
    try {
      const response = await client.get('/api/health');
      return response.data;
    } catch (error) {
      console.warn('Backend offline or health check failed:', error);
      return { status: 'offline', model_loaded: false };
    }
  },

  async predictPrice(propertyData) {
    const response = await client.post('/api/predict', propertyData);
    return response.data;
  },

  async explainPrediction(propertyData) {
    const response = await client.post('/api/explain', { property_data: propertyData });
    return response.data;
  },

  async simulateWhatIf(originalProperty, modifications) {
    const response = await client.post('/api/what-if', {
      original_property: originalProperty,
      modifications: modifications,
    });
    return response.data;
  },

  async sendChatMessage(message, currentProperty, conversationHistory = []) {
    const response = await client.post('/api/chat', {
      message,
      current_property: currentProperty,
      conversation_history: conversationHistory,
    });
    return response.data;
  },

  async getModelMetrics() {
    const response = await client.get('/api/model/metrics');
    return response.data;
  },

  async getLocations() {
    const response = await client.get('/api/locations');
    return response.data;
  }
};

export default apiService;
