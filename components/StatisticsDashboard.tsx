'use client'

import { School, ClusterCenter } from '@/lib/types'
import { exportToCSV } from '@/lib/utils'
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { useState } from 'react'

interface StatisticsDashboardProps {
  schools: School[]
  clusterCenters: ClusterCenter[]
  filteredCounties: string[]
}

export default function StatisticsDashboard({
  schools,
  clusterCenters,
  filteredCounties,
}: StatisticsDashboardProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  // Filter schools
  const filteredSchools = schools.filter(s => 
    filteredCounties.length === 0 || filteredCounties.includes(s.county)
  )

  // County distribution
  const countyData = Array.from(new Set(filteredSchools.map(s => s.county)))
    .map(county => ({
      name: county.replace(' County', ''),
      count: filteredSchools.filter(s => s.county === county).length,
    }))
    .sort((a, b) => b.count - a.count)

  // Cluster size distribution
  const clusterSizeData = clusterCenters
    .filter(c => filteredSchools.some(s => s.cluster_id === c.cluster_id))
    .map(c => ({
      cluster: `Cluster ${c.cluster_id + 1}`,
      schools: c.num_schools,
      avgDist: Math.round(c.avg_distance),
    }))
    .sort((a, b) => b.schools - a.schools)

  // Distance distribution
  const distanceRanges = [
    { range: '0-20km', min: 0, max: 20 },
    { range: '20-40km', min: 20, max: 40 },
    { range: '40-60km', min: 40, max: 60 },
    { range: '60+km', min: 60, max: Infinity },
  ]

  const distanceData = distanceRanges.map(({ range, min, max }) => ({
    range,
    count: filteredSchools.filter(s => 
      !s.is_host_venue && s.distance_to_host_venue >= min && s.distance_to_host_venue < max
    ).length,
  }))

  // Statistics
  const stats = {
    totalSchools: filteredSchools.length,
    totalVenues: filteredSchools.filter(s => s.is_host_venue).length,
    avgDistance: (filteredSchools.filter(s => !s.is_host_venue).reduce((sum, s) => sum + s.distance_to_host_venue, 0) / filteredSchools.filter(s => !s.is_host_venue).length || 0).toFixed(1),
    maxDistance: Math.max(...filteredSchools.map(s => s.distance_to_host_venue)).toFixed(1),
  }

  const handleExport = () => {
    const exportData = filteredSchools.map(s => ({
      'School Name': s.name,
      'County': s.county,
      'Sub-County': s.sub_county,
      'Latitude': s.latitude,
      'Longitude': s.longitude,
      'Cluster ID': s.cluster_id + 1,
      'Is Training Venue': s.is_host_venue ? 'Yes' : 'No',
      'Distance to Venue (km)': s.distance_to_host_venue.toFixed(2),
      'Location Type': s.location_type,
    }))
    exportToCSV(exportData, 'schools_export.csv')
  }

  const COLORS = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9', '#F8B88B', '#AED6F1']

  return (
    <>
      {/* Mobile: Floating button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="md:hidden fixed bottom-4 right-4 z-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-3 rounded-full shadow-lg flex items-center space-x-2"
      >
        <span className="text-sm font-medium">📊 Stats</span>
        <span className="text-xs">{isExpanded ? '▼' : '▲'}</span>
      </button>

      {/* Mobile: Bottom sheet */}
      {isExpanded && (
        <div className="md:hidden fixed inset-x-0 bottom-0 z-30 bg-gray-900 rounded-t-2xl shadow-2xl max-h-[80vh] overflow-y-auto animate-slideIn">
          <div className="sticky top-0 bg-gray-900 px-4 py-3 border-b border-gray-700 flex items-center justify-between">
            <h2 className="text-base font-bold text-white">📊 Statistics</h2>
            <button
              onClick={() => setIsExpanded(false)}
              className="text-gray-400 hover:text-white text-2xl"
            >
              ×
            </button>
          </div>
          
          <div className="p-4 space-y-4">
            {/* Key Metrics */}
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-gray-800 bg-opacity-50 rounded-lg p-3">
                <div className="text-xl font-bold text-blue-400">{stats.totalSchools}</div>
                <div className="text-xs text-gray-400 mt-1">Schools</div>
              </div>
              <div className="bg-gray-800 bg-opacity-50 rounded-lg p-3">
                <div className="text-xl font-bold text-amber-400">{stats.totalVenues}</div>
                <div className="text-xs text-gray-400 mt-1">Venues</div>
              </div>
              <div className="bg-gray-800 bg-opacity-50 rounded-lg p-3">
                <div className="text-xl font-bold text-green-400">{stats.avgDistance}km</div>
                <div className="text-xs text-gray-400 mt-1">Avg Distance</div>
              </div>
              <div className="bg-gray-800 bg-opacity-50 rounded-lg p-3">
                <div className="text-xl font-bold text-red-400">{stats.maxDistance}km</div>
                <div className="text-xs text-gray-400 mt-1">Max Distance</div>
              </div>
            </div>

            <button
              onClick={handleExport}
              className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-sm font-medium transition-colors flex items-center justify-center space-x-2"
            >
              <span>💾</span>
              <span>Export CSV</span>
            </button>
          </div>
        </div>
      )}

      {/* Desktop: Sidebar */}
      <div className="hidden md:block absolute top-28 right-4 z-10 w-96 max-h-[calc(100vh-8rem)] overflow-y-auto">
        <div className="glass-dark rounded-lg p-4 shadow-lg space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-700 pb-3">
            <h2 className="text-lg font-bold text-white">📊 Statistics</h2>
            <button
              onClick={handleExport}
              className="px-3 py-1 bg-green-600 hover:bg-green-700 rounded-lg text-xs font-medium transition-colors flex items-center space-x-1"
            >
              <span>💾</span>
              <span>Export CSV</span>
            </button>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gray-800 bg-opacity-50 rounded-lg p-3">
              <div className="text-2xl font-bold text-blue-400">{stats.totalSchools}</div>
              <div className="text-xs text-gray-400 mt-1">Total Schools</div>
            </div>
            <div className="bg-gray-800 bg-opacity-50 rounded-lg p-3">
              <div className="text-2xl font-bold text-amber-400">{stats.totalVenues}</div>
              <div className="text-xs text-gray-400 mt-1">Training Venues</div>
            </div>
            <div className="bg-gray-800 bg-opacity-50 rounded-lg p-3">
              <div className="text-2xl font-bold text-green-400">{stats.avgDistance}km</div>
              <div className="text-xs text-gray-400 mt-1">Avg Distance</div>
            </div>
            <div className="bg-gray-800 bg-opacity-50 rounded-lg p-3">
              <div className="text-2xl font-bold text-red-400">{stats.maxDistance}km</div>
              <div className="text-xs text-gray-400 mt-1">Max Distance</div>
            </div>
          </div>

          {/* County Distribution Pie Chart */}
          <div className="bg-gray-800 bg-opacity-30 rounded-lg p-3">
            <h3 className="text-sm font-semibold text-white mb-2">Schools by County</h3>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={countyData}
                  dataKey="count"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={70}
                  label={({ name, count }) => `${name}: ${count}`}
                  labelLine={false}
                >
                  {countyData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Distance Distribution Bar Chart */}
          <div className="bg-gray-800 bg-opacity-30 rounded-lg p-3">
            <h3 className="text-sm font-semibold text-white mb-2">Distance Distribution</h3>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={distanceData}>
                <XAxis dataKey="range" tick={{ fill: '#9ca3af', fontSize: 12 }} />
                <YAxis tick={{ fill: '#9ca3af', fontSize: 12 }} />
                <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px' }} />
                <Bar dataKey="count" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Cluster Sizes */}
          <div className="bg-gray-800 bg-opacity-30 rounded-lg p-3">
            <h3 className="text-sm font-semibold text-white mb-2">Cluster Sizes</h3>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {clusterSizeData.slice(0, 10).map((cluster) => (
                <div key={cluster.cluster} className="flex items-center justify-between text-xs">
                  <span className="text-gray-300">{cluster.cluster}</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-blue-400">{cluster.schools} schools</span>
                    <span className="text-gray-500">•</span>
                    <span className="text-gray-400">{cluster.avgDist}km avg</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Legend */}
          <div className="bg-gray-800 bg-opacity-30 rounded-lg p-3">
            <h3 className="text-sm font-semibold text-white mb-2">Legend</h3>
            <div className="space-y-2 text-xs">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                <span className="text-gray-300">Individual Schools</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-lg">⭐</span>
                <span className="text-gray-300">Regional Training Centers</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
