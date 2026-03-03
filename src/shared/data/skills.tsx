import { Database, Server, Layout, Terminal } from "lucide-react";

export const skillsData = [
    {
        slug: "frontend-architecture",
        category: "Frontend Architecture",
        icon: <Layout className="w-8 h-8 mb-6 text-blue-400" />,
        items: ["React", "Next.js", "TypeScript", "Tailwind CSS", "GSAP ScrollTrigger"],
        content: `## Constructing the Visual Force

The interface is where raw compute becomes human experience. We do not just "build web pages"; we architect expansive frontend ecosystems that maintain strict state integrity while delivering 120fps physics-driven visual mastery. 

### The Next.js Vanguard
Next.js provides the monolithic edge compute power necessary for supreme Time-To-First-Byte metrics. By seamlessly interpolating between Server-Side Rendering (SSR) and Server Components, we stream immediate JSON payloads to the frontend, bypassing traditional client-side waterfalls entirely.

### Unyielding TypeScript Typology
A fragile codebase shatters under scale. By locking the entire DOM into a relentless, strict TypeScript typology grid, runtime errors are eradicated before the compiler even flashes green. Data flowing from the backend is instantly parsed, mapped, and typed, forming an unbreakable bond between the server and the browser.`
    },
    {
        slug: "backend-api-design",
        category: "Backend API Design",
        icon: <Server className="w-8 h-8 mb-6 text-purple-400" />,
        items: ["Node.js", "NestJS", "Express", "GraphQL", "REST APIs"],
        content: `## Forging Neural Uplinks

The backend is the engine of the entire construct. A beautiful frontend is nothing without an impenetrable API that handles extreme concurrent payloads without yielding a single 500 status code.

### Node.js Event Loop Orchestration
By utilizing Node.js's native asynchronous I/O event loop, we bypass thread-locking completely. Simultaneous database queries, external integrations, and socket connections are executed non-blockingly, allowing solitary server instances to handle thousands of concurrent client uplinks.

### NestJS Strategic Structuring
When extreme scale is mandated, we deploy NestJS. Leveraging hardcore Dependency Injection protocols, strict module boundaries, and custom execution decorators, we forge APIs that adhere flawlessly to SOLID principles. Every route, controller, and query is highly testable and explicitly defined in the matrix.`
    },
    {
        slug: "databases-caching",
        category: "Databases & Caching",
        icon: <Database className="w-8 h-8 mb-6 text-emerald-400" />,
        items: ["PostgreSQL", "MongoDB", "Redis", "Prisma ORM", "Docker DB"],
        content: `## Storing the Global State

Data is the ultimate payload. Whether executing complex multi-table relational joins or rapidly storing unstructured JSON documents at high velocity, the local data telemetry must remain totally secure and absolutely instantaneous.

### PostgreSQL & Prisma Synthesis
PostgreSQL provides the unyielding bedrock for relational logic. When paired directly with the Prisma ORM, we synthesize type-safe query syntaxes that eradicate injection vulnerabilities and guarantee structural consistency at the absolute database schema level.

### Redis Memory Execution
When read queries overwhelm the persistent disk nodes, we deploy Redis as a lightning-fast, key-value memory layer. Session tokens, caching payloads, and global state registries are read directly from RAM, turning what was once a heavy disk I/O operation into instantaneous sub-millisecond network deliveries.`
    },
    {
        slug: "devops-tooling",
        category: "DevOps & Tools",
        icon: <Terminal className="w-8 h-8 mb-6 text-orange-400" />,
        items: ["Docker", "Kubernetes", "AWS", "CI/CD", "PDFKit", "Puppeteer", "n8n Pipelines"],
        content: `## Deploying Global Overrides

Code that lives on a local machine is effectively dead. To breathe life into the construct, high-latency human deployment strategies must be eliminated via rigorous CI/CD orchestration and immutable containerization.

### Docker Initialization
By encapsulating every microservice and frontend instance into autonomous Docker images, we eradicate "works on my machine" syndrome forever. The environment—its dependencies, OS configuration, and secrets—travels securely through the pipeline.

### Unwavering Pipeline Telemetry
Using GitHub Actions or Gitlab CI networks, every single commit executes a barrage of localized tests, type-checks, and linter protocols before automatically building and aggressively syncing the payload directly to the vast AWS cloud, keeping the digital ecosystem perfectly aligned at all times.`
    }
];
