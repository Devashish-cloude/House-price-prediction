"""
Dataset Generator for Intelligent House Price Prediction Agent (HouseAI)
Generates a realistic, multi-city housing dataset with 3,000+ records.
Covers real Indian cities, localities, property types, floor plans, and amenities.
"""

import os
import random
import numpy as np
import pandas as pd

# Set fixed seed for reproducibility
np.random.seed(42)
random.seed(42)

# City and Locality baseline price-per-sqft (INR) and coordinates
CITY_LOCALITY_DATA = {
    "Nagpur": {
        "lat_range": (21.05, 21.20),
        "lon_range": (79.00, 79.15),
        "localities": {
            "Manish Nagar": {"base_rate": 5800, "lat": 21.0911, "lon": 79.0834},
            "Dharampeth": {"base_rate": 8200, "lat": 21.1444, "lon": 79.0607},
            "Ramdaspeth": {"base_rate": 9000, "lat": 21.1352, "lon": 79.0754},
            "Civil Lines": {"base_rate": 8600, "lat": 21.1550, "lon": 79.0690},
            "Wardha Road": {"base_rate": 5200, "lat": 21.0800, "lon": 79.0700},
            "Besha": {"base_rate": 4600, "lat": 21.0740, "lon": 79.0910},
            "Khamla": {"base_rate": 6200, "lat": 21.1150, "lon": 79.0580},
            "Sadar": {"base_rate": 7800, "lat": 21.1630, "lon": 79.0820},
            "Pratap Nagar": {"base_rate": 6600, "lat": 21.1210, "lon": 79.0490},
            "Trimurti Nagar": {"base_rate": 6100, "lat": 21.1180, "lon": 79.0390}
        }
    },
    "Mumbai": {
        "lat_range": (18.90, 19.30),
        "lon_range": (72.75, 72.98),
        "localities": {
            "Bandra West": {"base_rate": 42000, "lat": 19.0596, "lon": 72.8295},
            "Andheri West": {"base_rate": 24000, "lat": 19.1363, "lon": 72.8277},
            "Andheri East": {"base_rate": 18500, "lat": 19.1136, "lon": 72.8697},
            "Borivali West": {"base_rate": 17000, "lat": 19.2307, "lon": 72.8567},
            "Juhu": {"base_rate": 38000, "lat": 19.1075, "lon": 72.8263},
            "Powai": {"base_rate": 21000, "lat": 19.1176, "lon": 72.9060},
            "Thane West": {"base_rate": 13500, "lat": 19.2183, "lon": 72.9781},
            "Navi Mumbai - Vashi": {"base_rate": 14000, "lat": 19.0771, "lon": 72.9986},
            "Kandivali East": {"base_rate": 15500, "lat": 19.2062, "lon": 72.8687},
            "Goregaon West": {"base_rate": 19000, "lat": 19.1646, "lon": 72.8407}
        }
    },
    "Pune": {
        "lat_range": (18.45, 18.65),
        "lon_range": (73.75, 73.98),
        "localities": {
            "Kothrud": {"base_rate": 11000, "lat": 18.5074, "lon": 73.8077},
            "Baner": {"base_rate": 9800, "lat": 18.5590, "lon": 73.7868},
            "Hinjewadi": {"base_rate": 7200, "lat": 18.5913, "lon": 73.7389},
            "Wakad": {"base_rate": 8100, "lat": 18.5987, "lon": 73.7688},
            "Viman Nagar": {"base_rate": 10500, "lat": 18.5679, "lon": 73.9143},
            "Kharadi": {"base_rate": 8800, "lat": 18.5516, "lon": 73.9351},
            "Hadapsar": {"base_rate": 7600, "lat": 18.5089, "lon": 73.9259},
            "Aundh": {"base_rate": 11500, "lat": 18.5626, "lon": 73.8087},
            "Kalyani Nagar": {"base_rate": 12500, "lat": 18.5463, "lon": 73.9033},
            "Magarpatta": {"base_rate": 9500, "lat": 18.5158, "lon": 73.9272}
        }
    },
    "Bengaluru": {
        "lat_range": (12.85, 13.10),
        "lon_range": (77.50, 77.75),
        "localities": {
            "Indiranagar": {"base_rate": 14500, "lat": 12.9784, "lon": 77.6408},
            "Koramangala": {"base_rate": 13800, "lat": 12.9352, "lon": 77.6245},
            "Whitefield": {"base_rate": 8500, "lat": 12.9698, "lon": 77.7500},
            "HSR Layout": {"base_rate": 11200, "lat": 12.9121, "lon": 77.6446},
            "Electronic City": {"base_rate": 6200, "lat": 12.8399, "lon": 77.6770},
            "Bellandur": {"base_rate": 9200, "lat": 12.9260, "lon": 77.6762},
            "Sarjapur Road": {"base_rate": 8100, "lat": 12.9103, "lon": 77.6850},
            "Hebbal": {"base_rate": 9600, "lat": 13.0358, "lon": 77.5970},
            "Yelahanka": {"base_rate": 7000, "lat": 13.1007, "lon": 77.5963},
            "JP Nagar": {"base_rate": 9400, "lat": 12.9063, "lon": 77.5857}
        }
    },
    "Hyderabad": {
        "lat_range": (17.30, 17.55),
        "lon_range": (78.30, 78.55),
        "localities": {
            "Gachibowli": {"base_rate": 9200, "lat": 17.4401, "lon": 78.3489},
            "HITEC City": {"base_rate": 10500, "lat": 17.4435, "lon": 78.3772},
            "Jubilee Hills": {"base_rate": 16500, "lat": 17.4319, "lon": 78.4073},
            "Banjara Hills": {"base_rate": 15800, "lat": 17.4156, "lon": 78.4357},
            "Kondapur": {"base_rate": 8300, "lat": 17.4699, "lon": 78.3578},
            "Madhapur": {"base_rate": 9800, "lat": 17.4483, "lon": 78.3915},
            "Kukatpally": {"base_rate": 7100, "lat": 17.4948, "lon": 78.3996},
            "Miyapur": {"base_rate": 6000, "lat": 17.4968, "lon": 78.3614},
            "Manikonda": {"base_rate": 7400, "lat": 17.4042, "lon": 78.3894},
            "Uppal": {"base_rate": 5500, "lat": 17.4018, "lon": 78.5602}
        }
    },
    "Delhi NCR": {
        "lat_range": (28.40, 28.75),
        "lon_range": (77.00, 77.40),
        "localities": {
            "Golf Course Road (Gurugram)": {"base_rate": 18000, "lat": 28.4595, "lon": 77.0944},
            "Cyber City (Gurugram)": {"base_rate": 15500, "lat": 28.4950, "lon": 77.0895},
            "Sohna Road (Gurugram)": {"base_rate": 8400, "lat": 28.3950, "lon": 77.0420},
            "Sector 62 (Noida)": {"base_rate": 7800, "lat": 28.6270, "lon": 77.3620},
            "Sector 150 (Noida)": {"base_rate": 8900, "lat": 28.4550, "lon": 77.4780},
            "Greater Noida West": {"base_rate": 5600, "lat": 28.5900, "lon": 77.4350},
            "Dwarka (Delhi)": {"base_rate": 11500, "lat": 28.5921, "lon": 77.0460},
            "Vasant Kunj (Delhi)": {"base_rate": 19000, "lat": 28.5200, "lon": 77.1560},
            "Rohini (Delhi)": {"base_rate": 9200, "lat": 28.7100, "lon": 77.1100},
            "Indirapuram (Ghaziabad)": {"base_rate": 6700, "lat": 28.6400, "lon": 77.3750}
        }
    },
    "Chennai": {
        "lat_range": (12.90, 13.15),
        "lon_range": (80.15, 80.30),
        "localities": {
            "Adyar": {"base_rate": 14000, "lat": 13.0012, "lon": 80.2565},
            "Anna Nagar": {"base_rate": 13200, "lat": 13.0850, "lon": 80.2100},
            "OMR (Thoraipakkam)": {"base_rate": 7200, "lat": 12.9430, "lon": 80.2370},
            "Velachery": {"base_rate": 8500, "lat": 12.9815, "lon": 80.2180},
            "Sholinganallur": {"base_rate": 6800, "lat": 12.9010, "lon": 80.2279},
            "Porur": {"base_rate": 6500, "lat": 13.0382, "lon": 80.1565},
            "T Nagar": {"base_rate": 15000, "lat": 13.0418, "lon": 80.2341},
            "Besant Nagar": {"base_rate": 15500, "lat": 13.0002, "lon": 80.2667}
        }
    },
    "Kolkata": {
        "lat_range": (22.45, 22.65),
        "lon_range": (88.30, 88.48),
        "localities": {
            "Salt Lake (Sector V)": {"base_rate": 8200, "lat": 22.5800, "lon": 88.4300},
            "New Town (Action Area 1)": {"base_rate": 6900, "lat": 22.5950, "lon": 88.4720},
            "Ballygunge": {"base_rate": 12800, "lat": 22.5280, "lon": 88.3650},
            "Alipore": {"base_rate": 16500, "lat": 22.5310, "lon": 88.3300},
            "Rajarhat": {"base_rate": 5800, "lat": 22.6200, "lon": 88.4900},
            "Garia": {"base_rate": 5200, "lat": 22.4640, "lon": 88.3900},
            "Jadavpur": {"base_rate": 6500, "lat": 22.4980, "lon": 88.3710}
        }
    }
}

PROPERTY_TYPES = ["Apartment", "Independent House", "Villa", "Plot"]
TYPE_MULTIPLIERS = {
    "Apartment": 1.0,
    "Independent House": 1.18,
    "Villa": 1.35,
    "Plot": 0.90
}

FURNISHING_STATUS = ["Unfurnished", "Semi-Furnished", "Fully Furnished"]
FURNISHING_MULTIPLIERS = {
    "Unfurnished": 0.96,
    "Semi-Furnished": 1.02,
    "Fully Furnished": 1.10
}

PROPERTY_CONDITIONS = ["New", "Good", "Average", "Needs Renovation"]
CONDITION_MULTIPLIERS = {
    "New": 1.08,
    "Good": 1.02,
    "Average": 0.95,
    "Needs Renovation": 0.84
}

AMENITIES_LIST = [
    "has_parking",
    "has_lift",
    "has_security",
    "has_gym",
    "has_swimming_pool",
    "has_garden",
    "has_clubhouse",
    "has_power_backup",
    "has_cctv",
    "has_internet",
    "has_water_supply",
    "has_ac"
]

def generate_records(num_records=3500):
    records = []
    
    cities = list(CITY_LOCALITY_DATA.keys())
    city_weights = [0.12, 0.18, 0.16, 0.18, 0.14, 0.12, 0.05, 0.05]
    
    for _ in range(num_records):
        city = random.choices(cities, weights=city_weights)[0]
        localities_dict = CITY_LOCALITY_DATA[city]["localities"]
        locality = random.choice(list(localities_dict.keys()))
        loc_info = localities_dict[locality]
        
        # Property Type
        prop_type = random.choices(PROPERTY_TYPES, weights=[0.68, 0.18, 0.10, 0.04])[0]
        
        # BHK configuration
        if prop_type == "Plot":
            bhk = 0
            bedrooms = 0
            bathrooms = 0
            balconies = 0
            floor = 0
            total_floors = 0
            area = random.randint(800, 4000)
            carpet_area = area
            prop_age = random.randint(0, 5)
            parking = 0
            furnishing = "Unfurnished"
            prop_condition = "Average"
            amenities = {k: 0 for k in AMENITIES_LIST}
            if random.random() > 0.4:
                amenities["has_water_supply"] = 1
            if random.random() > 0.6:
                amenities["has_security"] = 1
        else:
            bhk = random.choices([1, 2, 3, 4, 5], weights=[0.12, 0.40, 0.35, 0.10, 0.03])[0]
            bedrooms = bhk
            bathrooms = max(1, bhk + random.choice([-1, 0, 0, 1]))
            balconies = random.choice([1, 2, 2, 3, 0])
            
            # Floor details
            if prop_type in ["Independent House", "Villa"]:
                total_floors = random.choice([1, 2, 3])
                floor = 0
            else:
                total_floors = random.choice([4, 7, 10, 14, 18, 22, 28, 35])
                floor = random.randint(1, total_floors)
                
            # Area in sqft (built up)
            area_base = {1: 580, 2: 950, 3: 1400, 4: 2100, 5: 3200}[bhk]
            area = int(np.random.normal(area_base, area_base * 0.18))
            area = max(350, min(7500, area))
            carpet_area = int(area * random.uniform(0.78, 0.88))
            
            # Age of property in years
            prop_age = random.choices([0, 1, 2, 3, 5, 8, 12, 18, 25], weights=[0.20, 0.15, 0.15, 0.15, 0.12, 0.10, 0.07, 0.04, 0.02])[0]
            
            # Parking spaces
            parking = random.choices([0, 1, 2, 3], weights=[0.15, 0.60, 0.22, 0.03])[0]
            
            # Furnishing & Condition
            furnishing = random.choices(FURNISHING_STATUS, weights=[0.25, 0.55, 0.20])[0]
            if prop_age <= 2:
                prop_condition = random.choices(PROPERTY_CONDITIONS, weights=[0.70, 0.25, 0.05, 0.0])[0]
            elif prop_age <= 8:
                prop_condition = random.choices(PROPERTY_CONDITIONS, weights=[0.10, 0.65, 0.20, 0.05])[0]
            else:
                prop_condition = random.choices(PROPERTY_CONDITIONS, weights=[0.02, 0.35, 0.45, 0.18])[0]
            
            # Amenities probabilities
            amenities = {}
            for amenity in AMENITIES_LIST:
                prob = 0.5
                if amenity in ["has_lift", "has_security", "has_water_supply", "has_cctv"]:
                    prob = 0.85 if prop_type == "Apartment" else 0.40
                elif amenity in ["has_gym", "has_swimming_pool", "has_clubhouse"]:
                    prob = 0.55 if prop_type == "Apartment" and bhk >= 3 else 0.30
                elif amenity in ["has_power_backup", "has_parking"]:
                    prob = 0.75
                amenities[amenity] = 1 if random.random() < prob else 0
        
        # Coordinates with slight realistic jitter
        lat = round(loc_info["lat"] + np.random.normal(0, 0.008), 6)
        lon = round(loc_info["lon"] + np.random.normal(0, 0.008), 6)
        
        # Pin code generation placeholder based on city
        pincode_prefixes = {
            "Nagpur": 440001, "Mumbai": 400001, "Pune": 411001,
            "Bengaluru": 560001, "Hyderabad": 500001, "Delhi NCR": 110001,
            "Chennai": 600001, "Kolkata": 700001
        }
        pincode = pincode_prefixes[city] + random.randint(1, 45)
        
        # Realistic Price Calculation Engine
        # Base price per sq.ft from locality
        base_rate = loc_info["base_rate"]
        
        # Multipliers
        type_mult = TYPE_MULTIPLIERS[prop_type]
        furn_mult = FURNISHING_MULTIPLIERS[furnishing]
        cond_mult = CONDITION_MULTIPLIERS[prop_condition]
        
        # Age depreciation: ~0.8% per year up to 25% max
        age_depreciation = max(0.72, 1.0 - (prop_age * 0.012))
        
        # Floor premium/discount (higher floors in high-rises command a small scenic premium, ground floor might be slightly discounted)
        floor_mult = 1.0
        if total_floors > 4 and floor > 0:
            floor_mult = 1.0 + (min(floor, 25) * 0.004)
            
        # Parking bonus
        parking_bonus = parking * 120000 # INR 1.2 Lakhs per dedicated slot
        
        # Amenities count value add
        amenity_count = sum(amenities.values())
        amenity_mult = 1.0 + (amenity_count * 0.012)
        
        # Calculate raw estimated price
        effective_rate = base_rate * type_mult * furn_mult * cond_mult * age_depreciation * floor_mult * amenity_mult
        raw_price = (area * effective_rate) + parking_bonus
        
        # Add realistic market noise (+- 5%)
        noise = np.random.normal(1.0, 0.045)
        final_price = int(round(raw_price * noise, -4)) # Rounded to nearest 10,000 INR
        
        record = {
            "city": city,
            "locality": locality,
            "pincode": pincode,
            "property_type": prop_type,
            "area": area,
            "carpet_area": carpet_area,
            "bhk": bhk,
            "bedrooms": bedrooms,
            "bathrooms": bathrooms,
            "balconies": balconies,
            "floor": floor,
            "total_floors": total_floors,
            "property_age": prop_age,
            "parking": parking,
            "furnished": furnishing,
            "property_condition": prop_condition,
            "latitude": lat,
            "longitude": lon,
            "amenities_count": amenity_count,
            **amenities,
            "price": final_price
        }
        records.append(record)
        
    df = pd.DataFrame(records)
    return df

if __name__ == "__main__":
    out_dir = os.path.dirname(os.path.abspath(__file__))
    os.makedirs(out_dir, exist_ok=True)
    csv_path = os.path.join(out_dir, "house_prices.csv")
    print(f"Generating realistic dataset at {csv_path}...")
    df = generate_records(3500)
    df.to_csv(csv_path, index=False)
    print(f"Successfully generated {len(df)} records across {df['city'].nunique()} cities and {df['locality'].nunique()} localities.")
    print(f"Price range: ₹{df['price'].min():,} to ₹{df['price'].max():,}")
    print(f"Average price: ₹{int(df['price'].mean()):,}")
