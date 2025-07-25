# BriefCam Log Collection

A React-based log collection tool for BriefCam systems, built with TypeScript and Vite.

## Features

- **Service Selection**: Choose from multiple BriefCam services for log collection
- **Time Range Configuration**: Set custom date ranges for log collection
- **Output Location**: Specify where collected logs should be saved
- **AI Analysis**: Advanced AI-powered analysis of collected logs
- **Real-time Progress**: Monitor collection progress with visual indicators
- **Interactive Results**: View and interact with collected log data

## Technology Stack

- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **ESLint** for code quality

## Development

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

```bash
npm install
```

### Development Server

```bash
npm run dev
```

Visit `http://localhost:5173` to view the application.

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
src/
├── components/          # React components
│   ├── BriefCamLogo.tsx    # Custom BriefCam logo
│   ├── ServiceSelector.tsx # Service selection interface
│   ├── TimeRangeSelector.tsx # Date/time range picker
│   ├── OutputLocation.tsx   # Output path configuration
│   ├── CollectionProgress.tsx # Progress monitoring
│   ├── CollectionResults.tsx  # Results display
│   └── AIAnalysis.tsx      # AI analysis interface
├── hooks/              # Custom React hooks
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
└── assets/             # Static assets
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is part of the BriefCam ecosystem.
