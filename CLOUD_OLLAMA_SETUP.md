# Cloud Ollama Setup Guide

Complete step-by-step guide to deploy Ollama on cloud GPU servers for production use with your Vercel deployment.

## 📊 Provider Comparison

| Provider | Cost/Month | GPU Options | Setup Difficulty | Reliability | Best For |
|----------|------------|-------------|------------------|-------------|----------|
| **Vast.ai** | ~$150 | RTX 3090, A100 | Easy | Medium | Budget-conscious |
| **RunPod** | ~$220 | RTX 4090, A40, A100 | Very Easy | High | Best balance |
| **Lambda Labs** | ~$350 | A100, A10 | Easy | Very High | Enterprise |
| **AWS/GCP** | $500+ | T4, A10G, A100 | Complex | Highest | Large scale |

**Recommendation:** Start with **RunPod** for the best balance of ease, reliability, and cost.

---

## Option 1: RunPod (Recommended) ⭐

RunPod offers the easiest setup with one-click Ollama templates.

### Step 1: Sign Up

1. Go to https://www.runpod.io
2. Sign up with email or GitHub
3. Add credits (minimum $10, no monthly commitment)

### Step 2: Deploy Ollama Pod

1. Click **"Deploy"** in the dashboard
2. Select **"GPU Cloud"** (not Serverless)
3. Choose GPU:
   - **RTX 4090** (24GB VRAM) - $0.34/hr (~$245/month) - Best for most models
   - **RTX A5000** (24GB VRAM) - $0.29/hr (~$210/month) - Good balance
   - **RTX 3090** (24GB VRAM) - $0.24/hr (~$173/month) - Budget option

4. **Template Selection:**
   - Search for "Ollama" in the template marketplace
   - Select **"Ollama Server"** template (official)
   - Or select **"RunPod PyTorch"** and install manually

5. **Configuration:**
   - **Container Disk:** 50GB minimum (for models)
   - **Volume Disk:** 100GB (optional, for persistent storage)
   - **Expose HTTP Ports:** `11434, 22` (Ollama and SSH)
   - **Environment Variables:** (leave default)

6. Click **"Deploy On-Demand"**

### Step 3: Access Your Pod

1. Wait for pod to start (shows green "Running" status)
2. Note the **Connection Details:**
   - **IP Address:** e.g., `123.45.67.89`
   - **SSH Port:** e.g., `12345`
   - **HTTP Port:** e.g., `11434 → 54321` (external port)

3. **Connect via SSH:**
```bash
ssh root@123.45.67.89 -p 12345
# Default password: usually shown in pod details
```

### Step 4: Install/Verify Ollama

If using Ollama template, skip to Step 5. Otherwise:

```bash
# Install Ollama
curl -fsSL https://ollama.com/install.sh | sh

# Start Ollama service
systemctl start ollama
systemctl enable ollama

# Verify installation
ollama --version
```

### Step 5: Pull Your Models

```bash
# Pull the models you need
ollama pull llama3.3:latest        # 42GB
ollama pull deepseek-r1:32b        # 19GB
ollama pull qwen2.5v1:32b          # 32GB
ollama pull llava:34b              # 20GB
ollama pull qwq:latest             # 19GB

# List installed models
ollama list
```

**Note:** With 24GB VRAM, you can run models up to ~32B parameters efficiently.

### Step 6: Configure Ollama for External Access

```bash
# Edit Ollama service to listen on all interfaces
sudo nano /etc/systemd/system/ollama.service

# Find [Service] section and add:
Environment="OLLAMA_HOST=0.0.0.0:11434"

# Save and exit (Ctrl+X, Y, Enter)

# Reload and restart
sudo systemctl daemon-reload
sudo systemctl restart ollama

# Verify it's listening
curl http://localhost:11434/api/tags
```

### Step 7: Test External Access

From your local machine:

```bash
# Replace with your pod's HTTP endpoint
curl http://123.45.67.89:54321/api/tags
```

Should return JSON with available models.

### Step 8: Configure Vercel Environment Variable

1. Go to Vercel dashboard → Your Project → Settings → Environment Variables
2. Add new variable:
   - **Key:** `VITE_OLLAMA_API_URL`
   - **Value:** `http://123.45.67.89:54321` (your pod's HTTP endpoint)
   - **Environment:** Production, Preview, Development
3. Save

### Step 9: Secure Your Setup (Important!)

#### Option A: Use RunPod's Authentication (Easiest)

RunPod provides built-in authentication via their proxy. No additional setup needed!

#### Option B: Add HTTPS with Caddy (Recommended for production)

```bash
# Install Caddy
apt update
apt install -y debian-keyring debian-archive-keyring apt-transport-https
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' | tee /etc/apt/sources.list.d/caddy-stable.list
apt update
apt install caddy

# Create Caddyfile
nano /etc/caddy/Caddyfile

# Add this configuration:
:443 {
    reverse_proxy localhost:11434

    # Basic auth (optional but recommended)
    basicauth {
        admin $2a$14$YOUR_BCRYPT_HASH
    }
}

# Generate password hash
caddy hash-password

# Restart Caddy
systemctl restart caddy
```

Now use `https://123.45.67.89` instead of HTTP.

---

## Option 2: Vast.ai (Budget Option)

### Step 1: Sign Up

1. Go to https://vast.ai
2. Sign up and add credits ($10 minimum)

### Step 2: Search for Instance

1. Click **"Search"** in the top menu
2. Filter by:
   - **GPU:** RTX 3090, RTX 4090, or A100
   - **VRAM:** ≥ 24GB
   - **CUDA Version:** ≥ 12.0
   - **Disk Space:** ≥ 100GB
3. Sort by **"$/hour"** (lowest first)

### Step 3: Rent Instance

1. Click **"Rent"** on a suitable instance
2. Configuration:
   - **Image:** Select "pytorch/pytorch:latest" or "ubuntu:22.04"
   - **Disk Space:** 100GB+
   - **Open Ports:** `11434, 22`
3. Click **"Rent"**

### Step 4: Connect via SSH

```bash
ssh -p PORT_NUMBER root@IP_ADDRESS
# Password will be shown in instance details
```

### Step 5: Install Ollama

```bash
# Update system
apt update && apt upgrade -y

# Install Ollama
curl -fsSL https://ollama.com/install.sh | sh

# Start service
systemctl start ollama
systemctl enable ollama

# Configure for external access
mkdir -p /etc/systemd/system/ollama.service.d
cat > /etc/systemd/system/ollama.service.d/override.conf <<EOF
[Service]
Environment="OLLAMA_HOST=0.0.0.0:11434"
EOF

# Reload and restart
systemctl daemon-reload
systemctl restart ollama
```

### Step 6: Pull Models

```bash
ollama pull llama3.3:latest
ollama pull deepseek-r1:32b
ollama pull qwen2.5v1:32b
ollama list
```

### Step 7: Configure Firewall

```bash
# Allow Ollama port
ufw allow 11434/tcp
ufw allow 22/tcp
ufw enable
```

### Step 8: Update Vercel

Add to Vercel environment variables:
```
VITE_OLLAMA_API_URL=http://YOUR_VAST_IP:11434
```

---

## Option 3: AWS EC2 with GPU

For enterprise-grade reliability.

### Step 1: Launch EC2 Instance

1. Go to AWS Console → EC2 → Launch Instance
2. Select:
   - **AMI:** Deep Learning AMI (Ubuntu)
   - **Instance Type:** g4dn.xlarge (T4, 16GB) or g5.xlarge (A10G, 24GB)
   - **Storage:** 200GB EBS
3. **Security Group:**
   - Allow SSH (22) from your IP
   - Allow Custom TCP (11434) from anywhere (or restrict to Vercel IPs)

### Step 2: Connect

```bash
ssh -i your-key.pem ubuntu@ec2-instance-ip
```

### Step 3: Install Ollama

```bash
# Install Ollama
curl -fsSL https://ollama.com/install.sh | sh

# Configure
sudo mkdir -p /etc/systemd/system/ollama.service.d
sudo tee /etc/systemd/system/ollama.service.d/override.conf > /dev/null <<EOF
[Service]
Environment="OLLAMA_HOST=0.0.0.0:11434"
EOF

# Start service
sudo systemctl daemon-reload
sudo systemctl restart ollama
sudo systemctl enable ollama
```

### Step 4: Pull Models

```bash
ollama pull llama3.3:latest
ollama pull deepseek-r1:32b
```

### Step 5: Configure Elastic IP (Optional but Recommended)

1. AWS Console → EC2 → Elastic IPs → Allocate
2. Associate with your instance
3. This gives you a permanent IP address

### Step 6: Update Vercel

```
VITE_OLLAMA_API_URL=http://YOUR_ELASTIC_IP:11434
```

---

## Application Configuration

Now update your application to use the cloud Ollama endpoint.

### Step 1: Create Environment Config Helper

Create `src/config/ai.ts`:

```typescript
export const getOllamaUrl = (): string => {
  // Check for environment variable
  const envUrl = import.meta.env.VITE_OLLAMA_API_URL;

  if (envUrl) {
    return envUrl;
  }

  // Fallback to localhost for development
  return 'http://localhost:11434';
};

export const isCloudOllama = (): boolean => {
  const url = getOllamaUrl();
  return !url.includes('localhost') && !url.includes('127.0.0.1');
};

// Test Ollama connection
export const testOllamaConnection = async (): Promise<boolean> => {
  try {
    const response = await fetch(`${getOllamaUrl()}/api/tags`);
    return response.ok;
  } catch (error) {
    console.error('Ollama connection test failed:', error);
    return false;
  }
};
```

### Step 2: Update Local LLM Service

Update `services/localLLMService.ts` to use actual Ollama:

```typescript
import { getOllamaUrl } from '../config/ai';
import type { GeneratedPresentation, SermonBasis, SermonLength } from '../types';

interface OllamaResponse {
  model: string;
  response: string;
  done: boolean;
}

export const callOllama = async (
  model: string,
  prompt: string,
  stream: boolean = false
): Promise<string> => {
  const url = `${getOllamaUrl()}/api/generate`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model,
      prompt,
      stream: false,  // Set to true for streaming
    }),
  });

  if (!response.ok) {
    throw new Error(`Ollama API error: ${response.statusText}`);
  }

  const data: OllamaResponse = await response.json();
  return data.response;
};

export const listOllamaModels = async (): Promise<string[]> => {
  const url = `${getOllamaUrl()}/api/tags`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error('Failed to fetch Ollama models');
  }

  const data = await response.json();
  return data.models.map((m: any) => m.name);
};

// Update your existing generatePresentation to use actual Ollama
export const generatePresentation = async (
  topic: string,
  keyPoints: string[],
  sermonBasis: SermonBasis,
  sermonLength: SermonLength,
  setLoadingMessage: (message: string) => void,
  options: { model: string; temperature: number; topP: number }
): Promise<GeneratedPresentation> => {
  setLoadingMessage(`連接到 Ollama (${options.model})...`);

  // Build prompt
  const prompt = `Generate a ${sermonLength}-minute sermon about "${topic}"
based on ${sermonBasis}.
Key points: ${keyPoints.join(', ')}

Create a structured presentation with:
1. Introduction
2. Biblical Foundation
3. Theological Reflection
4. Practical Application
5. Conclusion

Format: JSON with slides array, fullScript, and summary.`;

  setLoadingMessage('生成講道內容...');

  try {
    const response = await callOllama(options.model, prompt);

    // Parse response (Ollama might return JSON or text)
    let parsed;
    try {
      parsed = JSON.parse(response);
    } catch {
      // If not JSON, create structure from text
      parsed = {
        summary: response.substring(0, 200),
        slides: createSlidesFromText(response, topic),
        fullScript: response
      };
    }

    setLoadingMessage('生成完成！');

    return {
      ...parsed,
      speakerImageUrl: 'https://picsum.photos/seed/speaker/150/150',
      audienceImageUrl: 'https://picsum.photos/seed/audience/300/200',
    };
  } catch (error) {
    console.error('Ollama generation error:', error);
    throw new Error('Failed to generate sermon with Ollama');
  }
};

// Helper function to create slides from text
function createSlidesFromText(text: string, topic: string) {
  // Split text into sections and create slides
  const sections = text.split('\n\n').filter(s => s.trim());

  return sections.slice(0, 5).map((section, i) => ({
    title: `${topic} - Part ${i + 1}`,
    talkingPoints: section.split('\n').slice(0, 3),
    speakerNotes: section,
    imagePrompt: `Christian sermon illustration part ${i + 1}`,
    backgroundUrl: `https://picsum.photos/seed/sermon${i}/800/600`
  }));
}
```

### Step 3: Add Connection Status Indicator

Create `components/OllamaStatus.tsx`:

```typescript
import React, { useEffect, useState } from 'react';
import { testOllamaConnection, getOllamaUrl, isCloudOllama } from '../config/ai';

export const OllamaStatus: React.FC = () => {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [isCloud, setIsCloud] = useState(false);

  useEffect(() => {
    const checkConnection = async () => {
      const connected = await testOllamaConnection();
      setIsConnected(connected);
      setIsCloud(isCloudOllama());
    };

    checkConnection();
    // Check every 30 seconds
    const interval = setInterval(checkConnection, 30000);
    return () => clearInterval(interval);
  }, []);

  if (isConnected === null) return null;

  return (
    <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs ${
      isConnected
        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
        : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
    }`}>
      <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
      <span>
        {isConnected
          ? `Ollama ${isCloud ? 'Cloud' : 'Local'}`
          : 'Ollama Offline'
        }
      </span>
    </div>
  );
};
```

### Step 4: Update .env Files

**Local development** (`.env.local`):
```bash
GEMINI_API_KEY=your_key_here
VITE_OLLAMA_API_URL=http://localhost:11434
```

**Vercel (Production)**:
In Vercel dashboard, add:
```bash
GEMINI_API_KEY=your_key_here
VITE_OLLAMA_API_URL=http://YOUR_CLOUD_IP:PORT
```

---

## Testing Your Setup

### Step 1: Test Ollama Endpoint

```bash
# From your local machine
curl http://YOUR_CLOUD_IP:PORT/api/tags

# Should return:
# {"models":[{"name":"llama3.3:latest",...}]}
```

### Step 2: Test from Application

Add a test page `src/pages/TestOllama.tsx`:

```typescript
import React, { useState } from 'react';
import { getOllamaUrl, testOllamaConnection } from '../config/ai';
import { callOllama, listOllamaModels } from '../services/localLLMService';

export const TestOllama: React.FC = () => {
  const [status, setStatus] = useState<string>('');
  const [models, setModels] = useState<string[]>([]);
  const [response, setResponse] = useState<string>('');

  const handleTest = async () => {
    setStatus('Testing connection...');
    const connected = await testOllamaConnection();

    if (connected) {
      setStatus(`✅ Connected to ${getOllamaUrl()}`);

      // Get models
      const availableModels = await listOllamaModels();
      setModels(availableModels);

      // Test generation
      if (availableModels.length > 0) {
        setStatus('Generating test response...');
        const testResponse = await callOllama(
          availableModels[0],
          'Say hello in one sentence'
        );
        setResponse(testResponse);
        setStatus('✅ Generation successful!');
      }
    } else {
      setStatus('❌ Connection failed');
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Ollama Connection Test</h1>

      <button
        onClick={handleTest}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Test Connection
      </button>

      {status && (
        <div className="mt-4 p-4 bg-gray-100 rounded">
          <p>{status}</p>
        </div>
      )}

      {models.length > 0 && (
        <div className="mt-4">
          <h2 className="font-semibold">Available Models:</h2>
          <ul className="list-disc pl-5">
            {models.map(model => (
              <li key={model}>{model}</li>
            ))}
          </ul>
        </div>
      )}

      {response && (
        <div className="mt-4 p-4 bg-green-100 rounded">
          <h2 className="font-semibold">Test Response:</h2>
          <p>{response}</p>
        </div>
      )}
    </div>
  );
};
```

### Step 3: Deploy to Vercel

```bash
# Commit your changes
git add .
git commit -m "Add cloud Ollama support"
git push

# Vercel will auto-deploy, or manually:
vercel --prod
```

---

## Monitoring & Maintenance

### Monitor GPU Usage

**RunPod:**
```bash
# SSH into pod
nvidia-smi

# Watch GPU usage
watch -n 1 nvidia-smi
```

**Vast.ai:**
Check dashboard for real-time GPU stats.

### Monitor Ollama Logs

```bash
# View Ollama logs
journalctl -u ollama -f

# View recent errors
journalctl -u ollama --since "1 hour ago" | grep ERROR
```

### Auto-Start on Reboot

```bash
# Ensure Ollama starts on boot
systemctl enable ollama

# Check status
systemctl status ollama
```

### Backup Models (Optional)

```bash
# Models are stored in /usr/share/ollama/.ollama/models
# Backup to external storage
tar -czf ollama-models-backup.tar.gz /usr/share/ollama/.ollama/models
```

---

## Cost Optimization Tips

### 1. Stop Pod When Not Needed

**RunPod:**
- Stop pod from dashboard when not in use
- Restart when needed (models persist on volume)

### 2. Use Spot Instances

**Vast.ai:**
- Enable "Interruptible" instances for 50% discount
- Auto-restart on interruption

### 3. Model Quantization

Use quantized models for lower VRAM:
```bash
# Instead of 32B full precision:
ollama pull deepseek-r1:32b

# Use quantized version:
ollama pull deepseek-r1:32b-q4_K_M  # 4-bit quantization
```

### 4. Schedule Auto-Stop

Create a cron job to stop pod during off-hours:
```bash
# Edit crontab
crontab -e

# Stop at 11 PM daily
0 23 * * * systemctl stop ollama
```

---

## Troubleshooting

### Issue: "Connection Refused"

**Solutions:**
1. Check Ollama is running: `systemctl status ollama`
2. Verify port is open: `netstat -tulpn | grep 11434`
3. Check firewall: `ufw status`
4. Verify OLLAMA_HOST is set to `0.0.0.0`

### Issue: "Model Not Found"

**Solution:**
```bash
ollama list  # Check installed models
ollama pull MODEL_NAME  # Pull missing model
```

### Issue: "Out of Memory"

**Solutions:**
1. Use smaller model or quantized version
2. Upgrade to GPU with more VRAM
3. Reduce context length in requests

### Issue: Slow Response Times

**Solutions:**
1. Use faster GPU (RTX 4090 > RTX 3090)
2. Enable GPU acceleration: check `nvidia-smi`
3. Use quantized models
4. Reduce model size

---

## Security Checklist

- [ ] Change default SSH password
- [ ] Configure firewall (ufw)
- [ ] Add authentication to Ollama endpoint
- [ ] Use HTTPS with Caddy/Nginx
- [ ] Restrict access to trusted IPs
- [ ] Enable automatic security updates
- [ ] Monitor logs for suspicious activity
- [ ] Regular backup of models

---

## Next Steps

1. ✅ Choose provider (RunPod recommended)
2. ✅ Deploy Ollama instance
3. ✅ Pull required models
4. ✅ Configure external access
5. ✅ Update application code
6. ✅ Set Vercel environment variables
7. ✅ Test thoroughly
8. ✅ Deploy to production
9. ✅ Monitor performance

---

**Need help?** Check the main DEPLOYMENT_GUIDE.md or create an issue in the repository.
