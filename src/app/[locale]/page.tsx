import { Header } from "@/widgets/header/Header";
import { Hero } from "@/widgets/hero/Hero";
import { About } from "@/widgets/about/About";
import { Experience } from "@/widgets/experience/Experience";
import { Skills } from "@/widgets/skills/Skills";
import { Services } from "@/widgets/services/Services";
import { StarWarsCrawl } from "@/widgets/starwars/StarWarsCrawl";
import { ProjectsTeaser } from "@/widgets/projects/ProjectsTeaser";
import { StackedProjects } from "@/widgets/projects/StackedProjects";
import { ContactForm } from "@/widgets/contact/ContactForm";
import { IntroScreen } from "@/widgets/intro/IntroScreen";
import { SmoothScrollProvider } from "@/shared/providers/SmoothScrollProvider";
import { ScrollProgress } from "@/shared/ui/ScrollProgress";

export default function Home() {
  return (
    <SmoothScrollProvider>
      <ScrollProgress />
      <div className="min-h-screen text-gray-900 dark:text-gray-100 font-[family-name:var(--font-geist-sans)] selection:bg-blue-500/30">

        {/* Cinematic intro reel — shows once per session */}
        <IntroScreen />

        <main>
          <Hero />
          <About />
          <Experience />
          <Skills />
          <Services />
          <StarWarsCrawl />
          <ProjectsTeaser />
          <StackedProjects />
          <ContactForm />
        </main>

        <footer className="py-8 text-center border-t border-gray-200 dark:border-gray-800 text-sm text-gray-500 dark:text-gray-400">
          <p>© {new Date().getFullYear()} Noris. Built with Next.js, Tailwind & GSAP.</p>
        </footer>
      </div>
    </SmoothScrollProvider>
  );
}
