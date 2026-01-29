'use client'

import { School } from '@/lib/types'
import { useState } from 'react'

interface MapControlsProps {
  schools: School[]
  showCentersOnly: boolean
  onToggleCenters: (show: boolean) => void
  filteredCounties: string[]
  onCountyFilterChange: (counties: string[]) => void
  searchQuery: string
  onSearchChange: (query: string) => void
}

export default function MapControls({
  schools,
  showCentersOnly,
  onToggleCenters,
  filteredCounties,
  onCountyFilterChange,
  searchQuery,
  onSearchChange,
}: MapControlsProps) {
  const [showFilters, setShowFilters] = useState(false)

  // Get unique counties
  const counties = Array.from(new Set(schools.map(s => s.county))).sort()

  const toggleCounty = (county: string) => {
    if (filteredCounties.includes(county)) {
      onCountyFilterChange(filteredCounties.filter(c => c !== county))
    } else {
      onCountyFilterChange([...filteredCounties, county])
    }
  }

  const clearFilters = () => {
    onCountyFilterChange([])
    onSearchChange('')
  }

  const selectAllCounties = () => {
    onCountyFilterChange([...counties])
  }

  return (
    <div className="absolute top-28 left-2 right-2 sm:left-4 sm:right-auto z-10 space-y-3 w-auto sm:max-w-sm">
      {/* Main Toggle */}
      <div className="glass-dark rounded-lg p-3 shadow-lg">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-3 gap-2">
          <span className="text-xs sm:text-sm font-semibold text-white">View Mode</span>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="text-xs px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded-full transition-colors whitespace-nowrap self-start sm:self-auto"
          >
            {showFilters ? 'Click here to Hide' : 'Click here to Show'} Filters
          </button>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2">
          <button
            onClick={() => onToggleCenters(false)}
            className={`w-full sm:flex-1 px-3 py-2 rounded-lg font-medium transition-all ${
              !showCentersOnly
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-gray-700 text-gray-300 active:bg-gray-600'
            }`}
          >
            <div className="flex items-center justify-center space-x-2">
              <span className="text-base">🏫</span>
              <span className="text-xs sm:text-sm">All Schools</span>
            </div>
          </button>
          
          <button
            onClick={() => onToggleCenters(true)}
            className={`w-full sm:flex-1 px-3 py-2 rounded-lg font-medium transition-all ${
              showCentersOnly
                ? 'bg-amber-600 text-white shadow-lg'
                : 'bg-gray-700 text-gray-300 active:bg-gray-600'
            }`}
          >
            <div className="flex items-center justify-center space-x-2">
              <span className="text-base">⭐</span>
              <span className="text-xs sm:text-sm">Centers Only</span>
            </div>
          </button>
        </div>

        <div className="mt-2 text-lg text-white-400 text-center">
          {showCentersOnly 
            ? '24 Regional Training Centers'
            : `${schools.filter(s => 
                filteredCounties.length === 0 || filteredCounties.includes(s.county)
              ).length} Schools Visible`
          }
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="glass-dark rounded-lg p-3 shadow-lg animate-slideIn max-h-[65vh] overflow-y-auto">
          {/* Search */}
          <div className="mb-3">
            <label className="block text-xs sm:text-sm font-semibold text-white mb-2">
              🔍 Search Schools
            </label>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Type school name..."
              className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs sm:text-sm"
            />
          </div>

          {/* County Filters */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs sm:text-sm font-semibold text-white">
                📍 Filter by County
              </label>
              <div className="flex space-x-2">
                <button
                  onClick={selectAllCounties}
                  className="text-xs text-blue-400 active:text-blue-300"
                >
                  All
                </button>
                <button
                  onClick={clearFilters}
                  className="text-xs text-red-400 active:text-red-300"
                >
                  Clear
                </button>
              </div>
            </div>
            
            <div className="space-y-2 max-h-48 sm:max-h-64 overflow-y-auto pr-1">
              {counties.map((county) => {
                const schoolCount = schools.filter(s => s.county === county).length
                const isSelected = filteredCounties.includes(county)
                
                return (
                  <label
                    key={county}
                    className={`flex items-center justify-between px-2 sm:px-3 py-2 rounded-lg cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-blue-600 bg-opacity-30 border border-blue-500'
                        : 'bg-gray-800 bg-opacity-50 border border-gray-700 active:bg-gray-700'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleCounty(county)}
                        className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                      />
                      <span className="text-xs sm:text-sm text-white truncate">{county}</span>
                    </div>
                    <span className="text-xs text-gray-400 bg-gray-900 px-2 py-1 rounded-full ml-2">
                      {schoolCount}
                    </span>
                  </label>
                )
              })}
            </div>
          </div>

          {/* Active Filters Count */}
          {(filteredCounties.length > 0 || searchQuery) && (
            <div className="mt-3 pt-3 border-t border-gray-700">
              <div className="flex items-center justify-between text-xs text-gray-400">
                <span>Filters: {filteredCounties.length + (searchQuery ? 1 : 0)}</span>
                <button
                  onClick={clearFilters}
                  className="text-red-400 active:text-red-300 font-medium"
                >
                  Clear All
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}