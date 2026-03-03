"use client";

import { Canvas } from "@react-three/fiber";
import { Particles } from "@/shared/ui/particles/Particles";

export function Scene3D() {
    return (
        <div className="fixed inset-0 z-0 pointer-events-none">
            <Canvas camera={{ position: [0, 0, 15], fov: 45 }}>
                <Particles />
            </Canvas>
            {/* Heavy vignette overlay to make the background darker and focus content */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.8)_100%)] dark:bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.95)_100%)]" />
        </div>
    );
}
