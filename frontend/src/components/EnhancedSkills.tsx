import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion, useAnimation, useInView, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Code2, Database, Globe, Server, Wrench, Brain, Star, Zap, Award, TrendingUp } from 'lucide-react';

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

interface EnhancedSkillsProps {
  skills: Skill[];
  technologies?: Technology[];
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

// Animated Counter Component
const AnimatedCounter: React.FC<{ 
  value: number; 
  duration?: number;
  suffix?: string;
}> = ({ value, duration = 2, suffix = '' }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (!isInView) return;

    let startTime = Date.now();
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / (duration * 1000), 1);
      
      // Ease-out animation
      const easeOut = 1 - Math.pow(1 - progress, 3);
      setDisplayValue(Math.floor(value * easeOut));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    animate();
  }, [isInView, value, duration]);

  return <span ref={ref}>{displayValue}{suffix}</span>;
};

// Radial Progress Component
const RadialProgress: React.FC<{
  percentage: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  delay?: number;
}> = ({ percentage, size = 120, strokeWidth = 8, color = '#3b82f6', delay = 0 }) => {
  const ref = useRef<SVGSVGElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg
        ref={ref}
        width={size}
        height={size}
        className="transform -rotate-90"
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          className="text-white/10"
        />
        
        {/* Progress circle */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={isInView ? { strokeDashoffset: offset } : {}}
          transition={{ 
            duration: 2, 
            delay: delay,
            ease: "easeInOut" 
          }}
          className="drop-shadow-lg"
          style={{
            filter: `drop-shadow(0 0 8px ${color}40)`
          }}
        />
      </svg>
      
      {/* Percentage text */}
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-2xl font-bold text-white">
          {isInView ? <AnimatedCounter value={percentage} suffix="%" /> : '0%'}
        </span>
      </div>
    </div>
  );
};

// Enhanced Skill Card Component
const EnhancedSkillCard: React.FC<{ 
  skill: Skill; 
  index: number;
  style: 'radial' | 'bar' | 'stars';
}> = ({ skill, index, style }) => {
  const [isHovered, setIsHovered] = useState(false);
  const IconComponent = categoryIcons[skill.category as keyof typeof categoryIcons] || categoryIcons.default;
  const gradientColor = categoryColors[skill.category as keyof typeof categoryColors] || categoryColors.default;

  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 60,
      rotateX: -15,
      scale: 0.9
    },
    visible: {
      opacity: 1,
      y: 0,
      rotateX: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 150,
        damping: 15,
        delay: index * 0.1
      }
    }
  };

  const renderSkillLevel = () => {
    switch (style) {
      case 'radial':
        return (
          <div className="flex items-center justify-center mb-4">
            <RadialProgress 
              percentage={skill.proficiency} 
              delay={index * 0.1}
              color={`hsl(${200 + (skill.proficiency * 1.8)}, 70%, 55%)`}
            />
          </div>
        );
      
      case 'stars':
        const stars = Math.floor(skill.proficiency / 20);
        const halfStar = (skill.proficiency % 20) >= 10;
        return (
          <div className="flex items-center justify-center mb-4 gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <motion.div
                key={star}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 + star * 0.1 }}
              >
                <Star 
                  className={`w-6 h-6 ${
                    star <= stars 
                      ? 'text-yellow-400 fill-yellow-400' 
                      : star === stars + 1 && halfStar
                      ? 'text-yellow-400 fill-yellow-400/50'
                      : 'text-gray-600'
                  }`} 
                />
              </motion.div>
            ))}
          </div>
        );
      
      default: // bar
        return (
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-300">Proficiency</span>
              <span className="text-sm font-bold text-white">
                <AnimatedCounter value={skill.proficiency} suffix="%" />
              </span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden">
              <motion.div
                className={`h-full bg-gradient-to-r ${gradientColor} rounded-full relative`}
                initial={{ width: 0 }}
                whileInView={{ width: `${skill.proficiency}%` }}
                viewport={{ once: true }}
                transition={{ duration: 1.5, delay: index * 0.1, ease: "easeOut" }}
              >
                <motion.div
                  className="absolute inset-0 bg-white/20 rounded-full"
                  animate={{ x: ['-100%', '100%'] }}
                  transition={{ 
                    duration: 2, 
                    repeat: Infinity, 
                    repeatDelay: 3,
                    ease: "easeInOut" 
                  }}
                />
              </motion.div>
            </div>
          </div>
        );
    }
  };

  return (
    <motion.div
      variants={cardVariants}
      className="group relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ perspective: '1000px' }}
    >
      <motion.div
        className={`
          relative bg-gradient-to-br from-white/10 via-white/5 to-transparent 
          backdrop-blur-xl rounded-2xl p-6 border border-white/20 
          hover:border-white/40 transition-all duration-500
          ${isHovered ? 'shadow-2xl shadow-black/50' : 'shadow-lg shadow-black/25'}
        `}
        whileHover={{ 
          y: -10,
          rotateX: 5,
          rotateY: 5,
          scale: 1.02,
          transformStyle: 'preserve-3d'
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        {/* Background Gradient Overlay */}
        <motion.div
          className={`absolute inset-0 bg-gradient-to-br ${gradientColor} rounded-2xl opacity-0 group-hover:opacity-10 transition-opacity duration-500`}
        />
        
        {/* Category Icon */}
        <motion.div
          className="flex items-center justify-center w-14 h-14 rounded-xl bg-white/10 backdrop-blur-lg mb-4 mx-auto"
          whileHover={{ rotate: 360, scale: 1.1 }}
          transition={{ duration: 0.6 }}
        >
          <IconComponent className={`w-7 h-7 text-white drop-shadow-lg`} />
        </motion.div>

        {/* Skill Name */}
        <h3 className="text-xl font-bold text-white text-center mb-2">
          {skill.name}
        </h3>
        
        {/* Category */}
        <p className="text-sm text-gray-300 text-center mb-4">
          {skill.category}
        </p>

        {/* Skill Level Visualization */}
        {renderSkillLevel()}

        {/* Years Experience */}
        {skill.years_experience && (
          <motion.div
            className="flex items-center justify-center gap-2 mt-4 text-sm text-gray-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: index * 0.1 + 0.5 }}
          >
            <TrendingUp className="w-4 h-4" />
            <AnimatedCounter value={skill.years_experience} suffix=" years" />
          </motion.div>
        )}

        {/* Hover Effect Overlay */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-white/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{
            background: `linear-gradient(135deg, transparent 0%, rgba(255,255,255,0.05) 50%, transparent 100%)`
          }}
        />
      </motion.div>
    </motion.div>
  );
};

const EnhancedSkills: React.FC<EnhancedSkillsProps> = ({ skills, technologies }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const controls = useAnimation();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [skillDisplayStyle, setSkillDisplayStyle] = useState<'radial' | 'bar' | 'stars'>('radial');
  
  useEffect(() => {
    if (isInView) {
      controls.start('visible');
    }
  }, [isInView, controls]);

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

  return (
    <motion.section
      ref={ref}
      id="skills"
      className="relative min-h-screen py-20 overflow-hidden"
      style={{
        background: `
          radial-gradient(circle at 20% 20%, rgba(59, 130, 246, 0.15) 0%, transparent 50%),
          radial-gradient(circle at 80% 80%, rgba(147, 51, 234, 0.15) 0%, transparent 50%),
          radial-gradient(circle at 40% 60%, rgba(16, 185, 129, 0.15) 0%, transparent 50%),
          linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)
        `
      }}
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-white/10 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [-20, 20, -20],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <motion.h2
            className="text-5xl md:text-6xl font-bold mb-6"
            style={{
              background: 'linear-gradient(135deg, #60a5fa 0%, #a78bfa 50%, #f472b6 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
            animate={{
              backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
            }}
            transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
          >
            Skills & Expertise
          </motion.h2>
          
          <motion.p
            className="text-xl text-gray-300 max-w-3xl mx-auto mb-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            Crafting digital experiences with cutting-edge technologies and creative solutions
          </motion.p>

          {/* Display Style Toggles */}
          <motion.div
            className="flex justify-center gap-4 mb-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            {[
              { key: 'radial', label: 'Radial', icon: Zap },
              { key: 'bar', label: 'Progress', icon: TrendingUp },
              { key: 'stars', label: 'Stars', icon: Star },
            ].map(({ key, label, icon: Icon }) => (
              <motion.button
                key={key}
                onClick={() => setSkillDisplayStyle(key as any)}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-300
                  ${skillDisplayStyle === key 
                    ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/25' 
                    : 'bg-white/10 text-gray-300 hover:bg-white/20'
                  }
                `}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Icon className="w-4 h-4" />
                {label}
              </motion.button>
            ))}
          </motion.div>
        </motion.div>

        {/* Category Filters */}
        <motion.div
          className="flex flex-wrap justify-center gap-4 mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          {categories.map((category) => {
            const IconComponent = categoryIcons[category as keyof typeof categoryIcons] || categoryIcons.default;
            return (
              <motion.button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`
                  flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-300
                  ${selectedCategory === category
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/25'
                    : 'bg-white/10 backdrop-blur-lg text-gray-300 hover:bg-white/20 border border-white/10'
                  }
                `}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <IconComponent className="w-5 h-5" />
                {category === 'all' ? 'All Skills' : category}
              </motion.button>
            );
          })}
        </motion.div>

        {/* Skills Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={controls}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
        >
          {filteredSkills.map((skill, index) => (
            <EnhancedSkillCard
              key={skill.id}
              skill={skill}
              index={index}
              style={skillDisplayStyle}
            />
          ))}
        </motion.div>

        {/* Technologies Section (if provided) */}
        {technologies && technologies.length > 0 && (
          <motion.div
            className="mt-20"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            <h3 className="text-3xl font-bold text-center text-white mb-12">
              Technologies & Tools
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
              {technologies.map((tech, index) => (
                <motion.div
                  key={tech.id}
                  className="group relative bg-white/5 backdrop-blur-lg rounded-xl p-4 border border-white/10 hover:border-white/30 transition-all duration-300"
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05, duration: 0.5 }}
                  whileHover={{ 
                    scale: 1.1, 
                    y: -5,
                    rotateY: 10,
                    boxShadow: "0 20px 40px rgba(0,0,0,0.3)"
                  }}
                >
                  <div className="text-center">
                    <h4 className="text-sm font-semibold text-white mb-1">{tech.name}</h4>
                    <p className="text-xs text-gray-400 mb-2">{tech.category}</p>
                    <div className="text-xs text-blue-400 font-medium">
                      {tech.proficiency}%
                    </div>
                  </div>
                  
                  {/* Subtle glow effect on hover */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </motion.section>
  );
};

export default EnhancedSkills;
