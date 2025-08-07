import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import axios from 'axios';
import ModernNavbar from './components/ModernNavbar';
import AnimatedHero from './components/AnimatedHero';
import AnimatedContact from './components/AnimatedContact';
import EnhancedSkills from './components/EnhancedSkills';
import EnhancedProjects from './components/EnhancedProjects';
import { ScrollProgressIndicator, ScrollToTopButton } from './components/ScrollIndicators';
import { ModernLoader, ErrorScreen } from './components/ModernLoader';
import './index.css';

// Simplified components that use our API structure (keeping as fallback)
const SimpleSkillsSection: React.FC<{ skills: any[], technologies: any[] }> = ({ skills, technologies }) => (
  <section id="skills" className="min-h-screen bg-gradient-to-br from-blue-900 via-gray-900 to-purple-900 py-20">
    <div className="container mx-auto px-4">
      <motion.div
        className="max-w-6xl mx-auto text-center"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-5xl font-bold mb-8 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
          Skills & Technologies
        </h2>
        
        {/* Skills */}
        <div className="mb-12">
          <h3 className="text-2xl font-semibold text-white mb-6">Core Skills</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {skills.map((skill, index) => (
              <motion.div
                key={skill.id}
                className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
              >
                <h4 className="text-xl font-semibold text-white mb-2">{skill.name}</h4>
                <p className="text-purple-300 mb-3">{skill.category}</p>
                
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-300">Proficiency</span>
                  <span className="text-blue-400 font-semibold">{skill.proficiency}%</span>
                </div>
                
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <motion.div
                    className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${skill.proficiency}%` }}
                    transition={{ duration: 1.5, delay: index * 0.1 }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
        
        {/* Technologies */}
        <div>
          <h3 className="text-2xl font-semibold text-white mb-6">Technologies</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {technologies.map((tech, index) => (
              <motion.div
                key={tech.id}
                className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20 hover:bg-white/20 transition-all duration-300"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.1, y: -3 }}
              >
                <div className="text-center">
                  <h4 className="text-lg font-semibold text-white">{tech.name}</h4>
                  <p className="text-sm text-gray-400">{tech.category}</p>
                  <div className="mt-2 text-xs text-blue-400">{tech.proficiency}%</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  </section>
);

const SimpleProjectsSection: React.FC<{ projects: any[] }> = ({ projects }) => (
  <section id="projects" className="min-h-screen bg-gradient-to-br from-purple-900 via-gray-900 to-blue-900 py-20">
    <div className="container mx-auto px-4">
      <motion.div
        className="max-w-6xl mx-auto text-center"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-5xl font-bold mb-8 bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 bg-clip-text text-transparent">
          Featured Projects
        </h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              className="bg-white/10 backdrop-blur-lg rounded-xl overflow-hidden border border-white/20 hover:bg-white/20 transition-all duration-300"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.15 }}
              whileHover={{ scale: 1.03, y: -10 }}
            >
              {project.image_url && (
                <div className="h-48 bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                  <img
                    src={project.image_url}
                    alt={project.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      e.currentTarget.parentElement!.innerHTML = `<div class="text-white text-4xl">📱</div>`;
                    }}
                  />
                </div>
              )}
              
              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-2">{project.title}</h3>
                <p className="text-gray-300 mb-4 line-clamp-3">{project.description}</p>
                
                <div className="flex gap-4">
                  {project.github_url && (
                    <a
                      href={project.github_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg text-sm font-medium transition-colors"
                    >
                      GitHub
                    </a>
                  )}
                  {project.live_url && (
                    <a
                      href={project.live_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg text-sm font-medium transition-colors"
                    >
                      Live Demo
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  </section>
);

const SimpleExperienceSection: React.FC<{ experiences: any[] }> = ({ experiences }) => (
  <section id="experience" className="min-h-screen bg-gradient-to-br from-gray-900 via-green-900 to-blue-900 py-20">
    <div className="container mx-auto px-4">
      <motion.div
        className="max-w-4xl mx-auto"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-5xl font-bold mb-12 text-center bg-gradient-to-r from-green-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
          Professional Experience
        </h2>
        
        <div className="space-y-8">
          {experiences.map((exp, index) => (
            <motion.div
              key={exp.id}
              className="bg-white/10 backdrop-blur-lg rounded-xl p-8 border border-white/20 hover:bg-white/20 transition-all duration-300"
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.2 }}
              whileHover={{ scale: 1.02, y: -5 }}
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-2xl font-bold text-white">{exp.position}</h3>
                  <p className="text-xl text-blue-400 font-semibold">{exp.company}</p>
                </div>
                <div className="text-right">
                  <p className="text-gray-300">
                    {new Date(exp.start_date).getFullYear()} - {exp.end_date ? new Date(exp.end_date).getFullYear() : 'Present'}
                  </p>
                  {exp.is_current && (
                    <span className="inline-block mt-1 px-2 py-1 bg-green-600 text-white text-xs rounded-full">
                      Current
                    </span>
                  )}
                </div>
              </div>
              
              <p className="text-gray-300 leading-relaxed">{exp.description}</p>
              
              {exp.achievements && (
                <div className="mt-4">
                  <h4 className="text-lg font-semibold text-white mb-2">Key Achievements:</h4>
                  <div className="text-gray-300">
                    {typeof exp.achievements === 'string' 
                      ? exp.achievements 
                      : JSON.stringify(exp.achievements)
                    }
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  </section>
);

// Main App Component
function App() {
  const [developer, setDeveloper] = useState<any>(null);
  const [skills, setSkills] = useState<any[]>([]);
  const [technologies, setTechnologies] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [experiences, setExperiences] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:5001/api';

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [devRes, skillsRes, techRes, projectsRes, expRes] = await Promise.all([
        axios.get(`${API_BASE}/developer`),
        axios.get(`${API_BASE}/skills`),
        axios.get(`${API_BASE}/technologies`),
        axios.get(`${API_BASE}/projects`),
        axios.get(`${API_BASE}/experiences`),
      ]);

      setDeveloper(devRes.data);
      setSkills(skillsRes.data || []);
      setTechnologies(techRes.data || []);
      setProjects(projectsRes.data || []);
      setExperiences(expRes.data || []);

      setLoading(false);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to load portfolio data. Please check your connection and try again.');
      setLoading(false);
    }
  };

  // Loading Screen
  if (loading) {
    return <ModernLoader />;
  }

  // Error Screen
  if (error || !developer) {
    return <ErrorScreen error={error || 'Developer data not found'} onRetry={fetchData} />;
  }

  return (
    <Router>
      <div className="App">
        <ScrollProgressIndicator />
        <ModernNavbar developer={developer} />
        
        {/* Hero Section */}
        <section id="home" className="min-h-screen">
          <AnimatedHero developer={developer} />
        </section>

        {/* About Section */}
        <section id="about" className="min-h-screen bg-gradient-to-br from-purple-900 via-gray-900 to-blue-900 py-20">
          <div className="container mx-auto px-4">
            <motion.div
              className="max-w-4xl mx-auto text-center"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-5xl font-bold mb-8 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                About Me
              </h2>
              <p className="text-xl text-gray-300 leading-relaxed mb-8">
                {developer.bio}
              </p>
              
              <div className="grid md:grid-cols-3 gap-6 mt-12">
                <motion.div
                  className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20"
                  whileHover={{ scale: 1.05, y: -5 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="text-3xl font-bold text-blue-400 mb-2">
                    {developer.years_experience}+
                  </div>
                  <div className="text-gray-300">Years Experience</div>
                </motion.div>
                
                <motion.div
                  className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20"
                  whileHover={{ scale: 1.05, y: -5 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="text-3xl font-bold text-purple-400 mb-2">
                    {projects.length}+
                  </div>
                  <div className="text-gray-300">Projects Completed</div>
                </motion.div>
                
                <motion.div
                  className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20"
                  whileHover={{ scale: 1.05, y: -5 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="text-3xl font-bold text-pink-400 mb-2">
                    {skills.length}+
                  </div>
                  <div className="text-gray-300">Technical Skills</div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Skills Section */}
        <EnhancedSkills skills={skills} technologies={technologies} />

        {/* Projects Section */}
        <EnhancedProjects projects={projects} />

        {/* Experience Section */}
        <SimpleExperienceSection experiences={experiences} />

        {/* Contact Section */}
        <section id="contact" className="min-h-screen">
          <AnimatedContact developer={developer} />
        </section>
        
        <ScrollToTopButton />
      </div>
    </Router>
  );
}

export default App;
