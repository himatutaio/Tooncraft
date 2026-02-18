# ToonCraft Studio - Basisschool Editie

Een Pixar-stijl video generator voor educatieve doeleinden in het basisonderwijs.

## 🚀 Setup Instructies

### 1. Google AI Studio API Key Verkrijgen

1. Ga naar [Google AI Studio](https://aistudio.google.com/apikey)
2. Log in met je Google account
3. Klik op **"Create API Key"**
4. Kopieer de gegenereerde API key

### 2. Installatie

```bash
# Clone de repository
git clone https://github.com/himatutaio/Tooncraft.git
cd Tooncraft

# Installeer dependencies
npm install

# Maak een .env bestand
cp .env.example .env
```

### 3. Configuratie

Open het `.env` bestand en voeg je API key toe:

```bash
VITE_GOOGLE_API_KEY=jouw_api_key_hier
```

### 4. Start de applicatie

```bash
npm run dev
```

De applicatie is nu beschikbaar op `http://localhost:3000`

## 💰 Kosten

⚠️ **Let op:** Deze applicatie gebruikt betaalde Google AI APIs:

- **Gemini 2.5 Flash (afbeeldingen)**: ~$0.00-0.10 per afbeelding
- **Veo 3.1 (video's)**: ~$0.10-1.00 per video
- **Gemini 3 Flash (tekst)**: Zeer goedkoop, ~$0.0001 per request

Controleer de actuele prijzen op [Google AI Pricing](https://ai.google.dev/pricing)

## 🔧 Technologieën

- React 19 + TypeScript
- Vite
- Google Gemini API (@google/genai)
- Tailwind CSS (styling via classes)
- Lucide React (icons)

## 📝 Licentie

Voor educatief gebruik in het basisonderwijs.

---

## Run Locally (English)

View your app in AI Studio: https://ai.studio/apps/drive/11kAEGj3V9XRWib1hE-OQzrs-kQA7a5b6

**Prerequisites:**  Node.js

1. Install dependencies:
   `npm install`
2. Set the `VITE_GOOGLE_API_KEY` in `.env` file to your Gemini API key
3. Run the app:
   `npm run dev`
