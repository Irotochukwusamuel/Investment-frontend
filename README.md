# KLTMINES Investment Platform - Frontend

The frontend application built with Next.js 15, providing a modern and responsive user interface for the KLTMINES investment platform.

## 🚀 Tech Stack

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type safety and better development experience
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Accessible and customizable UI components
- **React Query (TanStack Query)** - Server state management
- **React Hook Form** - Form validation and handling
- **Framer Motion** - Smooth animations and transitions
- **Next Auth** - Authentication for Next.js
- **Recharts** - Chart and data visualization
- **Sonner** - Beautiful toast notifications

## 📁 Project Structure

```
frontend/
├── src/
│   ├── app/                 # Next.js App Router pages
│   ├── components/          # Reusable UI components
│   │   ├── ui/             # Base UI components (shadcn/ui)
│   │   ├── landing/        # Landing page components
│   │   ├── dashboard/      # Dashboard components
│   │   └── auth/           # Authentication components
│   ├── lib/                # Utility functions and configurations
│   ├── hooks/              # Custom React hooks
│   ├── types/              # TypeScript type definitions
│   └── styles/             # Global styles
├── public/                 # Static assets
├── package.json           # Dependencies and scripts
├── tsconfig.json          # TypeScript configuration
├── tailwind.config.ts     # Tailwind CSS configuration
├── next.config.ts         # Next.js configuration
└── README.md              # This file
```

## 🛠️ Development

### Prerequisites

- Node.js (>=18.0.0)
- PNPM (>=8.0.0)

### Installation

From the project root:
```bash
pnpm install
```

### Development Server

Start the development server:
```bash
pnpm dev:frontend
```

The application will be available at `http://localhost:3000`.

### Building for Production

```bash
pnpm build:frontend
```

### Starting Production Server

```bash
pnpm start
```

## 🎨 UI Components

This project uses shadcn/ui components built on top of Radix UI. Components are located in `src/components/ui/` and can be customized via Tailwind CSS.

### Adding New Components

To add a new shadcn/ui component:
```bash
npx shadcn-ui@latest add [component-name]
```

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file in the frontend directory:

```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key
NEXT_PUBLIC_API_URL=http://localhost:5000
```

### API Configuration

The frontend communicates with the backend API. Configure the API base URL in `src/lib/api.ts`.

## 📱 Features

- **Responsive Design** - Mobile-first approach
- **Dark/Light Mode** - Theme switching
- **Authentication** - Secure user login/registration
- **Dashboard** - Investment portfolio management
- **Charts & Analytics** - Real-time data visualization
- **Payment Integration** - Multiple payment providers
- **Real-time Updates** - Socket.io integration
- **Form Validation** - Comprehensive form handling
- **Accessibility** - WCAG compliant components

## 🧪 Testing

```bash
# Run type checking
pnpm type-check

# Run linting
pnpm lint
```

## 🚀 Deployment

The frontend can be deployed to various platforms:

### Vercel (Recommended)
```bash
vercel --prod
```

### Netlify
```bash
npm run build
# Deploy the 'out' directory
```

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN pnpm install
COPY . .
RUN pnpm build
EXPOSE 3000
CMD ["pnpm", "start"]
```

## 📝 Development Guidelines

1. **Components**: Create reusable components in `src/components/`
2. **Pages**: Use App Router in `src/app/`
3. **Styles**: Use Tailwind CSS classes
4. **State Management**: Use React Query for server state
5. **Forms**: Use React Hook Form with Zod validation
6. **Icons**: Use Lucide React icons
7. **Animations**: Use Framer Motion sparingly

## 🤝 Contributing

1. Follow the existing code style
2. Write meaningful commit messages
3. Update documentation when needed
4. Test your changes thoroughly
5. Use TypeScript strictly

## 📄 License

This project is part of the KLTMINES Investment Platform and is proprietary software. 