# UGC Hook Generator

An AI-powered web application that helps UGC (User-Generated Content) creators generate scroll-stopping hooks and complete scripts for their social media ads using Claude AI.

## Features

- **5 Creative Angles**: Problem-Focused, Benefit-Focused, Curiosity, Objection-Handling, Comparison
- **Instant Hook Generation**: Get 8 tailored hooks per angle in seconds
- **Full Script Creation**: Generate complete 15-30 second scripts from hooks
- **Save Favorites**: Bookmark your best hooks for later use
- **Generation History**: Track all previous products you've worked on
- **Dark Mode**: Eye-friendly interface with persistent theme preference
- **Local Storage**: All data saved in browser (no account needed)
- **Delete Management**: Remove individual items or bulk delete with checkboxes

## Tech Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Backend**: Node.js, Express.js
- **AI**: Anthropic Claude API (claude-opus-4-6)
- **Deployment**: Firebase Hosting + Google Cloud Run

## Getting Started

### Prerequisites
- Node.js (v16+)
- npm
- Anthropic API key (get free credits at https://console.anthropic.com)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/YOUR_USERNAME/ugc-hook-generator.git
cd ugc-hook-generator
```

2. **Install dependencies**
```bash
npm install express dotenv @anthropic-ai/sdk cors
```

3. **Create .env file**
```bash
echo "ANTHROPIC_API_KEY=your_key_here" > .env
```

4. **Start the server**
```bash
node server.js
```

5. **Open in browser**
Visit `http://localhost:3000`

## Project Structure

```
ugc-hook-generator/
├── server.js              # Express backend with Claude API integration
├── package.json           # Dependencies
├── .env                   # API keys (not committed)
├── .gitignore            # Git ignore rules
├── README.md             # This file
└── public/
    └── index.html        # Frontend with retro design
```

## How It Works

1. **Enter Product Details** — Name, description, and target audience
2. **Generate Angles** — AI creates 5 creative hook angles with samples
3. **Select Angle** — Choose your preferred creative approach
4. **Get Hooks** — Receive 8 scroll-stopping hooks for that angle
5. **Generate Script** — Create a complete 15-30 second UGC script
6. **Save & Track** — Bookmark hooks and view generation history

## Hook Angles Explained

- **Problem-Focused**: Starts with a relatable pain point ("I was wasting time until...")
- **Benefit-Focused**: Highlights transformation ("This gave me back 3 hours weekly")
- **Curiosity**: Creates intrigue ("Wait, how does this work?")
- **Objection-Handling**: Addresses doubts ("I was skeptical at first...")
- **Comparison**: Compares to alternatives ("Better than the $200 version")

## API Endpoints

### POST `/api/angle-samples`
Generate one sample hook for each of the 5 angles.

**Request:**
```json
{
  "productName": "FlowState",
  "productDescription": "A pomodoro timer app...",
  "targetAudience": "Remote workers"
}
```

**Response:**
```json
{
  "angles": {
    "problemFocused": "I was burning out until...",
    "benefitFocused": "This helped me focus 3x better",
    ...
  }
}
```

### POST `/api/generate-hooks`
Generate 8 hooks for a selected angle.

**Request:**
```json
{
  "productName": "FlowState",
  "productDescription": "...",
  "targetAudience": "...",
  "angle": "problemFocused"
}
```

**Response:**
```json
{
  "hooks": [
    "I was burning out working 12-hour days...",
    "Nobody talks about productivity burnout...",
    ...
  ]
}
```

### POST `/api/generate-script`
Generate a complete UGC script from a hook.

**Request:**
```json
{
  "hook": "I was burning out working 12-hour days...",
  "productName": "FlowState",
  "productDescription": "...",
  "targetAudience": "..."
}
```

**Response:**
```json
{
  "script": "HOOK (0-3 sec): I was burning out...\nPROBLEM (3-8 sec): Long hours destroy..."
}
```

## Deployment

### Deploy to Firebase Hosting + Cloud Run

1. **Install Firebase CLI**
```bash
npm install -g firebase-tools
firebase login
```

2. **Initialize Firebase**
```bash
firebase init
```

3. **Deploy**
```bash
firebase deploy
```

Your app will be live at `https://your-project.firebaseapp.com`

## Features Roadmap

- [ ] Platform-specific hooks (TikTok vs Instagram)
- [ ] Hook performance tracking
- [ ] Batch script export (PDF/CSV)
- [ ] Multiple product comparison
- [ ] Team collaboration features
- [ ] Analytics dashboard

## Learning Outcomes

This project demonstrates:
- ✅ Full-stack web development
- ✅ API integration (Anthropic Claude)
- ✅ Real-world problem solving
- ✅ Responsive UI design
- ✅ State management with localStorage
- ✅ Error handling and user feedback
- ✅ Production-ready code organization

## License

MIT — Feel free to use for your portfolio

## Author

Created by [Your Name] as a demonstration of full-stack development with AI integration.

## Support

For issues or questions, please open an issue on GitHub.
