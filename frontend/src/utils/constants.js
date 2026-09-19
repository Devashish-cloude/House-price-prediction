export const AMENITIES = [
  { id: 'has_parking', label: 'Parking', icon: 'Car', desc: 'Reserved covered vehicle parking' },
  { id: 'has_lift', label: 'Lift', icon: 'ArrowUpDown', desc: 'High-speed passenger elevator' },
  { id: 'has_security', label: '24/7 Security', icon: 'ShieldCheck', desc: 'Manned gate security' },
  { id: 'has_gym', label: 'Gymnasium', icon: 'Dumbbell', desc: 'Fitness and cardio center' },
  { id: 'has_swimming_pool', label: 'Swimming Pool', icon: 'Waves', desc: 'Maintained swimming pool' },
  { id: 'has_garden', label: 'Garden / Park', icon: 'Trees', desc: 'Landscaped green spaces' },
  { id: 'has_clubhouse', label: 'Clubhouse', icon: 'Building', desc: 'Community hall & recreation' },
  { id: 'has_power_backup', label: 'Power Backup', icon: 'Zap', desc: 'Generator electricity backup' },
  { id: 'has_cctv', label: 'CCTV Surveillance', icon: 'Camera', desc: 'Continuous camera coverage' },
  { id: 'has_internet', label: 'High-Speed Fiber', icon: 'Wifi', desc: 'Pre-wired broadband line' },
  { id: 'has_water_supply', label: '24hr Water Supply', icon: 'Droplets', desc: 'Municipal & borewell water' },
  { id: 'has_ac', label: 'Air Conditioning', icon: 'Wind', desc: 'Pre-installed split ACs' },
];

export const INITIAL_FORM_DATA = {
  city: 'Nagpur',
  locality: 'Manish Nagar',
  property_type: 'Apartment',
  area: 1250,
  carpet_area: 1060,
  bhk: 3,
  bedrooms: 3,
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
  has_parking: true,
  has_lift: true,
  has_security: true,
  has_gym: false,
  has_swimming_pool: false,
  has_garden: false,
  has_clubhouse: false,
  has_power_backup: true,
  has_cctv: true,
  has_internet: true,
  has_water_supply: true,
  has_ac: false,
};

export const CITIES_DATA = {
  Nagpur: {
    lat: 21.1458,
    lon: 79.0882,
    localities: [
      'Manish Nagar', 'Dharampeth', 'Ramdaspeth', 'Civil Lines', 'Wardha Road',
      'Besha', 'Khamla', 'Sadar', 'Pratap Nagar', 'Trimurti Nagar'
    ]
  },
  Mumbai: {
    lat: 19.0760,
    lon: 72.8777,
    localities: [
      'Bandra West', 'Andheri West', 'Andheri East', 'Borivali West', 'Juhu',
      'Powai', 'Thane West', 'Navi Mumbai - Vashi', 'Kandivali East', 'Goregaon West'
    ]
  },
  Pune: {
    lat: 18.5204,
    lon: 73.8567,
    localities: [
      'Kothrud', 'Baner', 'Hinjewadi', 'Wakad', 'Viman Nagar',
      'Kharadi', 'Hadapsar', 'Aundh', 'Kalyani Nagar', 'Magarpatta'
    ]
  },
  Bengaluru: {
    lat: 12.9716,
    lon: 77.5946,
    localities: [
      'Indiranagar', 'Koramangala', 'Whitefield', 'HSR Layout', 'Electronic City',
      'Bellandur', 'Sarjapur Road', 'Hebbal', 'Yelahanka', 'JP Nagar'
    ]
  },
  Hyderabad: {
    lat: 17.3850,
    lon: 78.4867,
    localities: [
      'Gachibowli', 'HITEC City', 'Jubilee Hills', 'Banjara Hills', 'Kondapur',
      'Madhapur', 'Kukatpally', 'Miyapur', 'Manikonda', 'Uppal'
    ]
  },
  'Delhi NCR': {
    lat: 28.6139,
    lon: 77.2090,
    localities: [
      'Golf Course Road (Gurugram)', 'Cyber City (Gurugram)', 'Sohna Road (Gurugram)',
      'Sector 62 (Noida)', 'Sector 150 (Noida)', 'Greater Noida West',
      'Dwarka (Delhi)', 'Vasant Kunj (Delhi)', 'Rohini (Delhi)', 'Indirapuram (Ghaziabad)'
    ]
  },
  Chennai: {
    lat: 13.0827,
    lon: 80.2707,
    localities: [
      'Adyar', 'Anna Nagar', 'OMR (Thoraipakkam)', 'Velachery', 'Sholinganallur',
      'Porur', 'T Nagar', 'Besant Nagar'
    ]
  },
  Kolkata: {
    lat: 22.5726,
    lon: 88.3639,
    localities: [
      'Salt Lake (Sector V)', 'New Town (Action Area 1)', 'Ballygunge',
      'Alipore', 'Rajarhat', 'Garia', 'Jadavpur'
    ]
  }
};
