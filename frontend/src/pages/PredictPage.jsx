import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Building2, MapPin, Sparkles, Layers, Sliders, 
  ShieldCheck, ArrowRight, Check, Compass, Car, 
  ArrowUpDown, Waves, Dumbbell, Trees, Zap, 
  Camera, Wifi, Droplets, Wind, Home
} from 'lucide-react';
import { usePrediction } from '../context/PredictionContext';
import { AMENITIES, CITIES_DATA } from '../utils/constants';
import MapPicker from '../components/MapPicker';
import { PredictionLoadingOverlay } from '../components/LoadingSkeleton';

export default function PredictPage() {
  const { formData, updateFormField, updateFormBulk, runPrediction, predicting } = usePrediction();
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(1);
  const [localError, setLocalError] = useState(null);

  const cityData = CITIES_DATA[formData.city] || CITIES_DATA['Nagpur'];
  const localities = cityData.localities || [];

  // Icon mapping for amenities
  const getAmenityIcon = (iconName) => {
    switch (iconName) {
      case 'Car': return Car;
      case 'ArrowUpDown': return ArrowUpDown;
      case 'ShieldCheck': return ShieldCheck;
      case 'Dumbbell': return Dumbbell;
      case 'Waves': return Waves;
      case 'Trees': return Trees;
      case 'Building': return Building2;
      case 'Zap': return Zap;
      case 'Camera': return Camera;
      case 'Wifi': return Wifi;
      case 'Droplets': return Droplets;
      case 'Wind': return Wind;
      default: return Sparkles;
    }
  };

  const handleCityChange = (cityName) => {
    const data = CITIES_DATA[cityName] || CITIES_DATA['Nagpur'];
    const firstLocality = data.localities[0] || 'Center';
    updateFormBulk({
      city: cityName,
      locality: firstLocality,
      latitude: data.lat,
      longitude: data.lon,
    });
  };

  const handleCoordinatesChange = (lat, lon) => {
    updateFormBulk({ latitude: lat, longitude: lon });
  };

  const handleAreaChange = (val) => {
    const area = Number(val);
    updateFormField('area', area);
    if (!formData.carpet_area || formData.carpet_area === Math.round(formData.area * 0.85)) {
      updateFormField('carpet_area', Math.round(area * 0.85));
    }
  };

  const handleBhkChange = (bhkVal) => {
    const bhk = Number(bhkVal);
    updateFormBulk({
      bhk: bhk,
      bedrooms: bhk,
      bathrooms: Math.max(1, bhk === 1 ? 1 : bhk - 1),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError(null);

    // Validation
    if (formData.area <= 50) {
      setLocalError('Super Built-up Area must be greater than 50 sq.ft.');
      return;
    }
    if (formData.floor > formData.total_floors && formData.property_type === 'Apartment') {
      setLocalError('Floor number cannot exceed total floors.');
      return;
    }

    try {
      await runPrediction();
      navigate('/result');
    } catch (err) {
      setLocalError(err.message || 'Error executing ML prediction');
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      
      {predicting && <PredictionLoadingOverlay message="Generating genuine ML valuation and computing SHAP feature contributions..." />}

      {/* Header */}
      <div className="text-center space-y-2 max-w-2xl mx-auto">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-teal-500/10 text-teal-600 dark:text-teal-400 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Real-Time AIML Regression Engine</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
          Property Price Prediction Form
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Complete the property specifications below to generate an accurate valuation estimate with SHAP explainability.
        </p>
      </div>

      {/* Error Alert */}
      {localError && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-600 dark:text-rose-400 font-medium">
          {localError}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* SECTION 1: Location Details & Interactive Map */}
        <div className="glass-card rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="flex items-center space-x-3 pb-3 border-b border-slate-200 dark:border-white/10">
            <div className="w-8 h-8 rounded-xl bg-teal-500/10 text-teal-500 flex items-center justify-center font-bold text-xs">
              01
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">Location Details & GIS Mapping</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Select city, neighborhood locality, and exact coordinates.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            
            {/* City */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">City</label>
              <select
                value={formData.city}
                onChange={(e) => handleCityChange(e.target.value)}
                className="w-full glass-input rounded-xl px-3.5 py-2.5 text-xs font-medium text-slate-800 dark:text-slate-200"
              >
                {Object.keys(CITIES_DATA).map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* Locality */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Locality / Neighborhood</label>
              <select
                value={formData.locality}
                onChange={(e) => updateFormField('locality', e.target.value)}
                className="w-full glass-input rounded-xl px-3.5 py-2.5 text-xs font-medium text-slate-800 dark:text-slate-200"
              >
                {localities.map((loc) => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>
            </div>

            {/* State / Country */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Country & Region</label>
              <input
                type="text"
                disabled
                value="India (Urban Metro)"
                className="w-full glass-input rounded-xl px-3.5 py-2.5 text-xs font-medium bg-slate-100 dark:bg-slate-800/50 text-slate-500"
              />
            </div>

          </div>

          {/* Interactive Leaflet Map */}
          <MapPicker
            latitude={formData.latitude}
            longitude={formData.longitude}
            onCoordinatesChange={handleCoordinatesChange}
            city={formData.city}
            locality={formData.locality}
          />
        </div>

        {/* SECTION 2: Property Structural Details */}
        <div className="glass-card rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="flex items-center space-x-3 pb-3 border-b border-slate-200 dark:border-white/10">
            <div className="w-8 h-8 rounded-xl bg-teal-500/10 text-teal-500 flex items-center justify-center font-bold text-xs">
              02
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">Property Specifications</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Specify floor area, bedrooms, floor height, and property age.</p>
            </div>
          </div>

          {/* Property Type Radio Pills */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Property Type</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {['Apartment', 'Independent House', 'Villa', 'Plot'].map((type) => {
                const selected = formData.property_type === type;
                return (
                  <button
                    key={type}
                    type="button"
                    onClick={() => updateFormField('property_type', type)}
                    className={`p-3 rounded-2xl border text-xs font-bold transition-all flex items-center justify-center space-x-2 ${
                      selected
                        ? 'bg-teal-500 text-white border-teal-500 shadow-md shadow-teal-500/20'
                        : 'glass-input text-slate-700 dark:text-slate-300 hover:border-teal-500/40'
                    }`}
                  >
                    <Building2 className="w-4 h-4" />
                    <span>{type}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            
            {/* BHK Selection */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">BHK Configuration</label>
              <select
                value={formData.bhk}
                onChange={(e) => handleBhkChange(e.target.value)}
                className="w-full glass-input rounded-xl px-3.5 py-2.5 text-xs font-medium text-slate-800 dark:text-slate-200"
              >
                <option value={1}>1 BHK</option>
                <option value={2}>2 BHK</option>
                <option value={3}>3 BHK</option>
                <option value={4}>4 BHK</option>
                <option value={5}>5+ BHK</option>
                {formData.property_type === 'Plot' && <option value={0}>0 (Plot / Land)</option>}
              </select>
            </div>

            {/* Super Built-up Area */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Super Built-up Area (sq.ft)
              </label>
              <input
                type="number"
                min={100}
                max={20000}
                value={formData.area}
                onChange={(e) => handleAreaChange(e.target.value)}
                className="w-full glass-input rounded-xl px-3.5 py-2.5 text-xs font-medium text-slate-800 dark:text-slate-200"
                required
              />
            </div>

            {/* Carpet Area */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Carpet Area (sq.ft)
              </label>
              <input
                type="number"
                min={80}
                max={18000}
                value={formData.carpet_area || Math.round(formData.area * 0.85)}
                onChange={(e) => updateFormField('carpet_area', Number(e.target.value))}
                className="w-full glass-input rounded-xl px-3.5 py-2.5 text-xs font-medium text-slate-800 dark:text-slate-200"
              />
            </div>

            {/* Bathrooms */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Bathrooms</label>
              <input
                type="number"
                min={0}
                max={10}
                value={formData.bathrooms}
                onChange={(e) => updateFormField('bathrooms', Number(e.target.value))}
                className="w-full glass-input rounded-xl px-3.5 py-2.5 text-xs font-medium text-slate-800 dark:text-slate-200"
              />
            </div>

            {/* Balconies */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Balconies</label>
              <input
                type="number"
                min={0}
                max={10}
                value={formData.balconies}
                onChange={(e) => updateFormField('balconies', Number(e.target.value))}
                className="w-full glass-input rounded-xl px-3.5 py-2.5 text-xs font-medium text-slate-800 dark:text-slate-200"
              />
            </div>

            {/* Property Age */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Property Age (Years)</label>
              <input
                type="number"
                min={0}
                max={100}
                value={formData.property_age}
                onChange={(e) => updateFormField('property_age', Number(e.target.value))}
                className="w-full glass-input rounded-xl px-3.5 py-2.5 text-xs font-medium text-slate-800 dark:text-slate-200"
              />
            </div>

            {/* Floor Number */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Floor Level</label>
              <input
                type="number"
                min={0}
                max={100}
                value={formData.floor}
                onChange={(e) => updateFormField('floor', Number(e.target.value))}
                className="w-full glass-input rounded-xl px-3.5 py-2.5 text-xs font-medium text-slate-800 dark:text-slate-200"
              />
            </div>

            {/* Total Floors */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Total Building Floors</label>
              <input
                type="number"
                min={1}
                max={100}
                value={formData.total_floors}
                onChange={(e) => updateFormField('total_floors', Number(e.target.value))}
                className="w-full glass-input rounded-xl px-3.5 py-2.5 text-xs font-medium text-slate-800 dark:text-slate-200"
              />
            </div>

            {/* Parking Spaces */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Reserved Parking</label>
              <input
                type="number"
                min={0}
                max={10}
                value={formData.parking}
                onChange={(e) => updateFormField('parking', Number(e.target.value))}
                className="w-full glass-input rounded-xl px-3.5 py-2.5 text-xs font-medium text-slate-800 dark:text-slate-200"
              />
            </div>

          </div>
        </div>

        {/* SECTION 3: Furnishing & Condition */}
        <div className="glass-card rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="flex items-center space-x-3 pb-3 border-b border-slate-200 dark:border-white/10">
            <div className="w-8 h-8 rounded-xl bg-teal-500/10 text-teal-500 flex items-center justify-center font-bold text-xs">
              03
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">Condition & Furnishing State</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Select interior readiness and physical property state.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            
            {/* Furnishing Status */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Furnishing Status</label>
              <div className="grid grid-cols-3 gap-2">
                {['Unfurnished', 'Semi-Furnished', 'Fully Furnished'].map((f) => {
                  const sel = formData.furnished === f;
                  return (
                    <button
                      key={f}
                      type="button"
                      onClick={() => updateFormField('furnished', f)}
                      className={`p-2.5 rounded-xl border text-xs font-bold transition-all ${
                        sel 
                          ? 'bg-teal-500 text-white border-teal-500 shadow-sm'
                          : 'glass-input text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {f}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Condition */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Property Condition</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {['New', 'Good', 'Average', 'Needs Renovation'].map((c) => {
                  const sel = formData.property_condition === c;
                  return (
                    <button
                      key={c}
                      type="button"
                      onClick={() => updateFormField('property_condition', c)}
                      className={`p-2 rounded-xl border text-xs font-bold transition-all text-center ${
                        sel 
                          ? 'bg-teal-500 text-white border-teal-500 shadow-sm'
                          : 'glass-input text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {c}
                    </button>
                  );
                })}
              </div>
            </div>

          </div>
        </div>

        {/* SECTION 4: Amenities & Society Facilities */}
        <div className="glass-card rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="flex items-center space-x-3 pb-3 border-b border-slate-200 dark:border-white/10">
            <div className="w-8 h-8 rounded-xl bg-teal-500/10 text-teal-500 flex items-center justify-center font-bold text-xs">
              04
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">Amenities & Modern Facilities</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Toggle available amenities to factor into the ML valuation.</p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {AMENITIES.map((item) => {
              const Icon = getAmenityIcon(item.icon);
              const checked = Boolean(formData[item.id]);
              return (
                <div
                  key={item.id}
                  onClick={() => updateFormField(item.id, !checked)}
                  className={`p-3.5 rounded-2xl border cursor-pointer select-none transition-all flex items-center justify-between ${
                    checked
                      ? 'bg-teal-500/10 border-teal-500/50 text-teal-900 dark:text-teal-200 shadow-sm'
                      : 'glass-input text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center space-x-2.5">
                    <Icon className={`w-4 h-4 ${checked ? 'text-teal-500' : 'text-slate-400'}`} />
                    <span className="text-xs font-bold">{item.label}</span>
                  </div>
                  <div className={`w-4 h-4 rounded-md border flex items-center justify-center ${
                    checked ? 'bg-teal-500 border-teal-500 text-white' : 'border-slate-300 dark:border-white/20'
                  }`}>
                    {checked && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-4 text-center">
          <button
            type="submit"
            disabled={predicting}
            className="w-full sm:w-auto px-10 py-4 rounded-2xl bg-gradient-to-r from-teal-600 via-emerald-500 to-teal-500 hover:from-teal-500 hover:to-emerald-400 text-white font-extrabold text-base shadow-xl shadow-teal-500/30 flex items-center justify-center space-x-3 mx-auto transition-all hover:scale-[1.02] disabled:opacity-50"
          >
            <span>Predict Property Price →</span>
          </button>
        </div>

      </form>

    </div>
  );
}
