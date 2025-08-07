import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion, useAnimation, useInView, useMotionValue, useSpring } from 'framer-motion';
import { Code2, Database, Globe, Server, Wrench, Brain, Sparkles, Zap, Star } from 'lucide-react';

interface Skill {
  id: number;
  name: string;
  category: string;
  proficiency: number;
  years_experience?: number;
}

interface Technology {
  id: number;
  name: string;
  category: string;
  proficiency: number;
  icon?: string;
}

interface AnimatedSkillsProps {
  skills: Skill[];
  technologies?: Technology[];
}

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  life: number;
}

const categoryIcons = {
  Languages: Code2,
  Frontend: Globe,
  Backend: Server,
  Database: Database,
  DevOps: Wrench,
  default: Brain
};

const categoryColors = {
  Languages: 'from-blue-500 via-cyan-500 to-indigo-600',
  Frontend: 'from-purple-500 via-pink-500 to-rose-600',
  Backend: 'from-emerald-500 via-teal-500 to-green-600',
  Database: 'from-orange-500 via-red-500 to-amber-600',
  DevOps: 'from-violet-500 via-purple-500 to-fuchsia-600',
  default: 'from-gray-500 via-slate-500 to-zinc-600'
};

const AnimatedSkills: React.FC<AnimatedSkillsProps> = ({ skills, technologies }) => {
  const ref = useRef(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const controls = useAnimation();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [particles, setParticles] = useState<Particle[]>([]);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [hoveredSkill, setHoveredSkill] = useState<number | null>(null);
  
  // Physics-based mouse tracking
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springConfig = { damping: 25, stiffness: 700 };
  const springX = useSpring(mouseX, springConfig);
  const springY = useSpring(mouseY, springConfig);

  useEffect(() => {
    if (isInView) {
      controls.start('visible');
    }
  }, [isInView, controls]);

  // Particle system initialization and animation
  useEffect(() => {
    const generateParticles = () => {
      const newParticles: Particle[] = [];
      for (let i = 0; i < 50; i++) {
        newParticles.push({
          id: i,
          x: Math.random() * (containerRef.current?.offsetWidth || window.innerWidth),
          y: Math.random() * (containerRef.current?.offsetHeight || window.innerHeight),
          vx: (Math.random() - 0.5) * 2,
          vy: (Math.random() - 0.5) * 2,
          size: Math.random() * 3 + 1,
          color: `hsl(${Math.random() * 360}, 70%, 60%)`,
          life: Math.random() * 100 + 50
        });
      }
      setParticles(newParticles);
    };

    generateParticles();
    
    const animateParticles = () => {
      setParticles(prevParticles => 
        prevParticles.map(particle => {
          // Physics calculations for magnetic attraction
          const dx = mousePosition.x - particle.x;
          const dy = mousePosition.y - particle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          const attraction = hoveredSkill ? 100 / (distance + 1) : 0;
          
          return {
            ...particle,
            x: particle.x + particle.vx + (dx * attraction * 0.001),
            y: particle.y + particle.vy + (dy * attraction * 0.001),
            vx: particle.vx * 0.99 + (Math.random() - 0.5) * 0.1,
            vy: particle.vy * 0.99 + (Math.random() - 0.5) * 0.1,
            life: particle.life - 0.5
          };
        }).filter(p => p.life > 0)
      );
    };

    const interval = setInterval(animateParticles, 50);
    return () => clearInterval(interval);
  }, [mousePosition, hoveredSkill]);

  // Mouse tracking with physics
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (rect) {
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      setMousePosition({ x, y });
      mouseX.set(x);
      mouseY.set(y);
    }
  }, [mouseX, mouseY]);

  const skillsByCategory = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) acc[skill.category] = [];
    acc[skill.category].push(skill);
    return acc;
  }, {} as Record<string, Skill[]>);

  const categories = ['all', ...Object.keys(skillsByCategory)];
  const filteredSkills = selectedCategory === 'all' ? skills : skillsByCategory[selectedCategory] || [];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const skillVariants = {
    hidden: { 
      opacity: 0, 
      scale: 0,
      rotate: -180,
      y: 100
    },
    visible: {
      opacity: 1,
      scale: 1,
      rotate: 0,
      y: 0,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 200,
        duration: 0.8
      }
    }
  };

  const magneticVariants = {
    rest: { scale: 1, rotateY: 0, z: 0 },
    hover: { 
      scale: 1.15, 
      rotateY: 15, 
      z: 50,
      transition: { 
        type: "spring", 
        stiffness: 400, 
        damping: 20 
      } 
    }
  };

  return (
    <motion.div
      ref={ref}
      className="relative min-h-screen py-16 md:py-20 overflow-hidden"
      onMouseMove={handleMouseMove}
      style={{
        background: `
          radial-gradient(circle at 20% 20%, rgba(120, 119, 198, 0.1) 0%, transparent 50%),
          radial-gradient(circle at 80% 80%, rgba(255, 119, 198, 0.1) 0%, transparent 50%),
          radial-gradient(circle at 40% 60%, rgba(120, 219, 255, 0.1) 0%, transparent 50%),
          linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%)
        `
      }}
    >
      {/* Animated Particle Canvas */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute rounded-full"
            style={{
              left: particle.x,
              top: particle.y,
              width: particle.size,
              height: particle.size,
              backgroundColor: particle.color,
              opacity: particle.life / 100,
              filter: 'blur(0.5px)',
              boxShadow: `0 0 ${particle.size * 2}px ${particle.color}`
            }}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.8, 0.3]
            }}
            transition={{
              duration: 2 + Math.random() * 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      <div ref={containerRef} className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Enhanced Section Header */}
        <motion.div 
          className="text-center mb-12 md:mb-16"
          initial={{ opacity: 0, y: -50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <motion.div
            className="inline-flex items-center justify-center p-3 mb-6 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full backdrop-blur-sm border border-white/10"
            animate={{
              rotate: [0, 360],
              scale: [1, 1.1, 1]
            }}
            transition={{
              rotate: { duration: 20, repeat: Infinity, ease: "linear" },
              scale: { duration: 4, repeat: Infinity, ease: "easeInOut" }
            }}
          >
            <Brain className="w-8 h-8 text-purple-400" />
          </motion.div>
          
          <motion.h2 
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6"
            style={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              backgroundSize: "200% 200%"
            }}
            animate={{
              backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"]
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "linear"
            }}
          >
            Skills & Expertise
          </motion.h2>
          
          <motion.p 
            className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            A comprehensive toolkit of technologies and frameworks mastered through years of 
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 font-semibold"> hands-on experience</span> 
            and continuous learning
          </motion.p>
        </motion.div>

        {/* Physics-Based Category Filters */}
        <motion.div 
          className="flex flex-wrap justify-center gap-3 md:gap-4 mb-12 md:mb-16"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {categories.map((category) => {
            const IconComponent = categoryIcons[category as keyof typeof categoryIcons] || categoryIcons.default;
            const isActive = selectedCategory === category;
            
            return (
              <motion.button
                key={category}
                onClick={() => setSelectedCategory(category)}
                variants={skillVariants}
                whileHover="hover"
                whileTap={{ scale: 0.95 }}
                className={`
                  relative px-4 py-2 md:px-6 md:py-3 rounded-full font-medium text-sm md:text-base
                  transition-all duration-300 backdrop-blur-sm border
                  ${isActive 
                    ? `bg-gradient-to-r ${categoryColors[category as keyof typeof categoryColors] || categoryColors.default} text-white border-white/30 shadow-lg shadow-purple-500/25` 
                    : 'bg-white/10 text-gray-300 border-white/20 hover:bg-white/20 hover:border-white/30'
                  }
                `}
                animate={isActive ? {
                  scale: [1, 1.05, 1],
                  boxShadow: [
                    "0 0 20px rgba(139, 92, 246, 0.3)",
                    "0 0 30px rgba(139, 92, 246, 0.5)",
                    "0 0 20px rgba(139, 92, 246, 0.3)"
                  ]
                } : {}}
                transition={{
                  duration: 2,
                  repeat: isActive ? Infinity : 0,
                  ease: "easeInOut"
                }}
              >
                <div className="flex items-center gap-2">
                  <IconComponent className="w-4 h-4 md:w-5 md:h-5" />
                  <span className="capitalize">
                    {category === 'all' ? 'All Skills' : category}
                  </span>
                </div>
                
                {/* Magnetic glow effect */}
                {isActive && (
                  <motion.div
                    className="absolute inset-0 rounded-full opacity-30 blur-md"
                    style={{
                      background: `linear-gradient(135deg, ${categoryColors[category as keyof typeof categoryColors] || categoryColors.default})`
                    }}
                    animate={{
                      opacity: [0.2, 0.4, 0.2],
                      scale: [1, 1.1, 1]
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                )}
              </motion.button>
            );
          })}
        </motion.div>

        {/* Revolutionary Skills Grid with Physics */}
        <motion.div
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6 lg:gap-8 mb-16 md:mb-20"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {filteredSkills.map((skill, index) => {
            const IconComponent = categoryIcons[skill.category as keyof typeof categoryIcons] || categoryIcons.default;
            const categoryColor = categoryColors[skill.category as keyof typeof categoryColors] || categoryColors.default;
            
            return (
              <motion.div
                key={skill.id}
                variants={magneticVariants}
                initial="rest"
                whileHover="hover"
                onHoverStart={() => setHoveredSkill(skill.id)}
                onHoverEnd={() => setHoveredSkill(null)}
                className="group relative"
              >
                {/* Magnetic field visualization */}
                <motion.div
                  className="absolute inset-0 rounded-3xl"
                  style={{
                    background: `conic-gradient(from ${index * 40}deg, rgba(139, 92, 246, 0.1), rgba(219, 39, 119, 0.1), rgba(59, 130, 246, 0.1), rgba(139, 92, 246, 0.1))`
                  }}
                  animate={hoveredSkill === skill.id ? {
                    rotate: [0, 360],
                    scale: [1, 1.2, 1]
                  } : {}}
                  transition={{
                    duration: 4,
                    repeat: hoveredSkill === skill.id ? Infinity : 0,
                    ease: "linear"
                  }}
                />
                
                {/* Main skill card */}
                <motion.div
                  className={`
                    relative p-4 md:p-6 rounded-3xl backdrop-blur-xl border border-white/10
                    bg-gradient-to-br from-white/5 to-white/10 
                    shadow-xl hover:shadow-2xl transition-all duration-500
                    group-hover:border-white/30
                  `}
                  style={{
                    transform: hoveredSkill === skill.id ? 'translateZ(50px)' : 'translateZ(0px)',
                    transformStyle: 'preserve-3d'
                  }}
                  animate={hoveredSkill === skill.id ? {
                    boxShadow: [
                      "0 20px 60px rgba(139, 92, 246, 0.2)",
                      "0 30px 80px rgba(219, 39, 119, 0.3)",
                      "0 20px 60px rgba(59, 130, 246, 0.2)",
                      "0 20px 60px rgba(139, 92, 246, 0.2)"
                    ]
                  } : {}}
                  transition={{
                    duration: 3,
                    repeat: hoveredSkill === skill.id ? Infinity : 0,
                    ease: "easeInOut"
                  }}
                >
                  {/* Floating particles around hovered skill */}
                  {hoveredSkill === skill.id && (
                    <>
                      {[...Array(6)].map((_, i) => (
                        <motion.div
                          key={i}
                          className="absolute w-1 h-1 bg-white rounded-full"
                          style={{
                            left: '50%',
                            top: '50%',
                          }}
                          animate={{
                            x: Math.cos(i * 60 * Math.PI / 180) * 40,
                            y: Math.sin(i * 60 * Math.PI / 180) * 40,
                            opacity: [0, 1, 0],
                            scale: [0, 1.5, 0]
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            delay: i * 0.2,
                            ease: "easeOut"
                          }}
                        />
                      ))}
                    </>
                  )}
                  
                  {/* Icon with physics animation */}
                  <motion.div 
                    className={`w-8 h-8 md:w-10 md:h-10 mx-auto mb-3 md:mb-4 p-2 rounded-xl bg-gradient-to-r ${categoryColor} relative`}
                    animate={hoveredSkill === skill.id ? {
                      rotate: [0, 180, 360],
                      scale: [1, 1.3, 1]
                    } : {}}
                    transition={{
                      duration: 1.5,
                      ease: "easeInOut"
                    }}
                  >
                    <IconComponent className="w-full h-full text-white" />
                    
                    {/* Energy burst effect */}
                    {hoveredSkill === skill.id && (
                      <motion.div
                        className="absolute inset-0 rounded-xl opacity-50 blur-sm"
                        style={{
                          background: `linear-gradient(135deg, ${categoryColor})`
                        }}
                        animate={{
                          opacity: [0, 0.5, 0],
                          scale: [1, 1.5, 2]
                        }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          ease: "easeOut"
                        }}
                      />
                    )}
                  </motion.div>
                  
                  {/* Skill name */}
                  <h3 className="text-xs sm:text-sm md:text-base font-semibold text-white mb-2 md:mb-3 text-center group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-pink-400 transition-all duration-300">
                    {skill.name}
                  </h3>
                  
                  {/* Animated proficiency bar */}
                  <div className="relative">
                    <div className="w-full bg-gray-700/50 rounded-full h-2 mb-2 overflow-hidden">
                      <motion.div
                        className={`h-full bg-gradient-to-r ${categoryColor} relative overflow-hidden`}
                        initial={{ width: 0 }}
                        animate={isInView ? { width: `${skill.proficiency}%` } : { width: 0 }}
                        transition={{
                          delay: index * 0.1,
                          duration: 1.5,
                          ease: "easeOut"
                        }}
                      >
                        {/* Shimmer effect */}
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                          animate={{
                            x: [-100, 100]
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            delay: index * 0.1,
                            ease: "linear"
                          }}
                        />
                      </motion.div>
                    </div>
                    
                    {/* Proficiency percentage */}
                    <motion.div 
                      className="text-xs text-center text-gray-300 font-medium"
                      animate={hoveredSkill === skill.id ? {
                        scale: [1, 1.2, 1],
                        color: ["#d1d5db", "#a855f7", "#d1d5db"]
                      } : {}}
                      transition={{
                        duration: 1,
                        repeat: hoveredSkill === skill.id ? Infinity : 0
                      }}
                    >
                      {skill.proficiency}%
                    </motion.div>
                  </div>
                </motion.div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Physics-Based Statistics Dashboard */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 mb-16"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {/* Total Skills */}
          <motion.div
            variants={skillVariants}
            className="relative group"
            whileHover={{ scale: 1.05, rotateY: 5 }}
          >
            <motion.div
              className="p-6 md:p-8 rounded-3xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 backdrop-blur-xl border border-blue-500/30 relative overflow-hidden"
              animate={{
                boxShadow: [
                  "0 0 20px rgba(59, 130, 246, 0.3)",
                  "0 0 40px rgba(59, 130, 246, 0.5)",
                  "0 0 20px rgba(59, 130, 246, 0.3)"
                ]
              }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-cyan-500/10"
                animate={{
                  scale: [1, 1.1, 1],
                  opacity: [0.3, 0.6, 0.3]
                }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              />
              
              <div className="relative z-10">
                <motion.div
                  className="flex items-center justify-between mb-4"
                  animate={{
                    y: [0, -5, 0]
                  }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                  <Brain className="w-8 h-8 md:w-10 md:h-10 text-blue-400" />
                  <Sparkles className="w-6 h-6 text-cyan-400" />
                </motion.div>
                
                <motion.div
                  className="text-3xl md:text-4xl font-bold text-blue-400 mb-2"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={isInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
                >
                  {skills.length}
                </motion.div>
                
                <div className="text-gray-300 text-sm md:text-base">Core Skills Mastered</div>
                
                <motion.div
                  className="absolute -bottom-2 -right-2 w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full opacity-20"
                  animate={{
                    scale: [1, 1.5, 1],
                    rotate: [0, 180, 360]
                  }}
                  transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                />
              </div>
            </motion.div>
          </motion.div>

          {/* Expert Level Skills */}
          <motion.div
            variants={skillVariants}
            className="relative group"
            whileHover={{ scale: 1.05, rotateY: -5 }}
          >
            <motion.div
              className="p-6 md:p-8 rounded-3xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 backdrop-blur-xl border border-emerald-500/30 relative overflow-hidden"
              animate={{
                boxShadow: [
                  "0 0 20px rgba(16, 185, 129, 0.3)",
                  "0 0 40px rgba(16, 185, 129, 0.5)",
                  "0 0 20px rgba(16, 185, 129, 0.3)"
                ]
              }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-teal-500/10"
                animate={{
                  scale: [1, 1.1, 1],
                  opacity: [0.3, 0.6, 0.3]
                }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
              />
              
              <div className="relative z-10">
                <motion.div
                  className="flex items-center justify-between mb-4"
                  animate={{
                    y: [0, -5, 0]
                  }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
                >
                  <Star className="w-8 h-8 md:w-10 md:h-10 text-emerald-400" />
                  <Zap className="w-6 h-6 text-teal-400" />
                </motion.div>
                
                <motion.div
                  className="text-3xl md:text-4xl font-bold text-emerald-400 mb-2"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={isInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ delay: 0.7, type: "spring", stiffness: 200 }}
                >
                  {skills.filter(s => s.proficiency >= 90).length}
                </motion.div>
                
                <div className="text-gray-300 text-sm md:text-base">Expert Level Skills</div>
                
                <motion.div
                  className="absolute -bottom-2 -right-2 w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full opacity-20"
                  animate={{
                    scale: [1, 1.5, 1],
                    rotate: [360, 180, 0]
                  }}
                  transition={{ duration: 6, repeat: Infinity, ease: "linear", delay: 0.5 }}
                />
              </div>
            </motion.div>
          </motion.div>

          {/* Average Proficiency */}
          <motion.div
            variants={skillVariants}
            className="relative group"
            whileHover={{ scale: 1.05, rotateY: 5 }}
          >
            <motion.div
              className="p-6 md:p-8 rounded-3xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-xl border border-purple-500/30 relative overflow-hidden"
              animate={{
                boxShadow: [
                  "0 0 20px rgba(168, 85, 247, 0.3)",
                  "0 0 40px rgba(168, 85, 247, 0.5)",
                  "0 0 20px rgba(168, 85, 247, 0.3)"
                ]
              }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10"
                animate={{
                  scale: [1, 1.1, 1],
                  opacity: [0.3, 0.6, 0.3]
                }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              />
              
              <div className="relative z-10">
                <motion.div
                  className="flex items-center justify-between mb-4"
                  animate={{
                    y: [0, -5, 0]
                  }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
                >
                  <Globe className="w-8 h-8 md:w-10 md:h-10 text-purple-400" />
                  <Sparkles className="w-6 h-6 text-pink-400" />
                </motion.div>
                
                <motion.div
                  className="text-3xl md:text-4xl font-bold text-purple-400 mb-2"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={isInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ delay: 0.9, type: "spring", stiffness: 200 }}
                >
                  {Math.round(skills.reduce((acc, skill) => acc + skill.proficiency, 0) / skills.length)}%
                </motion.div>
                
                <div className="text-gray-300 text-sm md:text-base">Average Proficiency</div>
                
                <motion.div
                  className="absolute -bottom-2 -right-2 w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full opacity-20"
                  animate={{
                    scale: [1, 1.5, 1],
                    rotate: [0, 180, 360]
                  }}
                  transition={{ duration: 6, repeat: Infinity, ease: "linear", delay: 1 }}
                />
              </div>
            </motion.div>
          </motion.div>

          {/* Technologies Count */}
          <motion.div
            variants={skillVariants}
            className="relative group"
            whileHover={{ scale: 1.05, rotateY: -5 }}
          >
            <motion.div
              className="p-6 md:p-8 rounded-3xl bg-gradient-to-br from-orange-500/20 to-red-500/20 backdrop-blur-xl border border-orange-500/30 relative overflow-hidden"
              animate={{
                boxShadow: [
                  "0 0 20px rgba(249, 115, 22, 0.3)",
                  "0 0 40px rgba(249, 115, 22, 0.5)",
                  "0 0 20px rgba(249, 115, 22, 0.3)"
                ]
              }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-red-500/10"
                animate={{
                  scale: [1, 1.1, 1],
                  opacity: [0.3, 0.6, 0.3]
                }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
              />
              
              <div className="relative z-10">
                <motion.div
                  className="flex items-center justify-between mb-4"
                  animate={{
                    y: [0, -5, 0]
                  }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.9 }}
                >
                  <Server className="w-8 h-8 md:w-10 md:h-10 text-orange-400" />
                  <Wrench className="w-6 h-6 text-red-400" />
                </motion.div>
                
                <motion.div
                  className="text-3xl md:text-4xl font-bold text-orange-400 mb-2"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={isInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ delay: 1.1, type: "spring", stiffness: 200 }}
                >
                  {technologies?.length || 0}+
                </motion.div>
                
                <div className="text-gray-300 text-sm md:text-base">Technologies Used</div>
                
                <motion.div
                  className="absolute -bottom-2 -right-2 w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-full opacity-20"
                  animate={{
                    scale: [1, 1.5, 1],
                    rotate: [360, 180, 0]
                  }}
                  transition={{ duration: 6, repeat: Infinity, ease: "linear", delay: 1.5 }}
                />
              </div>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Interactive Physics Demo */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 1.5, duration: 0.8 }}
        >
          <motion.p 
            className="text-gray-400 text-sm md:text-base max-w-2xl mx-auto"
            animate={{
              opacity: [0.5, 1, 0.5]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <Sparkles className="inline w-4 h-4 mr-2" />
            Hover over skills to experience magnetic attraction effects and particle physics
            <Sparkles className="inline w-4 h-4 ml-2" />
          </motion.p>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default AnimatedSkills;
