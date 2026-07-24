# 🎓 Kenya Schools Training Centers Map

An interactive Next.js application showing 97 schools across 10 counties in Kenya, with 24 regional training centers calculated using K-means clustering.

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![Next.js](https://img.shields.io/badge/Next.js-14.1-black.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue.svg)

---

## 📋 Features

### Core Functionality
✅ **Interactive Google Maps** - Full-featured map with zoom, pan, satellite view  
✅ **97 Schools** - All schools plotted with verified GPS coordinates  
✅ **24 Training Centers** - Regional centers calculated via K-means clustering  
✅ **View Toggle** - Switch between "All Schools" and "Centers Only"  
✅ **Color Coding** - Schools colored by cluster assignment  

### Advanced Features
✅ **County Filters** - Show/hide schools by county  
✅ **Search Functionality** - Find schools by name  
✅ **Click for Details** - Full info popups for schools and centers  
✅ **Statistics Dashboard** - Live stats and charts  
✅ **Export to CSV** - Download filtered data  
✅ **Mobile Responsive** - Works on all devices  

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- A Google Maps API key ([create one here](https://console.cloud.google.com/google/maps-apis/credentials)) — keep it private and add HTTP referrer + API restrictions

### Installation

```bash
# 1. Extract the project folder
cd school-training-map

# 2. Install dependencies
npm install

# 3. Run development server
npm run dev

# 4. Open in browser
# Navigate to: http://localhost:3000
```

That's it! The app is ready to use.

---

## 📊 Data Overview

### Schools Data
- **Total Schools:** 97
- **Counties:** 10 (Baringo, Bomet, Bungoma, Homabay, Kajiado, Kitui, Nandi, Samburu, Turkana, West Pokot)
- **Data Source:** `schools_geocoded222.xlsx` (your verified coordinates)

### Clustering Algorithm
- **Method:** K-means clustering
- **Number of Clusters:** 24
- **Average Schools per Cluster:** 4
- **Average Distance to Center:** 19.4 km
- **Algorithm Iterations:** Converged in 7 iterations

### Training Centers
Each of the 24 regional training centers serves approximately 4 schools, with coordinates calculated as the geographic center (centroid) of its assigned schools.

---

## 🗺️ Using the Map

### View Modes

#### 1. All Schools View (Default)
- Shows all 97 individual school markers
- Color-coded by cluster assignment
- Training centers visible as gold stars
- Click any marker for details

#### 2. Centers Only View
- Shows only 24 training center markers
- Individual schools hidden
- Larger, prominent center markers
- Click to see which schools each center serves

### Controls

#### Toggle Buttons
- **🏫 All Schools** - Show individual schools
- **⭐ Centers Only** - Show training centers only

#### Filters Panel
- **Show/Hide Filters** - Toggle filter panel
- **Search** - Type to find schools by name
- **County Filters** - Check/uncheck counties
- **Clear Filters** - Reset all filters

#### Map Controls
- **Zoom** - Mouse wheel or +/- buttons
- **Pan** - Click and drag
- **Map Type** - Satellite, terrain, roadmap
- **Fullscreen** - Expand to full screen

---

## 📈 Statistics Dashboard

Located in the top-right corner, the dashboard shows:

### Key Metrics
- Total Schools (filtered)
- Active Training Centers
- Average Distance to Center
- Maximum Distance to Center

### Charts
1. **County Distribution** - Pie chart showing schools per county
2. **Distance Distribution** - Bar chart of distance ranges
3. **Cluster Sizes** - List of clusters by size

### Export Function
Click "💾 Export CSV" to download current filtered data.

---

## 🎨 Color Scheme

### Clusters
Each cluster has a distinct color:
- Cluster 1-10: Various blues, teals, corals
- Cluster 11-20: Purples, mints, yellows
- Cluster 21-24: Pastels

### Markers
- **Schools:** Colored circles (by cluster)
- **Training Centers:** Gold stars with orange outline

---

## 📱 Mobile Responsiveness

The application is fully responsive:
- **Desktop:** Full sidebar layout
- **Tablet:** Collapsible panels
- **Mobile:** Touch-optimized controls

---

## 🔧 Customization

### Change Number of Clusters

Edit `/lib/clustering.ts` (if you want to reprocess data):

```typescript
const NUM_CLUSTERS = 24; // Change this number
```

Then re-run the clustering script.

### Change Map Center

Edit `/components/MapContainer.tsx`:

```typescript
const center = {
  lat: 0.1473, // Your latitude
  lng: 35.7962, // Your longitude
}
```

### Change Colors

Edit `/lib/utils.ts` in the `getClusterColor` function:

```typescript
const colors = [
  '#FF6B6B', // Add or modify colors
  // ...
];
```

---

## 🚀 Deployment

### Deploy to Vercel (Recommended)

```bash
# 1. Install Vercel CLI
npm install -g vercel

# 2. Login
vercel login

# 3. Deploy
vercel

# Follow the prompts
```

Your app will be live at: `https://your-project.vercel.app`

### Deploy to Netlify

```bash
# 1. Build the project
npm run build

# 2. Deploy to Netlify
# Drag and drop the `.next` folder to netlify.com
```

### Environment Variables

When deploying, set this environment variable:
```
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
```

---

## 📁 Project Structure

```
school-training-map/
├── app/
│   ├── page.tsx              # Main application page
│   ├── layout.tsx            # Root layout
│   └── globals.css           # Global styles
├── components/
│   ├── MapContainer.tsx      # Google Maps component
│   ├── MapControls.tsx       # Filters and toggle
│   └── StatisticsDashboard.tsx # Stats and charts
├── lib/
│   ├── types.ts              # TypeScript types
│   └── utils.ts              # Utility functions
├── public/
│   └── data/
│       ├── schools.geojson           # Schools data
│       ├── cluster_centers.geojson   # Centers data
        ├── kenya_counties.geojson   # Overlay Map
│       └── schools_with_clusters.csv # Raw data
├── package.json              # Dependencies
├── tsconfig.json             # TypeScript config
├── tailwind.config.ts        # Tailwind CSS config
└── next.config.js            # Next.js config
```

---

## 🔐 API Key Security

### For Development
- API key is in `.env.local`
- This file is gitignored (not committed)

### For Production
- Set environment variable in Vercel/Netlify dashboard
- Never commit API keys to Git
- Restrict API key in Google Cloud Console:
  1. Go to: console.cloud.google.com
  2. APIs & Services → Credentials
  3. Edit your API key
  4. Add HTTP referrer restrictions (your domain)

---

## 🐛 Troubleshooting

### Map not loading
**Problem:** Blank screen or map not showing  
**Solution:** Check that `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` is set in `.env.local`

### "Failed to load data" error
**Problem:** Cannot load school data  
**Solution:** Ensure data files exist in `/public/data/` folder

### Slow performance
**Problem:** Map is laggy  
**Solution:** Filter to fewer counties or use "Centers Only" view

### Build errors
**Problem:** TypeScript or build errors  
**Solution:** Delete `.next` folder and `node_modules`, then:
```bash
npm install
npm run dev
```

---

## 📊 Data Files

### schools.geojson
GeoJSON format with all 97 schools:
```json
{
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [lng, lat]
      },
      "properties": {
        "id": 1,
        "name": "School Name",
        "county": "County",
        "cluster_id": 0
      }
    }
  ]
}
```

### cluster_centers.geojson
GeoJSON format with 24 training centers

### schools_with_clusters.csv
Raw CSV with all data for reference

---

## 💡 Use Cases

### For Training Coordinators
- Identify nearest training center for each school
- Plan regional training events
- Calculate travel logistics

### For Education Officials
- Visualize school distribution
- Understand geographic patterns
- Plan resource allocation

### For Researchers
- Analyze clustering patterns
- Study regional groupings
- Export data for further analysis

---

## 🔄 Updating Data

To update with new school coordinates:

1. Update `/public/data/schools_with_clusters.csv`
2. Run clustering script (provided separately)
3. Replace GeoJSON files in `/public/data/`
4. Restart development server

---

## 📞 Support

**Questions about the map?**  
Check the troubleshooting section above

**Need to modify clustering?**  
See the customization section

**API issues?**  
Verify your Google Cloud Console settings

---

## 📜 License

This project is for internal use for Kenya schools training coordination.

---

## 🎯 Next Steps

1. ✅ Run `npm install`
2. ✅ Run `npm run dev`
3. ✅ Open `http://localhost:3000`
4. ✅ Explore the map!
5. ✅ Deploy to Vercel when ready

**Built with ❤️ using Next.js, Google Maps API, and K-means clustering**
