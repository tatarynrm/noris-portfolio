import { notFound } from "next/navigation";
import { skillsData } from "@/shared/data/skills";
import { AnimatedSkillDetail } from "@/entities/skill-detail/AnimatedSkillDetail";

// 1. Додаємо цей рядок, щоб Next.js чітко знав, що робити з невідомими slug
export const dynamicParams = false;

export async function generateStaticParams() {
    return skillsData.map((skill) => ({
        slug: skill.slug,
    }));
}

// 2. Типізуємо пропси згідно з вимогами Next.js 15
interface Props {
    params: Promise<{ slug: string; locale: string }>;
}

export default async function SkillPage({ params }: Props) {
    // 3. Очікуємо пропси
    const { slug } = await params;

    // 4. Шукаємо дані
    const skill = skillsData.find((s) => s.slug === slug);

    if (!skill) {
        notFound();
    }

    return (
        <main className="min-h-screen pt-32 pb-20 bg-gray-50 dark:bg-black relative overflow-hidden">
            <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-blue-500/10 blur-[150px] rounded-full pointer-events-none -z-10" />
            <AnimatedSkillDetail skill={skill} />
        </main>
    );
}