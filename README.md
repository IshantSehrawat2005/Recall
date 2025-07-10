# Recall - Learning Management System

A modern learning management system built with Next.js and Supabase.

## Environment Variables

To run this application, you need to set up the following environment variables:

1. Create a `.env.local` file in the root directory
2. Add the following variables:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Getting Supabase Credentials

1. Go to [Supabase](https://supabase.com) and create a new project
2. Navigate to Settings > API
3. Copy the Project URL and anon/public key
4. Add them to your `.env.local` file

## Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Deployment

This application is configured to work with Vercel deployment. Make sure to:

1. Set the environment variables in your Vercel project settings
2. The build process will handle dynamic rendering for pages that use Supabase

## Features

- User authentication with Supabase Auth
- Protected routes
- Dynamic page rendering
- Responsive design with Tailwind CSS
