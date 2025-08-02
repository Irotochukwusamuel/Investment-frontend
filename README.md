# Investment Platform Frontend

A modern React/Next.js frontend for the investment platform with comprehensive features including user authentication, wallet management, investments, and admin functionality.

## Features.

### Authentication & Security
- **Session Timeout**: Automatic logout after 30 minutes of inactivity
- **Session Warning**: 5-minute warning before session expiration with option to stay logged in
- **Secure Token Management**: JWT tokens with automatic refresh and cleanup
- **User Activity Tracking**: Monitors user interactions to reset session timers

### User Dashboard
- **Wallet Management**: View balances, deposit, and withdraw funds
- **Investment Plans**: Browse and invest in various investment opportunities
- **ROI Tracking**: Monitor investment returns and earnings
- **Referral System**: Earn rewards by referring other users
- **Profile Management**: Update personal information and settings

### Admin Panel
- **User Management**: View and manage all platform users
- **Investment Management**: Create and manage investment plans
- **Withdrawal Management**: Process and approve withdrawal requests
- **Platform Settings**: Configure fees, limits, and system settings
- **Analytics Dashboard**: View platform statistics and performance

## Session Timeout Configuration

The platform implements a comprehensive session timeout system:

- **Timeout Duration**: 30 minutes of inactivity
- **Warning Time**: 5 minutes before automatic logout
- **Activity Detection**: Monitors mouse, keyboard, touch, and scroll events
- **User Control**: Users can extend their session or logout immediately
- **Automatic Cleanup**: Clears all cached data and redirects to login

### Session Timeout Behavior

1. **Active Session**: Timer resets on any user interaction
2. **Warning Phase**: Shows countdown dialog 5 minutes before timeout
3. **User Options**: 
   - "Stay Logged In" - Extends session for another 30 minutes
   - "Logout Now" - Immediately logs out the user
4. **Automatic Logout**: Forces logout and redirects to login page

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Backend API running (see backend documentation)

### Installation

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local

# Start development server
npm run dev
```

### Environment Variables

Create a `.env.local` file with the following variables:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Development

### Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # Dashboard pages
│   └── layout.tsx         # Root layout
├── components/            # Reusable components
│   ├── ui/               # UI components
│   ├── admin/            # Admin-specific components
│   └── dashboard/        # Dashboard components
├── lib/                  # Utilities and configurations
│   ├── hooks/            # Custom React hooks
│   ├── api.ts            # API configuration
│   └── utils.ts          # Utility functions
└── types/                # TypeScript type definitions
```

### Key Components

- **SessionProvider**: Manages authentication state and session timeout
- **useAuth**: Main authentication hook with session management
- **useSessionTimeout**: Handles session timeout logic and warnings
- **SessionTimeoutWarning**: UI component for session warnings

## Security Features

- **Automatic Session Management**: Prevents indefinite login sessions
- **Activity Monitoring**: Tracks user interactions to prevent premature timeouts
- **Secure Token Storage**: Uses localStorage with automatic cleanup
- **API Interceptors**: Handles authentication errors and token refresh
- **Route Protection**: Guards protected routes from unauthorized access

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License. 