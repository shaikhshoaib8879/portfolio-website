import React, { useEffect, useRef, useState } from 'react';
import { motion, useAnimation, useInView } from 'framer-motion';
import { Building2, Calendar, MapPin, Briefcase, Award, Star, Zap, Rocket } from 'lucide-react';
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

const AnimatedExperience: React.FC<AnimatedExperienceProps> = ({ experiences }) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const controls = useAnimation();
  const [hoveredExperience, setHoveredExperience] = useState<number | null>(null);

  useEffect(() => {
    if (isInView) {
      controls.start('visible');
    }
  }, [controls, isInView]);

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
      x: index % 2 === 0 ? -80 : 80,
      y: 30
    }),
    visible: (index: number) => ({
      opacity: 1,
      x: 0,
      y: 0,
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
      id="experience"
      className="relative min-h-screen py-20 overflow-hidden"
      style={{
        background: `
          radial-gradient(circle at 20% 30%, rgba(139, 92, 246, 0.2) 0%, transparent 50%),
          radial-gradient(circle at 80% 70%, rgba(59, 130, 246, 0.2) 0%, transparent 50%),
          radial-gradient(circle at 40% 90%, rgba(236, 72, 153, 0.15) 0%, transparent 50%),
          linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 25%, #16213e 50%, #0e1628 75%, #0a0a0a 100%)
        `
      }}
    >
      <div className="relative z-10 max-w-7xl mx-auto px-6">
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
            My Journey
          </motion.h2>

          <motion.p
            className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.8 }}
          >
            From ambitious dreams to extraordinary achievements -
            here's the story of how I've been turning code into impact.
          </motion.p>
        </motion.div>

        {/* Experience Timeline */}
        <div className="relative">
          {/* Timeline Line - left-aligned on mobile, center on md+ */}
          <motion.div
            className="absolute left-4 md:left-1/2 top-0 w-1 h-full md:-translate-x-1/2"
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
                className="relative flex items-start"
                onHoverStart={() => setHoveredExperience(experience.id)}
                onHoverEnd={() => setHoveredExperience(null)}
              >
                {/* Timeline Node - left on mobile, center on md+ */}
                <motion.div
                  className="absolute left-4 md:left-1/2 -translate-x-1/2 z-20"
                  whileHover={{ scale: 1.3 }}
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

                {/* Experience Card - always right of line on mobile, alternating on md+ */}
                <div
                  className={`ml-12 md:ml-0 w-full md:w-[calc(50%-2rem)] ${
                    index % 2 === 0
                      ? 'md:mr-auto md:pr-8'
                      : 'md:ml-auto md:pl-8'
                  }`}
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
                        <div className="flex items-center justify-between flex-wrap gap-2">
                          <div className="flex items-center gap-2">
                            <Building2 size={20} className="text-purple-400" />
                            <h3 className="text-lg font-bold text-white">
                              {experience.company}
                            </h3>
                          </div>

                          {experience.is_current && (
                            <motion.div
                              className="px-3 py-1 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full text-xs font-bold text-white"
                              animate={{
                                scale: [1, 1.1, 1],
                              }}
                              transition={{ duration: 2, repeat: Infinity }}
                            >
                              CURRENT
                            </motion.div>
                          )}
                        </div>

                        {/* Job Title */}
                        <h4 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400">
                          {experience.title}
                        </h4>

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
                      <p className="text-gray-300 leading-relaxed">
                        {experience.description}
                      </p>

                      {/* Achievements */}
                      {experience.achievements.length > 0 && (
                        <div className="space-y-3">
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
                        </div>
                      )}

                      {/* Technologies */}
                      {experience.technologies.length > 0 && (
                        <div className="space-y-3">
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
                        </div>
                      )}
                    </div>
                  </div>
                </div>
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
          >
            Want to be part of my next chapter? Let's create something extraordinary together!
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
      </div>
    </motion.section>
  );
};

export default AnimatedExperience;
