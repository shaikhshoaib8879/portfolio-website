import React, { useState, useEffect, useRef } from 'react';
import { motion, useAnimation, useInView } from 'framer-motion';
import { Github, ExternalLink, Calendar, Star, Zap, TrendingUp, Award, Code } from 'lucide-react';

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

interface AnimatedProjectsProps {
  projects: Project[];
}

const AnimatedProjects: React.FC<AnimatedProjectsProps> = ({ projects }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const controls = useAnimation();
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [filter, setFilter] = useState<'all' | 'featured'>('all');

  useEffect(() => {
    if (isInView) {
      controls.start('visible');
    }
  }, [controls, isInView]);

  const filteredProjects = filter === 'all' ? projects : projects.filter(p => p.featured);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const projectVariants = {
    hidden: { 
      opacity: 0, 
      y: 60,
      rotateX: -15
    },
    visible: {
      opacity: 1,
      y: 0,
      rotateX: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
        duration: 0.8
      }
    }
  };

  const ProjectCard: React.FC<{ project: Project; index: number }> = ({ project, index }) => {
    const techColors = [
      'from-blue-500 to-cyan-500',
      'from-purple-500 to-pink-500',
      'from-emerald-500 to-teal-500',
      'from-orange-500 to-red-500',
      'from-violet-500 to-purple-500',
      'from-green-500 to-emerald-500'
    ];

    return (
      <motion.div
        variants={projectVariants}
        className="group relative bg-white/5 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/10 hover:border-white/30 transition-all duration-500"
        whileHover={{ 
          y: -10,
          scale: 1.02,
          boxShadow: "0 25px 50px rgba(0,0,0,0.4)"
        }}
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Project Image/Preview */}
        <div className="relative h-48 overflow-hidden">
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-emerald-600"
            animate={{
              background: [
                'linear-gradient(45deg, #3b82f6, #8b5cf6, #10b981)',
                'linear-gradient(45deg, #8b5cf6, #10b981, #f59e0b)',
                'linear-gradient(45deg, #10b981, #f59e0b, #ef4444)',
                'linear-gradient(45deg, #f59e0b, #ef4444, #3b82f6)',
                'linear-gradient(45deg, #ef4444, #3b82f6, #8b5cf6)',
                'linear-gradient(45deg, #3b82f6, #8b5cf6, #10b981)'
              ]
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          />
          
          {/* Code Animation Overlay */}
          <div className="absolute inset-0 opacity-20">
            {['{', '}', '<', '>', '=', '+', '(', ')'].map((symbol, i) => (
              <motion.div
                key={i}
                className="absolute text-white text-2xl font-mono"
                style={{
                  left: `${20 + (i % 4) * 25}%`,
                  top: `${20 + Math.floor(i / 4) * 40}%`,
                }}
                animate={{
                  opacity: [0.2, 0.8, 0.2],
                  scale: [1, 1.2, 1],
                  rotate: [0, 360, 0],
                }}
                transition={{
                  duration: 3 + Math.random() * 2,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                }}
              >
                {symbol}
              </motion.div>
            ))}
          </div>

          {/* Project Status Badge */}
          {project.status === 'completed' && (
            <motion.div
              className="absolute top-4 right-4 bg-green-500/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-semibold text-white flex items-center gap-1"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Award className="w-4 h-4" />
              Completed
            </motion.div>
          )}

          {project.featured && (
            <motion.div
              className="absolute top-4 left-4 bg-yellow-500/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-bold text-black flex items-center gap-1"
              animate={{
                rotate: [0, 5, -5, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Star className="w-4 h-4" />
              Featured
            </motion.div>
          )}

          {/* Hover Overlay */}
          <motion.div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center"
            initial={{ opacity: 0 }}
          >
            <motion.button
              onClick={() => setSelectedProject(project)}
              className="px-6 py-3 bg-white text-black rounded-lg font-semibold flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Code className="w-5 h-5" />
              View Details
            </motion.button>
          </motion.div>
        </div>

        {/* Project Content */}
        <div className="p-6 space-y-4">
          {/* Title and Date */}
          <div className="flex justify-between items-start">
            <motion.h3 
              className="text-xl font-bold text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:to-purple-400 group-hover:bg-clip-text transition-all duration-300"
              whileHover={{ x: 5 }}
            >
              {project.title}
            </motion.h3>
            <div className="flex items-center gap-1 text-gray-400 text-sm">
              <Calendar className="w-4 h-4" />
              {new Date(project.start_date).getFullYear()}
            </div>
          </div>

          {/* Description */}
          <p className="text-gray-300 text-sm leading-relaxed line-clamp-3">
            {project.description}
          </p>

          {/* Technologies */}
          <div className="flex flex-wrap gap-2">
            {project.technologies.slice(0, 4).map((tech, techIndex) => (
              <motion.span
                key={tech}
                className={`px-3 py-1 bg-gradient-to-r ${techColors[techIndex % techColors.length]} text-white text-xs font-medium rounded-full`}
                whileHover={{ scale: 1.1 }}
                animate={{
                  boxShadow: [
                    '0 0 0 rgba(59, 130, 246, 0)',
                    '0 0 20px rgba(59, 130, 246, 0.3)',
                    '0 0 0 rgba(59, 130, 246, 0)'
                  ]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: techIndex * 0.5
                }}
              >
                {tech}
              </motion.span>
            ))}
            {project.technologies.length > 4 && (
              <span className="px-3 py-1 bg-gray-700 text-gray-300 text-xs font-medium rounded-full">
                +{project.technologies.length - 4} more
              </span>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            {project.github_url && (
              <motion.a
                href={project.github_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-medium transition-colors"
                whileHover={{ scale: 1.05, x: 5 }}
                whileTap={{ scale: 0.95 }}
              >
                <Github className="w-4 h-4" />
                Code
              </motion.a>
            )}
            
            {project.live_url && (
              <motion.a
                href={project.live_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg text-sm font-medium"
                whileHover={{ scale: 1.05, x: 5 }}
                whileTap={{ scale: 0.95 }}
              >
                <ExternalLink className="w-4 h-4" />
                Live Demo
              </motion.a>
            )}
          </div>
        </div>

        {/* Impact Metrics (for featured projects) */}
        {project.featured && (
          <motion.div
            className="absolute -bottom-2 -right-2 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full p-3"
            animate={{
              scale: [1, 1.1, 1],
              rotate: [0, 180, 360]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <TrendingUp className="w-5 h-5 text-white" />
          </motion.div>
        )}
      </motion.div>
    );
  };

  return (
    <section ref={ref} className="py-20 bg-gradient-to-b from-black to-gray-900 relative overflow-hidden">
      {/* Background Elements */}
      <motion.div
        className="absolute top-20 left-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.1, 0.2, 0.1],
          x: [0, 100, 0],
        }}
        transition={{ duration: 15, repeat: Infinity }}
      />

      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
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
            Featured Projects
          </motion.h2>
          <motion.p 
            className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            A showcase of my best work - from automation solutions that saved companies thousands, 
            to full-stack applications that drive real business value.
          </motion.p>

          {/* Filter Buttons */}
          <motion.div
            className="flex justify-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
          >
            <motion.button
              onClick={() => setFilter('all')}
              className={`px-6 py-3 rounded-full border transition-all duration-300 ${
                filter === 'all'
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 border-transparent text-white'
                  : 'bg-white/5 border-white/20 text-gray-300 hover:border-white/40'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              All Projects ({projects.length})
            </motion.button>
            <motion.button
              onClick={() => setFilter('featured')}
              className={`px-6 py-3 rounded-full border transition-all duration-300 flex items-center gap-2 ${
                filter === 'featured'
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 border-transparent text-white'
                  : 'bg-white/5 border-white/20 text-gray-300 hover:border-white/40'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Star className="w-4 h-4" />
              Featured ({projects.filter(p => p.featured).length})
            </motion.button>
          </motion.div>
        </motion.div>

        {/* Projects Grid */}
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate={controls}
        >
          {filteredProjects.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
        </motion.div>

        {/* Project Stats */}
        <motion.div
          className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={controls}
          variants={{
            hidden: { opacity: 0, y: 30 },
            visible: { opacity: 1, y: 0, transition: { delay: 1.5, duration: 0.8 } }
          }}
        >
          <motion.div
            className="text-center p-6 bg-white/5 rounded-xl backdrop-blur-sm border border-white/10"
            whileHover={{ scale: 1.05, y: -5 }}
          >
            <motion.div
              className="text-4xl font-bold text-blue-400 mb-2"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              22%
            </motion.div>
            <div className="text-gray-300">Revenue Impact</div>
            <div className="text-sm text-gray-400 mt-1">From automation projects</div>
          </motion.div>

          <motion.div
            className="text-center p-6 bg-white/5 rounded-xl backdrop-blur-sm border border-white/10"
            whileHover={{ scale: 1.05, y: -5 }}
          >
            <motion.div
              className="text-4xl font-bold text-emerald-400 mb-2"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
            >
              80%
            </motion.div>
            <div className="text-gray-300">Time Reduction</div>
            <div className="text-sm text-gray-400 mt-1">Through process automation</div>
          </motion.div>

          <motion.div
            className="text-center p-6 bg-white/5 rounded-xl backdrop-blur-sm border border-white/10"
            whileHover={{ scale: 1.05, y: -5 }}
          >
            <motion.div
              className="text-4xl font-bold text-purple-400 mb-2"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity, delay: 1 }}
            >
              25%
            </motion.div>
            <div className="text-gray-300">Cost Savings</div>
            <div className="text-sm text-gray-400 mt-1">AWS infrastructure optimization</div>
          </motion.div>
        </motion.div>
      </div>

      {/* Project Detail Modal would go here */}
      {/* For brevity, I'm not including the full modal implementation */}
    </section>
  );
};

export default AnimatedProjects;
