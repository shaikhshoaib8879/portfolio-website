import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { getSkills, getExperience, type Skill, type Experience } from '../utils/api';

const About: React.FC = () => {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [experience, setExperience] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [skillsData, experienceData] = await Promise.all([
          getSkills(),
          getExperience(),
        ]);
        setSkills(skillsData);
        setExperience(experienceData);
      } catch (error) {
        console.error('Failed to fetch about data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const skillCategories = Array.from(new Set(skills.map(skill => skill.category)));

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <section id="about" className="py-20 bg-gray-50 dark:bg-dark-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            About <span className="gradient-text">Me</span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Passionate about creating exceptional digital experiences through clean code and innovative solutions.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-16 mb-20">
          {/* Skills Section */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
              Skills & Technologies
            </h3>
            
            {skillCategories.map((category) => (
              <div key={category} className="mb-8">
                <h4 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-4">
                  {category}
                </h4>
                <div className="space-y-4">
                  {skills
                    .filter(skill => skill.category === category)
                    .map((skill, index) => (
                      <motion.div
                        key={skill.name}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        viewport={{ once: true }}
                        className="relative"
                      >
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-gray-700 dark:text-gray-300 font-medium">
                            {skill.name}
                          </span>
                          <span className="text-blue-600 dark:text-blue-400 font-semibold">
                            {skill.level}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <motion.div
                            initial={{ width: 0 }}
                            whileInView={{ width: `${skill.level}%` }}
                            transition={{ duration: 1, delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
                          />
                        </div>
                      </motion.div>
                    ))}
                </div>
              </div>
            ))}
          </motion.div>

          {/* Experience Timeline */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
              Work Experience
            </h3>
            
            <div className="space-y-8">
              {experience.map((exp, index) => (
                <motion.div
                  key={exp.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  viewport={{ once: true }}
                  className="relative pl-8 border-l-2 border-blue-200 dark:border-blue-800"
                >
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className="absolute left-0 top-0 w-4 h-4 bg-blue-500 rounded-full transform -translate-x-1/2"
                  />
                  
                  <div className="bg-white dark:bg-dark-100 rounded-lg p-6 shadow-lg hover-lift">
                    <div className="flex flex-wrap justify-between items-start mb-3">
                      <h4 className="text-xl font-bold text-gray-900 dark:text-white">
                        {exp.title}
                      </h4>
                      <span className="text-blue-600 dark:text-blue-400 font-semibold">
                        {exp.duration}
                      </span>
                    </div>
                    
                    <h5 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-3">
                      {exp.company}
                    </h5>
                    
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      {exp.description}
                    </p>
                    
                    <div className="flex flex-wrap gap-2">
                      {exp.technologies.map((tech) => (
                        <motion.span
                          key={tech}
                          whileHover={{ scale: 1.05 }}
                          className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-sm rounded-full"
                        >
                          {tech}
                        </motion.span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Personal Interests */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
            Beyond Code
          </h3>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Continuous Learning",
                description: "Always exploring new technologies and best practices",
                icon: "📚"
              },
              {
                title: "Open Source",
                description: "Contributing to the developer community",
                icon: "🌟"
              },
              {
                title: "Innovation",
                description: "Building solutions that make a difference",
                icon: "💡"
              }
            ].map((interest, index) => (
              <motion.div
                key={interest.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05 }}
                className="bg-white dark:bg-dark-100 rounded-lg p-6 shadow-lg hover-lift"
              >
                <div className="text-4xl mb-4">{interest.icon}</div>
                <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                  {interest.title}
                </h4>
                <p className="text-gray-600 dark:text-gray-400">
                  {interest.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default About;
