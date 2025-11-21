# 📦 ChatGPT Energy Tracker — Chrome Extension  
### 🔋 Track Energy • 💧 Water • 🌍 Carbon for Every ChatGPT Query

The **ChatGPT Energy Tracker** is a Chrome extension that monitors your ChatGPT usage and estimates the environmental impact of each query.

It displays:

- ⚡ **Energy consumption** (Wh / kWh per query)  
- 💧 **Freshwater usage** (liters per query)  
- 🌍 **Carbon emissions** (optional)  
- 📊 **Per-query, per-conversation, and all-time stats**

A modern **React + Vite** popup UI visualizes metrics using **TailwindCSS + shadcn/ui**.

---

## 🚀 Features

### 🔍 Real-Time Tracking
- Detects every message you send to ChatGPT  
- Uses DOM observers to capture new queries  
- Identifies which model is used  
- Estimates token count (chars → tokens)  

### 🌱 Environmental Metrics
Calculates:

- ⚡ Energy consumption (Wh / kWh)  
- 💧 Water footprint (liters)  
- 🌍 Carbon footprint (kg CO₂e)  

Additional:

- Model-specific environmental coefficients  
- Historical metric storage in Chrome Storage  

### 🖥️ Modern Popup Dashboard
Built with:

- React + Vite  
- TailwindCSS  
- shadcn/ui  

Includes:

- 📊 Stats cards  
- ⚡ Energy icons  
- 💧 Water icons  
- 🌱 Sustainability symbols  
- Smooth animations  
- Dark theme with emerald accents 🌿  

---

## 📁 Project Structure

```text
chatgpt-energy-tracker/
│
├── public/
│   ├── manifest.json
│   └── icon128.png
│
├── src/
│   ├── background.js
│   ├── content-script.js
│   ├── popup/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── hooks/
│   ├── components/
│   ├── utils/
│   │   ├── envMetrics.js
│   │   └── storage.js
│   └── styles/
│
├── popup.html
├── vite.config.js
└── package.json
