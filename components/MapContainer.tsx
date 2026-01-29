'use client'

import { useEffect, useState, useCallback, useMemo } from 'react'
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api'
import { School, ClusterCenter } from '@/lib/types'
import { getClusterColor, formatDistance } from '@/lib/utils'

const mapContainerStyle = {
  width: '100%',
  height: '100%',
}

const center = {
  lat: 0.1473,
  lng: 35.7962,
}

// List of counties with schools
const COUNTIES_WITH_SCHOOLS = [
  'Baringo',
  'Bomet', 
  'Bungoma',
  'Homa Bay',
  'Kajiado',
  'Kitui',
  'Nandi',
  'Samburu',
  'Turkana',
  'West Pokot'
]

const mapOptions = {
  disableDefaultUI: false,
  zoomControl: true,
  mapTypeControl: true,
  scaleControl: true,
  streetViewControl: false,
  rotateControl: false,
  fullscreenControl: true,
  styles: [
    {
      featureType: 'poi',
      elementType: 'labels',
      stylers: [{ visibility: 'off' }],
    },
  ],
}

interface MapContainerProps {
  schools: School[]
  clusterCenters: ClusterCenter[]
  showCentersOnly: boolean
  filteredCounties: string[]
  searchQuery: string
}

export default function MapContainer({
  schools,
  clusterCenters,
  showCentersOnly,
  filteredCounties,
  searchQuery,
}: MapContainerProps) {
  const [selectedSchool, setSelectedSchool] = useState<School | null>(null)
  const [selectedCenter, setSelectedCenter] = useState<ClusterCenter | null>(null)
  const [mapRef, setMapRef] = useState<google.maps.Map | null>(null)
  const [mapsLoaded, setMapsLoaded] = useState(false)

  // Load and style county boundaries using Google Maps Data Layer
  useEffect(() => {
    if (!mapRef || !mapsLoaded) return

    // Get the map's data layer
    const dataLayer = mapRef.data

    // Style function for the data layer
    dataLayer.setStyle((feature: google.maps.Data.Feature) => {
      const countyName = feature.getProperty('COUNTY') || feature.getProperty('name')
      
      // Check if this county has schools
      const hasSchools = COUNTIES_WITH_SCHOOLS.some(county => {
        const name = String(countyName || '').toLowerCase().trim()
        const searchName = county.toLowerCase().trim()
        return name === searchName || name.includes(searchName) || searchName.includes(name)
      })

      if (hasSchools) {
        return {
          fillColor: '#3B82F6',    // Light blue
          fillOpacity: 0.15,       // 15% opacity
          strokeColor: '#000000',  // Black border
          strokeWeight: 2,         // 2px thickness
          strokeOpacity: 1.0,
          zIndex: 1                // Below markers
        }
      } else {
        return {
          visible: false
        }
      }
    })

    // Load county boundaries from local file
    dataLayer.loadGeoJson('/data/kenya_counties.geojson', {}, (features) => {
      if (features && features.length > 0) {
        console.log('✅ County boundaries loaded:', features.length, 'counties')
        // Log the county names for debugging
        features.forEach((feature: google.maps.Data.Feature) => {
          const countyName = feature.getProperty('COUNTY')
          console.log('   -', countyName)
        })
      } else {
        console.warn('⚠️ No county boundaries loaded')
      }
    })

    // Cleanup function
    return () => {
      dataLayer.forEach((feature: google.maps.Data.Feature) => {
        dataLayer.remove(feature)
      })
    }
  }, [mapRef, mapsLoaded])

  // Filter schools based on county and search
  const filteredSchools = useMemo(() => {
    return schools.filter(school => {
      const countyMatch = filteredCounties.length === 0 || filteredCounties.includes(school.county)
      const searchMatch = searchQuery === '' || 
        school.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        school.county.toLowerCase().includes(searchQuery.toLowerCase()) ||
        school.sub_county.toLowerCase().includes(searchQuery.toLowerCase())
      return countyMatch && searchMatch
    })
  }, [schools, filteredCounties, searchQuery])

  // Get visible cluster IDs from filtered schools
  const filteredCenters = useMemo(() => {
    const visibleClusterIds = new Set(filteredSchools.map(s => s.cluster_id))
    return clusterCenters.filter(c => visibleClusterIds.has(c.cluster_id))
  }, [clusterCenters, filteredSchools])

  // Fit bounds to visible markers
  useEffect(() => {
    if (!mapRef || !mapsLoaded) return

    const bounds = new google.maps.LatLngBounds()
    let hasMarkers = false

    if (showCentersOnly) {
      filteredCenters.forEach(center => {
        bounds.extend({ lat: center.center_lat, lng: center.center_lng })
        hasMarkers = true
      })
    } else {
      filteredSchools.forEach(school => {
        bounds.extend({ lat: school.latitude, lng: school.longitude })
        hasMarkers = true
      })
    }

    if (hasMarkers) {
      mapRef.fitBounds(bounds)
    }
  }, [mapRef, filteredSchools, filteredCenters, showCentersOnly, mapsLoaded])

  // Search result handling
  useEffect(() => {
    if (searchQuery && filteredSchools.length === 1 && mapRef && mapsLoaded) {
      const school = filteredSchools[0]
      mapRef.panTo({ lat: school.latitude, lng: school.longitude })
      mapRef.setZoom(12)
      setSelectedSchool(school)
    }
  }, [searchQuery, filteredSchools, mapRef, mapsLoaded])

  const onMapLoad = useCallback((map: google.maps.Map) => {
    setMapRef(map)
  }, [])

  const onLoadScript = useCallback(() => {
    setMapsLoaded(true)
  }, [])

  // Create icons using useMemo to avoid recreation on every render
  const schoolIcon = useCallback((clusterId: number) => {
    if (!mapsLoaded) return undefined
    
    return {
      path: google.maps.SymbolPath.CIRCLE,
      fillColor: getClusterColor(clusterId),
      fillOpacity: 0.9,
      strokeColor: '#ffffff',
      strokeWeight: 2,
      scale: 8,
    }
  }, [mapsLoaded])

  const centerIcon = useCallback((clusterId: number) => {
    if (!mapsLoaded) return undefined

    return {
      path: 'M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z',
      fillColor: '#FFD700',
      fillOpacity: 1,
      strokeColor: '#FF6B00',
      strokeWeight: 2,
      scale: 1.5,
      anchor: new google.maps.Point(12, 12),
    }
  }, [mapsLoaded])

  return (
    <LoadScript 
      googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''}
      onLoad={onLoadScript}
    >
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={center}
        zoom={7}
        options={mapOptions}
        onLoad={onMapLoad}
      >
        {mapsLoaded && (
          <>
            {/* Render Schools */}
            {!showCentersOnly && filteredSchools.map((school) => (
              <Marker
                key={school.id}
                position={{ lat: school.latitude, lng: school.longitude }}
                icon={schoolIcon(school.cluster_id)}
                onClick={() => {
                  setSelectedSchool(school)
                  setSelectedCenter(null)
                }}
                title={school.name}
              />
            ))}

            {/* Render Cluster Centers */}
            {filteredCenters.map((center) => (
              <Marker
                key={`center-${center.cluster_id}`}
                position={{ lat: center.center_lat, lng: center.center_lng }}
                icon={centerIcon(center.cluster_id)}
                onClick={() => {
                  setSelectedCenter(center)
                  setSelectedSchool(null)
                }}
                title={`Training Center ${center.cluster_id + 1}`}
                zIndex={1000}
              />
            ))}

            {/* School Info Window */}
            {selectedSchool && (
              <InfoWindow
                position={{ lat: selectedSchool.latitude, lng: selectedSchool.longitude }}
                onCloseClick={() => setSelectedSchool(null)}
              >
                <div className="p-2 min-w-[250px]">
                  <h3 className="font-bold text-lg text-gray-900 mb-2">{selectedSchool.name}</h3>
                  <div className="space-y-1 text-sm text-gray-700">
                    <p><strong>County:</strong> {selectedSchool.county}</p>
                    <p><strong>Sub-County:</strong> {selectedSchool.sub_county}</p>
                    <p><strong>Cluster:</strong> #{selectedSchool.cluster_id + 1}</p>
                    <p><strong>Distance to Training Center:</strong> {formatDistance(selectedSchool.distance_to_cluster_center)}</p>
                    <p><strong>Location Type:</strong> {selectedSchool.location_type}</p>
                  </div>
                  <div className="mt-2 pt-2 border-t border-gray-200">
                    <span
                      className="inline-block w-4 h-4 rounded-full mr-2"
                      style={{ backgroundColor: getClusterColor(selectedSchool.cluster_id) }}
                    />
                    <span className="text-xs text-gray-600">Cluster Color</span>
                  </div>
                </div>
              </InfoWindow>
            )}

            {/* Cluster Center Info Window */}
            {selectedCenter && (
              <InfoWindow
                position={{ lat: selectedCenter.center_lat, lng: selectedCenter.center_lng }}
                onCloseClick={() => setSelectedCenter(null)}
              >
                <div className="p-2 min-w-[280px]">
                  <h3 className="font-bold text-lg text-gray-900 mb-2 flex items-center">
                    <span className="text-2xl mr-2">⭐</span>
                    Regional Training Center #{selectedCenter.cluster_id + 1}
                  </h3>
                  <div className="space-y-1 text-sm text-gray-700 mb-3">
                    <p><strong>Serves:</strong> {selectedCenter.num_schools} schools</p>
                    <p><strong>Avg Distance:</strong> {formatDistance(selectedCenter.avg_distance)}</p>
                    <p><strong>Max Distance:</strong> {formatDistance(selectedCenter.max_distance)}</p>
                  </div>
                  <div className="border-t border-gray-200 pt-2">
                    <p className="font-semibold text-sm text-gray-800 mb-1">Schools in this cluster:</p>
                    <ul className="text-xs text-gray-600 space-y-0.5 max-h-32 overflow-y-auto">
                      {selectedCenter.schools.map((schoolName, idx) => (
                        <li key={idx} className="truncate">• {schoolName}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </InfoWindow>
            )}
          </>
        )}
      </GoogleMap>
    </LoadScript>
  )
}