import React, { useEffect, useState, useRef, useCallback } from 'react';
import { motion, useAnimation, useMotionValue, useTransform, useInView } from 'framer-motion';
import { ChevronDown, Github, Linkedin, Mail, Download, Code, Zap, Rocket, Sparkles, Star, ArrowRight, TrendingUp } from 'lucide-react';

interface AnimatedHeroProps {
  developer: {
    name: string;
    title: string;
    bio: string;
    email: string;
    phone?: string;
    location: string;
    github?: string;
    linkedin?: string;
    years_experience?: number;
    resume_url?: string;
    avatar_url?: string;
  };
}

interface FloatingElement {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  speed: number;
  rotation: number;
  icon: any;
}

const AnimatedHero: React.FC<AnimatedHeroProps> = ({ developer }) => {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true });
  const [typewriterText, setTypewriterText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [floatingElements, setFloatingElements] = useState<FloatingElement[]>([]);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  // Advanced mouse tracking for parallax effects
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useTransform(mouseY, [-300, 300], [10, -10]);
  const rotateY = useTransform(mouseX, [-300, 300], [-10, 10]);

  const roles = [
    '🚀 Full Stack Engineer',
    '💎 Ruby on Rails Expert', 
    '⚡ React Architect',
    '🐍 Python Developer',
    '☁️ DevOps Engineer',
    '🧠 AI Problem Solver'
  ];

  // Initialize floating tech icons
  useEffect(() => {
    const techIcons = [Code, Zap, Rocket, Star, Github, Sparkles];
    const elements = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      size: Math.random() * 30 + 20,
      color: `hsl(${Math.random() * 360}, 70%, 60%)`,
      speed: Math.random() * 2 + 1,
      rotation: Math.random() * 360,
      icon: techIcons[Math.floor(Math.random() * techIcons.length)]
    }));
    setFloatingElements(elements);
  }, []);

  // Animate floating elements
  useEffect(() => {
    const animateElements = () => {
      setFloatingElements(prev => prev.map(element => {
        // Magnetic attraction to mouse
        const dx = mousePosition.x - element.x;
        const dy = mousePosition.y - element.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const attraction = 50 / (distance + 1);
        
        return {
          ...element,
          x: (element.x + element.speed + dx * attraction * 0.01) % window.innerWidth,
          y: (element.y + element.speed * 0.5 + dy * attraction * 0.01) % window.innerHeight,
          rotation: element.rotation + element.speed
        };
      }));
    };

    const interval = setInterval(animateElements, 100);
    return () => clearInterval(interval);
  }, [mousePosition]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const rect = ref.current?.getBoundingClientRect();
    if (rect) {
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      mouseX.set(x);
      mouseY.set(y);
      setMousePosition({ x: e.clientX, y: e.clientY });
    }
  }, [mouseX, mouseY]);

  useEffect(() => {
    const typewriterEffect = () => {
      const currentRole = roles[currentIndex];
      let charIndex = 0;
      const interval = setInterval(() => {
        setTypewriterText(currentRole.slice(0, charIndex + 1));
        charIndex++;
        if (charIndex >= currentRole.length) {
          clearInterval(interval);
          setTimeout(() => {
            // Clear text before next role
            const clearInterval2 = setInterval(() => {
              charIndex--;
              setTypewriterText(currentRole.slice(0, charIndex));
              if (charIndex === 0) {
                clearInterval(clearInterval2);
                setCurrentIndex((prev) => (prev + 1) % roles.length);
              }
            }, 50);
          }, 2000);
        }
      }, 100);
    };

    typewriterEffect();
  }, [currentIndex]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  const floatingAnimation = {
    y: [-10, 10, -10],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut"
    }
  };

  const statsAnimation = {
    scale: [1, 1.05, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut"
    }
  };

  return (
    <motion.section
      ref={ref}
      className="relative min-h-screen overflow-hidden flex items-center justify-center"
      onMouseMove={handleMouseMove}
      style={{
        background: `
          radial-gradient(circle at 20% 20%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
          radial-gradient(circle at 80% 80%, rgba(255, 119, 198, 0.3) 0%, transparent 50%),
          radial-gradient(circle at 40% 60%, rgba(120, 219, 255, 0.3) 0%, transparent 50%),
          linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 25%, #16213e 50%, #0f3460 75%, #0a0a0a 100%)
        `,
        perspective: '1000px'
      }}
    >
      {/* Floating Tech Icons Background */}
      <div className="absolute inset-0 overflow-hidden">
        {floatingElements.map((element) => {
          const IconComponent = element.icon;
          return (
            <motion.div
              key={element.id}
              className="absolute pointer-events-none z-10"
              style={{
                left: element.x,
                top: element.y,
                width: element.size,
                height: element.size,
              }}
              animate={{
                rotate: element.rotation,
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.7, 0.3]
              }}
              transition={{
                duration: 4 + Math.random() * 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <IconComponent
                size={element.size}
                className="text-white"
                style={{ 
                  color: element.color,
                  filter: 'drop-shadow(0 0 10px currentColor)'
                }}
              />
            </motion.div>
          );
        })}
      </div>

      {/* Neural Network Background Effect */}
      <div className="absolute inset-0 z-0">
        <svg className="w-full h-full opacity-20">
          <defs>
            <linearGradient id="neuralGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#667eea" stopOpacity="0.5" />
              <stop offset="50%" stopColor="#764ba2" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#f093fb" stopOpacity="0.5" />
            </linearGradient>
          </defs>
          {Array.from({ length: 50 }, (_, i) => (
            <motion.line
              key={i}
              x1={Math.random() * 100 + '%'}
              y1={Math.random() * 100 + '%'}
              x2={Math.random() * 100 + '%'}
              y2={Math.random() * 100 + '%'}
              stroke="url(#neuralGradient)"
              strokeWidth="1"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ 
                pathLength: [0, 1, 0], 
                opacity: [0, 0.7, 0] 
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
                ease: "easeInOut"
              }}
            />
          ))}
        </svg>
      </div>

      {/* Main Content Container with 3D Transform */}
      <motion.div
        className="relative z-20 max-w-7xl mx-auto px-6 py-20"
        style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.5 }}
      >
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Side - Text Content */}
          <motion.div 
            className="text-center lg:text-left space-y-8"
            initial={{ opacity: 0, x: -100 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 1, delay: 0.7 }}
          >
            {/* Greeting with Particle Effect */}
            <motion.div
              className="relative inline-block"
              whileHover={{ scale: 1.05 }}
            >
              <motion.h1 
                className="text-sm md:text-lg font-medium text-gray-300 mb-4 relative"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
              >
                👋 Hello, I'm
                <motion.span
                  className="absolute -top-2 -right-8"
                  animate={{ 
                    rotate: [0, 15, -15, 0],
                    scale: [1, 1.2, 1] 
                  }}
                  transition={{ 
                    duration: 2, 
                    repeat: Infinity,
                    ease: "easeInOut" 
                  }}
                >
                  ✨
                </motion.span>
              </motion.h1>
            </motion.div>

            {/* Name with Gradient Animation */}
            <motion.h2
              className="text-5xl md:text-7xl lg:text-8xl font-bold leading-tight"
              style={{
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #667eea 75%, #764ba2 100%)",
                backgroundSize: "300% 300%",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text"
              }}
              animate={isInView ? {
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                opacity: 1,
                scale: 1
              } : {
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                opacity: 0,
                scale: 0.8
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "linear"
              }}
              initial={{ opacity: 0, scale: 0.8 }}
            >
              {developer?.name || 'Shoaib Shaikh'}
            </motion.h2>

            {/* Dynamic Role with Typewriter */}
            <motion.div 
              className="h-16 flex items-center justify-center lg:justify-start"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5 }}
            >
              <motion.h3
                className="text-2xl md:text-4xl font-medium text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400"
                key={currentIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                {typewriterText}
                <motion.span
                  className="inline-block ml-1"
                  animate={{ opacity: [0, 1, 0] }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  |
                </motion.span>
              </motion.h3>
            </motion.div>

            {/* Bio with Enhanced Typography */}
            <motion.p
              className="text-lg md:text-xl text-gray-300 leading-relaxed max-w-2xl"
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1, delay: 1.8 }}
            >
              {developer?.bio || "Crafting extraordinary digital experiences with cutting-edge technologies and innovative solutions that drive business growth."}
            </motion.p>

            {/* Enhanced CTA Buttons */}
            <motion.div
              className="flex flex-col sm:flex-row gap-6 pt-8"
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1, delay: 2 }}
            >
              {/* Primary CTA */}
              <motion.button
                className="group relative px-8 py-4 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-full font-semibold text-white shadow-2xl overflow-hidden"
                whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(139, 92, 246, 0.4)" }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  const element = document.getElementById('contact');
                  element?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500"
                  initial={{ x: '-100%' }}
                  whileHover={{ x: '100%' }}
                  transition={{ duration: 0.6, ease: "easeInOut" }}
                />
                <span className="relative flex items-center gap-2">
                  Let's Collaborate 🚀
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </motion.button>

              {/* Secondary CTA */}
              <motion.button
                className="group px-8 py-4 border-2 border-purple-500 rounded-full font-semibold text-purple-400 hover:text-white hover:bg-purple-500/20 backdrop-blur-sm transition-all duration-300"
                whileHover={{ scale: 1.05, borderColor: '#a855f7' }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  if (developer?.resume_url) {
                    window.open(developer.resume_url, '_blank');
                  }
                }}
              >
                <span className="flex items-center gap-2">
                  <Download className="w-5 h-5 group-hover:-translate-y-1 transition-transform" />
                  Download Resume
                </span>
              </motion.button>
            </motion.div>

            {/* Social Links with Magnetic Effect */}
            <motion.div
              className="flex gap-6 pt-8 justify-center lg:justify-start"
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ duration: 1, delay: 2.3 }}
            >
              {developer?.github && (
                <motion.a
                  href={developer.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative p-4 bg-white/5 backdrop-blur-sm rounded-full border border-white/10 hover:border-purple-400/50 transition-all duration-300"
                  whileHover={{ scale: 1.1, rotateZ: 5 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Github className="w-6 h-6 text-gray-400 group-hover:text-white transition-colors" />
                  <motion.div
                    className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 opacity-0 group-hover:opacity-20 transition-opacity"
                  />
                </motion.a>
              )}
              
              {developer?.linkedin && (
                <motion.a
                  href={developer.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative p-4 bg-white/5 backdrop-blur-sm rounded-full border border-white/10 hover:border-blue-400/50 transition-all duration-300"
                  whileHover={{ scale: 1.1, rotateZ: -5 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Linkedin className="w-6 h-6 text-gray-400 group-hover:text-white transition-colors" />
                  <motion.div
                    className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 opacity-0 group-hover:opacity-20 transition-opacity"
                  />
                </motion.a>
              )}

              <motion.a
                href={`mailto:${developer?.email}`}
                className="group relative p-4 bg-white/5 backdrop-blur-sm rounded-full border border-white/10 hover:border-emerald-400/50 transition-all duration-300"
                whileHover={{ scale: 1.1, rotateZ: 5 }}
                whileTap={{ scale: 0.9 }}
              >
                <Mail className="w-6 h-6 text-gray-400 group-hover:text-white transition-colors" />
                <motion.div
                  className="absolute inset-0 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 opacity-0 group-hover:opacity-20 transition-opacity"
                />
              </motion.a>
            </motion.div>
          </motion.div>

          {/* Right Side - 3D Avatar & Stats */}
          <motion.div 
            className="relative"
            initial={{ opacity: 0, x: 100 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 1, delay: 1 }}
          >
            {/* 3D Avatar Container */}
            <motion.div
              className="relative mx-auto w-80 h-80 lg:w-96 lg:h-96"
              animate={{
                rotateY: [0, 10, -10, 0],
                y: [-10, 10, -10]
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              {/* Outer Glow Ring */}
              <motion.div
                className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 p-1"
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              >
                <div className="w-full h-full rounded-full bg-gray-900" />
              </motion.div>

              {/* Avatar Content */}
              <motion.div
                className="absolute inset-4 rounded-full bg-gradient-to-br from-purple-900/50 to-blue-900/50 backdrop-blur-sm border border-white/20 flex items-center justify-center overflow-hidden"
                whileHover={{ scale: 1.05 }}
              >
                {developer?.avatar_url ? (
                  <img
                    src={developer.avatar_url}
                    alt={developer.name}
                    className="w-full h-full object-cover rounded-full"
                  />
                ) : (
                  <motion.div
                    className="text-6xl"
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    👨‍💻
                  </motion.div>
                )}
              </motion.div>

              {/* Floating Stats Cards */}
              <motion.div
                className="absolute -top-6 -left-8 bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-sm rounded-xl p-4 border border-white/20 shadow-2xl"
                animate={{ 
                  y: [0, -10, 0],
                  rotate: [0, 2, -2, 0]
                }}
                transition={{ 
                  duration: 4, 
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <div className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-yellow-400" />
                  <div className="text-white">
                    <div className="text-2xl font-bold">{developer?.years_experience || 5}+</div>
                    <div className="text-xs opacity-75">Years Experience</div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                className="absolute -bottom-6 -right-8 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 backdrop-blur-sm rounded-xl p-4 border border-white/20 shadow-2xl"
                animate={{ 
                  y: [0, 10, 0],
                  rotate: [0, -2, 2, 0]
                }}
                transition={{ 
                  duration: 4, 
                  repeat: Infinity,
                  delay: 2,
                  ease: "easeInOut"
                }}
              >
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-emerald-400" />
                  <div className="text-white">
                    <div className="text-2xl font-bold">98%</div>
                    <div className="text-xs opacity-75">Success Rate</div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                className="absolute top-1/2 -right-12 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 backdrop-blur-sm rounded-xl p-4 border border-white/20 shadow-2xl"
                animate={{ 
                  x: [0, 10, 0],
                  rotate: [0, 3, -3, 0]
                }}
                transition={{ 
                  duration: 5, 
                  repeat: Infinity,
                  delay: 1,
                  ease: "easeInOut"
                }}
              >
                <div className="flex items-center gap-2">
                  <Rocket className="w-5 h-5 text-purple-400" />
                  <div className="text-white">
                    <div className="text-2xl font-bold">50+</div>
                    <div className="text-xs opacity-75">Projects</div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-30"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="flex flex-col items-center text-white/70">
          <span className="text-sm mb-2">Scroll to explore</span>
          <ChevronDown className="w-6 h-6" />
        </div>
      </motion.div>
    </motion.section>
  );
};

export default AnimatedHero;
