// Utility functions for the School Training Map

export function haversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

// Generate distinct colors for clusters
export function getClusterColor(clusterId: number): string {
  const colors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8',
    '#F7DC6F', '#BB8FCE', '#85C1E9', '#F8B88B', '#AED6F1',
    '#F1948A', '#73C6B6', '#FAD7A0', '#D7BDE2', '#A9DFBF',
    '#F9E79F', '#FADBD8', '#D5F4E6', '#FCF3CF', '#EBDEF0',
    '#E8DAEF', '#D1F2EB', '#FEF5E7', '#FDEBD0'
  ];
  return colors[clusterId % colors.length];
}

// Export data to CSV
export function exportToCSV(data: any[], filename: string): void {
  if (data.length === 0) return;

  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(','),
    ...data.map(row =>
      headers.map(header => {
        const value = row[header];
        // Escape commas and quotes
        if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value;
      }).join(',')
    )
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Format distance for display
export function formatDistance(km: number): string {
  if (km < 1) {
    return `${Math.round(km * 1000)}m`;
  }
  return `${km.toFixed(1)}km`;
}

// Get bounds from array of coordinates
export function getBounds(coordinates: Array<{lat: number, lng: number}>) {
  if (coordinates.length === 0) return null;

  return coordinates.reduce(
    (bounds, coord) => ({
      north: Math.max(bounds.north, coord.lat),
      south: Math.min(bounds.south, coord.lat),
      east: Math.max(bounds.east, coord.lng),
      west: Math.min(bounds.west, coord.lng),
    }),
    {
      north: coordinates[0].lat,
      south: coordinates[0].lat,
      east: coordinates[0].lng,
      west: coordinates[0].lng,
    }
  );
}
