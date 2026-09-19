import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  History, Search, Filter, Trash2, Eye, Scale, 
  Download, Plus, Building2, MapPin, Calendar, Heart 
} from 'lucide-react';
import { usePrediction } from '../context/PredictionContext';
import { formatPrice, formatDate } from '../utils/formatters';

export default function HistoryPage() {
  const { savedPredictions, deletePrediction, toggleCompare, compareList, setCurrentPrediction, favorites, toggleFavorite } = usePrediction();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('All');
  const [selectedType, setSelectedType] = useState('All');
  const [sortBy, setSortBy] = useState('date_desc');

  // Unique cities and types in history
  const cities = ['All', ...new Set(savedPredictions.map((p) => p.city))];
  const types = ['All', ...new Set(savedPredictions.map((p) => p.property_type))];

  const filteredPredictions = useMemo(() => {
    return savedPredictions
      .filter((item) => {
        const matchesSearch = 
          item.locality?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.city?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCity = selectedCity === 'All' || item.city === selectedCity;
        const matchesType = selectedType === 'All' || item.property_type === selectedType;
        return matchesSearch && matchesCity && matchesType;
      })
      .sort((a, b) => {
        if (sortBy === 'date_desc') return new Date(b.created_at) - new Date(a.created_at);
        if (sortBy === 'date_asc') return new Date(a.created_at) - new Date(b.created_at);
        if (sortBy === 'price_desc') return b.predicted_price - a.predicted_price;
        if (sortBy === 'price_asc') return a.predicted_price - b.predicted_price;
        return 0;
      });
  }, [savedPredictions, searchQuery, selectedCity, selectedType, sortBy]);

  const handleViewPrediction = (item) => {
    setCurrentPrediction({
      predicted_price: item.predicted_price,
      price_formatted: formatPrice(item.predicted_price),
      price_per_sqft: item.price_per_sqft,
      lower_range: item.lower_range,
      upper_range: item.upper_range,
      lower_range_formatted: formatPrice(item.lower_range),
      upper_range_formatted: formatPrice(item.upper_range),
      model_r2: item.model_r2 || 0.9035,
      model_name: item.model_name || 'XGBoost Regressor',
      explanation: item.explanation,
      top_positive_features: [],
      top_negative_features: [],
      all_contributions: [],
      property_input: item,
      timestamp: item.created_at,
      property_summary: {
        city: item.city,
        locality: item.locality,
        property_type: item.property_type,
        area: item.area,
        bhk: item.bhk,
        bathrooms: item.bathrooms,
        floor: `${item.floor}/${item.total_floors}`,
        age: `${item.property_age} yrs`,
        condition: item.property_condition,
        furnishing: item.furnished,
      }
    });
    navigate('/result');
  };

  const handleExportCSV = () => {
    if (!savedPredictions.length) return;
    const headers = ["City", "Locality", "Property Type", "BHK", "Area (sqft)", "Predicted Price (INR)", "Price/sqft", "Date"];
    const rows = filteredPredictions.map((p) => [
      `"${p.city}"`,
      `"${p.locality}"`,
      `"${p.property_type}"`,
      p.bhk,
      p.area,
      p.predicted_price,
      p.price_per_sqft || Math.round(p.predicted_price / p.area),
      `"${p.created_at}"`
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `houseai_predictions_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-white/10">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center space-x-2">
            <History className="w-5 h-5 text-teal-500" />
            <span>Prediction History</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Browse, filter, compare, and manage your saved ML property valuations.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          {compareList.length > 0 && (
            <Link
              to="/compare"
              className="px-3.5 py-2 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/30 text-xs font-bold flex items-center space-x-1.5 animate-pulse"
            >
              <Scale className="w-3.5 h-3.5" />
              <span>Compare Selected ({compareList.length})</span>
            </Link>
          )}

          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2 rounded-xl glass-card text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center space-x-1.5 hover:border-teal-500/40 transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>

          <Link
            to="/predict"
            className="px-3.5 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold flex items-center space-x-1.5 shadow-md shadow-teal-500/20 transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Valuation</span>
          </Link>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="glass-card rounded-2xl p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
        
        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search locality or city..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full glass-input rounded-xl pl-9 pr-3 py-2 text-xs text-slate-800 dark:text-slate-200"
          />
        </div>

        {/* City Filter */}
        <div>
          <select
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            className="w-full glass-input rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-slate-200"
          >
            {cities.map((c) => (
              <option key={c} value={c}>City: {c}</option>
            ))}
          </select>
        </div>

        {/* Property Type Filter */}
        <div>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="w-full glass-input rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-slate-200"
          >
            {types.map((t) => (
              <option key={t} value={t}>Type: {t}</option>
            ))}
          </select>
        </div>

        {/* Sort Order */}
        <div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full glass-input rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-slate-200"
          >
            <option value="date_desc">Sort: Newest First</option>
            <option value="date_asc">Sort: Oldest First</option>
            <option value="price_desc">Sort: Price (High to Low)</option>
            <option value="price_asc">Sort: Price (Low to High)</option>
          </select>
        </div>

      </div>

      {/* Predictions Table */}
      <div className="glass-card rounded-3xl overflow-hidden shadow-xl border border-slate-200 dark:border-white/10">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 dark:bg-slate-900/80 text-slate-500 dark:text-slate-400 font-bold border-b border-slate-200 dark:border-white/10 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="px-5 py-3.5">Property</th>
                <th className="px-5 py-3.5">BHK & Area</th>
                <th className="px-5 py-3.5">Location</th>
                <th className="px-5 py-3.5">Predicted Price</th>
                <th className="px-5 py-3.5">Date</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/5">
              {filteredPredictions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-slate-400">
                    No predictions match your filter criteria.
                  </td>
                </tr>
              ) : (
                filteredPredictions.map((item) => {
                  const isCompared = compareList.some((p) => p.id === item.id);
                  const isFav = favorites.includes(item.id);
                  return (
                    <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => toggleFavorite(item.id)}
                            className={`p-1 rounded ${isFav ? 'text-rose-500' : 'text-slate-400 hover:text-rose-500'}`}
                          >
                            <Heart className={`w-3.5 h-3.5 ${isFav ? 'fill-rose-500' : ''}`} />
                          </button>
                          <div>
                            <span className="font-bold text-slate-900 dark:text-white block">
                              {item.locality}
                            </span>
                            <span className="text-[11px] text-teal-600 dark:text-teal-400">
                              {item.property_type}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-slate-600 dark:text-slate-300">
                        <span className="font-bold">{item.bhk} BHK</span> • {item.area} sq.ft
                        <span className="block text-[10px] text-slate-400">Age: {item.property_age} yrs</span>
                      </td>
                      <td className="px-5 py-4 text-slate-600 dark:text-slate-300">
                        <span className="font-semibold">{item.city}</span>
                      </td>
                      <td className="px-5 py-4">
                        <span className="font-bold text-teal-600 dark:text-teal-400 font-display block">
                          {formatPrice(item.predicted_price)}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          ₹{(item.price_per_sqft || Math.round(item.predicted_price / item.area)).toLocaleString('en-IN')}/sq.ft
                        </span>
                      </td>
                      <td className="px-5 py-4 text-slate-400 text-[11px]">
                        {formatDate(item.created_at)}
                      </td>
                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end space-x-1.5">
                          <button
                            onClick={() => toggleCompare(item)}
                            className={`p-1.5 rounded-lg border text-xs transition-all ${
                              isCompared
                                ? 'bg-teal-500 text-white border-teal-500'
                                : 'text-slate-400 border-slate-200 dark:border-white/10 hover:border-teal-500/40 hover:text-teal-500'
                            }`}
                            title="Add to Compare"
                          >
                            <Scale className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => handleViewPrediction(item)}
                            className="p-1.5 rounded-lg bg-teal-500/10 text-teal-600 dark:text-teal-400 hover:bg-teal-500 hover:text-white transition-all"
                            title="View Full Result"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => deletePrediction(item.id)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-500/10 transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
