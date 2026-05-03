import React, { useRef, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Stars, Float, Html, MeshDistortMaterial, MeshWobbleMaterial, ContactShadows, Environment, Sparkles } from '@react-three/drei';
import * as THREE from 'three';
import { Info, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { sounds } from '../lib/sounds';

interface Hotspot {
  position: [number, number, number];
  title: string;
  description: string;
}

const MODAL_DATA: Record<string, Hotspot[]> = {
  virus: [
    { position: [0, 1.2, 0], title: "Spike Protein", description: "Glycoproteins (like Hemagglutinin) used for host cell attachment." },
    { position: [0.8, 0.4, 0.6], title: "Capsid", description: "Outer protein shell protecting the viral genome." },
    { position: [-0.6, -0.6, 0], title: "Capsomere", description: "Individual protein subunits that self-assemble to form the capsid." },
    { position: [0, 0, 0], title: "Nucleocapsid", description: "The combined structure of the viral nucleic acid and its protective protein layer." }
  ],
  adenovirus: [
    { position: [0, 1.2, 0], title: "Fiber", description: "Long projections from vertices used for primary receptor binding." },
    { position: [0.8, 0.4, 0], title: "Penton Base", description: "Base of the fiber protein; involved in internalization via integrins." },
    { position: [0.3, 0.8, 0.6], title: "Hexon", description: "The most abundant capsid protein; forms the 20 triangular facets." },
    { position: [0, 0, 0], title: "dsDNA", description: "Linear double-stranded DNA genome within the core." }
  ],
  bacterium: [
    { position: [0, 1, 0], title: "Cell Wall", description: "Provides structural integrity; contains peptidoglycan which determines Gram reaction." },
    { position: [0.6, 0, 0.6], title: "Plasma Membrane", description: "Phospholipid bilayer regulating nutrient transport and energy production." },
    { position: [0, 0, 0], title: "Nucleoid", description: "Region containing the circular bacterial chromosome (DNA)." },
    { position: [0, -1.8, 0], title: "Flagella", description: "Rotary motor proteins providing motility via chemotaxis." }
  ],
  bacillus: [
    { position: [0, 1.5, 0], title: "Terminal Endospore", description: "Highly resistant structure formed under stress (e.g., Clostridium, Bacillus)." },
    { position: [0.6, 0.2, 0.6], title: "Capsule", description: "Outer slime layer often associated with virulence and immune evasion." },
    { position: [0, -1.5, 0], title: "Peritrichous Flagella", description: "Flagella distributed all over the bacterial surface." }
  ],
  yeast: [
    { position: [0, 1.2, 0], title: "Chitin Wall", description: "Strong cellular envelope characteristic of fungi." },
    { position: [0.4, 0.4, 0.4], title: "Bud Scar", description: "Mark left behind where a daughter cell has separated during asexual reproduction." },
    { position: [0, 0, 0], title: "Nucleus", description: "True eukaryotic nucleus containing linear chromosomes." }
  ],
  parasite: [
    { position: [0, 1.3, 0], title: "Apical Complex", description: "Polar organelles used for host cell penetration (Apicomplexa)." },
    { position: [0.5, 0, 0.5], title: "Pellicle", description: "Outer protective layer composed of the plasma membrane and inner membrane complex." },
    { position: [0, -1, 0], title: "Micronemes", description: "Secretory organelles involved in motility and host cell recognition." }
  ]
};

const Annotation = ({ hotspot, onSelect }: { hotspot: Hotspot, onSelect: (h: Hotspot) => void }) => {
  return (
    <Html position={hotspot.position} center>
      <div className="relative">
        <div className="absolute inset-0 animate-ping bg-cyan-400 rounded-full opacity-40 scale-150" />
        <button
          onClick={(e) => {
            e.stopPropagation();
            sounds.playHotspot();
            onSelect(hotspot);
          }}
          className="w-6 h-6 bg-cyan-600 hover:bg-cyan-500 text-white rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-125 border-2 border-white cursor-pointer relative z-10"
          id={`hotspot-${hotspot.title.toLowerCase().replace(/\s+/g, '-')}`}
        >
          <Info className="w-4 h-4" />
        </button>
      </div>
    </Html>
  );
};

// Organic Ribosome component
const Ribosomes = ({ count = 30, color = "#22c55e", areaSize = [0.4, 1.4, 0.4] }) => {
  const points = useRef(Array.from({ length: count }, () => ({
    pos: [
      (Math.random() - 0.5) * areaSize[0],
      (Math.random() - 0.5) * areaSize[1],
      (Math.random() - 0.5) * areaSize[2]
    ] as [number, number, number],
    size: 0.015 + Math.random() * 0.015,
    speed: 0.5 + Math.random() * 0.5
  })));

  useFrame((state) => {
    // Subtle Brownian-like motion for ribosomes
    points.current.forEach((p, i) => {
      // Just a tiny wobble
    });
  });

  return (
    <group>
      {points.current.map((p, i) => (
        <mesh key={i} position={p.pos}>
          <sphereGeometry args={[p.size, 16, 16]} />
          <MeshDistortMaterial color={color} transparent opacity={0.6} roughness={0.6} emissive={color} emissiveIntensity={0.4} distort={0.2} speed={1.5} />
        </mesh>
      ))}
    </group>
  );
};

// Helical Flagellum with rotary motor simulation
const Flagellum = ({ position, rotation, color, count = 1 }: { position: [number, number, number], rotation: [number, number, number], color: string, count?: number }) => {
  const ref = useRef<THREE.Group>(null);
  
  const curve = useMemo(() => {
    const points = [];
    const segments = 40;
    const length = 2.5;
    for (let i = 0; i <= segments; i++) {
        const t = i / segments;
        const y = -t * length;
        const amplitude = t * 0.15; // gets wider towards the end
        const x = Math.sin(t * Math.PI * 6) * amplitude;
        const z = Math.cos(t * Math.PI * 6) * amplitude;
        points.push(new THREE.Vector3(x, y, z));
    }
    return new THREE.CatmullRomCurve3(points);
  }, []);

  useFrame((state) => {
    if (ref.current) {
      ref.current.children.forEach((child, i) => {
        const mesh = child.children[0];
        if (mesh) {
            // Spin the helical tube to simulate bacterial motor
            mesh.rotation.y = -(state.clock.elapsedTime * (12 + i));
        }
        // Wobble the base slightly
        const baseX = count > 1 ? Math.sin(i * Math.PI * 2 / count) * 0.2 : 0;
        const baseZ = count > 1 ? Math.cos(i * Math.PI * 2 / count) * 0.2 : 0;
        child.rotation.x = baseX + Math.sin(state.clock.elapsedTime * 2 + i) * 0.05;
        child.rotation.z = baseZ + Math.cos(state.clock.elapsedTime * 2.5 + i) * 0.05;
      });
    }
  });

  return (
    <group position={position} rotation={rotation}>
      <group ref={ref}>
        {Array.from({ length: count }).map((_, i) => (
          <group key={i}>
            <mesh>
              <tubeGeometry args={[curve, 64, 0.012, 16, false]} />
              <MeshWobbleMaterial color={color} factor={0.2} speed={3} roughness={0.4} />
            </mesh>
          </group>
        ))}
      </group>
    </group>
  );
};

// Pili (Fimbriae) for bacterial attachment
const Pili = ({ count = 40, color = "#94a3b8" }) => {
  const filaments = useRef(Array.from({ length: count }, () => {
    const phi = Math.acos(-1 + (Math.random() * 2));
    const theta = Math.random() * Math.PI * 2;
    // Distribute on a cylinder-ish shape
    const h = (Math.random() - 0.5) * 1.5;
    return {
      pos: [
        0.5 * Math.cos(theta),
        h,
        0.5 * Math.sin(theta)
      ] as [number, number, number],
      rot: [0, theta + Math.PI / 2, 0] as [number, number, number]
    };
  }));

  return (
    <group>
      {filaments.current.map((f, i) => (
        <mesh key={i} position={f.pos} rotation={f.rot}>
          <cylinderGeometry args={[0.006, 0.002, 0.15, 8]} />
          <MeshWobbleMaterial color={color} transparent opacity={0.6} factor={0.5} speed={2} roughness={0.5} />
        </mesh>
      ))}
    </group>
  );
};

// Circular DNA (Plasmids)
const Plasmid = ({ position, color = "#fde047" }: { position: [number, number, number], color?: string }) => {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y += 0.02;
      ref.current.rotation.x += 0.01;
    }
  });
  return (
    <mesh ref={ref} position={position}>
      <torusGeometry args={[0.08, 0.008, 16, 64]} />
      <MeshDistortMaterial color={color} emissive={color} emissiveIntensity={0.5} distort={0.2} speed={2} roughness={0.3} />
    </mesh>
  );
};

const Bacterium = ({ modelId, onSelect }: { modelId: string, onSelect: (h: Hotspot) => void }) => {
  const groupRef = useRef<THREE.Group>(null);
  const hotspots = MODAL_DATA[modelId] || MODAL_DATA.bacterium;
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.005;
      const breathX = Math.sin(state.clock.elapsedTime * 1.5) * 0.04;
      const breathY = Math.cos(state.clock.elapsedTime * 1.5) * 0.03;
      groupRef.current.scale.set(1 + breathX, 1 + breathY, 1 + breathX);
    }
  });

  const mainColor = modelId === 'bacillus' ? "#0ea5e9" : "#10b981"; 
  const emissiveColor = modelId === 'bacillus' ? "#0369a1" : "#065f46";

  return (
    <group ref={groupRef}>
      {/* Outer Slime Layer / Capsule - Organic Layer */}
      <mesh>
        <capsuleGeometry args={[0.6, 1.55, 32, 64]} />
        <MeshDistortMaterial 
          color={mainColor} 
          opacity={0.3} 
          metalness={0.1} 
          roughness={0.6} 
          transparent
          distort={0.15}
          speed={2}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Capsule (Main Layer) - Distorted glowing inner layer */}
      <mesh>
        <capsuleGeometry args={[0.55, 1.5, 32, 64]} />
        <MeshDistortMaterial 
          color={mainColor} 
          speed={4} 
          distort={0.3} 
          radius={1} 
          transparent 
          opacity={0.4} 
          side={THREE.DoubleSide}
          metalness={0.5}
          roughness={0.2}
          emissive={emissiveColor}
          emissiveIntensity={0.6}
        />
      </mesh>
      
      {/* Cell Wall (Intermediate Layer) - Wireframe to give cell structure */}
      <mesh>
        <capsuleGeometry args={[0.53, 1.5, 16, 32]} />
        <MeshWobbleMaterial 
          color={mainColor} 
          wireframe 
          transparent 
          opacity={0.3} 
          factor={0.2}
          speed={2}
        />
      </mesh>

      {/* Cytoplasm (Inner Body) */}
      <mesh>
        <capsuleGeometry args={[0.48, 1.48, 32, 64]} />
        <MeshDistortMaterial color={mainColor} transparent opacity={0.7} metalness={0.3} roughness={0.5} distort={0.2} speed={3} />
      </mesh>

      {/* Nucleoid (Complex DNA structure) */}
      <group rotation={[Math.PI / 4, Math.PI / 6, 0]}>
        <mesh>
          <torusKnotGeometry args={[0.22, 0.04, 256, 32, 4, 9]} />
          <MeshWobbleMaterial color={modelId === 'bacillus' ? "#38bdf8" : "#34d399"} emissive={modelId === 'bacillus' ? "#0284c7" : "#059669"} emissiveIntensity={0.5} factor={0.8} speed={3} roughness={0.3} />
        </mesh>
      </group>

      <Ribosomes color={modelId === 'bacillus' ? "#38bdf8" : "#34d399"} />
      <Pili color={modelId === 'bacillus' ? "#7dd3fc" : "#6ee7b7"} />
      <Plasmid position={[0.2, 0.5, 0.1]} />
      <Plasmid position={[-0.2, -0.6, -0.1]} color="#67e8f9" />

      {/* Peritrichous Flagella for Bacillus */}
      {modelId === 'bacillus' ? (
        <>
          <Flagellum position={[0, -1.6, 0]} rotation={[0.2, 0, 0]} color={mainColor} count={3} />
          <Flagellum position={[0.4, 0, 0.3]} rotation={[0, Math.PI/2, 0]} color={mainColor} />
          <Flagellum position={[-0.4, -0.5, -0.3]} rotation={[0, -Math.PI/2, 0]} color={mainColor} />
        </>
      ) : (
        <Flagellum position={[0, -1.6, 0]} rotation={[0, 0, 0]} color={mainColor} count={2} />
      )}

      {hotspots.map((h, i) => <Annotation key={i} hotspot={h} onSelect={onSelect} />)}
    </group>
  );
};

const Virus = ({ modelId, onSelect }: { modelId: string, onSelect: (h: Hotspot) => void }) => {
  const groupRef = useRef<THREE.Group>(null);
  const hotspots = MODAL_DATA[modelId] || MODAL_DATA.virus;
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.008;
      groupRef.current.rotation.x = Math.cos(state.clock.elapsedTime * 0.3) * 0.1;
      const breath = Math.sin(state.clock.elapsedTime * 2) * 0.03;
      groupRef.current.scale.setScalar(1 + breath);
    }
  });

  const isEnveloped = modelId === 'virus'; 
  const virusColor = modelId === 'adenovirus' ? "#6366f1" : "#ef4444"; // Indigo vs Vivid Red
  const emissiveColor = modelId === 'adenovirus' ? "#4338ca" : "#991b1b";

  return (
    <group ref={groupRef}>
      {/* Envelope for relevant viruses */}
      {isEnveloped && (
        <>
          <mesh>
            <sphereGeometry args={[1.45, 64, 64]} />
            <MeshDistortMaterial 
              color={virusColor} 
              opacity={0.2} 
              roughness={0.7} 
              transparent 
              distort={0.15}
              speed={2}
              side={THREE.DoubleSide} 
            />
          </mesh>
          <mesh>
            <sphereGeometry args={[1.4, 64, 64]} />
            <MeshDistortMaterial color={virusColor} transparent opacity={0.4} speed={1.5} distort={0.25} metalness={0.5} roughness={0.1} emissive={emissiveColor} emissiveIntensity={0.5} />
          </mesh>
        </>
      )}

      {/* Capsid */}
      <mesh>
        <icosahedronGeometry args={[1, 5]} />
        <MeshDistortMaterial 
          color={virusColor} 
          flatShading 
          transparent 
          opacity={0.9}
          metalness={0.2}
          roughness={0.6}
          distort={0.05}
          speed={1}
          emissive={emissiveColor}
          emissiveIntensity={0.4}
        />
      </mesh>
      
      {/* Wireframe overlay for structural emphasis */}
      <mesh>
        <icosahedronGeometry args={[1.02, 5]} />
        <MeshWobbleMaterial color={virusColor} wireframe transparent opacity={0.4} factor={0.1} speed={1} />
      </mesh>

      {/* Internal Genome (DNA/RNA strand) */}
      <mesh rotation={[Math.PI / 4, 0, 0]}>
        <torusKnotGeometry args={[0.3, 0.08, 128, 16, 2, 3]} />
        <MeshWobbleMaterial color="#fca5a5" emissive="#fca5a5" emissiveIntensity={0.5} factor={0.8} speed={3} />
      </mesh>

      {/* Spikes / Fibers with better design */}
      {hotspots.filter(h => h.title === "Spike Protein" || h.title === "Fiber").map((h, i) => (
         <group key={i} position={h.position}>
            <mesh rotation={[Math.PI, 0, 0]}>
              <capsuleGeometry args={[0.02, 0.4, 12, 16]} />
              <MeshWobbleMaterial color={virusColor} emissive={emissiveColor} emissiveIntensity={0.4} factor={0.2} speed={2} roughness={0.4} />
            </mesh>
            <mesh position={[0, 0.2, 0]}>
              <sphereGeometry args={[0.06, 16, 16]} />
              <meshStandardMaterial color={virusColor} roughness={0.5} />
            </mesh>
         </group>
      ))}

      {hotspots.map((h, i) => <Annotation key={i} hotspot={h} onSelect={onSelect} />)}
    </group>
  );
};

// Phage Organic Tail Fiber
const PhageLeg = () => {
  const curve = useMemo(() => new THREE.CatmullRomCurve3([
    new THREE.Vector3(0.1, -0.1, 0),
    new THREE.Vector3(0.3, -0.4, 0.1),
    new THREE.Vector3(0.5, -0.8, 0.2),
    new THREE.Vector3(0.6, -1.2, 0.3)
  ]), []);
  return (
    <mesh>
      <tubeGeometry args={[curve, 32, 0.015, 8, false]} />
      <MeshWobbleMaterial color="#0f766e" factor={0.5} speed={2} roughness={0.4} />
    </mesh>
  );
};

// Organelles: Mitochondria
const Mitochondrion = ({ position, rotation }: { position: [number, number, number], rotation: [number, number, number] }) => {
  return (
    <group position={position} rotation={rotation}>
      <mesh>
        <capsuleGeometry args={[0.08, 0.2, 16, 32]} />
        <MeshDistortMaterial color="#ea580c" transparent opacity={0.8} roughness={0.5} distort={0.1} speed={1.5} />
      </mesh>
      <mesh scale={[0.8, 0.8, 0.8]}>
        <capsuleGeometry args={[0.08, 0.2, 16, 32]} />
        <MeshDistortMaterial color="#fcd34d" emissive="#f97316" emissiveIntensity={0.5} distort={0.1} speed={2} wireframe />
      </mesh>
    </group>
  );
};

// Organelles: ER (Endoplasmic Reticulum)
const ER = ({ position, rotation }: { position: [number, number, number], rotation: [number, number, number] }) => {
  return (
    <group position={position} rotation={rotation}>
      <mesh>
        <torusGeometry args={[0.3, 0.03, 16, 64, Math.PI]} />
        <MeshDistortMaterial color="#fb7185" transparent opacity={0.8} distort={0.2} speed={1.5} side={THREE.DoubleSide} roughness={0.3} />
      </mesh>
      <mesh position={[0, 0.1, 0]}>
        <torusGeometry args={[0.2, 0.03, 16, 64, Math.PI]} />
        <MeshDistortMaterial color="#fda4af" transparent opacity={0.8} distort={0.2} speed={1.5} side={THREE.DoubleSide} roughness={0.3} />
      </mesh>
    </group>
  );
};

const Yeast = ({ modelId, onSelect }: { modelId: string, onSelect: (h: Hotspot) => void }) => {
  const groupRef = useRef<THREE.Group>(null);
  const hotspots = MODAL_DATA[modelId] || MODAL_DATA.yeast;
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.004;
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.05;
      const breath = Math.sin(state.clock.elapsedTime * 1.5) * 0.03;
      groupRef.current.scale.set(1 + breath, 1 + breath * 1.2, 1 + breath);
    }
  });

  return (
    <group ref={groupRef}>
      {/* Cell Wall (Organic outer layer) */}
      <mesh scale={[1, 1.1, 1]}>
        <sphereGeometry args={[1.02, 64, 64]} />
        <MeshDistortMaterial 
          color="#f59e0b" 
          opacity={0.4} 
          metalness={0.1} 
          roughness={0.6} 
          transparent
          distort={0.1}
          speed={2}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Inner organic layer */}
      <mesh scale={[1, 1.1, 1]}>
        <sphereGeometry args={[1, 64, 64]} />
        <MeshDistortMaterial color="#f59e0b" speed={2.5} distort={0.4} transparent opacity={0.5} roughness={0.3} metalness={0.5} emissive="#b45309" emissiveIntensity={0.3} />
      </mesh>

      {/* Internal Organelles */}
      {/* Nucleus */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.35, 32, 32]} />
        <meshStandardMaterial color="#78350f" metalness={0.4} roughness={0.2} emissive="#78350f" emissiveIntensity={0.3} />
      </mesh>

      {/* Vacuole */}
      <mesh position={[-0.35, -0.2, 0.45]}>
        <sphereGeometry args={[0.25, 24, 24]} />
        <meshStandardMaterial color="#ffedd5" transparent opacity={0.8} metalness={0.9} roughness={0.05} />
      </mesh>

      <Mitochondrion position={[0.4, -0.4, 0.2]} rotation={[0.5, 0.2, 0.1]} />
      <Mitochondrion position={[-0.5, 0.3, -0.2]} rotation={[-0.3, 0.5, 0.4]} />
      <ER position={[0, 0.4, 0]} rotation={[Math.PI/2, 0, 0]} />

      {/* Mitochondria/Other Granules */}
      <Ribosomes count={15} color="#f97316" areaSize={[0.8, 0.8, 0.8]} />

      {/* Budding Daughter Cell (Organic attachment) */}
      <group position={[0.7, 0.7, 0]}>
        {/* Daughter outer layer */}
        <mesh scale={0.52}>
           <sphereGeometry args={[1, 32, 32]} />
           <MeshDistortMaterial 
             color="#fbbf24" 
             opacity={0.4}
             roughness={0.6} 
             transparent 
             distort={0.15}
             speed={2}
             side={THREE.DoubleSide} 
           />
        </mesh>
        
        {/* Daughter inner layer */}
        <mesh scale={0.5}>
           <sphereGeometry args={[1, 32, 32]} />
           <MeshDistortMaterial color="#fbbf24" speed={3} distort={0.35} emissive="#d97706" emissiveIntensity={0.3} transparent opacity={0.7} />
        </mesh>
        {/* Connection point */}
        <mesh position={[-0.3, -0.3, 0]} rotation={[0, 0, -Math.PI / 4]}>
           <capsuleGeometry args={[0.2, 0.4, 16, 16]} />
           <MeshWobbleMaterial color="#f59e0b" factor={0.2} speed={2} />
        </mesh>
      </group>

      {hotspots.map((h, i) => <Annotation key={i} hotspot={h} onSelect={onSelect} />)}
    </group>
  );
};

const Parasite = ({ modelId, onSelect }: { modelId: string, onSelect: (h: Hotspot) => void }) => {
  const groupRef = useRef<THREE.Group>(null);
  const hotspots = MODAL_DATA[modelId] || MODAL_DATA.parasite;
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.003;
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
      const breath = Math.sin(state.clock.elapsedTime * 2.5) * 0.02;
      groupRef.current.scale.set(1 - breath, 1 + breath, 1 - breath);
    }
  });

  return (
    <group ref={groupRef}>
      {/* Trophozoite Body (Outer organic layer) */}
      <mesh rotation={[0, 0, Math.PI / 6]}>
        <capsuleGeometry args={[0.42, 2.02, 32, 64]} />
        <MeshDistortMaterial 
          color="#d946ef" 
          opacity={0.3}
          roughness={0.6} 
          transparent 
          distort={0.1}
          speed={1.5}
          side={THREE.DoubleSide} 
        />
      </mesh>

      {/* Trophozoite Body (Inner distorted layer) */}
      <mesh rotation={[0, 0, Math.PI / 6]}>
        <capsuleGeometry args={[0.4, 2, 32, 64]} />
        <MeshDistortMaterial color="#d946ef" speed={2} distort={0.3} metalness={0.5} roughness={0.2} emissive="#701a75" emissiveIntensity={0.5} transparent opacity={0.8} />
      </mesh>

      {/* Apical Complex */}
      <mesh position={[0, 1.15, 0]}>
        <capsuleGeometry args={[0.18, 0.3, 16, 32]} />
        <MeshDistortMaterial color="#a21caf" transparent opacity={0.8} roughness={0.5} distort={0.1} speed={1.5} />
      </mesh>

      {/* Internal Micronemes/Organelles */}
      <Ribosomes count={25} color="#f0abfc" areaSize={[0.3, 1.5, 0.3]} />
      
      {/* Rhoptries (Polar organelles) */}
      <group position={[0, 0.8, 0]}>
        <mesh position={[0.1, 0, 0]} rotation={[0, 0, 0.2]}>
          <capsuleGeometry args={[0.05, 0.3, 4, 8]} />
          <meshStandardMaterial color="#9d174d" />
        </mesh>
        <mesh position={[-0.1, 0, 0]} rotation={[0, 0, -0.2]}>
          <capsuleGeometry args={[0.05, 0.3, 4, 8]} />
          <meshStandardMaterial color="#9d174d" />
        </mesh>
      </group>

      {/* Nucleus */}
      <mesh position={[0, -0.2, 0]}>
        <sphereGeometry args={[0.25, 32, 32]} />
        <meshStandardMaterial color="#701a75" emissive="#db2777" emissiveIntensity={0.4} />
      </mesh>

      {hotspots.map((h, i) => <Annotation key={i} hotspot={h} onSelect={onSelect} />)}
    </group>
  );
};

const Phage = ({ onSelect }: { onSelect: (h: Hotspot) => void }) => {
  const groupRef = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.008;
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 1.5) * 0.15;
      const breath = Math.sin(state.clock.elapsedTime * 3) * 0.015;
      groupRef.current.scale.set(0.8 + breath, 0.8 - breath, 0.8 + breath);
    }
  });

  const phageColor = "#0f766e";
  const glowColor = "#34d399";

  return (
    <group ref={groupRef} scale={0.8} position={[0, 0.5, 0]}>
      {/* Head (Capsid) */}
      <mesh position={[0, 1.2, 0]}>
        <icosahedronGeometry args={[0.5, 5]} />
        <MeshDistortMaterial color={phageColor} flatShading transparent opacity={0.9} roughness={0.6} distort={0.1} speed={1.5} />
      </mesh>
      <mesh position={[0, 1.2, 0]} scale={0.4}>
        <torusKnotGeometry args={[0.3, 0.1, 64, 8]} />
        <MeshWobbleMaterial color={glowColor} emissive={glowColor} emissiveIntensity={0.8} factor={0.4} speed={2} />
      </mesh>

      {/* Collar */}
      <mesh position={[0, 0.9, 0]}>
        <cylinderGeometry args={[0.1, 0.15, 0.05, 12]} />
        <meshStandardMaterial color={phageColor} />
      </mesh>

      {/* Tail Tube (Sheath) */}
      <mesh position={[0, 0.3, 0]}>
        <cylinderGeometry args={[0.08, 0.08, 1.2, 12]} />
        <meshStandardMaterial color={phageColor} metalness={0.5} />
      </mesh>
      {/* Spring-like Sheath */}
      <mesh position={[0, 0.8, 0]} rotation={[0, 0, 0]}>
        <torusGeometry args={[0.09, 0.02, 8, 32]} />
        <meshStandardMaterial color={phageColor} />
      </mesh>
      <mesh position={[0, 0.6, 0]} rotation={[0, 0, 0]}>
        <torusGeometry args={[0.09, 0.02, 8, 32]} />
        <meshStandardMaterial color={phageColor} />
      </mesh>
      <mesh position={[0, 0.4, 0]} rotation={[0, 0, 0]}>
        <torusGeometry args={[0.09, 0.02, 8, 32]} />
        <meshStandardMaterial color={phageColor} />
      </mesh>
      <mesh position={[0, 0.2, 0]} rotation={[0, 0, 0]}>
        <torusGeometry args={[0.09, 0.02, 8, 32]} />
        <meshStandardMaterial color={phageColor} />
      </mesh>

      {/* Base Plate */}
      <mesh position={[0, -0.3, 0]}>
        <cylinderGeometry args={[0.18, 0.18, 0.1, 16]} />
        <MeshWobbleMaterial color={phageColor} metalness={0.9} factor={0.1} speed={1} />
      </mesh>

      {/* Tail Fibers (Legs) */}
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <group key={i} rotation={[0, (i * Math.PI) / 3, 0]} position={[0, -0.3, 0]}>
          <PhageLeg />
        </group>
      ))}

      {MODAL_DATA.virus.map((h, i) => <Annotation key={i} hotspot={h} onSelect={onSelect} />)}
    </group>
  );
};

export const ThreeViewer: React.FC<{ modelId: string }> = ({ modelId }) => {
  const [selectedHotspot, setSelectedHotspot] = useState<Hotspot | null>(null);
  
  const renderModel = () => {
    const id = modelId.toLowerCase();
    if (id === 'phage' || id === 'bacteriophage') {
      return <Phage onSelect={setSelectedHotspot} />;
    }
    if (id === 'adenovirus' || id === 'virus') {
      return <Virus modelId={id} onSelect={setSelectedHotspot} />;
    }
    if (id === 'yeast' || id === 'fungus') {
      return <Yeast modelId="yeast" onSelect={setSelectedHotspot} />;
    }
    if (id === 'parasite' || id === 'protozoa') {
      return <Parasite modelId="parasite" onSelect={setSelectedHotspot} />;
    }
    return <Bacterium modelId={id} onSelect={setSelectedHotspot} />;
  };

  return (
    <div className="w-full h-[450px] bg-brand-ink rounded-2xl overflow-hidden relative border border-brand-denim/20 shadow-2xl group">
      <div className="absolute top-4 left-4 z-10 pointer-events-none">
        <span className="text-brand-alabaster/60 text-[10px] font-black uppercase tracking-[0.2em] bg-brand-prussian/60 px-3 py-1 rounded-full border border-white/10 backdrop-blur-md">
          {modelId} • Interactive Structure
        </span>
      </div>

      <Canvas shadows>
        <PerspectiveCamera makeDefault position={[0, 0, 5]} />
        <OrbitControls enableZoom={true} enableDamping dampingFactor={0.05} rotateSpeed={0.5} maxDistance={10} minDistance={2} />
        
        <fog attach="fog" args={["#0f172a", 4, 15]} />
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 10, 5]} intensity={1.2} castShadow color="#f8fafc" />
        <pointLight position={[-10, -10, -10]} intensity={0.8} color="#38bdf8" />
        
        <Environment preset="warehouse" />
        <Sparkles count={200} scale={14} size={3} speed={0.4} opacity={0.4} color="#a5f3fc" />
        
        <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
          {renderModel()}
        </Float>

        <ContactShadows 
          position={[0, -2.5, 0]} 
          opacity={0.4} 
          scale={10} 
          blur={2.5} 
          far={4} 
        />
      </Canvas>

      <AnimatePresence>
        {selectedHotspot && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="absolute bottom-6 left-6 right-6 z-20"
          >
            <div className="bg-white/95 backdrop-blur-xl p-5 rounded-2xl shadow-2xl border border-brand-denim/10 flex gap-4 items-start relative max-w-md mx-auto">
              <button 
                onClick={() => setSelectedHotspot(null)}
                className="absolute top-2 right-2 bg-brand-alabaster text-brand-dusk p-1.5 rounded-full hover:bg-red-500 hover:text-white transition-all shadow-sm"
                id="close-hotspot-btn"
              >
                <X className="w-3.5 h-3.5" />
              </button>
              <div className="bg-brand-prussian p-2.5 rounded-xl text-brand-alabaster shadow-lg shadow-brand-ink/20 shrink-0 mt-1">
                <Info className="w-5 h-5" />
              </div>
              <div className="pr-4">
                <h4 className="text-sm font-black text-brand-ink uppercase tracking-tight mb-1">
                  {selectedHotspot.title}
                </h4>
                <p className="text-xs text-brand-dusk font-medium leading-relaxed italic">
                  {selectedHotspot.description}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="absolute bottom-4 right-4 z-10 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="text-white/30 text-[9px] font-bold uppercase tracking-widest bg-black/40 px-2 py-1 rounded">
          Orbit: Click + Drag • Zoom: Scroll
        </div>
      </div>
    </div>
  );
};

