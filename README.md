# 🐾 PawResQ

### AI-Powered Animal Rescue, Emergency Response & Adoption Platform

<p align="center">

Transforming animal rescue through Artificial Intelligence, Real-Time Coordination, and Community-Driven Welfare.

</p>

---

## 🌍 Vision

Every year, millions of injured and abandoned animals suffer because rescue requests are delayed, rescue information is incomplete, and emergency cases are not prioritized effectively.

PawResQ was built to solve this problem.

PawResQ is an intelligent rescue coordination platform that connects:

🐾 Citizens
🏥 NGOs
🚑 Emergency Volunteers
🏠 Animal Adopters

through a unified AI-powered ecosystem.

Instead of simply reporting an injured animal, PawResQ analyzes the injury, prioritizes the rescue, routes cases to responders, tracks rescue progress, and helps rescued animals find permanent homes.

---

# 🚀 What Makes PawResQ Different?

Unlike traditional reporting platforms, PawResQ combines:

✅ Computer Vision

✅ Real-Time Rescue Coordination

✅ Geolocation Intelligence

✅ Emergency Escalation Workflows

✅ Adoption Management

✅ AI-Based Injury Analysis

into a single end-to-end platform.

---

# ⚡ Key Capabilities

## 🩺 AI Injury Detection Engine

PawResQ integrates a custom YOLOv8-based Computer Vision pipeline capable of:

* Detecting animals from uploaded images
* Identifying injury categories
* Estimating injury severity
* Recommending emergency response actions

### Supported Injury Classes

| Injury Type | Detection |
| ----------- | --------- |
| Bleeding    | ✅         |
| Fracture    | ✅         |
| Infection   | ✅         |
| Cut/Wound   | ✅         |

Example AI Output:

```json id="h3mjlwm"
{
  "animal": "dog",
  "injury": "bleeding",
  "severity": "HIGH",
  "ngo_alert_required": true
}
```

The AI engine combines image analysis and citizen descriptions to produce more reliable severity assessments.

---

# 🚨 Intelligent Rescue Pipeline

Citizen Reports Animal

⬇

AI Analyzes Injury

⬇

Priority Engine Calculates Severity

⬇

Nearby NGOs Receive Case

⬇

No Response?

⬇

Emergency Volunteers Activated

⬇

Animal Rescued

⬇

Case Tracked Until Closure

⬇

Animal Listed For Adoption

---

# 🎯 Smart Priority System

Not every rescue case has the same urgency.

PawResQ automatically classifies rescue requests into:

🔵 Routine

🟢 Important

🟠 Urgent

🔴 Emergency

based on:

* AI predictions
* Injury descriptions
* Emergency keywords
* Rescue context

This ensures that critical cases receive immediate attention.

---

# 🗺️ Live Rescue Intelligence Map

Built using:

* Leaflet.js
* OpenStreetMap
* Nominatim Reverse Geocoding

Capabilities:

✅ Live rescue visualization

✅ Priority-based marker colors

✅ Real-time case locations

✅ Citizen location selection

✅ Automatic address detection

Priority Indicators:

🔴 Emergency

🟠 Urgent

🟢 Routine / Important

---

# 🏥 NGO Rescue Operations Dashboard

Verified NGOs can:

* View incoming rescue cases
* Accept rescue requests
* Manage active operations
* Track rescue progress
* Prioritize emergency reports

The dashboard acts as a centralized rescue command center.

---

# 🚑 Emergency Volunteer Network

When NGOs fail to respond within a predefined timeframe:

PawResQ automatically escalates the case.

Emergency volunteers can:

* View escalated rescue requests
* Accept assignments
* Update rescue status
* Mark animals as rescued

This creates a secondary safety net for animals requiring urgent assistance.

---

# 🔍 Rescue Tracking System

Every report receives a unique tracking ID.

Citizens can monitor rescue progress in real time:

```text id="4wq7pc"
Pending
↓
Accepted
↓
Volunteer Assigned
↓
Rescued
↓
Closed
```

This eliminates uncertainty and improves transparency.

---

# 🏠 Adoption Ecosystem

Rescue is only half the journey.

PawResQ also helps animals find permanent homes.

### Adoption Listings Include

* Animal Name
* Breed
* Age
* Gender
* Vaccination Status
* Food Habits
* Pet Personality
* Contact Information
* Multiple Images

### Adoption Features

✅ Multi-image gallery

✅ Search

✅ Filters

✅ Responsive adoption feed

✅ Direct adopter contact

---

# 🏗️ System Architecture

```text id="5zjzwz"
Citizen
   │
   ▼
React Frontend
   │
   ▼
Node.js + Express Backend
   │
   ├─────────────► MongoDB Atlas
   │
   ├─────────────► Cloudinary
   │
   ▼
FastAPI AI Service
   │
   ▼
YOLOv8 Models
   │
   ▼
Severity Analysis Engine
   │
   ▼
NGO Workflow
   │
   ▼
Volunteer Escalation
   │
   ▼
Adoption Pipeline
```

---

# 🛠️ Technology Stack

## Frontend

* React.js
* Vite
* React Router
* CSS3
* Leaflet.js

## Backend

* Node.js
* Express.js
* MongoDB Atlas
* Mongoose

## Artificial Intelligence

* YOLOv8
* FastAPI
* OpenCV
* Python
* Ultralytics

## Real-Time Systems

* Socket.IO

## Media Storage

* Cloudinary

## Geolocation

* OpenStreetMap
* Nominatim API

---

# 📊 Current Development Status

### Completed

✅ AI Injury Detection

✅ Rescue Reporting

✅ Cloudinary Image Uploads

✅ NGO Dashboard

✅ Volunteer Dashboard

✅ Priority Engine

✅ Live Rescue Map

✅ Tracking System

✅ Adoption Marketplace

✅ Multi-Image Adoption Posts

✅ Search & Filters

✅ Responsive UI

---

### Currently Building

🚧 Real-Time Adoption Feed

🚧 Adoption Ownership Controls

🚧 Notification System

🚧 Analytics Dashboard

🚧 Advanced Rescue Insights

---

# 📈 Impact

PawResQ is designed to:

* Reduce rescue response time
* Improve NGO coordination
* Prioritize emergency cases automatically
* Increase adoption success rates
* Build a technology-driven animal welfare ecosystem

The platform demonstrates how Artificial Intelligence can be applied to solve meaningful real-world social challenges.

---

# 👨‍💻 Author

### Nayana Deepthy Rangaraju

Computer Science Engineering

Matrusri Engineering College

Building AI-powered solutions for social impact, emergency response systems, and real-world problem solving.

---

⭐ If you found this project interesting, consider starring the repository and supporting the mission of technology-driven animal welfare.

