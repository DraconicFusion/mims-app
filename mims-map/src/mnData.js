// src/mnData.js

// 1. COUNTY DATA (The "Jurisdiction" Layer)
export const countyData = {
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": { "name": "Sherburne", "riskLevel": "high" }, // Red Zone
      "geometry": {
        "type": "Polygon",
        "coordinates": [[
          [-93.95, 45.30], [-93.50, 45.30], [-93.50, 45.60], [-93.95, 45.60], [-93.95, 45.30]
        ]]
      }
    },
    {
      "type": "Feature",
      "properties": { "name": "Hennepin", "riskLevel": "low" }, // Green Zone
      "geometry": {
        "type": "Polygon",
        "coordinates": [[
          [-93.75, 44.80], [-93.20, 44.80], [-93.20, 45.25], [-93.75, 45.25], [-93.75, 44.80]
        ]]
      }
    },
    {
      "type": "Feature",
      "properties": { "name": "Ramsey", "riskLevel": "low" }, // Green Zone
      "geometry": {
        "type": "Polygon",
        "coordinates": [[
          [-93.20, 44.88], [-92.99, 44.88], [-92.99, 45.10], [-93.20, 45.10], [-93.20, 44.88]
        ]]
      }
    }
  ]
};

// 2. CITY DATA (The "Sanctuary" Geofence)
export const cityData = {
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": { "name": "Minneapolis", "type": "sanctuary" },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[
          [-93.33, 44.89], [-93.20, 44.89], [-93.20, 45.05], [-93.33, 45.05], [-93.33, 44.89]
        ]]
      }
    },
    {
      "type": "Feature",
      "properties": { "name": "Saint Paul", "type": "sanctuary" },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[
          [-93.20, 44.89], [-93.00, 44.89], [-93.00, 44.99], [-93.20, 44.99], [-93.20, 44.89]
        ]]
      }
    }
  ]
};