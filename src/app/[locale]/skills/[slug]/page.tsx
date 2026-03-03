import { notFound } from "next/navigation";
import { skillsData } from "@/shared/data/skills";
import { AnimatedSkillDetail } from "@/entities/skill-detail/AnimatedSkillDetail";

export function generateStaticParams() {
    return skillsData.map((skill) => ({
        slug: skill.slug,
    }));
}

export default async function SkillPage({ params }: { params: Promise<{ slug: string }> }) {
    const resolvedParams = await params;
    const skill = skillsData.find((s) => s.slug === resolvedParams.slug);

    if (!skill) {
        notFound();
    }

    return (
        <main className="min-h-screen pt-32 pb-20 bg-gray-50 dark:bg-black relative overflow-hidden">
            {/* Ambient Lighting */}
            <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-blue-500/10 blur-[150px] rounded-full pointer-events-none -z-10" />

            <AnimatedSkillDetail skill={skill} />
        </main>
    );
}
