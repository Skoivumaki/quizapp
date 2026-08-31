# Quiz App

A free music guessing game powered by your Spotify playlists. Turn any playlist into an interactive quiz, challenge friends, and test your music knowledge.

![Quiz App Preview](public/view.png)

## Features

- **Playlist Powered** – Use your own Spotify playlist to generate a quiz.
- **Multiple Game Modes** – Guess the song of one playlist or blend multiple into one.
- **Customizable Experience** – Adjust how long the song is played, how many tracks to include, where the track starts or have it be completly random.
- **Competitive Scoring** – Real-time score tracking – add your participants mid-game.
- **Built for Friends** – Perfect for parties and "sober" nights.

## Tech Stack

- [Next.js 15](https://nextjs.org/) (App Router)
- [Spotify Web API](https://developer.spotify.com/documentation/web-api)

## Getting Started

### Prerequisites

- **Node.js 20+** (for local npm development)
- **npm**
- **Spotify Premium** – needed to use the app
- **Spotify Developer Account** – needed to obtain API credentials
- **Docker** (optional, for containerized deployment)

### Environment Variables

Create a `.env.local` file for local development or `.env.production` for Docker production. The following variables are required:

| Variable                | Description                                      | Example                                   |
| ----------------------- | ------------------------------------------------ | ----------------------------------------- |
| `SPOTIFY_CLIENT_ID`     | Your Spotify application client ID               | `your_spotify_client_id`                  |
| `SPOTIFY_CLIENT_SECRET` | Your Spotify application client secret           | `your_spotify_client_secret`              |
| `SPOTIFY_REDIRECT_URI`  | Callback URL after Spotify authentication       | `http://localhost:3000/api/callback`      |
| `NEXT_PUBLIC_BASE_URL`  | Public base URL of your app (used in client)     | `http://localhost:3000`                   |
| `NEXT_PUBLIC_API_URI`   | Public API URI (if different from base URL)      | `https://api.example.com`                 |

For production, set `SPOTIFY_REDIRECT_URI` and `NEXT_PUBLIC_BASE_URL` to your domain (e.g., `https://quiz.example.com`).

---

## Local Development (npm)

1. **Clone the repository**

   ```bash
   git clone https://github.com/skoivumaki/quizapp.git
   cd quizapp
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   Create a `.env.local` file in the project root and fill in your Spotify credentials and URLs (see table above).

4. **Run the development server**

   ```bash
   npm run dev
   ```

   The app will be available at [http://localhost:3000](http://localhost:3000).

---

## Docker

### Production with Docker

The production setup uses `docker-compose.yml` and `Dockerfile`.
1. **Prepare environment variables**

   Create a `.env.production` file with your production values:

   ```env
   SPOTIFY_CLIENT_ID=your_spotify_client_id
   SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
   SPOTIFY_REDIRECT_URI=https://your-domain.com/api/callback
   NEXT_PUBLIC_BASE_URL=https://your-domain.com/
   NEXT_PUBLIC_API_URI=https://api.your-domain.com
   ```

2. **Ensure the external network exists**

   If you haven't already created the `proxy-network`, run:

   ```bash
   docker network create proxy-network
   ```

   Otherwise, modify `docker-compose.yml` to match your existing network name.

3. **Build and start the production container**

   ```bash
   docker-compose up -d --build
   ```

   The container will run the app on internal port **2999**. Your reverse proxy should forward requests to `quizapp:2999`. The healthcheck currently uses `http://localhost:3000` – you may need to adjust it to `http://localhost:2999` or change the internal port in the Dockerfile/compose file.

---

## Contributing

As of March 2026, this project has been released as **open source** due to changes in Spotify's developer platform. Contributions are welcome! Feel free to fork, open issues, suggest improvements, or submit pull requests.

## License

This project is licensed under the [MIT License]

## Acknowledgements

- Spotify for providing the Web API.
- The Next.js and React communities.