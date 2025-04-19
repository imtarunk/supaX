# SuperFi

Supercharge your crypto community with automated engagement tools.

## Prerequisites

- Node.js v22 or higher
- Bun v1.1.19 or higher
- Docker
- PostgreSQL database
- X (Twitter) Developer Account

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Database
DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DATABASE

# NextAuth
NEXTAUTH_URL=http://localhost:3000  # Change to https://supax.codextarun.xyz in production
NEXTAUTH_SECRET=your-secret-key

# X (Twitter) API
TWITTER_CLIENT_ID=your-client-id
TWITTER_CLIENT_SECRET=your-client-secret
TWITTER_API_KEY=your-api-key
TWITTER_API_SECRET=your-api-secret
TWITTER_ACCESS_TOKEN=your-access-token
TWITTER_ACCESS_TOKEN_SECRET=your-access-token-secret
```

## Local Development Setup

1. Clone the repository:

```bash
git clone [your-repository-url]
cd superfi
```

2. Install dependencies:

```bash
bun install
```

3. Generate Prisma client:

```bash
bunx prisma generate
```

4. Run the development server:

```bash
bun run dev
```

The application will be available at `http://localhost:3000`

## Docker Setup

1. Build the Docker image:

```bash
docker build -t imtarunk/supax:latest .
```

2. Run the container:

```bash
docker run -p 3000:3000 --env-file .env imtarunk/supax:latest
```

## X (Twitter) Developer Portal Setup

1. Go to [X Developer Portal](https://developer.twitter.com/en/portal/dashboard)
2. Create a new app or select your existing app
3. Set the callback URL:
   - For development: `http://localhost:3000/api/auth/callback/twitter`
   - For production: `https://supax.codextarun.xyz/api/auth/callback/twitter`
4. Copy the API keys and tokens to your `.env` file

## Database Setup

1. Set up a PostgreSQL database
2. Update the `DATABASE_URL` in your `.env` file
3. Run database migrations:

```bash
bunx prisma migrate dev
```

## Available Scripts

- `bun run dev` - Start development server
- `bun run build` - Build for production
- `bun run start` - Start production server
- `bun run lint` - Run ESLint
- `bun run dev:docker` - Start development server in Docker

## Project Structure

```
superfi/
├── src/
│   ├── app/              # Next.js app directory
│   ├── components/       # React components
│   ├── hooks/           # Custom React hooks
│   ├── lib/             # Utility functions
│   └── prisma/          # Database schema and migrations
├── public/              # Static assets
├── prisma/              # Prisma configuration
└── package.json         # Project dependencies
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
