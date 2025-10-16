# Deployment Guide: Using Local LLM with Vercel

This guide explains how to connect your Vercel-deployed application to your local Ollama LLM server.

## Quick Overview

Your app currently uses:
- **Gemini AI** for cloud-based generation (sermon generator, Bible question generator)
- **Local LLM** (Ollama) for theology assistant chat

When deploying to Vercel, you have several options to connect to your local LLM.

---

## Option 1: Cloudflare Tunnel (Recommended) ⭐

**Pros:**
- ✅ Free forever
- ✅ Secure and encrypted
- ✅ Persistent URLs
- ✅ Built-in DDoS protection
- ✅ No bandwidth limits

**Cons:**
- ⚠️ Requires keeping tunnel running on your machine
- ⚠️ Requires a domain (free via Cloudflare)

### Setup Steps

#### 1. Install Cloudflared

**macOS:**
```bash
brew install cloudflare/cloudflare/cloudflared
```

**Windows:**
Download from: https://github.com/cloudflare/cloudflared/releases

**Linux:**
```bash
wget https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64.deb
sudo dpkg -i cloudflared-linux-amd64.deb
```

#### 2. Authenticate with Cloudflare

```bash
cloudflared tunnel login
```

This opens a browser window to log into Cloudflare and authorize the tunnel.

#### 3. Create a Tunnel

```bash
cloudflared tunnel create ollama-llm
```

Save the **Tunnel ID** that appears (looks like: `a1b2c3d4-e5f6-7890-abcd-ef1234567890`)

#### 4. Create Configuration File

Create `~/.cloudflared/config.yml`:

```yaml
tunnel: <YOUR-TUNNEL-ID>  # Replace with your actual tunnel ID
credentials-file: /Users/<YOUR-USERNAME>/.cloudflared/<YOUR-TUNNEL-ID>.json

ingress:
  # Route for Ollama API
  - hostname: ollama.yourdomain.com  # Change to your domain
    service: http://localhost:11434
  # Catch-all rule (required)
  - service: http_status:404
```

#### 5. Configure DNS

```bash
cloudflared tunnel route dns ollama-llm ollama.yourdomain.com
```

Or manually add a CNAME record in Cloudflare dashboard:
- **Type:** CNAME
- **Name:** ollama
- **Target:** `<TUNNEL-ID>.cfargotunnel.com`

#### 6. Run the Tunnel

**Manual start:**
```bash
cloudflared tunnel run ollama-llm
```

**Or as a background service (macOS/Linux):**
```bash
sudo cloudflared service install
sudo systemctl start cloudflared
```

**Windows service:**
```bash
cloudflared service install
sc start cloudflared
```

#### 7. Update Vercel Environment Variables

In your Vercel dashboard:
1. Go to Project Settings → Environment Variables
2. Add:
   - **Key:** `OLLAMA_API_URL`
   - **Value:** `https://ollama.yourdomain.com`
3. Redeploy

---

## Option 2: ngrok (Easiest Setup)

**Pros:**
- ✅ Extremely easy to set up
- ✅ Works immediately
- ✅ No domain required
- ✅ Good for testing

**Cons:**
- ⚠️ Free tier: URL changes every restart
- ⚠️ Free tier: Limited bandwidth (1GB/month)
- ⚠️ Paid tier required for persistent URLs ($8/month)

### Setup Steps

#### 1. Install ngrok

**macOS:**
```bash
brew install ngrok/ngrok/ngrok
```

**Windows/Linux:**
Download from: https://ngrok.com/download

#### 2. Sign Up and Get Auth Token

1. Go to https://dashboard.ngrok.com/signup
2. Copy your authtoken from https://dashboard.ngrok.com/get-started/your-authtoken

#### 3. Add Auth Token

```bash
ngrok config add-authtoken <YOUR_AUTH_TOKEN>
```

#### 4. Start Tunnel

```bash
ngrok http 11434
```

You'll see output like:
```
Forwarding  https://1234-5678-90ab-cdef.ngrok-free.app -> http://localhost:11434
```

#### 5. Update Vercel Environment Variable

Copy the HTTPS forwarding URL and add to Vercel:
- **Key:** `OLLAMA_API_URL`
- **Value:** `https://1234-5678-90ab-cdef.ngrok-free.app`

⚠️ **Important:** This URL changes every time you restart ngrok (free tier).

#### 6. For Persistent URLs (Paid)

Upgrade to ngrok Pro and use:
```bash
ngrok http 11434 --domain=your-custom-domain.ngrok.app
```

---

## Option 3: Cloud-Hosted Ollama

**Pros:**
- ✅ Always available (24/7)
- ✅ No local machine dependency
- ✅ Scalable
- ✅ No tunneling complexity

**Cons:**
- ⚠️ Monthly cost (~$50-200/month depending on GPU)
- ⚠️ Requires server management

### Recommended Providers

#### Budget Option: Vast.ai
- **Cost:** ~$0.20/hour (~$150/month for 24/7)
- **GPU:** RTX 3090 or A100
- **Setup:** Docker-based, easy deployment

#### Mid-Range: RunPod
- **Cost:** ~$0.30/hour (~$220/month)
- **GPU:** RTX 4090, A40, A100
- **Setup:** One-click Ollama template

#### Enterprise: AWS/GCP/Azure
- **Cost:** $500-1000+/month
- **GPU:** NVIDIA T4, A10G, A100
- **Setup:** More complex, better reliability

### Deployment Steps

#### 1. Rent a GPU Server

**Example with Vast.ai:**

1. Sign up at https://vast.ai
2. Search for instance: `CUDA >= 12.0, GPU RAM >= 24GB`
3. Rent instance (select "SSH" access)

#### 2. SSH into Server

```bash
ssh -p PORT root@IP_ADDRESS
```

#### 3. Install Ollama

```bash
curl -fsSL https://ollama.com/install.sh | sh
```

#### 4. Pull Models

```bash
ollama pull llama3.3:latest
ollama pull deepseek-r1:32b
ollama pull qwen2.5v1:32b
# Pull all models you need
```

#### 5. Configure Firewall

```bash
# Allow port 11434
sudo ufw allow 11434/tcp
sudo ufw enable
```

#### 6. Start Ollama (Listen on all interfaces)

```bash
# Edit service file
sudo nano /etc/systemd/system/ollama.service

# Add this line under [Service]:
Environment="OLLAMA_HOST=0.0.0.0"

# Restart
sudo systemctl daemon-reload
sudo systemctl restart ollama
```

#### 7. Update Vercel Environment Variable

```bash
OLLAMA_API_URL=http://YOUR_SERVER_IP:11434
```

⚠️ **Security Note:** Use HTTPS reverse proxy (Nginx/Caddy) for production.

---

## Option 4: Hybrid Approach (Development vs Production)

Use different AI services based on environment.

### Implementation

Create `services/aiRouter.ts`:

```typescript
export const getAIServiceUrl = (): string => {
  // Check if running in production
  const isProduction = import.meta.env.PROD;

  // Check if OLLAMA_API_URL is configured
  const ollamaUrl = import.meta.env.VITE_OLLAMA_API_URL;

  if (ollamaUrl && !isProduction) {
    // Use local Ollama in development
    return ollamaUrl;
  } else {
    // Use Gemini in production or if Ollama not available
    return 'gemini';
  }
};

export const shouldUseLocalLLM = (): boolean => {
  return getAIServiceUrl() !== 'gemini';
};
```

Update `.env.local`:
```bash
VITE_OLLAMA_API_URL=http://localhost:11434
```

In Vercel, don't set `VITE_OLLAMA_API_URL` → will use Gemini automatically.

---

## Recommended Setup for Your Use Case

Based on your application, I recommend:

### For Development & Testing
- **Use ngrok** for quick testing
- Keep local Ollama running

### For Production Deployment
Choose based on budget:

1. **Budget-Conscious:** Cloudflare Tunnel (Free)
   - Keep your computer running 24/7 OR
   - Run tunnel on a cheap VPS ($5/month DigitalOcean)

2. **Best Performance:** Cloud-Hosted Ollama
   - Vast.ai for budget (~$150/month)
   - RunPod for reliability (~$220/month)

3. **Simplest:** Hybrid Approach
   - Use Gemini for production (pays per use)
   - Use Ollama for local development

---

## Security Considerations

### 1. API Authentication

Add authentication to your local LLM endpoint:

```typescript
// services/ollamaClient.ts
const OLLAMA_API_KEY = import.meta.env.VITE_OLLAMA_API_KEY;

export const callOllama = async (model: string, prompt: string) => {
  const response = await fetch(`${OLLAMA_API_URL}/api/generate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${OLLAMA_API_KEY}`,  // Add auth
    },
    body: JSON.stringify({ model, prompt }),
  });
  return response.json();
};
```

### 2. Rate Limiting

Implement rate limiting to prevent abuse:

```typescript
// Use Vercel Edge Config or Upstash Redis
import { Ratelimit } from "@upstash/ratelimit";
import { kv } from "@vercel/kv";

const ratelimit = new Ratelimit({
  redis: kv,
  limiter: Ratelimit.slidingWindow(10, "1 m"), // 10 requests per minute
});

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for") ?? "127.0.0.1";
  const { success } = await ratelimit.limit(ip);

  if (!success) {
    return new Response("Too Many Requests", { status: 429 });
  }

  // Process request...
}
```

### 3. CORS Configuration

If using tunnels, configure CORS properly:

```typescript
// In your Ollama server or proxy
const headers = {
  'Access-Control-Allow-Origin': 'https://your-vercel-app.vercel.app',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};
```

---

## Testing Your Setup

### 1. Test Tunnel Connection

```bash
curl https://your-tunnel-url.com/api/tags
```

Should return list of available models.

### 2. Test from Vercel

Add a test endpoint in your app:

```typescript
// pages/api/test-ollama.ts
export default async function handler(req, res) {
  try {
    const response = await fetch(`${process.env.OLLAMA_API_URL}/api/tags`);
    const data = await response.json();
    res.status(200).json({ success: true, models: data.models });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}
```

Visit: `https://your-app.vercel.app/api/test-ollama`

---

## Troubleshooting

### Issue: "Failed to fetch" error

**Solution:**
1. Check if tunnel is running: `cloudflared tunnel info`
2. Verify Ollama is running: `ollama list`
3. Check firewall settings
4. Verify CORS headers

### Issue: Slow response times

**Solution:**
1. Use cloud-hosted Ollama closer to Vercel regions
2. Reduce model size (use quantized models)
3. Enable streaming responses

### Issue: Tunnel disconnects frequently

**Solution:**
1. Use Cloudflare Tunnel instead of ngrok
2. Set up as systemd service for auto-restart
3. Use cloud-hosted solution for production

---

## Next Steps

1. Choose your preferred deployment option
2. Follow the setup steps above
3. Update environment variables in Vercel
4. Test the connection
5. Deploy and monitor

---

## Additional Resources

- [Cloudflare Tunnel Docs](https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/)
- [ngrok Documentation](https://ngrok.com/docs)
- [Ollama Documentation](https://github.com/ollama/ollama/blob/main/docs/README.md)
- [Vercel Environment Variables](https://vercel.com/docs/projects/environment-variables)

---

**Need Help?** Create an issue in the repository with your specific setup and error messages.
