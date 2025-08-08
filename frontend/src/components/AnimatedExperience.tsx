import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion, useAnimation, useInView, useMotionValue, useTransform } from 'framer-motion';
import { Building2, Calendar, MapPin, TrendingUp, Users, Award, Briefcase, GraduationCap, Rocket, Star, Zap, Target } from 'lucide-react';
import EmptyState from './EmptyState';

interface Experience {
  id: number;
  title: string;
  company: string;
  company_url?: string;
  location: string;
  employment_type: string;
  start_date: string;
  end_date?: string;
  description: string;
  achievements: string[];
  is_current: boolean;
  duration: string;
  technologies: string[];
}

interface AnimatedExperienceProps {
  experiences: Experience[];
}

interface FloatingIcon {
  id: number;
  x: number;
  y: number;
  icon: React.ComponentType<any>;
  color: string;
  size: number;
  speed: number;
}

const AnimatedExperience: React.FC<AnimatedExperienceProps> = ({ experiences }) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const controls = useAnimation();
  
  // Mouse tracking for 3D effects
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useTransform(mouseY, [-300, 300], [10, -10]);
  const rotateY = useTransform(mouseX, [-300, 300], [-10, 10]);
  
  // Floating background icons
  const [floatingIcons, setFloatingIcons] = useState<FloatingIcon[]>([]);
  const [hoveredExperience, setHoveredExperience] = useState<number | null>(null);

  // All hooks must be called before any early returns
  useEffect(() => {
    if (isInView) {
      controls.start('visible');
    }
  }, [controls, isInView]);

  // Initialize floating icons
  useEffect(() => {
    if (!experiences || experiences.length === 0) return; // Only run if we have experiences
    
    const icons = [Rocket, Star, Zap, Target, Award, TrendingUp, Users, Building2];
    const newIcons: FloatingIcon[] = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      x: Math.random() * (window.innerWidth || 1200),
      y: Math.random() * (window.innerHeight || 800),
      icon: icons[Math.floor(Math.random() * icons.length)],
      color: ['#667eea', '#764ba2', '#f093fb', '#4facfe', '#00f2fe', '#43e97b'][Math.floor(Math.random() * 6)],
      size: 20 + Math.random() * 15,
      speed: 0.3 + Math.random() * 0.7
    }));
    setFloatingIcons(newIcons);
  }, [experiences]);

  // Animate floating icons
  useEffect(() => {
    if (!experiences || experiences.length === 0) return; // Only run if we have experiences
    
    const animateIcons = () => {
      setFloatingIcons(prev => prev.map(icon => ({
        ...icon,
        x: (icon.x + icon.speed) % (window.innerWidth || 1200),
        y: icon.y + Math.sin(Date.now() * 0.001 + icon.id) * 0.5,
      })));
    };

    const interval = setInterval(animateIcons, 50);
    return () => clearInterval(interval);
  }, [experiences]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const rect = ref.current?.getBoundingClientRect();
    if (rect) {
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      mouseX.set(x * 0.1);
      mouseY.set(y * 0.1);
    }
  }, [mouseX, mouseY]);

  // Handle empty experiences data - moved after all hooks
  if (!experiences || experiences.length === 0) {
    return (
      <motion.section
        id="experience"
        className="relative min-h-screen py-20 flex items-center justify-center"
        style={{
          background: `
            radial-gradient(circle at 30% 30%, rgba(129, 140, 248, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 70% 70%, rgba(251, 191, 36, 0.1) 0%, transparent 50%),
            linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)
          `
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <motion.h2
              className="text-4xl md:text-5xl font-bold text-white mb-4"
              initial={{ opacity: 0, y: -30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              Work <span className="bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-transparent">Experience</span>
            </motion.h2>
          </div>
          <EmptyState 
            type="experience"
            title="No Experience Available"
            description="Work experience information is currently unavailable. Please check back later."
          />
        </div>
      </motion.section>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3
      }
    }
  };

  const timelineVariants = {
    hidden: { 
      opacity: 0,
      scaleY: 0
    },
    visible: {
      opacity: 1,
      scaleY: 1,
      transition: {
        duration: 2,
        ease: "easeInOut"
      }
    }
  };

  const experienceVariants = {
    hidden: (index: number) => ({
      opacity: 0,
      x: index % 2 === 0 ? -100 : 100,
      y: 50,
      scale: 0.8
    }),
    visible: (index: number) => ({
      opacity: 1,
      x: 0,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
        delay: index * 0.3
      }
    })
  };

  return (
    <motion.section 
      ref={ref}
      className="relative min-h-screen py-20 overflow-hidden"
      onMouseMove={handleMouseMove}
      style={{
        background: `
          radial-gradient(circle at 20% 30%, rgba(139, 92, 246, 0.2) 0%, transparent 50%),
          radial-gradient(circle at 80% 70%, rgba(59, 130, 246, 0.2) 0%, transparent 50%),
          radial-gradient(circle at 40% 90%, rgba(236, 72, 153, 0.15) 0%, transparent 50%),
          linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 25%, #16213e 50%, #0e1628 75%, #0a0a0a 100%)
        `,
        perspective: '1000px'
      }}
    >
      {/* Floating Background Icons */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {floatingIcons.map((iconData) => {
          const IconComponent = iconData.icon;
          return (
            <motion.div
              key={iconData.id}
              className="absolute opacity-10"
              style={{
                left: iconData.x,
                top: iconData.y,
                width: iconData.size,
                height: iconData.size,
              }}
              animate={{
                rotate: [0, 360],
                scale: [1, 1.2, 1]
              }}
              transition={{
                duration: 8 + Math.random() * 4,
                repeat: Infinity,
                ease: "linear"
              }}
            >
              <IconComponent
                size={iconData.size}
                style={{ color: iconData.color }}
              />
            </motion.div>
          );
        })}
      </div>

      {/* Main Container with 3D Transform */}
      <motion.div
        className="relative z-10 max-w-7xl mx-auto px-6"
        style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        {/* Section Header */}
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: 0.3 }}
        >
          <motion.h2 
            className="text-5xl md:text-7xl font-bold mb-6 leading-tight"
            style={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #4facfe 75%, #00f2fe 100%)",
              backgroundSize: "300% 300%",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text"
            }}
            animate={{
              backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"]
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "linear"
            }}
          >
            My Journey 🚀
          </motion.h2>
          
          <motion.p 
            className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.8 }}
          >
            From ambitious dreams to extraordinary achievements - 
            here's the story of how I've been turning code into magic! ✨
          </motion.p>
        </motion.div>

        {/* Experience Timeline */}
        <div className="relative">
          {/* Central Timeline Line */}
          <motion.div
            className="absolute left-1/2 top-0 w-1 h-full transform -translate-x-1/2"
            style={{
              background: "linear-gradient(to bottom, #667eea, #764ba2, #f093fb, #4facfe, #00f2fe)"
            }}
            variants={timelineVariants}
            initial="hidden"
            animate={controls}
          />

          {/* Timeline Glow Effect */}
          <motion.div
            className="absolute left-1/2 top-0 w-4 h-full transform -translate-x-1/2 blur-sm opacity-50"
            style={{
              background: "linear-gradient(to bottom, #667eea, #764ba2, #f093fb, #4facfe, #00f2fe)"
            }}
            variants={timelineVariants}
            initial="hidden"
            animate={controls}
          />

          {/* Experience Cards */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={controls}
            className="relative space-y-16"
          >
            {experiences.map((experience, index) => (
              <motion.div
                key={experience.id}
                custom={index}
                variants={experienceVariants}
                className={`relative flex items-center ${
                  index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'
                }`}
                onHoverStart={() => setHoveredExperience(experience.id)}
                onHoverEnd={() => setHoveredExperience(null)}
              >
                {/* Timeline Node */}
                <motion.div
                  className="absolute left-1/2 transform -translate-x-1/2 z-20"
                  whileHover={{ scale: 1.5, rotate: 360 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 rounded-full border-4 border-white shadow-2xl flex items-center justify-center">
                    {experience.is_current ? (
                      <motion.div
                        className="w-3 h-3 bg-white rounded-full"
                        animate={{ scale: [1, 1.5, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                    ) : (
                      <div className="w-3 h-3 bg-white rounded-full" />
                    )}
                  </div>
                </motion.div>

                {/* Experience Card */}
                <motion.div
                  className={`w-full max-w-md mx-8 ${
                    index % 2 === 0 ? 'mr-auto ml-8' : 'ml-auto mr-8'
                  }`}
                  whileHover={{ 
                    scale: 1.05, 
                    rotateY: index % 2 === 0 ? 5 : -5,
                    z: 50 
                  }}
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  <div className="relative group">
                    {/* Card Background with Glassmorphism */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl"
                      animate={{
                        borderColor: hoveredExperience === experience.id 
                          ? ['rgba(139, 92, 246, 0.5)', 'rgba(236, 72, 153, 0.5)', 'rgba(59, 130, 246, 0.5)', 'rgba(139, 92, 246, 0.5)']
                          : 'rgba(255, 255, 255, 0.2)'
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />

                    {/* Hover Glow Effect */}
                    <motion.div
                      className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-20 transition-opacity duration-500"
                      style={{
                        background: `radial-gradient(circle at center, ${
                          index % 3 === 0 ? '#667eea' : index % 3 === 1 ? '#f093fb' : '#4facfe'
                        } 0%, transparent 70%)`
                      }}
                    />

                    {/* Card Content */}
                    <div className="relative z-10 p-8 space-y-6">
                      {/* Header */}
                      <div className="space-y-3">
                        {/* Company & Current Badge */}
                        <div className="flex items-center justify-between">
                          <motion.div
                            className="flex items-center gap-2"
                            whileHover={{ x: 5 }}
                          >
                            <Building2 size={20} className="text-purple-400" />
                            <h3 className="text-lg font-bold text-white">
                              {experience.company}
                            </h3>
                          </motion.div>
                          
                          {experience.is_current && (
                            <motion.div
                              className="px-3 py-1 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full text-xs font-bold text-white"
                              animate={{ 
                                scale: [1, 1.1, 1],
                                boxShadow: [
                                  '0 0 10px rgba(16, 185, 129, 0.5)',
                                  '0 0 20px rgba(16, 185, 129, 0.8)',
                                  '0 0 10px rgba(16, 185, 129, 0.5)'
                                ]
                              }}
                              transition={{ duration: 2, repeat: Infinity }}
                            >
                              🚀 CURRENT
                            </motion.div>
                          )}
                        </div>

                        {/* Job Title */}
                        <motion.h4
                          className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400"
                          whileHover={{ scale: 1.05 }}
                        >
                          {experience.title}
                        </motion.h4>

                        {/* Meta Information */}
                        <div className="flex flex-wrap gap-4 text-sm text-gray-300">
                          <div className="flex items-center gap-1">
                            <Calendar size={16} className="text-blue-400" />
                            <span>{experience.duration}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin size={16} className="text-emerald-400" />
                            <span>{experience.location}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Briefcase size={16} className="text-purple-400" />
                            <span>{experience.employment_type}</span>
                          </div>
                        </div>
                      </div>

                      {/* Description */}
                      <motion.p
                        className="text-gray-300 leading-relaxed"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                      >
                        {experience.description}
                      </motion.p>

                      {/* Achievements */}
                      {experience.achievements.length > 0 && (
                        <motion.div
                          className="space-y-3"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.7 }}
                        >
                          <div className="flex items-center gap-2">
                            <Award size={18} className="text-yellow-400" />
                            <h5 className="font-semibold text-white">Key Achievements</h5>
                          </div>
                          <ul className="space-y-2">
                            {experience.achievements.map((achievement, achIndex) => (
                              <motion.li
                                key={achIndex}
                                className="flex items-start gap-2 text-sm text-gray-300"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.8 + achIndex * 0.1 }}
                                whileHover={{ x: 5, color: '#ffffff' }}
                              >
                                <Star size={12} className="text-yellow-400 mt-1 flex-shrink-0" />
                                <span>{achievement}</span>
                              </motion.li>
                            ))}
                          </ul>
                        </motion.div>
                      )}

                      {/* Technologies */}
                      {experience.technologies.length > 0 && (
                        <motion.div
                          className="space-y-3"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 1 }}
                        >
                          <div className="flex items-center gap-2">
                            <Zap size={18} className="text-cyan-400" />
                            <h5 className="font-semibold text-white">Technologies Used</h5>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {experience.technologies.map((tech, techIndex) => (
                              <motion.span
                                key={techIndex}
                                className="px-3 py-1 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-400/30 rounded-full text-xs font-medium text-purple-300 backdrop-blur-sm"
                                whileHover={{ 
                                  scale: 1.1, 
                                  backgroundColor: 'rgba(139, 92, 246, 0.3)',
                                  borderColor: 'rgba(139, 92, 246, 0.6)'
                                }}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 1.1 + techIndex * 0.05 }}
                              >
                                {tech}
                              </motion.span>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </div>
                  </div>
                </motion.div>

                {/* Side Decoration */}
                <motion.div
                  className={`absolute ${
                    index % 2 === 0 ? 'right-8' : 'left-8'
                  } top-1/2 transform -translate-y-1/2 opacity-20`}
                  animate={{
                    rotate: [0, 360],
                    scale: [1, 1.2, 1]
                  }}
                  transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                >
                  <TrendingUp size={40} className="text-purple-400" />
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Bottom CTA */}
        <motion.div
          className="text-center mt-20"
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 2 }}
        >
          <motion.p
            className="text-xl text-gray-300 mb-8"
            whileHover={{ scale: 1.05 }}
          >
            Want to be part of my next chapter? Let's create something extraordinary together! 🌟
          </motion.p>
          
          <motion.button
            className="group px-8 py-4 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-full font-semibold text-white shadow-2xl"
            whileHover={{ 
              scale: 1.05, 
              boxShadow: "0 20px 40px rgba(139, 92, 246, 0.4)" 
            }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              const element = document.getElementById('contact');
              element?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            <span className="flex items-center gap-2">
              Let's Collaborate
              <Rocket className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </span>
          </motion.button>
        </motion.div>
      </motion.div>
    </motion.section>
  );
};

export default AnimatedExperience;
