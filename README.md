# Video Stream Backend

This is a simple Node.js backend server for streaming `.mp4` video files using byte-range requests. It also provides APIs to retrieve video URLs dynamically. Useful for building frontend CCTV simulators or video playback applications.

## Features

- Stream `.mp4` videos with byte-range support (HTTP 206).
- List available video files with their streaming URLs.
- Retrieve a single video URL by ID.
- CORS-enabled for cross-origin requests.

## Requirements

- Node.js 18+
- A `videos/` folder in the project root containing `.mp4` files.

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/pradnyanandana/video-stream-backend.git
   cd video-stream-backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `videos` folder and add your `.mp4` video files:
   ```bash
   mkdir videos
   ```

4. Start the server:
   ```bash
   npm start
   ```

## API Endpoints

### `GET /video/:id`

Streams video content by ID with byte-range support.

**Headers required:**
- `Range`: e.g., `bytes=0-`

**Example:**
```
GET /video/1
Range: bytes=0-
```

---

### `GET /video-url/:id`

Returns the full streamable URL of the video with the given ID.

**Response:**
```json
{
  "url": "http://localhost:3000/video/1"
}
```

---

### `GET /video-urls`

Returns a list of all available video files and their streamable URLs.

**Response:**
```json
[
  {
    "id": "1",
    "url": "http://localhost:3000/video/1"
  },
  {
    "id": "2",
    "url": "http://localhost:3000/video/2"
  }
]
```

## Development

This project uses `nodemon` for auto-reloading during development. Run:

```bash
npm start
```

## License

ISC