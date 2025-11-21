📦 ChatGPT Energy Tracker — Chrome Extension
🔋 Track Energy • 💧 Water • 🌍 Carbon for Every ChatGPT Query🛠️ Installation (Development)
1️⃣ Clone the repository
git clone https://github.com/yourname/chatgpt-energy-tracker
cd chatgpt-energy-tracker
2️⃣ Install dependencies
npm install
3️⃣ Build the extension
npm run build
A production build will appear in the dist/ folder.
4️⃣ Load into Chrome
Visit: chrome://extensions/
Enable Developer Mode
Click Load Unpacked
Select the dist/ folder
🔧 Development Mode (Popup Hot Reload)
Run popup development mode:
npm run dev
Popup updates live, but you must manually reload the extension whenever you change:
manifest.json, content-script.js, or background.js.
🌍 How Environmental Metrics Work
Environmental factors are defined per model in envMetrics.js.
Example Model Factors
Model	Energy / Token (Wh)	Water / Token (mL)	CO₂e / Token (g)
GPT-4 Turbo	0.00012	0.0004	0.0021
GPT-3.5 Turbo	0.00005	0.0001	0.0010
Token Estimation Formula
tokens ≈ chars / 4
Metric Calculations
energy = tokens × energyPerToken
water  = tokens × waterPerToken
carbon = tokens × carbonPerToken

The ChatGPT Energy Tracker is a Chrome extension that monitors your ChatGPT usage and estimates the environmental impact of each query.
It displays:
⚡ Energy consumption (Wh / kWh per query)
💧 Freshwater usage (liters per query)
🌍 Carbon emissions (optional)
📊 Per-query, per-conversation, and all-time stats
A modern React + Vite popup UI visualizes all metrics using TailwindCSS + shadcn/ui.
🚀 Features
🔍 Real-Time Tracking
Detects every message you send to ChatGPT
Uses DOM observers to capture new queries
Identifies the model used
Estimates token count (chars → tokens)
🌱 Environmental Metrics
Calculates:
⚡ Energy consumption (Wh / kWh)
💧 Water footprint (liters)
🌍 Carbon emissions (kg CO₂e)
Other features:
Model-specific environmental coefficients
Historical metric storage via Chrome Storage
🖥️ Modern Popup Dashboard
Built with:
React + Vite
TailwindCSS
shadcn/ui
Includes:
📊 Stats cards
⚡ Energy icons
💧 Water droplet icons
🌱 Sustainability symbols
Smooth animations
Dark theme with emerald accents 🌿
📁 Project Structure

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
