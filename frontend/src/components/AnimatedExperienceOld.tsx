import React, { useEffect, useRef } from 'react';
import { motion, useAnimation, useInView } from 'framer-motion';
import { Building2, Calendar, MapPin, TrendingUp, Users, Award, Briefcase, GraduationCap } from 'lucide-react';

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
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const controls = useAnimation();

  useEffect(() => {
    if (isInView) {
      controls.start('visible');
    }
  }, [controls, isInView]);

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
        duration: 1.5,
        ease: "easeOut"
      }
    }
  };

  const cardVariants = {
    hidden: { 
      opacity: 0, 
      x: -50,
      scale: 0.8
    },
    visible: {
      opacity: 1,
      x: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
        duration: 0.8
      }
    }
  };

  const getCompanyIcon = (employmentType: string, company: string) => {
    if (employmentType === 'education') return GraduationCap;
    if (company.toLowerCase().includes('university')) return GraduationCap;
    return Briefcase;
  };

  const getCompanyColor = (index: number, isEducation: boolean) => {
    if (isEducation) return 'from-emerald-500 to-teal-500';
    const colors = [
      'from-blue-500 to-cyan-500',
      'from-purple-500 to-pink-500',
      'from-orange-500 to-red-500',
      'from-violet-500 to-purple-500',
    ];
    return colors[index % colors.length];
  };

  const ExperienceCard: React.FC<{ experience: Experience; index: number; isLast: boolean }> = ({ 
    experience, index, isLast 
  }) => {
    const CompanyIcon = getCompanyIcon(experience.employment_type, experience.company);
    const isEducation = experience.employment_type === 'education';
    const colorClass = getCompanyColor(index, isEducation);
    const isEven = index % 2 === 0;

    return (
      <div className="relative flex items-center">
        {/* Timeline Line */}
        {!isLast && (
          <motion.div
            className="absolute left-1/2 top-32 w-1 h-32 bg-gradient-to-b from-blue-500/50 to-purple-500/50 transform -translate-x-1/2 z-0"
            variants={timelineVariants}
          />
        )}

        {/* Timeline Node */}
        <motion.div
          className={`absolute left-1/2 top-8 transform -translate-x-1/2 z-10 w-16 h-16 bg-gradient-to-br ${colorClass} rounded-full flex items-center justify-center border-4 border-gray-900`}
          variants={{
            hidden: { scale: 0, rotate: -180 },
            visible: { 
              scale: 1, 
              rotate: 0,
              transition: {
                type: "spring",
                stiffness: 200,
                damping: 15,
                delay: index * 0.2
              }
            }
          }}
          whileHover={{ 
            scale: 1.2,
            boxShadow: "0 0 30px rgba(59, 130, 246, 0.5)"
          }}
        >
          <CompanyIcon className="w-8 h-8 text-white" />
        </motion.div>

        {/* Experience Card */}
        <motion.div
          className={`w-5/12 ${isEven ? 'mr-auto' : 'ml-auto'} ${isEven ? 'pr-8' : 'pl-8'}`}
          variants={cardVariants}
          style={{ transformOrigin: isEven ? 'right center' : 'left center' }}
        >
          <motion.div
            className="group bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-white/30 transition-all duration-500 relative"
            whileHover={{ 
              scale: 1.05,
              y: -10,
              boxShadow: "0 25px 50px rgba(0,0,0,0.4)"
            }}
          >
            {/* Background Glow */}
            <div className={`absolute inset-0 bg-gradient-to-br ${colorClass} opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity duration-500`} />
            
            {/* Current Job Indicator */}
            {experience.is_current && (
              <motion.div
                className="absolute -top-2 -right-2 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold"
                animate={{
                  scale: [1, 1.1, 1],
                  boxShadow: [
                    '0 0 0 0 rgba(34, 197, 94, 0.4)',
                    '0 0 0 10px rgba(34, 197, 94, 0)',
                  ]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity
                }}
              >
                Current
              </motion.div>
            )}

            {/* Company & Role */}
            <div className="space-y-3 mb-4">
              <motion.h3 
                className="text-2xl font-bold text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:to-purple-400 group-hover:bg-clip-text transition-all duration-300"
                whileHover={{ x: isEven ? -5 : 5 }}
              >
                {experience.title}
              </motion.h3>
              
              <div className="flex items-center gap-2 text-lg">
                <motion.a
                  href={experience.company_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`font-semibold bg-gradient-to-r ${colorClass} bg-clip-text text-transparent hover:opacity-80 transition-opacity`}
                  whileHover={{ scale: 1.05 }}
                >
                  {experience.company}
                </motion.a>
                {!isEducation && <Building2 className="w-4 h-4 text-gray-400" />}
              </div>

              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {experience.location}
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {experience.duration}
                </div>
              </div>
            </div>

            {/* Description */}
            <p className="text-gray-300 leading-relaxed mb-4 text-sm">
              {experience.description}
            </p>

            {/* Achievements */}
            {experience.achievements && experience.achievements.length > 0 && (
              <div className="mb-4">
                <h4 className="text-white font-semibold mb-2 flex items-center gap-2">
                  <Award className="w-4 h-4 text-yellow-400" />
                  Key Achievements
                </h4>
                <ul className="space-y-1">
                  {experience.achievements.slice(0, 3).map((achievement, i) => (
                    <motion.li
                      key={i}
                      className="text-sm text-gray-300 flex items-start gap-2"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + i * 0.1 }}
                    >
                      <TrendingUp className="w-3 h-3 text-emerald-400 mt-1 flex-shrink-0" />
                      <span>{achievement.replace(/^[🚀⚡💰👥📈🏗️📊💸🔄🎯🏆📝🔬]+\s*/, '')}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>
            )}

            {/* Technologies */}
            {experience.technologies && experience.technologies.length > 0 && (
              <div>
                <h4 className="text-white font-semibold mb-2 text-sm">Technologies Used</h4>
                <div className="flex flex-wrap gap-2">
                  {experience.technologies.map((tech, techIndex) => (
                    <motion.span
                      key={tech}
                      className="px-2 py-1 bg-white/10 text-gray-300 text-xs rounded-full border border-white/20"
                      whileHover={{ 
                        scale: 1.1,
                        backgroundColor: "rgba(59, 130, 246, 0.2)",
                        borderColor: "rgba(59, 130, 246, 0.5)"
                      }}
                      animate={{
                        opacity: [0.7, 1, 0.7]
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        delay: techIndex * 0.3
                      }}
                    >
                      {tech}
                    </motion.span>
                  ))}
                </div>
              </div>
            )}

            {/* Hover Effects */}
            <motion.div
              className={`absolute inset-0 bg-gradient-to-br ${colorClass} opacity-0 group-hover:opacity-5 rounded-2xl pointer-events-none transition-opacity duration-500`}
            />

            {/* Card Direction Indicator */}
            <motion.div
              className={`absolute top-8 ${isEven ? '-right-3' : '-left-3'} w-6 h-6 bg-gradient-to-br ${colorClass} rotate-45 transform`}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: index * 0.2 + 0.5 }}
            />
          </motion.div>
        </motion.div>
      </div>
    );
  };

  return (
    <section ref={ref} className="py-20 bg-gradient-to-b from-gray-900 to-black relative overflow-hidden">
      {/* Background Elements */}
      <motion.div
        className="absolute top-1/4 right-10 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.1, 0.3, 0.1],
          y: [0, -50, 0],
        }}
        transition={{ duration: 12, repeat: Infinity }}
      />

      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 30 }}
          animate={controls}
          variants={{
            hidden: { opacity: 0, y: 30 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.8 } }
          }}
        >
          <motion.h2 
            className="text-4xl lg:text-6xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-emerald-400 bg-clip-text text-transparent mb-6"
            animate={{ 
              backgroundPosition: ['0%', '100%', '0%']
            }}
            transition={{ duration: 5, repeat: Infinity }}
          >
            Professional Journey
          </motion.h2>
          <motion.p 
            className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            From academic excellence to industry leadership - a timeline of growth, 
            innovation, and measurable impact across leading technology companies.
          </motion.p>
        </motion.div>

        {/* Experience Timeline */}
        <motion.div
          className="relative max-w-6xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate={controls}
        >
          {/* Main Timeline Line */}
          <motion.div
            className="absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500/30 via-purple-500/30 to-emerald-500/30 transform -translate-x-1/2"
            variants={timelineVariants}
          />

          {/* Experience Cards */}
          <div className="space-y-24">
            {experiences
              .sort((a, b) => new Date(b.start_date).getTime() - new Date(a.start_date).getTime())
              .map((experience, index) => (
                <ExperienceCard 
                  key={experience.id} 
                  experience={experience} 
                  index={index}
                  isLast={index === experiences.length - 1}
                />
              ))}
          </div>
        </motion.div>

        {/* Career Stats */}
        <motion.div
          className="mt-20 grid grid-cols-1 md:grid-cols-4 gap-6 max-w-5xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={controls}
          variants={{
            hidden: { opacity: 0, y: 30 },
            visible: { opacity: 1, y: 0, transition: { delay: 2, duration: 0.8 } }
          }}
        >
          <motion.div
            className="text-center p-6 bg-white/5 rounded-xl backdrop-blur-sm border border-white/10"
            whileHover={{ scale: 1.05, y: -5 }}
          >
            <motion.div
              className="text-3xl font-bold text-blue-400 mb-2"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              3+
            </motion.div>
            <div className="text-gray-300">Years Experience</div>
          </motion.div>

          <motion.div
            className="text-center p-6 bg-white/5 rounded-xl backdrop-blur-sm border border-white/10"
            whileHover={{ scale: 1.05, y: -5 }}
          >
            <motion.div
              className="text-3xl font-bold text-emerald-400 mb-2"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
            >
              20%
            </motion.div>
            <div className="text-gray-300">Customer Growth</div>
          </motion.div>

          <motion.div
            className="text-center p-6 bg-white/5 rounded-xl backdrop-blur-sm border border-white/10"
            whileHover={{ scale: 1.05, y: -5 }}
          >
            <motion.div
              className="text-3xl font-bold text-purple-400 mb-2"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.6 }}
            >
              22%
            </motion.div>
            <div className="text-gray-300">Revenue Impact</div>
          </motion.div>

          <motion.div
            className="text-center p-6 bg-white/5 rounded-xl backdrop-blur-sm border border-white/10"
            whileHover={{ scale: 1.05, y: -5 }}
          >
            <motion.div
              className="text-3xl font-bold text-orange-400 mb-2"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.9 }}
            >
              15→0
            </motion.div>
            <div className="text-gray-300">Days Automated</div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default AnimatedExperience;
