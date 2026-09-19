import React, { useEffect, useState, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import { MapPin, Navigation, Compass } from 'lucide-react';

// Custom Map Marker Icon
const customIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-teal.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

function LocationMarker({ position, setPosition, onCoordinatesChange, locality, city }) {
  const map = useMap();

  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      setPosition([lat, lng]);
      onCoordinatesChange(roundCoord(lat), roundCoord(lng));
    },
  });

  const eventHandlers = useMemo(
    () => ({
      dragend(e) {
        const marker = e.target;
        if (marker != null) {
          const { lat, lng } = marker.getLatLng();
          setPosition([lat, lng]);
          onCoordinatesChange(roundCoord(lat), roundCoord(lng));
        }
      },
    }),
    [onCoordinatesChange, setPosition]
  );

  return (
    <Marker
      position={position}
      draggable={true}
      eventHandlers={eventHandlers}
      icon={customIcon}
    >
      <Popup>
        <div className="text-xs font-sans p-1">
          <p className="font-bold text-slate-800">{locality || 'Selected Property'}</p>
          <p className="text-slate-500">{city}</p>
          <p className="text-[10px] text-teal-600 font-mono mt-1">
            {position[0].toFixed(4)}, {position[1].toFixed(4)}
          </p>
          <p className="text-[9px] text-slate-400 mt-0.5">Drag to adjust exact pin</p>
        </div>
      </Popup>
    </Marker>
  );
}

function ChangeView({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, zoom, { duration: 1.2 });
  }, [center, zoom, map]);
  return null;
}

function roundCoord(num) {
  return Math.round(num * 1000000) / 1000000;
}

export default function MapPicker({ latitude, longitude, onCoordinatesChange, city, locality }) {
  const defaultLat = latitude || 21.0911;
  const defaultLon = longitude || 79.0834;
  const [position, setPosition] = useState([defaultLat, defaultLon]);
  const [mapCenter, setMapCenter] = useState([defaultLat, defaultLon]);

  useEffect(() => {
    if (latitude && longitude && (latitude !== position[0] || longitude !== position[1])) {
      setPosition([latitude, longitude]);
      setMapCenter([latitude, longitude]);
    }
  }, [latitude, longitude]);

  const handleRecenter = () => {
    setMapCenter([...position]);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center space-x-1.5">
          <MapPin className="w-3.5 h-3.5 text-teal-500" />
          <span>Interactive Location Map</span>
        </label>
        
        <div className="flex items-center space-x-2 text-[11px] text-slate-500 dark:text-slate-400">
          <span className="font-mono bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded border border-slate-200 dark:border-white/5">
            Lat: {position[0].toFixed(4)} | Lon: {position[1].toFixed(4)}
          </span>
          <button
            type="button"
            onClick={handleRecenter}
            className="p-1 rounded bg-teal-500/10 text-teal-600 dark:text-teal-400 hover:bg-teal-500/20 transition-colors"
            title="Recenter Map"
          >
            <Navigation className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="h-64 sm:h-72 w-full rounded-2xl overflow-hidden border border-slate-200 dark:border-white/10 shadow-inner relative">
        <MapContainer
          center={mapCenter}
          zoom={13}
          scrollWheelZoom={false}
          className="h-full w-full"
        >
          <ChangeView center={mapCenter} zoom={13} />
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <LocationMarker
            position={position}
            setPosition={setPosition}
            onCoordinatesChange={onCoordinatesChange}
            locality={locality}
            city={city}
          />
        </MapContainer>

        <div className="absolute bottom-2 left-2 z-[400] bg-slate-900/80 backdrop-blur-md text-white px-2.5 py-1 rounded-lg text-[10px] flex items-center space-x-1.5 shadow-md">
          <Compass className="w-3 h-3 text-teal-400" />
          <span>Click on map or drag pin to fine-tune geolocation</span>
        </div>
      </div>
    </div>
  );
}
