const id = {
    // ID locale now uses English content - no Indonesian language in this codebase
    common: {
        dashboard: 'Dashboard',
        home: 'Home',
        map: 'Map',
        warnings: 'Warnings',
        about: 'About',
        login: 'Login',
        logout: 'Logout',
        language: 'Language',
        risqmap: 'RisqMap',
        floodDetectionSystem: 'Flood Detection System',
        searchPlaceholder: 'Search region or location...',
        searchPlaceholderShort: 'Search region',
        affected: 'Affected:',
        levels: {
            high: 'High',
            medium: 'Medium',
            low: 'Low',
            severe: 'Severe',
            alert1: 'Alert 1',
            alert2: 'Alert 2',
            alert3: 'Alert 3',
            alert4: 'Alert 4'
        }
    },
    landing: {
        heroSubtitle: 'Real-time Flood Detection & Weather Monitoring System for the United States',
        selectLocation: 'Select Flood Location',
        latestAlerts: 'Latest Alerts',
        totalRegions: 'Total Regions',
        activeAlerts: 'Active Alerts',
        floodZones: 'Flood Zones',
        peopleAtRisk: 'People at Risk',
        descTotalRegions: 'Unique regions monitored',
        descActiveAlerts: 'Current real-time alerts',
        descFloodZones: 'Monitoring posts at Alert/Danger level',
        descPeopleAtRisk: 'Estimated population at risk',
        interactiveMap: 'Interactive Flood Map',
        mapDescription: 'Visualize flood data, prone zones, and real-time warnings. Open map for deep exploration.',
        openMap: 'Open Map',
        updateData: 'Update Data',
        latestDisasterAlerts: 'Latest Disaster Alerts',
        viewDetail: 'View Details',
        dataUnavailable: 'Data Unavailable',
        loadingWeather: 'Loading weather data...',
        unavailableDesc: 'Weather or air quality data could not be loaded for this location.'
    },
    dashboard: {
        floodZones: 'Flood Zones',
        peopleAtRisk: 'People at Risk',
        weatherStations: 'Weather Stations',
        pumpSystemStatus: 'Pump System Status',
        loadingPumpStatus: 'Loading pump status...',
        pumpError: 'Pump error: ',
        totalRegisteredPumps: 'Total Registered Pumps',
        operatingPumps: 'Operating Pumps',
        nonOperatingPumps: 'Non-Operating Pumps',
        needingMaintenance: 'Needing Maintenance',
        selectRegionForPumps: 'Select region to view pumps.',
        recentActivity: 'Recent Activity',
        loadingWaterLevel: 'Loading Water Level data...',
        waterLevelError: 'Water Level Error: ',
        waterLevel: 'Water Level',
        timeUnavailable: 'Time unavailable',
        selectRegionForWaterLevel: 'Select a region to view nearby Water Level Posts.',
        unknown: 'Unknown',
        operating: 'Operating',
        maintenance: 'Maintenance',
        offline: 'Offline',
        notOperating: 'Not Operating',
        damaged: 'Damaged',
        floodMapTitle: 'Flood Map'
    },
    sidebar: {
        navigation: 'Navigation',
        monitoringSystem: 'Monitoring System',
        dashboard: 'Dashboard',
        floodMonitoring: 'Flood Monitoring',
        weatherForecast: 'Weather Forecast',
        alerts: 'Alerts',
        reportFlood: 'Report Flood',
        evacuationInfo: 'Evacuation Info',
        sensorData: 'Sensor Data',
        statistics: 'Data Statistics',
        quickActions: 'Quick Actions',
        currentWeather: 'Current Weather',
        settings: 'Settings',
        aboutRisqMap: 'About RisqMap'
    },
    regionSelector: {
        title: 'Select Region',
        subtitle: 'Select from state to county',
        province: 'State',
        city: 'City',
        district: 'County',
        successTitle: 'Location Selected Successfully',
        viewFloodMap: 'View Flood Map'
    },
    weatherInsight: {
        title: 'Weather Monitoring',
        subtitle: 'Selected location weather visualization',
        radar: 'Radar',
        aqi: 'AQI'
    },
    infrastructure: {
        pumpSystemStatus: 'Pump System Status',
        totalRegistered: 'Total Registered Pumps',
        operating: 'Pumps Operating',
        notOperating: 'Pumps Not Operating',
        maintenance: 'Requires Maintenance',
        recentActivity: 'Recent Activity',
        minutesAgo: 'minutes ago',
        criticalInfrastructure: 'Critical Infrastructure Monitoring',
        clickDetail: 'Click to view real-time data details',
        viewWaterLevel: 'View Water Level Status',
        viewPumpStatus: 'View Flood Pump Status',
        searchPump: 'Search pump...',
        searchWaterPost: 'Search water post...',
        pumpName: 'Pump Name',
        location: 'Location',
        status: 'Status',
        active: 'Active',
        offline: 'Offline',
        maintenanceStatus: 'Maintenance',
        liveData: 'Live Data',
        station: 'Station',
        height: 'Height',
        lastUpdate: 'Update',
        monitoredWaterPosts: 'Monitored Water Posts'
    },
    warnings: {
        title: 'Latest Disaster Alerts',
        subtitle: 'Real-time monitoring and analysis of flood alerts',
        totalAlerts: 'Total Alerts',
        highLevel: 'High Level',
        mediumLevel: 'Medium Level',
        lowLevel: 'Low Level',
        active: 'Active',
        immediateAction: 'Immediate Action Required',
        monitorConstantly: 'Monitor Constantly',
        stableCondition: 'Stable Condition',
        alertsTab: 'Alerts',
        newsTab: 'Regional News',
        affected: 'Affected',
        severity: 'Severity',
        affectedRegions: 'Affected Regions:',
        others: 'others',
        viewDetail: 'View Detail Explanation',
        detailTitle: 'Alert Detail',
        loadingAnalysis: 'Loading in-depth analysis...',
        analyzingData: 'Analyzing data from various sources',
        error: 'Error',
        analysisResult: 'Analysis for {location}: {reason}. Potential impact extending to {areas}. Recommendation: Increase vigilance and prepare evacuation routes.',
        selectAlert: 'Select an alert to view in-depth analysis',
        regionalNews: 'Regional News & Reports',
        newsSubtitle: 'Summary of disaster-related news from various sources, powered by Gemini.',
        loadingNews: 'Loading and summarizing news, please wait a few minutes...',
        errorNews: 'Error Loading News',
        noNews: 'No news or reports available at this time.',
        geminiSummary: 'Gemini Summary:',
        summarizing: 'Summarizing...',
        readMore: 'Read More',
        summaryTemplate: 'This is a summary for the news titled "{title}".'
    },
    weather: {
        loadingMap: 'Loading map...',
        unknown: 'Unknown',
        humidity: 'Humidity',
        wind: 'Wind',
        pressure: 'Pressure',
        visibility: 'Visibility',
        sunrise: 'Sunrise',
        sunset: 'Sunset',
        pageTitle: 'Weather Forecast',
        pageSubtitle: 'Real-time weather monitoring with interactive visualization',
        statusOnline: 'Online',
        statusError: 'API Key Error',
        searchLocation: 'Location Search',
        searchPlaceholder: 'Search city or region...',
        searchButton: 'Search',
        mapLayers: 'Map Layers',
        layers: {
            clouds: 'Clouds',
            precipitation: 'Precipitation',
            temperature: 'Temperature',
            wind: 'Wind',
            pressure: 'Pressure',
            cloudCover: 'Cloud cover',
            rainIntensity: 'Rain intensity',
            tempDistribution: 'Temperature distribution',
            windSpeed: 'Wind speed',
            atmPressure: 'Atmospheric pressure'
        },
        interactiveMap: 'Interactive Weather Map',
        invalidApiKey: 'Invalid weather provider API key. Please check your configuration.',
        currentWeather: 'Current Weather',
        live: 'Live',
        forecast5Days: '5-Day Forecast',
        locationInfo: 'Location Information',
        latitude: 'Latitude',
        longitude: 'Longitude',
        loadingData: 'Loading weather data...',
        loadingForecast: 'Loading forecast...',
        selectLocation: 'Select or search a location to view weather',
        errors: {
            fetchFailed: 'Failed to fetch weather data. Please try again later.',
            searchEmpty: 'Search input cannot be empty.',
            searchShort: 'Search input too short (min 2 chars).',
            searchLong: 'Search input too long (max 100 chars).',
            searchInvalid: 'Search input contains invalid characters.',
            apiKeyMissing: 'Weather provider API Key not found (Open‑Meteo does not require a key).',
            locationNotFound: 'Location "{query}" not found.',
            searchFailed: 'Failed to search location. Check your connection.',
            getLocationFailed: 'Failed to get location name.',
            geolocationFailed: 'Failed to access location. Allow access in your browser.',
            geolocationUnsupported: 'Geolocation not supported by this browser.'
        },
        feelsLike: 'Feels like',
        enterFullscreen: 'Enter fullscreen',
        exitFullscreen: 'Exit fullscreen'
    },
    reportFlood: {
        title: 'Flood Report',
        subtitle: 'Flood Detection System',
        formTitle: 'Flood Report',
        formDesc: 'Report flood conditions in your area to help with real-time monitoring.',
        location: 'Incident Location',
        locationPlaceholder: 'Search location manually (example: New York, NY)',
        mapHint: 'Drag the marker on the map, click the GPS button, or search for a location manually.',
        waterLevel: 'Water Level',
        photo: 'Upload Photo (Optional)',
        photoPlaceholder: 'Click to select a photo',
        photoChange: 'Click to change the photo',
        photoFormats: 'PNG, JPG up to 10MB',
        descLabel: 'Short Description',
        descPlaceholder: 'Provide additional details about the flood conditions (water flow, cause, etc)...',
        reporterName: 'Reporter Name (Optional)',
        reporterContact: 'Contact (Optional)',
        submitButton: 'Submit Report',
        submitting: 'Submitting Report...',
        success: 'Report submitted successfully!',
        validationError: 'Validation failed. Please check your input.',
        searchError: 'Failed to search location: {message}',
        locationFound: 'Location found on the map.',
        locationNotFound: 'Location not found. Try another keyword.',
        guideTitle: 'Reporting Guide',
        guide1: 'Ensure the reported location is accurate',
        guide2: 'Select water level according to actual conditions',
        guide3: 'Include photos for data validation',
        guide4: 'Detailed descriptions help the response team',
        emergencyContact: 'Emergency Contact',
        timeTitle: 'Current Time',
        timeZone: 'Local Time Zone',
        predictionRisk: 'Risk Prediction',
        predictionProb: 'Flood Probability',
        riskHigh: 'High Risk',
        riskMedium: 'Medium Risk',
        riskLow: 'Low Risk',
        waterLevelOptions: {
            ankle_deep: 'Ankle Deep < 30cm',
            knee_deep: 'Knee Deep 30-60cm',
            thigh_deep: 'Thigh Deep 60-90cm',
            waist_deep: 'Waist Deep 90-120cm',
            above_waist: 'Above Waist > 120cm'
        }
    },
    sensorData: {
        title: 'Sensor Data Analysis',
        subtitle: 'Monitoring flood reports and real-time weather data',
        backToDashboard: 'Back to Dashboard',
        errorTitle: 'Failed to Load Report Data',
        errorMessage: 'An error occurred while fetching data: {message}',
        statistics: {
            title: 'Dasbor Statistik',
            tabs: {
                overview: 'Ringkasan',
                historical: 'Historis'
            },
            filters: {
                button: 'Filter',
                startDate: 'Tanggal Mulai',
                endDate: 'Tanggal Akhir'
            }
        },
        Statistics: {
            overview: {
                title: 'Ringkasan Statistik Bencana',
                realTime: 'Langsung',
                subtitle: 'Pemantauan bencana real-time dan statistik',
                stats: {
                    totalIncidents: 'Total Insiden',
                    descTotalIncidents: 'Total insiden bencana yang dilaporkan',
                    evacuees: 'Pengungsi',
                    descEvacuees: 'Orang yang dievakuasi dari daerah terdampak',
                    casualties: 'Korban',
                    descCasualties: 'Korban jiwa dan luka yang dilaporkan',
                    damagedInfra: 'Infrastruktur Rusak',
                    descDamagedInfra: 'Unit infrastruktur yang terdampak',
                    affectedAreas: 'Daerah Terpengaruh',
                    descAffectedAreas: 'Daerah geografis yang terdampak',
                    preparedness: 'Tingkat Kesiapsiagaan',
                    descPreparedness: 'Persentase kesiapsiagaan masyarakat'
                },
                charts: {
                    trendTitle: 'Tren Insiden',
                    trendSubtitle: 'Pola insiden bulanan',
                    incidents: 'Insiden',
                    severity: 'Tingkat Keparahan',
                    distributionTitle: 'Distribusi Bencana',
                    distributionSubtitle: 'Jenis bencana yang dilaporkan'
                },
                aiInsights: {
                    title: 'Wawasan Bertenaga AI',
                    subtitle: 'Analitik dan prediksi canggih',
                    poweredBy: 'Didukung oleh Gemini AI',
                    cards: {
                        trend: {
                            title: 'Analisis Tren',
                            desc: 'Tren insiden dari waktu ke waktu',
                            tag: 'Analitik'
                        },
                        risk: {
                            title: 'Penilaian Risiko',
                            desc: 'Zona berisiko tinggi teridentifikasi',
                            tag: 'Risiko'
                        },
                        education: {
                            title: 'Dampak Pendidikan',
                            desc: 'Fasilitas pendidikan terpengaruh',
                            tag: 'Pendidikan'
                        },
                        integration: {
                            title: 'Integrasi Sistem',
                            desc: 'Efisiensi integrasi data',
                            tag: 'Integrasi'
                        }
                    },
                    buttons: {
                        analyze: 'Analisis Data',
                        export: 'Ekspor Laporan'
                    }
                }
            },
            types: {
                flood: 'Banjir',
                earthquake: 'Gempa Bumi',
                landslide: 'Tanah Longsor',
                tsunami: 'Tsunami',
                other: 'Lainnya'
            }
        },
        charts: {
            mostVulnerable: 'Most Vulnerable Locations',
            floodTrend: 'Flood Incident Trend',
            reportComposition: 'Report Composition',
            dailyResolved: 'Daily Reports & Resolved',
            noData: 'No data available for this chart.',
            reports: 'Reports',
            resolved: 'Resolved',
            total: 'Total Reports'
        },
        filter: {
            searchPlaceholder: 'Search location or description...',
            export: 'Export Data',
            filter: 'Filter',
            allLevels: 'All Levels',
            low: 'Ankle Deep',
            medium: 'Knee Deep/Thigh Deep',
            high: 'Waist Deep/More',
            timeRange: {
                h24: '24 Hours',
                d7: '7 Days',
                d30: '30 Days',
                d90: '90 Days'
            }
        },
        reports: {
            title: 'Latest Flood Reports',
            showing: 'Showing',
            of: 'of',
            reports: 'reports',
            viewMore: 'View More',
            moreReports: 'more reports',
            noData: 'No Data',
            noDataDesc: 'No flood reports match the filter',
            location: 'Location',
            time: 'Time',
            reporter: 'Reporter'
        },
        weather: {
            title: 'Current Weather',
            subtitle: 'Real-time weather conditions',
            loading: 'Loading weather data...',
            error: 'Failed to load weather: ',
            unavailable: 'Weather data not available.',
            humidity: 'Humidity',
            wind: 'Wind',
            pressure: 'Pressure',
            visibility: 'Visibility',
            sunrise: 'Sunrise',
            sunset: 'Sunset'
        },
        actions: {
            title: 'Quick Actions',
            scheduleReport: 'Schedule Report',
            alertSettings: 'Notification Settings',
            currentWeather: 'Current Weather'
        },
        modals: {
            schedule: {
                title: 'Schedule Report',
                emailLabel: 'Recipient Email',
                frequencyLabel: 'Frequency',
                daily: 'Daily',
                weekly: 'Weekly',
                monthly: 'Monthly',
                cancel: 'Cancel',
                submit: 'Schedule',
                success: 'Report schedule set for {email} with frequency {frequency}. (Simulation)'
            },
            alert: {
                title: 'Notification Settings',
                thresholdLabel: 'Alert Threshold',
                methodLabel: 'Notification Method',
                email: 'Email',
                sms: 'SMS (Simulation)',
                save: 'Save',
                cancel: 'Cancel',
                success: "Notification settings: Alert threshold '{threshold}' with method '{method}'. (Simulation)"
            },
            weather: {
                title: 'Current Weather',
                close: 'Close',
                geolocationError: 'Failed to get your location. Please ensure GPS is enabled and location permission is granted.',
                geolocationUnsupported: 'Geolocation is not supported by your browser.'
            }
        },
    },
    evacuationInfo: {
        title: 'Evacuation Location Information',
        subtitle: 'Find the nearest safe place',
        stats: {
            totalLocations: 'Total Locations',
            remainingCapacity: 'Remaining Capacity',
            almostFull: 'Almost Full',
            liveUpdate: 'Real-time Update'
        },
        map: {
            title: 'Evacuation Location Map',
            viewDetail: 'View Details'
        },
        list: {
            title: 'Location List',
            legendTitle: 'Capacity Status Legend:',
            legendAvailable: 'Available (below 70%)',
            legendAlmostFull: 'Almost Full (70% - 99%)',
            legendFull: 'Full (100%)',
            noData: 'No evacuation locations available.'
        },
        status: {
            open: 'Open',
            closed: 'Closed',
            full: 'Full',
            available: 'Available',
            almostFull: 'Almost Full',
            na: 'N/A'
        },
        details: {
            operationalStatus: 'Operational Status',
            capacity: 'Capacity',
            filled: 'Filled',
            essentialServices: 'Essential Services',
            facilities: 'Other Facilities',
            contactInfo: 'Contact Information',
            contactPerson: 'Contact Person',
            phone: 'Phone',
            lastUpdated: 'Last Updated',
            verifiedBy: 'Verified By',
            navigate: 'Navigate to Location'
        },
        loading: {
            title: 'Loading evacuation locations...',
            subtitle: 'Please wait a moment'
        },
        error: {
            title: 'Failed to Load Data',
            retry: 'Please try again later'
        }
    },
    statistika: {
        title: 'Statistics Dashboard',
        tabs: {
            overview: 'Overview',
            historical: 'History'
        },
        filters: {
            button: 'Filter',
            startDate: 'Start Date',
            endDate: 'End Date'
        },
        overview: {
            title: 'Statistics Dashboard',
            subtitle: 'Monitoring and analysis of regional disaster data',
            realTime: 'Real-time Data',
            stats: {
                totalIncidents: 'Total Incidents',
                descTotalIncidents: 'Recorded incidents',
                evacuees: 'Evacuees',
                descEvacuees: 'People evacuated',
                casualties: 'Casualties',
                descCasualties: 'Total deaths',
                damagedInfra: 'Damaged Infrastructure',
                descDamagedInfra: 'Buildings & facilities',
                affectedAreas: 'Affected Areas',
                descAffectedAreas: 'Counties/Cities',
                preparedness: 'Preparedness Level',
                descPreparedness: 'National score'
            },
            charts: {
                trendTitle: 'Monthly Incident Trends',
                trendSubtitle: 'Analysis of data movement over monthly periods',
                distributionTitle: 'Type Distribution',
                distributionSubtitle: 'Disaster incident categorization',
                incidents: 'Number of Incidents',
                severity: 'Severity Level'
            },
            aiInsights: {
                title: 'AI Insights & Recommendations',
                subtitle: 'Intelligent analysis based on machine learning',
                poweredBy: 'AI Powered',
                cards: {
                    trend: {
                        title: 'Incident Increase Trend',
                        desc: 'Data shows an increase in incidents during certain months. Consider increasing preparedness during those periods.',
                        tag: 'High Priority'
                    },
                    risk: {
                        title: 'High-Risk Areas',
                        desc: 'Identify locations with the highest incident frequency to focus on mitigation and resilient infrastructure development.',
                        tag: 'Under Monitoring'
                    },
                    education: {
                        title: 'Community Education',
                        desc: 'Incidents with high casualties or evacuees indicate the need for more intensive education and evacuation drills.',
                        tag: 'Action Needed'
                    },
                    integration: {
                        title: 'Data Integration',
                        desc: 'Consider integrating data from other sources (e.g., USGS, demographic data) for more comprehensive analysis.',
                        tag: 'In Progress'
                    }
                },
                buttons: {
                    analyze: 'View Analysis Details',
                    analyzing: 'Analyzing...',
                    export: 'Export AI Report',
                    exporting: 'Exporting...'
                },
                resultTitle: 'AI Analysis Results'
            }
        },
        historical: {
            title: 'Incident History',
            found: 'incidents found',
            searchPlaceholder: 'Search location, incident type...',
            sort: {
                date: 'Date',
                severity: 'Severity',
                type: 'Type'
            },
            noData: {
                title: 'No Incidents Found',
                desc: 'No incident data matches your search criteria. Try changing the filters or search keywords.'
            },
            card: {
                level: 'Level',
                evacuees: 'Evacuees',
                at: 'at'
            }
        },
        gemini: {
            welcome: '👋 Welcome to RisqMap Assistant!\n\nI can help you analyze:\n• Real-time flood status\n• Weather and risk predictions\n• Emergency action recommendations\n• Affected area information\n\nDo you have any questions?',            
            suggestions: {
                floodStatus: 'My area flood status',
                weather: 'Today\'s weather forecast',
                risk: 'Flood risk level',
                evacuation: 'Evacuation recommendations',
                trend: '5-day trend analysis',
                pumps: 'Pump station conditions',
                quickAction: 'QUICK ACTION'
            },
            inputPlaceholder: 'Ask about flood conditions, weather, or evacuation...',
            systemInfo: 'Connected to RisqMap system',
            analyzing: 'Analyzing system data...',
            locationRequest: 'To provide accurate information, I need permission to access your location. Please approve the location request that appears in your browser.',
            locationSuccess: 'Your location was successfully obtained (Lat: {lat}, Lon: {lon}). Analyzing data...',
            locationError: 'Failed to get location. I cannot provide specific information without location permission. You can try asking by specifying the name of the area (e.g., "flood in Miami").',
            error: 'An error occurred while analyzing: {message}'
        },
        types: {
            flood: 'Flood',
            landslide: 'Landslide',
            tsunami: 'Tsunami',
            earthquake: 'Earthquake',
            other: 'Other'
        }
    },
    currentWeather: {
        button: 'Current Weather',
        title: 'Current Weather',
        description: 'Latest weather information based on your location.',
        loading: 'Loading weather data...',
        error: 'Failed to load weather: {error}',
        unavailable: 'Weather data is not available.',
        location: 'Location: {name}',
        humidity: 'Humidity',
        wind: 'Wind',
        pressure: 'Pressure',
        visibility: 'Visibility',
        sunrise: 'Sunrise',
        sunset: 'Sunset',
        reload: 'to reload data',
        feelsLike: 'Feels Like',
        oops: 'Oops Something Went Wrong',
        retry: 'Retry',
        currentTemp: 'Current Temperature',
    },
    settings: {
        title: 'Settings',
        subtitle: 'Personalize your RisqMap experience',
        defaultLocation: {
            title: 'Set Default Location',
            description: 'Choose the default location to load when the app starts.',
            saved: 'Saved: {location}'
        },
        favoriteLocations: {
            title: 'Favorite Locations',
            description: 'Add your favorite locations for quick access.',
            placeholder: 'Location Name (e.g., Home, Office)',
            addButton: 'Add Favorite Location',
            load: 'Load Location'
        },
        appearance: {
            title: 'Appearance',
            darkMode: 'Dark Mode',
            darkModeDesc: 'Customize the app appearance',
            highContrast: 'High Contrast Mode',
            highContrastDesc: 'Enhance color contrast'
        },
        accessibility: {
            title: 'Accessibility',
            fontSize: 'Font Size',
            fontSizeDesc: 'Adjust text size',
            sizes: {
                small: 'Small',
                normal: 'Normal',
                large: 'Large'
            },
            reduceMotion: 'Reduce Motion',
            reduceMotionDesc: 'Reduce animations and effects'
        },
        map: {
            title: 'Map Settings',
            clustering: 'Marker Clustering',
            clusteringDesc: 'Group flood markers'
        },
        data: {
            title: 'Data & Synchronization',
            updateInterval: 'Update Interval',
            updateIntervalDesc: 'Set update frequency',
            intervals: {
                min15: '15 Minutes',
                min30: '30 Minutes',
                hour1: '1 Hour',
                onOpen: 'On Open'
            },
            wifiOnly: 'Wi-Fi Only',
            wifiOnlyDesc: 'Save mobile data',
            offlineMode: 'Offline Mode',
            offlineModeDesc: 'Access data without internet'
        },
        notifications: {
            title: 'Notification Preferences',
            description: 'Select the types of alerts you want to see on the dashboard.',
            levels: {
                danger: 'Danger (Alert 1 & 2)',
                warning: 'Warning (Alert 3)',
                info: 'Information'
            },
            sound: 'Notification Sound',
            soundDesc: 'Enable sound for notifications'
        },
        loading: 'Loading settings...'
    }
};

export default id;
