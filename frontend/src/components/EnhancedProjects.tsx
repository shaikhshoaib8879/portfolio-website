import React, { useState, useEffect, useRef } from 'react';
import { motion, useAnimation, useInView, useMotionValue, useTransform } from 'framer-motion';
import {
  Github, ExternalLink, Calendar, Star, TrendingUp, Award, Code,
  Clock, ArrowUpRight
} from 'lucide-react';
import EmptyState from './EmptyState';

interface Project {
  id: number;
  title: string;
  description: string;
  detailed_description?: string;
  technologies: string[];
  github_url?: string;
  live_url?: string;
  image_url: string;
  featured: boolean;
  status: string;
  start_date: string;
  end_date?: string;
}

interface EnhancedProjectsProps {
  projects: Project[];
}

// 3D Project Card Component
const Enhanced3DProjectCard: React.FC<{ 
  project: Project; 
  index: number; 
}> = ({ project, index }) => {
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  
  // Mouse tracking for 3D effect
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const rotateX = useTransform(mouseY, [-300, 300], [15, -15]);
  const rotateY = useTransform(mouseX, [-300, 300], [-15, 15]);
  const scale = useTransform(mouseY, [-300, 300], [1.05, 1.05]);

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    mouseX.set(event.clientX - centerX);
    mouseY.set(event.clientY - centerY);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    mouseX.set(0);
    mouseY.set(0);
  };

  const techColors = [
    'from-blue-500 to-cyan-500',
    'from-purple-500 to-pink-500',
    'from-emerald-500 to-teal-500',
    'from-orange-500 to-red-500',
    'from-violet-500 to-purple-500',
    'from-green-500 to-emerald-500',
    'from-yellow-500 to-orange-500',
    'from-indigo-500 to-blue-500'
  ];

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed': return 'from-green-500 to-emerald-500';
      case 'in-progress': return 'from-yellow-500 to-orange-500';
      case 'planned': return 'from-blue-500 to-cyan-500';
      default: return 'from-gray-500 to-slate-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed': return Award;
      case 'in-progress': return Clock;
      case 'planned': return Star;
      default: return Code;
    }
  };

  const StatusIcon = getStatusIcon(project.status);

  return (
    <motion.div
      ref={cardRef}
      className="group relative"
      style={{ 
        perspective: '1000px',
        transformStyle: 'preserve-3d'
      }}
      initial={{ opacity: 0, y: 60, rotateX: -15 }}
      whileInView={{ 
        opacity: 1, 
        y: 0, 
        rotateX: 0,
        transition: {
          type: "spring",
          stiffness: 100,
          damping: 20,
          delay: index * 0.1
        }
      }}
      viewport={{ once: true, margin: '-50px' }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div
        className="relative bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl rounded-2xl overflow-hidden border border-white/20 hover:border-white/40 transition-all duration-500"
        style={{
          rotateX: isHovered ? rotateX : 0,
          rotateY: isHovered ? rotateY : 0,
          scale: isHovered ? scale : 1,
          transformStyle: 'preserve-3d',
          boxShadow: isHovered 
            ? '0 25px 50px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.1)' 
            : '0 10px 30px rgba(0,0,0,0.3)'
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        {/* Project Image/Hero Section */}
        <div className="relative h-48 overflow-hidden">
          {/* Animated gradient background */}
          <motion.div
            className="absolute inset-0 opacity-80"
            style={{
              background: `linear-gradient(135deg, 
                hsl(${200 + index * 30}, 70%, 50%), 
                hsl(${250 + index * 20}, 60%, 60%), 
                hsl(${180 + index * 40}, 80%, 45%)
              )`
            }}
            animate={{
              background: [
                `linear-gradient(135deg, hsl(${200 + index * 30}, 70%, 50%), hsl(${250 + index * 20}, 60%, 60%), hsl(${180 + index * 40}, 80%, 45%))`,
                `linear-gradient(135deg, hsl(${220 + index * 30}, 70%, 55%), hsl(${270 + index * 20}, 60%, 65%), hsl(${200 + index * 40}, 80%, 50%))`,
                `linear-gradient(135deg, hsl(${200 + index * 30}, 70%, 50%), hsl(${250 + index * 20}, 60%, 60%), hsl(${180 + index * 40}, 80%, 45%))`
              ]
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          />

          {/* Status Badge */}
          <motion.div
            className={`absolute top-4 right-4 bg-gradient-to-r ${getStatusColor(project.status)} px-3 py-1 rounded-full text-sm font-bold text-white flex items-center gap-2 shadow-lg`}
            animate={{ 
              scale: [1, 1.05, 1],
              boxShadow: [
                '0 4px 15px rgba(0,0,0,0.2)',
                '0 8px 25px rgba(0,0,0,0.4)',
                '0 4px 15px rgba(0,0,0,0.2)'
              ]
            }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            <StatusIcon className="w-4 h-4" />
            {project.status}
          </motion.div>

          {/* Featured Badge */}
          {project.featured && (
            <motion.div
              className="absolute top-4 left-4 bg-gradient-to-r from-yellow-500 to-orange-500 px-3 py-1 rounded-full text-sm font-bold text-black flex items-center gap-1 shadow-lg"
              animate={{
                rotate: [0, 5, -5, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <Star className="w-4 h-4 fill-current" />
              Featured
            </motion.div>
          )}

          {/* Hover overlay with actions */}
          <motion.div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center gap-4 opacity-0 group-hover:opacity-100 transition-all duration-300"
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
          >
            {project.github_url && (
              <motion.a
                href={project.github_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg text-white font-medium hover:bg-white/30 transition-colors"
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <Github className="w-5 h-5" />
                Code
              </motion.a>
            )}
            
            {project.live_url && (
              <motion.a
                href={project.live_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-blue-500/80 backdrop-blur-sm px-4 py-2 rounded-lg text-white font-medium hover:bg-blue-600/80 transition-colors"
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <ExternalLink className="w-5 h-5" />
                Live Demo
              </motion.a>
            )}
          </motion.div>
        </div>

        {/* Project Content */}
        <div className="p-6 space-y-4">
          {/* Title */}
          <motion.h3
            className="text-xl md:text-2xl font-bold text-white mb-2 group-hover:text-blue-300 transition-colors duration-300"
            layoutId={`title-${project.id}`}
          >
            {project.title}
          </motion.h3>

          {/* Description */}
          <motion.p
            className="text-gray-300 text-sm md:text-base leading-relaxed line-clamp-3"
            initial={{ opacity: 0.8 }}
            whileHover={{ opacity: 1 }}
          >
            {project.description}
          </motion.p>

          {/* Technologies */}
          <motion.div 
            className="flex flex-wrap gap-2 mt-4"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: { staggerChildren: 0.1 }
              }
            }}
            initial="hidden"
            animate="visible"
          >
            {project.technologies.slice(0, 4).map((tech, techIndex) => (
              <motion.span
                key={tech}
                className={`px-3 py-1 bg-gradient-to-r ${techColors[techIndex % techColors.length]} rounded-full text-xs font-medium text-white shadow-lg`}
                variants={{
                  hidden: { opacity: 0, scale: 0, rotate: -180 },
                  visible: { 
                    opacity: 1, 
                    scale: 1, 
                    rotate: 0,
                    transition: { 
                      type: "spring", 
                      stiffness: 500, 
                      damping: 25 
                    }
                  }
                }}
                whileHover={{ 
                  scale: 1.1, 
                  y: -2,
                  boxShadow: '0 8px 25px rgba(0,0,0,0.3)'
                }}
              >
                {tech}
              </motion.span>
            ))}
            
            {project.technologies.length > 4 && (
              <motion.span
                className="px-3 py-1 bg-gray-600/80 backdrop-blur-sm rounded-full text-xs font-medium text-white"
                whileHover={{ scale: 1.05 }}
              >
                +{project.technologies.length - 4} more
              </motion.span>
            )}
          </motion.div>

          {/* Project Date */}
          {project.start_date && (
            <motion.div
              className="flex items-center pt-4 border-t border-white/10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 + 0.5 }}
            >
              <div className="flex items-center gap-2 text-gray-400 text-sm">
                <Calendar className="w-4 h-4" />
                <span>{new Date(project.start_date).getFullYear()}</span>
              </div>
            </motion.div>
          )}
        </div>

        {/* Shimmer effect on hover */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"
          animate={isHovered ? {
            x: ['-100%', '100%'],
            transition: { duration: 1.5, ease: "easeInOut" }
          } : {}}
          style={{
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
            transform: 'skewX(-25deg)'
          }}
        />

        {/* 3D depth indicator */}
        <motion.div
          className="absolute -inset-1 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"
          style={{
            transform: isHovered ? 'translateZ(-20px)' : 'translateZ(-10px)',
            filter: 'blur(10px)'
          }}
        />
      </motion.div>
    </motion.div>
  );
};

const EnhancedProjects: React.FC<EnhancedProjectsProps> = ({ projects }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const controls = useAnimation();
  const [filter, setFilter] = useState<'all' | 'featured' | 'completed'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'featured'>('featured');

  useEffect(() => {
    if (isInView) {
      controls.start('visible');
    }
  }, [controls, isInView]);

  // Handle empty projects data
  if (!projects || projects.length === 0) {
    return (
      <motion.section
        id="projects"
        className="relative min-h-screen py-20 flex items-center justify-center"
        style={{
          background: `
            radial-gradient(circle at 25% 25%, rgba(99, 102, 241, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 75% 75%, rgba(168, 85, 247, 0.1) 0%, transparent 50%),
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
              Featured <span className="bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent">Projects</span>
            </motion.h2>
          </div>
          <EmptyState 
            type="projects"
            title="No Projects Available"
            description="No projects are currently available to showcase. Please check back later for updates."
          />
        </div>
      </motion.section>
    );
  }

  const getFilteredProjects = () => {
    let filtered = projects;
    
    if (filter === 'featured') {
      filtered = projects.filter(p => p.featured);
    } else if (filter === 'completed') {
      filtered = projects.filter(p => p.status.toLowerCase() === 'completed');
    }

    if (sortBy === 'date') {
      filtered = [...filtered].sort((a, b) => 
        new Date(b.start_date).getTime() - new Date(a.start_date).getTime()
      );
    } else {
      filtered = [...filtered].sort((a, b) => Number(b.featured) - Number(a.featured));
    }

    return filtered;
  };

  const filteredProjects = getFilteredProjects();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.3
      }
    }
  };

  return (
    <motion.section
      ref={ref}
      id="projects"
      className="relative min-h-screen py-20 overflow-hidden"
      style={{
        background: `
          radial-gradient(circle at 80% 20%, rgba(147, 51, 234, 0.15) 0%, transparent 50%),
          radial-gradient(circle at 20% 80%, rgba(59, 130, 246, 0.15) 0%, transparent 50%),
          radial-gradient(circle at 60% 40%, rgba(16, 185, 129, 0.15) 0%, transparent 50%),
          linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #1f2937 100%)
        `
      }}
    >
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white/20 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [-30, 30, -30],
              opacity: [0.2, 0.8, 0.2],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 4 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 2,
              ease: "easeInOut"
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
              background: 'linear-gradient(135deg, #f472b6 0%, #a78bfa 50%, #60a5fa 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
            animate={{
              backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
            }}
            transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
          >
            Featured Projects
          </motion.h2>
          
          <motion.p
            className="text-xl text-gray-300 max-w-3xl mx-auto mb-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            Explore my latest work and creative solutions built with modern technologies
          </motion.p>

          {/* Filters and Sort Controls */}
          <motion.div
            className="flex flex-wrap justify-center gap-4 mb-8"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            {/* Filter buttons */}
            {[
              { key: 'all', label: 'All Projects', icon: Code },
              { key: 'featured', label: 'Featured', icon: Star },
              { key: 'completed', label: 'Completed', icon: Award },
            ].map(({ key, label, icon: Icon }) => (
              <motion.button
                key={key}
                onClick={() => setFilter(key as any)}
                className={`
                  flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-300
                  ${filter === key
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/25'
                    : 'bg-white/10 backdrop-blur-lg text-gray-300 hover:bg-white/20 border border-white/10'
                  }
                `}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <Icon className="w-5 h-5" />
                {label}
              </motion.button>
            ))}

            {/* Sort dropdown */}
            <motion.select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-white/10 backdrop-blur-lg border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white/30 transition-colors"
              whileHover={{ scale: 1.02 }}
            >
              <option value="featured" className="bg-gray-800">Sort by Featured</option>
              <option value="date" className="bg-gray-800">Sort by Date</option>
            </motion.select>
          </motion.div>
        </motion.div>

        {/* Projects Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={controls}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {filteredProjects.length > 0 ? (
            filteredProjects.map((project, index) => (
              <Enhanced3DProjectCard
                key={project.id}
                project={project}
                index={index}
              />
            ))
          ) : (
            <div className="col-span-full">
              <EmptyState 
                type="projects"
                title={`No ${filter === 'all' ? '' : filter} Projects Found`}
                description={`No projects match the current filter "${filter}". Try selecting a different filter option.`}
              />
            </div>
          )}
        </motion.div>

        {/* Show more projects button */}
        {filteredProjects.length < projects.length && (
          <motion.div
            className="text-center mt-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.8, duration: 0.6 }}
          >
            <motion.button
              onClick={() => setFilter('all')}
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-300"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              <TrendingUp className="w-5 h-5" />
              View All Projects
              <ArrowUpRight className="w-5 h-5" />
            </motion.button>
          </motion.div>
        )}
      </div>
    </motion.section>
  );
};

export default EnhancedProjects;
