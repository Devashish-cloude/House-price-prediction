import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Building2, MapPin, Maximize2, Bed, Bath, Calendar, 
  Trash2, Scale, Heart, ArrowUpRight, Sparkles 
} from 'lucide-react';
import { formatPrice, formatDate } from '../utils/formatters';
import { usePrediction } from '../context/PredictionContext';

export default function PropertyCard({ property, onSelectForCompare, isCompared }) {
  const { deletePrediction, favorites, toggleFavorite, setCurrentPrediction } = usePrediction();
  const isFav = favorites.includes(property.id);

  const handleCardClick = () => {
    setCurrentPrediction({
      predicted_price: property.predicted_price,
      price_formatted: formatPrice(property.predicted_price),
      price_per_sqft: property.price_per_sqft,
      lower_range: property.lower_range,
      upper_range: property.upper_range,
      lower_range_formatted: formatPrice(property.lower_range),
      upper_range_formatted: formatPrice(property.upper_range),
      model_r2: property.model_r2 || 0.9035,
      model_name: property.model_name || 'XGBoost Regressor',
      explanation: property.explanation,
      top_positive_features: [],
      top_negative_features: [],
      all_contributions: [],
      property_input: property,
      timestamp: property.created_at,
      property_summary: {
        city: property.city,
        locality: property.locality,
        property_type: property.property_type,
        area: property.area,
        bhk: property.bhk,
        bathrooms: property.bathrooms,
        floor: `${property.floor}/${property.total_floors}`,
        age: `${property.property_age} yrs`,
        condition: property.property_condition,
        furnishing: property.furnished,
      }
    });
  };

  return (
    <div className="glass-card rounded-2xl p-5 relative group flex flex-col justify-between space-y-4 hover:border-teal-500/40">
      
      {/* Top Bar: Location & Fav */}
      <div>
        <div className="flex items-start justify-between gap-2">
          <div>
            <div className="flex items-center space-x-1.5 text-xs text-teal-600 dark:text-teal-400 font-bold uppercase tracking-wider">
              <Building2 className="w-3.5 h-3.5" />
              <span>{property.property_type}</span>
              <span className="text-slate-400">•</span>
              <span>{property.city}</span>
            </div>
            <h4 className="text-base font-bold text-slate-900 dark:text-white mt-1 group-hover:text-teal-500 transition-colors">
              {property.locality}
            </h4>
          </div>

          <div className="flex items-center space-x-1">
            <button
              onClick={() => toggleFavorite(property.id)}
              className={`p-1.5 rounded-lg transition-colors ${
                isFav 
                  ? 'text-rose-500 bg-rose-500/10' 
                  : 'text-slate-400 hover:text-rose-500 hover:bg-slate-100 dark:hover:bg-white/5'
              }`}
              title="Favorite"
            >
              <Heart className={`w-4 h-4 ${isFav ? 'fill-rose-500' : ''}`} />
            </button>
            <button
              onClick={() => deletePrediction(property.id)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-500/10 transition-colors"
              title="Delete Prediction"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Feature Tags */}
        <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-slate-100 dark:border-white/5 text-xs text-slate-600 dark:text-slate-300">
          <div className="flex items-center space-x-1.5">
            <Bed className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-semibold">{property.bhk} BHK</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <Maximize2 className="w-3.5 h-3.5 text-slate-400" />
            <span>{property.area} sq.ft</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>{property.property_age} yrs</span>
          </div>
        </div>
      </div>

      {/* Valuation Section */}
      <div className="pt-2 border-t border-slate-100 dark:border-white/5 flex items-center justify-between">
        <div>
          <p className="text-[10px] uppercase font-bold text-slate-400">Valuation</p>
          <p className="text-lg font-bold text-teal-600 dark:text-teal-400 font-display">
            {formatPrice(property.predicted_price)}
          </p>
          <p className="text-[10px] text-slate-400">
            ₹{property.price_per_sqft ? property.price_per_sqft.toLocaleString('en-IN') : Math.round(property.predicted_price / property.area).toLocaleString('en-IN')}/sq.ft
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => onSelectForCompare && onSelectForCompare(property)}
            className={`p-2 rounded-xl text-xs font-semibold flex items-center space-x-1 border transition-all ${
              isCompared
                ? 'bg-teal-500 text-white border-teal-500'
                : 'text-slate-600 dark:text-slate-300 border-slate-200 dark:border-white/10 hover:border-teal-500/40 hover:bg-teal-500/10'
            }`}
            title="Compare Property"
          >
            <Scale className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{isCompared ? 'Added' : 'Compare'}</span>
          </button>

          <Link
            to="/result"
            onClick={handleCardClick}
            className="p-2 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400 hover:bg-teal-500 hover:text-white transition-all"
            title="View Full Prediction Analysis"
          >
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

    </div>
  );
}
