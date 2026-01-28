# 🌊 RisqMap: Real-Time Flood Detection & Alert System 🗺️

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Next.js](https://img.shields.io/badge/Next.js-14.2.35-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.x-38B2AC)](https://tailwindcss.com/)
[![Vercel](https://img.shields.io/badge/Vercel-Deployed-black)](https://vercel.com/)

> 🚨 **Empowering Communities with Proactive Flood Management** 🚨  
> RisqMap is an innovative, real-time flood detection and alert system designed specifically for the United States. Leveraging cutting-edge AI, geospatial data, and user-friendly interfaces, it provides instant flood warnings, evacuation guidance, and comprehensive disaster preparedness tools to keep lives and properties safe.

## 📋 Table of Contents
- [🌟 What is RisqMap?](#-what-is-risqmap)
- [✨ Key Features](#-key-features)
- [🛠️ Tech Stack](#️-tech-stack)
- [🚀 Installation](#-installation)
- [📖 Usage](#-usage)
- [🗺️ Roadmap](#️-roadmap)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)
- [📞 Contact](#-contact)

## 🌟 What is RisqMap?
RisqMap is a comprehensive web application that transforms flood risk management from reactive to proactive. Built for the US, it integrates real-time data from multiple sources including NOAA, USGS, FEMA, and AI-powered analytics to deliver:

- **Instant Alerts**: Get notified of flooding events as they happen.
- **Interactive Maps**: Visualize flood zones, water levels, and evacuation routes.
- **AI Insights**: Predictive analysis using Gemini AI for flood forecasting.
- **Community Reports**: Crowdsourced flood reports and emergency updates.
- **Educational Resources**: Guides on flood preparation, monitoring technology, and regional flood histories.

Whether you're a homeowner, emergency responder, or city planner, RisqMap equips you with the tools to stay ahead of floods. 🌧️➡️🛡️

**🚀 SaaS Transition**: RisqMap is evolving into a paid SaaS platform. V1 remains free and open-source, while V2 introduces premium features for advanced users. Stay tuned for subscription details!

## ✨ Key Features
RisqMap packs a punch with features designed for reliability and ease of use:

### 🔔 Real-Time Alerts & Notifications
- **Live Flood Warnings**: Integrated with NOAA alerts for instant notifications.
- **Customizable Alerts**: Set up alerts based on location, severity, and type.
- **Push Notifications**: Browser and mobile notifications for critical updates.

### 🗺️ Interactive Mapping
- **Flood Zone Visualization**: Color-coded maps showing current and predicted flood areas.
- **Water Level Monitoring**: Real-time data from USGS gauges across the US.
- **Evacuation Routing**: Dynamic routes with traffic and flood considerations.
- **Multi-Layer Maps**: Weather radar, air quality, and infrastructure overlays.

### 🤖 AI-Powered Analytics
- **Flood Prediction**: Gemini AI analyzes weather patterns for accurate forecasts.
- **Risk Assessment**: Property-specific hazard indicators and vulnerability scores.
- **Chatbot Assistance**: AI-driven Q&A for flood-related queries and advice.

### 📊 Data & Statistics
- **Historical Data**: Analyze past floods in Jakarta, New Orleans, and US regions.
- **Infrastructure Monitoring**: Pump station status and emergency response tracking.
- **User Reports**: Submit and view community flood reports with geolocation.

### 🌐 Multilingual & Accessible
- **Language Support**: English and Indonesian interfaces.
- **Accessibility**: WCAG-compliant design for all users.
- **Offline Mode**: Core features work without internet (PWA).

### 🔧 Developer-Friendly
- **API Endpoints**: RESTful APIs for integrating with external systems.
- **Modular Architecture**: Easy to extend and customize.
- **Open Source**: Fully open for community contributions.

## 🛠️ Tech Stack
RisqMap is built with modern, scalable technologies:

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, Radix UI components
- **Mapping**: Leaflet.js with custom layers
- **Backend**: Next.js API routes, Supabase (PostgreSQL)
- **AI/ML**: Google Gemini AI
- **Data Sources**: NOAA, USGS, FEMA, Open-Meteo
- **Deployment**: Vercel with PWA support
- **Testing**: Vitest, Playwright
- **CI/CD**: GitHub Actions

## 🚀 Installation
Get RisqMap running locally in minutes! 🏃‍♂️

### Prerequisites
- Node.js 18+
- npm or yarn
- Git
- (Optional) Docker for local database

### Steps
1. **Clone the repo**:
   ```bash
   git clone https://github.com/itsRabb/Floodzy-USA.git
   cd Floodzy-USA
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   - Copy `.env.example` to `.env.local`
   - Fill in your API keys (see `.env.example` for details)
   - Example:
     ```
     NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
     NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
     GEMINI_API_KEY=your_gemini_key
     ```

4. **Run the database** (if using Docker):
   ```bash
   docker-compose up -d
   ```

5. **Start the development server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

6. **Build for production**:
   ```bash
   npm run build
   npm start
   ```

## 📖 Usage
RisqMap is intuitive and powerful. Here's how to make the most of it:

### For Users
1. **Sign Up/Login**: Create an account to save preferences and locations.
2. **Set Your Location**: Allow geolocation for personalized alerts.
3. **Explore the Dashboard**: View weather, flood risks, and statistics.
4. **Report Floods**: Use the map to submit real-time reports.
5. **Access Education**: Learn about flood preparation and technology.

### For Developers
- **API Documentation**: Check `/api` routes for data endpoints.
- **Component Library**: Reusable UI components in `/components/ui`.
- **Contributing**: See [Contributing](#-contributing) below.

### Screenshots
*(Add screenshots here once deployed)*
- Dashboard View 🖥️
- Flood Map 🗺️
- Alert Notifications 📱

## 🗺️ Roadmap
RisqMap is continuously evolving. Here's what's coming in V2 and beyond:

### V2.0: Enhanced Hazard Intelligence (Q2 2026) - **Premium SaaS Features** 💰
RisqMap V2 introduces advanced, paid SaaS capabilities for professional users, emergency services, and enterprises. Unlock premium features with a subscription:

- **RisqMaps Property Hazard Indicator**: AI-driven property risk scoring with detailed hazard maps. 🏠⚠️
- **Emergency Action Levels (EAL)**: Integration with FEMA EALs for structured emergency responses. 🚨📋
- **Evacuation Routes with Coordinates**: GPS-precise routes including waypoints, estimated times, and alternative paths. 🛣️📍
- **Advanced AI Forecasting**: Machine learning models for hyper-local flood predictions. 🤖🌊
- **Mobile App**: Native iOS/Android apps with offline capabilities. 📱

*Note: V2 features are part of our paid SaaS offering. Free users can access basic features, while premium unlocks full hazard intelligence.*

### Future Releases
- **V2.1: Community Integration** (Q3 2026)
  - Social features for neighborhood watch groups.
  - Integration with local government APIs.

- **V3.0: Global Expansion** (2027)
  - Support for international flood data.
  - Multi-language expansion (Spanish, French, etc.).

- **Ongoing**: 
  - Performance optimizations.
  - Accessibility improvements.
  - New data source integrations.

Stay tuned for updates! Follow our [GitHub Issues](https://github.com/itsRabb/Floodzy-USA/issues) for progress.

## 🤝 Contributing
We welcome contributions! 🌟 Help us make RisqMap even better.

### How to Contribute
1. **Fork the repo** on GitHub.
2. **Create a feature branch**: `git checkout -b feature/your-feature`
3. **Make changes** and test thoroughly.
4. **Submit a PR** with a clear description.

### Guidelines
- Follow the existing code style (ESLint, Prettier).
- Write tests for new features.
- Update documentation as needed.
- Respect the [Code of Conduct](CODE_OF_CONDUCT.md).

### Development Setup
See [Installation](#-installation) above, then:
```bash
npm run lint
npm run test
```

## 📄 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details. 📜

## 📞 Contact
- **Project Lead**: [itsRabb](https://github.com/itsRabb)
- **Issues**: [GitHub Issues](https://github.com/itsRabb/Floodzy-USA/issues)
- **Discussions**: [GitHub Discussions](https://github.com/itsRabb/Floodzy-USA/discussions)
- **Email**: (Add contact email if available)

---

**Made with ❤️ for flood-prone communities worldwide. Let's build resilience together!** 🌍💪

*RisqMap - Because every drop counts. 💧*</content>
<parameter name="filePath">c:\Users\evoga\OneDrive\Desktop\Floodzy-main\README.md
