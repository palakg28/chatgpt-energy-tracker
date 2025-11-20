📦 ChatGPT Energy Tracker — Chrome Extension
🔋 Track Energy • 💧 Water • 🌍 Carbon for Every ChatGPT Query

The ChatGPT Energy Tracker is a Chrome Extension that monitors your queries on ChatGPT (chat.openai.com / chatgpt.com) and calculates estimated environmental impacts:

⚡ Energy consumption (Wh / kWh per query)

💧 Freshwater usage (liters per query)

🌍 Carbon footprint (optional)

📊 Per-query, per-conversation, and all-time usage

A polished React + Vite popup UI shows live stats using TailwindCSS + shadcn/ui.

🚀 Features
🔍 Real-Time Tracking

Detects every user message you send to ChatGPT

Uses DOM observers to track new queries

Detects which model is being used

Estimates token count (chars → tokens conversion)

🌱 Environmental Metrics

Calculates:

⚡ Energy consumption (Wh / kWh)

💧 Freshwater consumption (liters)

🌍 Carbon footprint (kg CO₂e)

Model-specific environmental factors

Stores historical metrics in Chrome Storage

🖥️ Modern Popup Dashboard

Built with:

React + Vite

TailwindCSS

shadcn/ui

Dark theme with emerald accents 🌿

Includes:

📊 Stats cards

⚡ Energy icon

💧 Water droplet icon

🌱 Sustainability symbol

Smooth micro-animations

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

🛠️ Installation (Development)
1️⃣ Clone the project
git clone https://github.com/yourname/chatgpt-energy-tracker
cd chatgpt-energy-tracker

2️⃣ Install dependencies
npm install

3️⃣ Build the extension
npm run build


This generates the production build in:

dist/

4️⃣ Load into Chrome

Go to chrome://extensions/

Enable Developer Mode

Click Load Unpacked

Select the dist/ folder

🔧 Development Mode (Hot Reload for Popup)

Run:

npm run dev


This updates your React popup live, but you still reload the extension manually when changing:

manifest.json

content-script.js

background.js

🌍 How Environmental Metrics Work

The extension uses estimated factors per model:

Example factors (editable in envMetrics.js):
Model	Energy / Token (Wh)	Water / Token (mL)	CO₂e / Token (g)
GPT-4 Turbo	0.00012	0.0004	0.0021
GPT-3.5 Turbo	0.00005	0.0001	0.0010

Token Estimation:

tokens ≈ chars / 4


Metrics Calculated:

energy = tokens × energyPerToken
water  = tokens × waterPerToken
carbon = tokens × carbonPerToken

🧠 How Tracking Works
Content Script

Watches the ChatGPT DOM for new user messages

Extracts:

user text

model

conversation ID

estimated tokens

Sends message to background worker:

chrome.runtime.sendMessage({
  type: "CHAT_QUERY",
  text,
  tokens,
  model,
  conversationId
});

Background Worker

Saves query data to chrome.storage.local

Updates historical totals

Responds to popup UI

Popup

Reads stored stats

Displays environmental impact

🐞 Debugging
Verify content script loaded:

Open ChatGPT → DevTools → Console

You should see:

[EnergyTracker-CS] content script loaded

Verify background loaded:

Chrome Extensions → Inspect Worker

[EnergyTracker-BG] service worker loaded


If popup shows "No queries tracked", see the troubleshooting section.
