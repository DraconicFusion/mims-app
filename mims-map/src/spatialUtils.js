export function isPointInPolygon(point, polygon) {
  const x = point[0], y = point[1];
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i][0], yi = polygon[i][1];
    const xj = polygon[j][0], yj = polygon[j][1];
    const intersect = ((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
    if (intersect) inside = !inside;
  }
  return inside;
}

export function checkRiskZone(lat, lng, geoJsonData) {
  if (!geoJsonData) return null;
  const userPoint = [lng, lat];
  for (const feature of geoJsonData.features) {
    const geometry = feature.geometry;
    if (geometry.type === 'Polygon') {
      if (isPointInPolygon(userPoint, geometry.coordinates[0])) return feature.properties;
    } else if (geometry.type === 'MultiPolygon') {
      for (const polygon of geometry.coordinates) {
        if (isPointInPolygon(userPoint, polygon[0])) return feature.properties;
      }
    }
  }
  return null;
}