"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Float, Stars, TorusKnot, Dodecahedron, Cone } from "@react-three/drei";
import * as THREE from "three";
import { useTheme } from "next-themes";

function FloatingShape({
    children,
    position,
    speed = 2,
    rotationIntensity = 2,
    floatIntensity = 2
}: {
    children: React.ReactNode,
    position: [number, number, number],
    speed?: number,
    rotationIntensity?: number,
    floatIntensity?: number
}) {
    const meshRef = useRef<THREE.Mesh>(null);
    useFrame(() => {
        if (meshRef.current) {
            meshRef.current.rotation.x += 0.002;
            meshRef.current.rotation.y += 0.003;
        }
    });

    return (
        <Float speed={speed} rotationIntensity={rotationIntensity} floatIntensity={floatIntensity} position={position}>
            <mesh ref={meshRef}>
                {children}
            </mesh>
        </Float>
    );
}

export function Particles() {
    const { resolvedTheme } = useTheme();
    const groupRef = useRef<THREE.Group>(null);

    useFrame((state) => {
        if (groupRef.current) {
            groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.02;
            groupRef.current.rotation.x = state.clock.getElapsedTime() * 0.01;
        }
    });

    const isDark = resolvedTheme === "dark";

    const glassMaterial = new THREE.MeshPhysicalMaterial({
        color: isDark ? "#3b82f6" : "#6366f1",
        metalness: 0.1,
        roughness: 0.2,
        transmission: 0.9,
        thickness: 0.5,
        wireframe: true,
        transparent: true,
        opacity: 0.3,
    });

    const accentMaterial1 = new THREE.MeshPhysicalMaterial({
        color: isDark ? "#ec4899" : "#f43f5e", // Pink/Rose
        metalness: 0.2,
        roughness: 0.1,
        wireframe: true,
        transparent: true,
        opacity: 0.4,
    });

    const accentMaterial2 = new THREE.MeshPhysicalMaterial({
        color: isDark ? "#10b981" : "#14b8a6", // Emerald/Teal
        metalness: 0.2,
        roughness: 0.1,
        wireframe: true,
        transparent: true,
        opacity: 0.4,
    });

    return (
        <group ref={groupRef}>
            <Stars
                radius={100}
                depth={50}
                count={8000}
                factor={4}
                saturation={0.5}
                fade
                speed={1.5}
            />

            {/* Center Massive Icosahedron */}
            <FloatingShape position={[0, 0, -5]} floatIntensity={1}>
                <icosahedronGeometry args={[4, 1]} />
                <primitive object={glassMaterial} attach="material" />
            </FloatingShape>

            {/* Fun Torus Knot */}
            <FloatingShape position={[-8, 4, -10]} speed={3} rotationIntensity={4}>
                <torusKnotGeometry args={[1.5, 0.4, 100, 16]} />
                <primitive object={accentMaterial1} attach="material" />
            </FloatingShape>

            {/* Floating Dodecahedron */}
            <FloatingShape position={[8, -5, -8]} speed={2.5}>
                <dodecahedronGeometry args={[2]} />
                <primitive object={accentMaterial2} attach="material" />
            </FloatingShape>

            {/* Playful Cone */}
            <FloatingShape position={[6, 6, -12]} speed={4} rotationIntensity={3}>
                <coneGeometry args={[1.5, 3, 3]} />
                <primitive object={glassMaterial} attach="material" />
            </FloatingShape>

            {/* Extra background torus */}
            <FloatingShape position={[-10, -6, -15]} speed={1.5}>
                <torusGeometry args={[2.5, 0.5, 16, 50]} />
                <primitive object={accentMaterial1} attach="material" />
            </FloatingShape>
        </group>
    );
}
