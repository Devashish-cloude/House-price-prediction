import React, { createContext, useContext, useState, useEffect } from 'react';
import apiService from '../services/api';
import storageService from '../services/storage';
import { INITIAL_FORM_DATA } from '../utils/constants';
import { useAuth } from './AuthContext';

const PredictionContext = createContext();

export function PredictionProvider({ children }) {
  const { user } = useAuth();
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [currentPrediction, setCurrentPrediction] = useState(null);
  const [predicting, setPredicting] = useState(false);
  const [predictionError, setPredictionError] = useState(null);

  const [savedPredictions, setSavedPredictions] = useState(() => storageService.getPredictions());
  const [favorites, setFavorites] = useState(() => storageService.getFavorites());
  const [compareList, setCompareList] = useState([]);
  const [modelMetrics, setModelMetrics] = useState(null);

  // Load initial model metrics
  useEffect(() => {
    apiService.getModelMetrics()
      .then((data) => setModelMetrics(data))
      .catch((err) => console.warn('Could not fetch model metrics on mount:', err));
  }, []);

  const updateFormField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const updateFormBulk = (fields) => {
    setFormData((prev) => ({ ...prev, ...fields }));
  };

  const runPrediction = async (customData = null) => {
    setPredicting(true);
    setPredictionError(null);
    try {
      const payload = customData || formData;
      const result = await apiService.predictPrice(payload);
      setCurrentPrediction({
        ...result,
        property_input: payload,
        timestamp: new Date().toISOString(),
      });
      return result;
    } catch (err) {
      const message = err.response?.data?.detail || err.message || 'Failed to generate prediction';
      setPredictionError(message);
      throw new Error(message);
    } finally {
      setPredicting(false);
    }
  };

  const saveCurrentPrediction = () => {
    if (!currentPrediction) return null;
    const input = currentPrediction.property_input || formData;
    const record = {
      city: input.city,
      locality: input.locality,
      property_type: input.property_type,
      area: input.area,
      carpet_area: input.carpet_area,
      bhk: input.bhk,
      bathrooms: input.bathrooms,
      balconies: input.balconies,
      floor: input.floor,
      total_floors: input.total_floors,
      property_age: input.property_age,
      parking: input.parking,
      furnished: input.furnished,
      property_condition: input.property_condition,
      latitude: input.latitude,
      longitude: input.longitude,
      predicted_price: currentPrediction.predicted_price,
      price_per_sqft: currentPrediction.price_per_sqft,
      lower_range: currentPrediction.lower_range,
      upper_range: currentPrediction.upper_range,
      model_r2: currentPrediction.model_r2,
      model_name: currentPrediction.model_name,
      explanation: currentPrediction.explanation,
      amenities: Object.keys(input).filter((k) => k.startsWith('has_') && input[k]),
      created_at: new Date().toISOString(),
    };

    const saved = storageService.savePrediction(record, user);
    setSavedPredictions(storageService.getPredictions());
    return saved;
  };

  const deletePrediction = (id) => {
    const updated = storageService.deletePrediction(id);
    setSavedPredictions(updated);
    setCompareList((prev) => prev.filter((item) => item.id !== id));
  };

  const toggleFavorite = (id) => {
    const updated = storageService.toggleFavorite(id);
    setFavorites(updated);
  };

  const toggleCompare = (property) => {
    setCompareList((prev) => {
      const exists = prev.some((p) => p.id === property.id);
      if (exists) {
        return prev.filter((p) => p.id !== property.id);
      }
      if (prev.length >= 4) {
        alert('You can compare up to 4 properties at a time.');
        return prev;
      }
      return [...prev, property];
    });
  };

  const clearCompare = () => setCompareList([]);

  return (
    <PredictionContext.Provider
      value={{
        formData,
        updateFormField,
        updateFormBulk,
        currentPrediction,
        setCurrentPrediction,
        predicting,
        predictionError,
        runPrediction,
        savedPredictions,
        saveCurrentPrediction,
        deletePrediction,
        favorites,
        toggleFavorite,
        compareList,
        toggleCompare,
        clearCompare,
        modelMetrics,
      }}
    >
      {children}
    </PredictionContext.Provider>
  );
}

export function usePrediction() {
  const context = useContext(PredictionContext);
  if (!context) {
    throw new Error('usePrediction must be used within a PredictionProvider');
  }
  return context;
}
