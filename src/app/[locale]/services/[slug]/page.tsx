import { notFound } from "next/navigation";
import { servicesData } from "@/shared/data/services";
import { AnimatedServiceDetail } from "@/entities/service-detail/AnimatedServiceDetail";

export function generateStaticParams() {
    return servicesData.map((service) => ({
        slug: service.slug,
    }));
}

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
    const resolvedParams = await params;
    const service = servicesData.find((s) => s.slug === resolvedParams.slug);

    if (!service) {
        notFound();
    }

    return (
        <main className="min-h-screen pt-32 pb-20 bg-gray-50 dark:bg-[#0a0a0a] relative overflow-hidden">
            {/* Ambient Background */}
            <div className={`absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-bl ${service.color} blur-[120px] rounded-full opacity-20 pointer-events-none -z-10`} />

            <AnimatedServiceDetail service={service} />
        </main>
    );
}
