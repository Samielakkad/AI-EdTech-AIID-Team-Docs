import React, { useRef, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { motion, Variants, useScroll, useTransform } from 'framer-motion';
import { LightBulbIcon, CpuChipIcon, RocketLaunchIcon, PlayCircleIcon } from '../components/IconComponents';
import { projects, projectSummaries, testimonials } from '../data';
import TestimonialCarousel from '../components/TestimonialCarousel';
import VideoModal from '../components/VideoModal';

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 40, scale: 0.98 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 100, damping: 15 } },
};

const getTagColorClass = (tag: string): string => {
    const lowerTag = tag.toLowerCase().replace(/[\s-]/g, '');

    // Theme 1: Pedagogy & Student Experience (Purple/Fuchsia)
    const pedagogyKeywords = ['gamifiedcurriculum', 'herosjourney', 'narrativedriven', 'culturalheroes', 'historicalpersonas', 'studentengagement', 'learningquests', 'privacyfirst', 'aitool', 'realtime'];
    if (pedagogyKeywords.some(kw => lowerTag.includes(kw))) {
        return 'bg-fuchsia-900/80 text-fuchsia-200 border border-fuchsia-500/60 shadow-md shadow-fuchsia-500/10';
    }

    // Theme 2: Educational Content & Teacher Tools (Green)
    const contentKeywords = ['folklore', 'personalizedlearning', 'adaptivelearning', 'globaleducation', 'curriculumgeneration', 'lessongeneration', 'teacherautomation', 'edtech'];
    if (contentKeywords.some(kw => lowerTag.includes(kw))) {
        return 'bg-emerald-900/80 text-emerald-200 border border-emerald-500/60 shadow-md shadow-emerald-500/10';
    }

    // Theme 3: Core AI & Technology (Cyan/Teal)
    const techKeywords = ['crosscurricular', 'aimentor', 'multimodal', 'serverless', 'aipoweredassessment', 'educationalos', 'ainative', 'api', 'gemini', 'gsap', 'rokid', 'aiglasses'];
    if (techKeywords.some(kw => lowerTag.includes(kw))) {
        return 'bg-cyan-900/80 text-cyan-200 border border-cyan-500/60 shadow-md shadow-cyan-500/10';
    }
    
    // Theme 4: Data & Analytics (Red/Rose)
    const dataKeywords = ['analytics', 'datainsights', 'realtimefeedback', 'equityanalytics'];
    if (dataKeywords.some(kw => lowerTag.includes(kw))) {
        return 'bg-rose-900/80 text-rose-200 border border-rose-500/60 shadow-md shadow-rose-500/10';
    }
    
    // Theme 5: Domain-specific (Amber)
    const domainKeywords = ['education', 'learning', 'student', 'teacher', 'admin', 'communication', 'tutor', 'curriculum', 'chatbot', 'classroom', 'interactive'];
    if (domainKeywords.some(kw => lowerTag.includes(kw))) {
        return 'bg-amber-900/80 text-amber-200 border border-amber-500/60 shadow-md shadow-amber-500/10';
    }

    // Default/General (Slate)
    return 'bg-slate-800/80 text-slate-200 border border-slate-600/60 shadow-md shadow-slate-500/10';
};

const ProjectCard: React.FC<{ title: string; description: string; tags?: string[]; imageUrl: string; onPlayVideo: () => void; isFeatured?: boolean; }> = ({ title, description, tags, imageUrl, onPlayVideo, isFeatured = false }) => {
    const cardRef = useRef<HTMLDivElement>(null);
    const bgRef = useRef<HTMLDivElement>(null);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const card = cardRef.current;
        if (!card) return;
        const { left, top, width, height } = card.getBoundingClientRect();
        const x = e.clientX - left;
        const y = e.clientY - top;
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);

        const rotateX = (y - height / 2) / 25;
        const rotateY = -(x - width / 2) / 25;
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.03, 1.03, 1.03)`;
        
        const bg = bgRef.current;
        if (bg) {
            const parallaxX = -(x - width / 2) / 15;
            const parallaxY = -(y - height / 2) / 15;
            bg.style.transform = `translateX(${parallaxX}px) translateY(${parallaxY}px) scale(1.2)`;
        }
    };

    const handleMouseLeave = () => {
        const card = cardRef.current;
        if (!card) return;
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
        
        const bg = bgRef.current;
        if (bg) {
            bg.style.transform = 'translateX(0px) translateY(0px) scale(1.2)';
        }
    };

    const handlePlayClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();
        onPlayVideo();
    };

    return (
        <motion.div
            ref={cardRef}
            className="interactive-card rounded-xl h-full flex flex-col relative group overflow-hidden"
            variants={itemVariants}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{ transition: 'transform 0.2s ease-out', minHeight: isFeatured ? '500px' : '450px' }}
        >
            <div
                ref={bgRef}
                className="absolute inset-0 bg-cover bg-center transition-transform duration-300 ease-out"
                style={{ 
                    backgroundImage: `url(${imageUrl})`, 
                    transform: 'scale(1.2)' 
                }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent"></div>
            <div 
                onClick={handlePlayClick}
                className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer"
                aria-label={`Play video for ${title}`}
            >
                <PlayCircleIcon className="w-20 h-20 text-white/80 group-hover:text-white/100 group-hover:scale-110 transition-all" />
            </div>
            <div className="relative p-6 mt-auto text-white" style={{ transform: 'translateZ(40px)' }}>
                <h3 className={`font-bold text-white glow-on-hover ${isFeatured ? 'text-4xl' : 'text-2xl'}`}>{title}</h3>
                 {tags && tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3 mb-2">
                        {(isFeatured ? tags : tags.slice(0, 5)).map((tag) => (
                            <span 
                                key={tag} 
                                className={`font-semibold px-2.5 py-0.5 rounded-full ${isFeatured ? 'text-sm' : 'text-xs'} ${getTagColorClass(tag)}`}
                            >
                                {tag}
                            </span>
                        ))}
                    </div>
                )}
                <p className={`mt-3 text-gray-200 flex-grow ${isFeatured ? 'text-lg max-w-4xl' : ''}`}>{description}</p>
                <div className="text-cyan-400 group-hover:text-cyan-300 transition-colors mt-5 inline-block font-semibold text-base glow-on-hover">Explore Project &rarr;</div>
            </div>
        </motion.div>
    );
};

const JourneyStep: React.FC<{icon: React.ReactNode; title: string; description: string; align: 'left' | 'right'}> = ({ icon, title, description, align }) => {
    const cardRef = useRef<HTMLDivElement>(null);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const card = cardRef.current;
        if (!card) return;
        const { left, top, width, height } = card.getBoundingClientRect();
        const x = e.clientX - left;
        const y = e.clientY - top;
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
        const rotateX = (y - height / 2) / 25;
        const rotateY = -(x - width / 2) / 25;
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.03, 1.03, 1.03)`;
    };

    const handleMouseLeave = () => {
        const card = cardRef.current;
        if (!card) return;
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    };
    
    return (
        <motion.div 
            className={`md:flex items-center w-full ${align === 'right' ? 'md:flex-row-reverse' : ''}`}
            variants={itemVariants}
        >
            <div className="md:w-1/2"></div>
            <div className="md:w-1/2 md:px-8">
                <div 
                    ref={cardRef}
                    onMouseMove={handleMouseMove}
                    onMouseLeave={handleMouseLeave}
                    style={{ transition: 'transform 0.2s ease-out' }}
                    className="glass-card interactive-card p-6 rounded-lg"
                >
                    <div style={{ transform: 'translateZ(20px)' }}>
                        <div className="flex items-center gap-4 mb-2">
                            <div className="text-cyan-500">{icon}</div>
                            <h3 className="text-2xl text-white">{title}</h3>
                        </div>
                        <p className="text-gray-300">{description}</p>
                    </div>
                </div>
            </div>
             <div className="absolute left-1/2 -ml-6 top-1/2 -mt-6 hidden md:block">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500 to-fuchsia-600 flex items-center justify-center text-white shadow-lg border-4 border-slate-900">
                    {icon}
                </div>
            </div>
        </motion.div>
    );
};


const HomePage: React.FC = () => {
  const targetRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end start"],
  });

  const [activeVideoUrl, setActiveVideoUrl] = useState<string | null>(null);

  const heroTextY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const missionImageY = useTransform(scrollYProgress, [0, 0.8], ["0%", "-20%"]);
  const parallaxBg1Y = useTransform(scrollYProgress, [0, 1], ["0%", "120%"]);
  const parallaxBg2Y = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);

  const handleOpenModal = (videoUrl: string) => {
    setActiveVideoUrl(videoUrl);
  };

  const handleCloseModal = () => {
    setActiveVideoUrl(null);
  };

  const featuredProject = projects[0];
  const otherProjects = projects.slice(1);

  return (
    <>
    <div ref={targetRef} className="space-y-24 md:space-y-32 pb-20 overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative text-center py-32 md:py-48 overflow-hidden">
        {/* Parallax Background Elements */}
        <motion.div
            className="absolute top-[10%] left-[15%] w-64 h-64 bg-cyan-500/10 rounded-full filter blur-3xl opacity-70"
            style={{ y: parallaxBg1Y }}
            aria-hidden="true"
        />
        <motion.div
            className="absolute bottom-[10%] right-[15%] w-80 h-80 bg-fuchsia-500/10 rounded-full filter blur-3xl opacity-70"
            style={{ y: parallaxBg2Y }}
            aria-hidden="true"
        />
        <div className="container mx-auto px-4 relative z-10">
          <motion.h1
            className="text-5xl md:text-8xl font-black uppercase tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-fuchsia-500 to-amber-400"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            style={{ 
                y: heroTextY,
                textShadow: '0 0 20px rgba(6, 182, 212, 0.5), 0 0 30px rgba(192, 38, 211, 0.3)',
                animation: 'gradient-flow 10s ease-in-out infinite',
                backgroundSize: '200% auto',
             }}
          >
            AI-Explorers
          </motion.h1>
          <motion.p
            style={{ y: heroTextY }}
            className="mt-6 text-xl md:text-3xl font-light text-gray-300 max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            A collaborative journey into the world of generative AI. We build, we learn, and we share our passion for creating intelligent applications.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            whileHover={{ scale: 1.05, y: -5, boxShadow: "0px 10px 30px -5px rgba(6, 182, 212, 0.4)" }}
            whileTap={{ scale: 0.95 }}
            className="mt-12 inline-block"
          >
            <NavLink
              to="/team"
              className="inline-block bg-cyan-500 text-white font-bold py-4 px-10 rounded-full text-lg hover:bg-cyan-600 transition-colors duration-300 shadow-lg"
            >
              Meet the Team
            </NavLink>
          </motion.div>
        </div>
      </section>

      {/* Theme Introduction */}
       <motion.section 
        className="container mx-auto px-4"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={containerVariants}
      >
        <div className="max-w-6xl mx-auto">
           <div className="grid md:grid-cols-2 gap-12 items-center">
             <motion.div variants={itemVariants}>
                <h2 className="text-4xl sm:text-5xl mb-6 text-center md:text-left">Our Hackathon Mission 🎯</h2>
                <p className="text-lg text-gray-400">
                  Our group's mission was to explore diverse applications of generative AI to solve real-world problems. From revolutionizing education with a privacy-first OS to fostering creativity in music and promoting environmental consciousness, our projects showcase the versatility and power of AI as a collaborative tool.
                </p>
             </motion.div>
             <motion.div variants={itemVariants} className="glass-card p-2 rounded-xl overflow-hidden">
                <motion.img 
                  style={{ y: missionImageY }}
                  src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop" 
                  alt="Team collaborating" 
                  className="rounded-lg shadow-2xl w-full h-full object-cover"
                />
             </motion.div>
           </div>
        </div>
      </motion.section>

       {/* Our Journey Section */}
      <motion.section 
        className="container mx-auto px-4"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={containerVariants}
      >
        <h2 className="text-4xl sm:text-5xl mb-20 text-center">Our Journey 🚀</h2>
        <div className="relative max-w-5xl mx-auto">
          <div className="absolute left-1/2 top-6 h-[calc(100%-3rem)] w-1 bg-gray-700/50 hidden md:block" aria-hidden="true"></div>
          <div className="space-y-16 md:space-y-0">
              <JourneyStep
                  icon={<LightBulbIcon className="w-8 h-8" />}
                  title="Phase 1: The Spark"
                  description="Our journey began with a shared passion for solving real-world problems. We brainstormed, researched, and defined the core concepts for our three distinct projects, laying the foundation for an intense and rewarding hackathon."
                  align="left"
              />
              <JourneyStep
                  icon={<CpuChipIcon className="w-8 h-8" />}
                  title="Phase 2: The Build"
                  description="With a clear vision, we dove into Vibe Coding. This phase was a whirlwind of prompt engineering, collaborative coding, and rapid prototyping. We embraced challenges and pushed the Gemini API to its creative limits."
                  align="right"
              />
              <JourneyStep
                  icon={<RocketLaunchIcon className="w-8 h-8" />}
                  title="Phase 3: The Launch"
                  description="From code to community. In the final phase, we polished our applications, crafted this documentation, and deployed our work for the world to see. It's not just about building apps; it's about sharing our vision."
                  align="left"
              />
          </div>
        </div>
      </motion.section>

      {/* Testimonials Section */}
       <motion.section 
        className="container mx-auto px-4"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={containerVariants}
      >
        <h2 className="text-4xl sm:text-5xl mb-16 text-center">Community Voice 💬</h2>
        <motion.div variants={itemVariants} className="max-w-5xl mx-auto">
          <TestimonialCarousel testimonials={testimonials} />
        </motion.div>
      </motion.section>

      {/* Project Overviews */}
       <motion.section 
        className="container mx-auto px-4"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={containerVariants}
       >
        <h2 className="text-4xl sm:text-5xl mb-16 text-center">Our Projects 🛠️</h2>
        
        {/* Featured Project */}
        <div className="mb-10">
          <NavLink to="/project1" className="block h-full">
            <ProjectCard
              isFeatured={true}
              title={featuredProject.name}
              description={projectSummaries[featuredProject.id]}
              tags={featuredProject.tags}
              imageUrl={featuredProject.heroImageUrl}
              onPlayVideo={() => handleOpenModal(featuredProject.result.videoUrl)}
            />
          </NavLink>
        </div>

        {/* Other Projects */}
        <div className="grid md:grid-cols-2 gap-10">
          {otherProjects.map((project, index) => (
            <NavLink 
                key={project.id} 
                to={`/project${index + 2}`} 
                className="block h-full"
            >
              <ProjectCard
                isFeatured={false}
                title={project.name}
                description={projectSummaries[project.id]}
                tags={project.tags}
                imageUrl={project.heroImageUrl}
                onPlayVideo={() => handleOpenModal(project.result.videoUrl)}
              />
            </NavLink>
          ))}
        </div>
      </motion.section>
    </div>
    <VideoModal 
      isOpen={!!activeVideoUrl}
      onClose={handleCloseModal}
      videoUrl={activeVideoUrl || ''}
    />
    </>
  );
};

export default HomePage;