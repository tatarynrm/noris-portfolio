import { Globe, Monitor, Smartphone, Cog, MessageSquareQuote } from "lucide-react";

export const servicesData = [
    {
        slug: "web-applications",
        title: "Web Applications",
        shortDesc: "High-performance, scalable, and visually stunning React and Next.js web applications that dominate the browser.",
        icon: <Globe className="w-12 h-12 text-blue-500 mb-6 group-hover:scale-110 transition-transform duration-500" />,
        color: "from-blue-500/20 to-indigo-500/20",
        border: "group-hover:border-blue-500/50",
        content: `## Architecting Digital Ecosystems

### Unyielding Execution Speed
The modern web is congested with slow, heavy monoliths masquerading as dynamic applications. To pierce through this noise, we must abandon generic templating and forge custom, high-performance interfaces from the ground up, utilizing the React virtual DOM and Next.js server-side telemetry.

By aggressively pushing compute to the Vercel edge network and leveraging React Server Components, we eliminate client-side JavaScript payloads. This architecture ensures an instantaneous Time-to-Interactive, scoring deep in the perfect 99th percentile across Lighthouse metrics. 

### The Engineering Aesthetic
Performance without visual excellence is merely raw utility. True mastery requires weaving data states into fluid, cinematic micro-interactions. Utilizing GSAP mathematics and Framer Motion spring physics, we choreograph DOM elements into a unified, immersive experience that feels as much like a compiled video game as it does a robust web application. Deploying these constructs establishes digital dominance for your brand.`,
        tools: ["Next.js App Router", "React Server Components", "Tailwind CSS", "GSAP ScrollTrigger", "Three.js / WebGL"]
    },
    {
        slug: "desktop-apps",
        title: "Desktop Apps",
        shortDesc: "Native-feeling, cross-platform desktop experiences engineered with Electron or Tauri for raw system power.",
        icon: <Monitor className="w-12 h-12 text-emerald-500 mb-6 group-hover:scale-110 transition-transform duration-500" />,
        color: "from-emerald-500/20 to-teal-500/20",
        border: "group-hover:border-emerald-500/50",
        content: `## Forging System-Level Constructs

When browser sandboxes constrict the workflow, we tear down those walls and synthesize direct, native operating system integrations. We architect powerful cross-platform desktop applications that leverage raw CPU multi-threading and direct filesystem telemetry.

### The Tauri Vanguard
Electron has served the matrix well, but as memory constraints tighten, we embrace the bleeding edge: **Tauri**. Engineered atop a robust Rust backend with a minuscule webview footprint, the Tauri construct delivers identical cross-platform payloads that run exponentially faster, natively executing system calls while rendering flawless frontend React logic.

### Unrestricted I/O Payload
Working closely with the native filesystem allows us to construct aggressive local caching databases, hardware acceleration hooks, and autonomous background daemon processes. Whether it is real-time media manipulation or low-latency financial dashboards, the boundaries of the browser are obliterated.`,
        tools: ["Electron", "Tauri", "Rust Backend", "Native C++ Extensions", "Local SQLite"]
    },
    {
        slug: "mobile-apps",
        title: "Mobile Apps",
        shortDesc: "Fluid, 120fps mobile interfaces built with React Native to conquer both iOS and Android stores simultaneously.",
        icon: <Smartphone className="w-12 h-12 text-pink-500 mb-6 group-hover:scale-110 transition-transform duration-500" />,
        color: "from-pink-500/20 to-rose-500/20",
        border: "group-hover:border-pink-500/50",
        content: `## Orchestrating Infinite Scroll

Mobile is the primary battlefield. To capture and sustain user attention amidst millions of apps, the UI must feel entirely physics-based. Using React Native and Expo, we deploy a singular, cohesive codebase that manifests flawlessly across both Android and Apple ecosystems.

### The 120fps Threshold
Lag is unacceptable in the modern matrix. By utilizing React Native Reanimated running parallel on the native UI thread, we orchestrate extremely complex layout transitions and gesture-based gesture handler physics that never block the JavaScript execution context. The result is pure, unadulterated 120fps fluidity underneath the user's touch.

### Offline-First Resiliency
An app is only as strong as its offline capabilities. We implement militant local caching strategies via WatermelonDB and AsyncStorage, guaranteeing that users can interact, mutate state, and review records even when the uplink is severed. All local mutations sync autonomously once telemetry is restored.`,
        tools: ["React Native", "Expo Go", "Reanimated UI", "WatermelonDB", "Gesture Handler"]
    },
    {
        slug: "process-automation",
        title: "Process Automation",
        shortDesc: "Eliminating human error by architecting robotic process automations, scraping scripts, and CRON pipelines.",
        icon: <Cog className="w-12 h-12 text-orange-500 mb-6 group-hover:scale-110 group-hover:rotate-90 transition-transform duration-500" />,
        color: "from-orange-500/20 to-amber-500/20",
        border: "group-hover:border-orange-500/50",
        content: `## Hardcoding Efficiency Vectors

Human error is the ultimate system vulnerability. By architecting relentless, headless background processes and data scraper nodes, we synthesize autonomous bots that execute repetitive tasks with machine precision, day and night without fatigue.

### Headless Puppeteer Extraction
We deploy stealth instances of Puppeteer to invisibly navigate the web grid, stripping data from legacy architectures, parsing convoluted HTML arrays, and normalizing chaotic outputs into perfectly structured JSON payloads. This telemetry can then be piped directly into any upstream CRM or database pipeline seamlessly.

### Invisible CRON Orchestration
Using advanced scheduling matrices on highly available Linux instances, entire operational workflows are shifted off the human shoulder. From midnight server backups and cache invalidations to bulk email invoice generation, we script the nervous system of the enterprise to fire synchronously.`,
        tools: ["Puppeteer Headless", "Node.js Workers", "Linux CRON", "BeautifulSoup / Python", "n8n Pipelines"]
    },
    {
        slug: "telegram-bots",
        title: "Telegram Bots",
        shortDesc: "Intelligent, interactive conversational agents leveraging the Telegram API for seamless user interaction and alerts.",
        icon: <MessageSquareQuote className="w-12 h-12 text-sky-500 mb-6 group-hover:scale-110 transition-transform duration-500" />,
        color: "from-sky-500/20 to-cyan-500/20",
        border: "group-hover:border-sky-500/50",
        content: `## Establishing Direct Neural Uplinks

Why force a user to open an application when the application can live inside their most-used communications client? By forging an interactive matrix atop the Telegram API, we deploy intelligent micro-apps that instantly alert, converse, and process commands securely in the user's pocket.

### Seamless Command Architecture
We script Node.js engines powered by native Telegraf frameworks to listen and instantly respond to inline queries, chat commands, and callback buttons. By generating dynamic inline keyboard payloads and webhooks, the bot functions not just as an informational terminal, but as a full-fledged interface for mutating external server data.

### Instant Pipeline Telemetry
An enterprise needs to know when nodes fail. We hook critical backend systems directly into the Telegram bot registry, creating a zero-latency alert pipeline that pings the operations channel the exact millisecond a database transaction fails or a new high-value client registers in the external portal.`,
        tools: ["Telegraf Node.js", "GrammY", "Telegram Web App API", "Webhook Sockets", "Redis KV Store"]
    }
];
