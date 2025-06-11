# Supabase Setup Guide

## Environment Variables Setup

To properly configure Supabase with secure environment variables:

### 1. Create a `.env.local` file in your project root

```bash
# Create the environment file (this will be ignored by git)
touch .env.local
```

### 2. Add your Supabase configuration to `.env.local`

```env
# Your Supabase project URL
VITE_SUPABASE_URL=https://sltcpnmcznryuwjyextr.supabase.co

# Your Supabase anon key (the one you provided)
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNsdGNwbm1jem5yeXV3anlleHRyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk1MjU0MzYsImV4cCI6MjA2NTEwMTQzNn0.6Tk-DKJ2qH2kNrNUXzqmFbeaWh6tzy0Um0WDxKEVhpw
```

### 3. Restart your development server

```bash
npm run dev
```

## Page View Tracking

The app now includes automatic page view tracking that records user navigation through your National Park Ranker:

### Tracked Pages:

- `/landing` - When users first visit the app
- `/selection` - When users are selecting parks to rank
- `/ranking` - When users are comparing parks
- `/results` - When users view their final rankings

### Tracked Actions:

- `/action/start-ranking` - When users click "Start Ranking"
- `/action/complete-ranking` - When users finish their ranking

### Database Schema:

The tracking uses your existing `page_views` table with:

- `id` (uuid) - Auto-generated unique identifier
- `viewed_at` (timestamp) - When the page was viewed
- `path` (text) - The page/action identifier

### Analytics Component:

You can optionally add the Analytics component to any page to view statistics:

```tsx
import { Analytics } from "./components/Analytics";

// Add to any component
<Analytics />;
```

## Security Best Practices

### ✅ Safe Keys (Client-Side)

- **Anon Key**: Safe to expose in client-side code
- **URL**: Safe to expose in client-side code

### ❌ Dangerous Keys (Server-Side Only)

- **Service Role Key**: Never expose in client-side code!
- **Database Password**: Never expose anywhere!

## Key Types Explained

### Anon Key (Public)

- Used for client-side operations
- Has limited permissions based on your Row Level Security (RLS) policies
- Safe to include in your frontend bundle
- This is what you provided and what we're using

### Service Role Key (Private)

- Bypasses all RLS policies
- Should only be used in server-side code (API routes, serverless functions)
- Never include in client-side code
- Never commit to version control

## Environment File Security

### Why `.env.local`?

- Automatically ignored by git (see `.gitignore`)
- Loaded by Vite automatically
- Keeps sensitive data out of your repository

### Vite Environment Variables

- Must be prefixed with `VITE_` to be accessible in client-side code
- Vite will replace these at build time
- Still visible in the final bundle (which is why only public keys should be used)

## Testing the Connection

Once you've set up your `.env.local` file, you can test the connection by:

1. Starting your development server: `npm run dev`
2. The app will now use your environment variables
3. Check the browser console for any connection errors
4. Page views will be automatically tracked and logged to the console

## Deployment

For production deployment (Vercel, Netlify, etc.):

1. Add the same environment variables in your hosting platform's dashboard
2. Use the same variable names: `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
3. The build process will automatically use these values

## Row Level Security (RLS)

For production use, consider setting up RLS policies on your `page_views` table:

```sql
-- Enable RLS
ALTER TABLE page_views ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert page views (for anonymous tracking)
CREATE POLICY "Allow anonymous inserts" ON page_views
FOR INSERT TO anon
WITH CHECK (true);

-- Only allow reading your own data (if you add user authentication later)
CREATE POLICY "Users can read own data" ON page_views
FOR SELECT TO authenticated
USING (auth.uid() = user_id); -- if you add a user_id column later
```
