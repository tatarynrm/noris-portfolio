"use client";

import { useRef, useMemo, useState, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Points, PointMaterial, Float, Sphere } from "@react-three/drei";
import * as THREE from "three";
import { useTheme } from "next-themes";

function FallingStars({ mouse }: { mouse: React.MutableRefObject<[number, number]> }) {
    const count = 1500;
    const scrollY = useRef(0);

    const positions = useMemo(() => {
        const pos = new Float32Array(count * 3);
        for (let i = 0; i < count; i++) {
            pos[i * 3] = (Math.random() - 0.5) * 50;
            pos[i * 3 + 1] = (Math.random() - 0.5) * 50;
            pos[i * 3 + 2] = (Math.random() - 0.5) * 50;
        }
        return pos;
    }, []);

    const starsRef = useRef<THREE.Points>(null);

    useFrame((state, delta) => {
        if (!starsRef.current) return;

        // Falling animation
        const positions = starsRef.current.geometry.attributes.position.array as Float32Array;
        for (let i = 0; i < count; i++) {
            positions[i * 3 + 1] -= delta * 15; // Fall speed

            // Mouse influence - subtle horizontal drift
            positions[i * 3] += mouse.current[0] * delta * 5;

            // Reset if out of bounds
            if (positions[i * 3 + 1] < -25) {
                positions[i * 3 + 1] = 25;
                positions[i * 3] = (Math.random() - 0.5) * 50;
            }
        }
        starsRef.current.geometry.attributes.position.needsUpdate = true;

        // Scene rotation based on mouse
        starsRef.current.rotation.y += mouse.current[0] * 0.01;
        starsRef.current.rotation.x += mouse.current[1] * 0.01;
    });

    return (
        <Points ref={starsRef} positions={positions} stride={3} frustumCulled={false}>
            <PointMaterial
                transparent
                color="#3b82f6"
                size={0.08}
                sizeAttenuation={true}
                depthWrite={false}
                opacity={0.4}
            />
        </Points>
    );
}

function Satellites({ mouse }: { mouse: React.MutableRefObject<[number, number]> }) {
    const satelliteCount = 8;
    const satellites = useMemo(() => {
        return Array.from({ length: satelliteCount }).map(() => ({
            position: [
                (Math.random() - 0.5) * 20,
                (Math.random() - 0.5) * 20,
                (Math.random() - 0.5) * 20
            ] as [number, number, number],
            speed: Math.random() * 0.2 + 0.1,
            rotationSpeed: Math.random() * 0.5 + 0.2,
            size: Math.random() * 0.1 + 0.05
        }));
    }, []);

    const Particles = () => {
        const count = 2000;
        const positions = useMemo(() => {
            const pos = new Float32Array(count * 3);
            for (let i = 0; i < count; i++) {
                pos[i * 3] = (Math.random() - 0.5) * 60;
                pos[i * 3 + 1] = (Math.random() - 0.5) * 60;
                pos[i * 3 + 2] = (Math.random() - 0.5) * 60;
            }
            return pos;
        }, []);

        const particlesRef = useRef<THREE.Points>(null);
        useFrame((state, delta) => {
            if (particlesRef.current) {
                particlesRef.current.rotation.y += delta * 0.05;
                particlesRef.current.rotation.x += mouse.current[1] * 0.01;
                particlesRef.current.rotation.y += mouse.current[0] * 0.01;
            }
        });

        return (
            <Points ref={particlesRef} positions={positions} stride={3} frustumCulled={false}>
                <PointMaterial
                    transparent
                    color="#ffffff"
                    size={0.03}
                    sizeAttenuation={true}
                    depthWrite={false}
                    opacity={0.2}
                />
            </Points>
        );
    };

    return (
        <>
            <Particles />
            {satellites.map((sat, i) => (
                <Float
                    key={i}
                    speed={sat.speed * 5}
                    rotationIntensity={sat.rotationSpeed * 2}
                    floatIntensity={2}
                >
                    <mesh position={sat.position}>
                        <boxGeometry args={[sat.size, sat.size, sat.size]} />
                        <meshStandardMaterial color="#4f46e5" emissive="#4f46e5" emissiveIntensity={2} />
                        {/* Antennae or details */}
                        <mesh position={[0, sat.size, 0]}>
                            <cylinderGeometry args={[0.005, 0.005, sat.size * 2]} />
                            <meshStandardMaterial color="#312e81" />
                        </mesh>
                    </mesh>
                </Float>
            ))}
            <ambientLight intensity={0.2} />
            <pointLight position={[10, 10, 10]} intensity={1.5} color="#3b82f6" />
        </>
    );
}

export function Hero3D() {
    const { theme, resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const mouse = useRef<[number, number]>([0, 0]);

    useEffect(() => {
        setMounted(true);
        const handleMouseMove = (e: MouseEvent) => {
            mouse.current = [
                (e.clientX / window.innerWidth) * 2 - 1,
                -(e.clientY / window.innerHeight) * 2 + 1
            ];
        };
        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, []);

    if (!mounted) return null;

    const currentTheme = resolvedTheme || theme;

    return (
        <div className="absolute inset-0 z-0 pointer-events-none opacity-40 dark:opacity-60 transition-opacity duration-1000">
            <Canvas camera={{ position: [0, 0, 15], fov: 60 }}>
                {currentTheme === "light" ? (
                    <FallingStars mouse={mouse} />
                ) : (
                    <Satellites mouse={mouse} />
                )}
            </Canvas>
        </div>
    );
}
