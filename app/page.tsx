'use client'

import { useEffect, useState } from 'react'
import MapContainer from '@/components/MapContainer'
import MapControls from '@/components/MapControls'
import StatisticsDashboard from '@/components/StatisticsDashboard'
import { School, ClusterCenter } from '@/lib/types'

export default function Home() {
  const [schools, setSchools] = useState<School[]>([])
  const [clusterCenters, setClusterCenters] = useState<ClusterCenter[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // UI State
  const [showCentersOnly, setShowCentersOnly] = useState(false)
  const [filteredCounties, setFilteredCounties] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true)
        
        // Load schools
        const schoolsResponse = await fetch('/data/schools.geojson')
        if (!schoolsResponse.ok) throw new Error('Failed to load schools data')
        const schoolsData = await schoolsResponse.json()
        
        // Load cluster centers
        const centersResponse = await fetch('/data/cluster_centers.geojson')
        if (!centersResponse.ok) throw new Error('Failed to load cluster centers data')
        const centersData = await centersResponse.json()

        // Parse schools
        const parsedSchools: School[] = schoolsData.features.map((feature: any) => ({
          id: feature.properties.id,
          name: feature.properties.name,
          county: feature.properties.county,
          sub_county: feature.properties.sub_county,
          latitude: feature.geometry.coordinates[1],
          longitude: feature.geometry.coordinates[0],
          cluster_id: feature.properties.cluster_id,
          is_host_venue: feature.properties.is_host_venue || false,
          distance_to_host_venue: feature.properties.distance_to_host_venue || 0,
          location_type: feature.properties.location_type,
        }))

        // Parse cluster centers
        const parsedCenters: ClusterCenter[] = centersData.features.map((feature: any) => ({
          cluster_id: feature.properties.cluster_id,
          center_lat: feature.geometry.coordinates[1],
          center_lng: feature.geometry.coordinates[0],
          num_schools: feature.properties.num_schools,
          avg_distance: feature.properties.avg_distance,
          max_distance: feature.properties.max_distance,
          schools: feature.properties.schools,
        }))

        setSchools(parsedSchools)
        setClusterCenters(parsedCenters)
        setLoading(false)
      } catch (err) {
        console.error('Error loading data:', err)
        setError(err instanceof Error ? err.message : 'Failed to load data')
        setLoading(false)
      }
    }

    loadData()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading Schools Data...</p>
          <p className="text-gray-400 text-sm mt-2">Please wait while we fetch the data</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900 px-4">
        <div className="text-center max-w-md p-8 bg-red-900 bg-opacity-20 rounded-lg border border-red-500">
          <h2 className="text-red-400 text-xl font-bold mb-2">Error Loading Data</h2>
          <p className="text-gray-300">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-white transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <main className="relative w-screen h-screen overflow-hidden">
      {/* Header - Mobile Responsive */}
      <header className="absolute top-0 left-0 right-0 z-20 bg-gradient-to-r from-blue-900 to-purple-900 bg-opacity-95 backdrop-blur-sm shadow-lg">
        <div className="px-3 sm:px-6 py-3 sm:py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <div className="flex-1">
              <h1 className="text-base sm:text-xl md:text-2xl font-bold text-white flex items-center space-x-2">
                <span>🎓</span>
                <span className="truncate">Kenya Schools Training Centers</span>
              </h1>
              <p className="text-xs sm:text-sm text-gray-300 mt-1">
                <span className="hidden sm:inline">
                  {schools.length} schools across {new Set(schools.map(s => s.county)).size} counties • {clusterCenters.length} regional training centers
                </span>
                <span className="sm:hidden">
                  {schools.length} schools • {clusterCenters.length} centers
                </span>
              </p>
            </div>
            <div className="hidden sm:flex items-center space-x-3">
              <div className="text-right">
                <div className="text-xs text-gray-400">Powered by</div>
                <div className="text-sm font-semibold text-white">Google Maps API</div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Map */}
      <div className="absolute inset-0 pt-16 sm:pt-20">
        <MapContainer
          schools={schools}
          clusterCenters={clusterCenters}
          showCentersOnly={showCentersOnly}
          filteredCounties={filteredCounties}
          searchQuery={searchQuery}
        />
      </div>

      {/* Controls */}
      <MapControls
        schools={schools}
        showCentersOnly={showCentersOnly}
        onToggleCenters={setShowCentersOnly}
        filteredCounties={filteredCounties}
        onCountyFilterChange={setFilteredCounties}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* Statistics Dashboard */}
      <StatisticsDashboard
        schools={schools}
        clusterCenters={clusterCenters}
        filteredCounties={filteredCounties}
      />

      {/* Footer Info - Hidden on mobile */}
      <div className="hidden sm:block absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10">
        <div className="glass-dark px-4 py-2 rounded-full text-xl text-gray-300 flex items-center space-x-4">
          <span>•</span>
          <span>Powered by AFOSI</span>
          <span>•</span>
          
        </div>
      </div>
    </main>
  )
}
