// Type definitions for the School Training Map application

export interface School {
  id: number;
  name: string;
  county: string;
  sub_county: string;
  latitude: number;
  longitude: number;
  cluster_id: number;
  is_host_venue: boolean;
  distance_to_host_venue: number;
  location_type: string;
}

export interface ClusterCenter {
  cluster_id: number;
  center_lat: number;
  center_lng: number;
  num_schools: number;
  avg_distance: number;
  max_distance: number;
  schools: string[];
}

export interface MapBounds {
  north: number;
  south: number;
  east: number;
  west: number;
}

export interface FilterState {
  counties: string[];
  search: string;
  showCentersOnly: boolean;
}

export interface Statistics {
  totalSchools: number;
  totalClusters: number;
  avgSchoolsPerCluster: number;
  avgDistanceToCenter: number;
  countiesCovered: number;
  clusterSizes: { [key: number]: number };
}
