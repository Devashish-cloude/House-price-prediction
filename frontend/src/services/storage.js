import { supabase, isSupabaseConfigured } from './supabase';

const LOCAL_STORAGE_KEY = 'houseai_saved_predictions';
const FAVORITES_KEY = 'houseai_favorite_ids';

const INITIAL_DEMO_PREDICTIONS = [
  {
    id: 'demo-pred-1',
    user_id: 'demo-user',
    city: 'Nagpur',
    locality: 'Manish Nagar',
    property_type: 'Apartment',
    area: 1250,
    carpet_area: 1060,
    bhk: 3,
    bathrooms: 2,
    balconies: 2,
    floor: 5,
    total_floors: 12,
    property_age: 3,
    parking: 1,
    furnished: 'Semi-Furnished',
    property_condition: 'Good',
    latitude: 21.0911,
    longitude: 79.0834,
    predicted_price: 9153000,
    price_per_sqft: 7322,
    lower_range: 5450000,
    upper_range: 12800000,
    model_r2: 0.9035,
    model_name: 'XGBoost Regressor',
    explanation: 'BHK Layout (+₹16.25 L) and Super Built-up Area (+₹2.76 L) added positive value.',
    amenities: ['has_parking', 'has_lift', 'has_security', 'has_power_backup', 'has_cctv'],
    created_at: new Date(Date.now() - 3600000 * 2).toISOString(),
  },
  {
    id: 'demo-pred-2',
    user_id: 'demo-user',
    city: 'Mumbai',
    locality: 'Bandra West',
    property_type: 'Apartment',
    area: 1650,
    carpet_area: 1420,
    bhk: 3,
    bathrooms: 3,
    balconies: 2,
    floor: 14,
    total_floors: 25,
    property_age: 2,
    parking: 2,
    furnished: 'Fully Furnished',
    property_condition: 'New',
    latitude: 19.0596,
    longitude: 72.8295,
    predicted_price: 74800000,
    price_per_sqft: 45333,
    lower_range: 70500000,
    upper_range: 79100000,
    model_r2: 0.9035,
    model_name: 'XGBoost Regressor',
    explanation: 'Prime coastal metro location in Bandra West and high-floor panoramic positioning generated substantial capital appreciation.',
    amenities: ['has_parking', 'has_lift', 'has_security', 'has_gym', 'has_swimming_pool', 'has_clubhouse', 'has_power_backup', 'has_ac'],
    created_at: new Date(Date.now() - 3600000 * 24).toISOString(),
  },
  {
    id: 'demo-pred-3',
    user_id: 'demo-user',
    city: 'Bengaluru',
    locality: 'Whitefield',
    property_type: 'Villa',
    area: 2800,
    carpet_area: 2450,
    bhk: 4,
    bathrooms: 4,
    balconies: 3,
    floor: 0,
    total_floors: 2,
    property_age: 1,
    parking: 2,
    furnished: 'Semi-Furnished',
    property_condition: 'New',
    latitude: 12.9698,
    longitude: 77.7500,
    predicted_price: 33500000,
    price_per_sqft: 11964,
    lower_range: 29800000,
    upper_range: 37200000,
    model_r2: 0.9035,
    model_name: 'XGBoost Regressor',
    explanation: 'Gated community villa specification, 4 BHK footprint, and private clubhouse amenities provided major uplift.',
    amenities: ['has_parking', 'has_security', 'has_gym', 'has_swimming_pool', 'has_garden', 'has_clubhouse', 'has_power_backup'],
    created_at: new Date(Date.now() - 3600000 * 48).toISOString(),
  },
  {
    id: 'demo-pred-4',
    user_id: 'demo-user',
    city: 'Pune',
    locality: 'Baner',
    property_type: 'Apartment',
    area: 980,
    carpet_area: 840,
    bhk: 2,
    bathrooms: 2,
    balconies: 1,
    floor: 6,
    total_floors: 14,
    property_age: 4,
    parking: 1,
    furnished: 'Semi-Furnished',
    property_condition: 'Good',
    latitude: 18.5590,
    longitude: 73.7868,
    predicted_price: 10400000,
    price_per_sqft: 10612,
    lower_range: 8500000,
    upper_range: 12300000,
    model_r2: 0.9035,
    model_name: 'XGBoost Regressor',
    explanation: 'Baner IT-hub proximity and efficient 2 BHK floorplan provides steady valuation performance.',
    amenities: ['has_parking', 'has_lift', 'has_security', 'has_power_backup'],
    created_at: new Date(Date.now() - 3600000 * 72).toISOString(),
  }
];

export const storageService = {
  getPredictions(userId = null) {
    if (isSupabaseConfigured() && supabase && userId) {
      // Async sync handled by hook; for fallback return local
    }
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!saved) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(INITIAL_DEMO_PREDICTIONS));
      return INITIAL_DEMO_PREDICTIONS;
    }
    try {
      return JSON.parse(saved);
    } catch {
      return INITIAL_DEMO_PREDICTIONS;
    }
  },

  savePrediction(prediction, user = null) {
    const list = this.getPredictions();
    const newRecord = {
      ...prediction,
      id: prediction.id || `pred-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      user_id: user?.id || 'guest-user',
      created_at: prediction.created_at || new Date().toISOString(),
    };

    const updated = [newRecord, ...list];
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));

    // Also persist to Supabase if connected
    if (isSupabaseConfigured() && supabase && user) {
      supabase.from('predictions').insert([{
        user_id: user.id,
        city: newRecord.city,
        locality: newRecord.locality,
        property_type: newRecord.property_type,
        area: newRecord.area,
        carpet_area: newRecord.carpet_area,
        bhk: newRecord.bhk,
        bathrooms: newRecord.bathrooms,
        balconies: newRecord.balconies,
        floor: newRecord.floor,
        total_floors: newRecord.total_floors,
        property_age: newRecord.property_age,
        parking: newRecord.parking,
        furnished: newRecord.furnished,
        property_condition: newRecord.property_condition,
        latitude: newRecord.latitude,
        longitude: newRecord.longitude,
        predicted_price: newRecord.predicted_price,
        price_per_sqft: newRecord.price_per_sqft,
        lower_range: newRecord.lower_range,
        upper_range: newRecord.upper_range,
        model_r2: newRecord.model_r2,
        model_name: newRecord.model_name,
        explanation: newRecord.explanation,
      }]).then(({ error }) => {
        if (error) console.warn('Supabase save note:', error.message);
      });
    }

    return newRecord;
  },

  deletePrediction(id) {
    const list = this.getPredictions();
    const filtered = list.filter((p) => p.id !== id);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(filtered));

    if (isSupabaseConfigured() && supabase) {
      supabase.from('predictions').delete().eq('id', id).then();
    }
    return filtered;
  },

  getFavorites() {
    try {
      const favs = localStorage.getItem(FAVORITES_KEY);
      return favs ? JSON.parse(favs) : ['demo-pred-1'];
    } catch {
      return ['demo-pred-1'];
    }
  },

  toggleFavorite(id) {
    const favs = this.getFavorites();
    let updated;
    if (favs.includes(id)) {
      updated = favs.filter((f) => f !== id);
    } else {
      updated = [...favs, id];
    }
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
    return updated;
  }
};

export default storageService;
