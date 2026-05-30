

import React, { useState, useRef } from 'react';
import { motion, Variants, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import type { Project } from '../types';
import { ssoHeroImages } from '../data';
import HeroImageSelector from '../components/HeroImageSelector';
import ProjectTimeline from '../components/ProjectTimeline';
import InteractiveDemo from '../components/InteractiveDemo';
import ShareModal from '../components/ShareModal';
import VideoModal from '../components/VideoModal';
import PromptCard from '../components/PromptCard';
import ArchitectureDiagram from '../components/ArchitectureDiagram';
import TechDeepDive from '../components/TechDeepDive';
import FunctionalityMatrix from '../components/FunctionalityMatrix';
import GlobalAppealGlobe from '../components/GlobalAppealGlobe';
import CodeDirectory from '../components/CodeDirectory';
// Fix: Removed incorrect 'UsersIcon' import and will use 'UserGroupIcon' which is already imported.
import { ShareIcon, CodeBracketIcon, LightBulbIcon, BeakerIcon, ClockIcon, PlayCircleIcon, SparklesIcon, UserIcon, AcademicCapIcon, UserGroupIcon, ChartBarIcon, CpuChipIcon, ShieldCheckIcon, ExclamationTriangleIcon, RocketLaunchIcon, ClipboardDocumentIcon, PhotoIcon, ViewColumnsIcon, CubeTransparentIcon, ChatBubbleLeftRightIcon, GlobeAltIcon, GitHubIcon } from '../components/IconComponents';

const keywordsToHighlight = [
    'AI mentor', 'personalized quests', 'gamified challenges', 'AI copilot', 'privacy-first', 'The Holodeck',
    'Hero\'s Journey', 'serverless', 'responseSchema', 'Vibe Coding', 'few-shot prompting', 'multimodal',
    'multimodal AI', 'multimodal model', 'Base64 string', 'gemini-2.5-flash', 'imagen-4.0-generate-001',
    'gemini-2.5-flash-native-audio-preview-09-2025', 'S.M.A.R.T. Classroom', 'gemini-2.5-pro',
    'thinkingConfig', 'Veo', 'gemini-2.5-flash-image'
];

const getYouTubeEmbedUrl = (url: string): string => {
    if (!url) return '';
    
    // Google Drive
    if (url.includes('drive.google.com')) {
        const match = url.match(/file\/d\/([^/]+)/);
        if (match && match[1]) {
            const fileId = match[1];
            return `https://drive.google.com/file/d/${fileId}/preview`;
        }
    }
    
    // YouTube
    if (url.includes('/embed/')) return url;
    let videoId = '';
    if (url.includes('youtube.com/watch?v=')) {
        const urlParts = url.split('v=');
        if (urlParts.length > 1) {
            videoId = urlParts[1].split('&')[0];
        }
    } else if (url.includes('youtu.be/')) {
        const urlParts = url.split('youtu.be/');
        if (urlParts.length > 1) {
            videoId = urlParts[1].split('?')[0];
        }
    }
    if (videoId) {
        return `https://www.youtube.com/embed/${videoId}`;
    }

    return url; // fallback
};

const renderRichText = (text: string) => {
    // Escape special characters for regex and join with '|'
    const keywordRegexPart = keywordsToHighlight.map(k => k.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')).join('|');
    const boldRegexPart = '\\*\\*(.*?)\\*\\*';
    
    // Create a regex to find either a keyword or a bolded text
    const combinedRegex = new RegExp(`(${keywordRegexPart})|(${boldRegexPart})`, 'gi');

    if (!text || typeof text !== 'string') {
        return text;
    }

    const parts = text.split(combinedRegex).filter(Boolean);

    const keywordColors = ['primary', 'secondary', 'accent'];
    let keywordCounter = 0;

    return parts.map((part, index) => {
        // Check if it's a keyword (case-insensitive)
        const isKeyword = keywordsToHighlight.some(kw => part.toLowerCase() === kw.toLowerCase());
        if (isKeyword) {
            const colorClass = `highlight-keyword-${keywordColors[keywordCounter % keywordColors.length]}`;
            keywordCounter++;
            return <strong key={index} className={`highlight-keyword ${colorClass}`}>{part}</strong>;
        }

        // Check if it's a bolded part
        if (part.startsWith('**') && part.endsWith('**')) {
            return <strong key={index}>{part.slice(2, -2)}</strong>;
        }
        
        return part;
    });
};


const sectionVariants: Variants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const ProjectSection: React.FC<{id?: string; title: string; children: React.ReactNode; isHovered?: boolean;}> = ({id, title, children, isHovered}) => (
    <motion.section 
        id={id}
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        className={`scroll-mt-24 transition-all duration-300 ease-in-out ${isHovered ? 'section-hover-highlight' : ''}`}
    >
        {title && <h2 className="text-4xl text-center mb-12">{title}</h2>}
        {children}
    </motion.section>
);

const getTagColorClass = (tag: string): string => {
    const lowerTag = tag.toLowerCase().replace(/[\s-]/g, '');

    // Theme 1: Pedagogy & Student Experience (Purple/Fuchsia)
    const pedagogyKeywords = ['gamifiedcurriculum', 'herosjourney', 'narrativedriven', 'culturalheroes', 'historicalpersonas', 'studentengagement', 'learningquests', 'privacyfirst', 'aitool', 'realtime', 'client-sideai'];
    if (pedagogyKeywords.some(kw => lowerTag.includes(kw))) {
        return 'bg-fuchsia-900/80 text-fuchsia-200 border border-fuchsia-500/60 shadow-md shadow-fuchsia-500/10';
    }

    // Theme 2: Educational Content & Teacher Tools (Green)
    const contentKeywords = ['folklore', 'personalizedlearning', 'adaptivelearning', 'globaleducation', 'curriculumgeneration', 'lessongeneration', 'teacherautomation', 'edtech'];
    if (contentKeywords.some(kw => lowerTag.includes(kw))) {
        return 'bg-emerald-900/80 text-emerald-200 border border-emerald-500/60 shadow-md shadow-emerald-500/10';
    }

    // Theme 3: Core AI & Technology (Cyan/Teal)
    const techKeywords = ['crosscurricular', 'aimentor', 'multimodal', 'serverless', 'aipoweredassessment', 'educationalos', 'ainative', 'api', 'gemini', 'gsap', 'rokid', 'aiglasses', 'deepseekapi', 'vanillajs'];
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

const Pill: React.FC<{children: React.ReactNode}> = ({ children }) => (
    <div className={`inline-block text-white text-sm font-semibold px-4 py-1 rounded-full shadow-md ${getTagColorClass(children as string)}`}>
        {children}
    </div>
);

const iconMap: { [key: string]: React.FC<React.SVGProps<SVGSVGElement>> } = {
    AcademicCapIcon,
    UserGroupIcon,
    ChartBarIcon,
    CpuChipIcon,
    ShieldCheckIcon,
    CodeBracketIcon,
    ExclamationTriangleIcon,
    RocketLaunchIcon,
    LightBulbIcon,
    BeakerIcon,
    ViewColumnsIcon,
    CubeTransparentIcon,
    ChatBubbleLeftRightIcon,
};

const FeatureCard: React.FC<{icon: string; title: string; subtitle: string; description: string;}> = ({ icon, title, subtitle, description }) => {
    const cardRef = useRef<HTMLDivElement>(null);
    const IconComponent = iconMap[icon];

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
        <div 
            ref={cardRef}
            className="glass-card interactive-card p-8 rounded-xl h-full"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{ transition: 'transform 0.2s ease-out' }}
        >
            <div style={{ transform: 'translateZ(40px)' }}>
                <div className="flex items-center gap-4 mb-4">
                    {IconComponent && <IconComponent className="w-10 h-10 text-cyan-400" />}
                    <div>
                        <p className="font-semibold text-cyan-400">{subtitle}</p>
                        <h3 className="text-2xl text-white">{title}</h3>
                    </div>
                </div>
                <p className="text-gray-300 text-lg">{renderRichText(description)}</p>
            </div>
        </div>
    );
};

const InteractiveContentCard: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className }) => {
    const cardRef = useRef<HTMLDivElement>(null);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const card = cardRef.current;
        if (!card) return;
        const { left, top, width, height } = card.getBoundingClientRect();
        const x = e.clientX - left;
        const y = e.clientY - top;
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
        const rotateX = (y - height / 2) / 40; // Less pronounced effect for big cards
        const rotateY = -(x - width / 2) / 40;
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    };

    const handleMouseLeave = () => {
        const card = cardRef.current;
        if (!card) return;
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    };

    return (
        <div
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{ transition: 'transform 0.2s ease-out' }}
            className={`glass-card interactive-card p-8 rounded-lg ${className}`}
        >
            <div style={{ transform: 'translateZ(20px)' }}>
                {children}
            </div>
        </div>
    )
};


const ProjectPage: React.FC<{ project: Project }> = ({ project }) => {
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [hoveredSectionId, setHoveredSectionId] = useState<string | null>(null);

  // Specific render logic for the award-winning SSO page
  if (project.id === 'sso') {
    return <SSOProjectPage project={project} setIsShareModalOpen={setIsShareModalOpen} isShareModalOpen={isShareModalOpen} />;
  }
  
  if (project.id === 'ask-smart') {
    return <AskSmartProjectPage project={project} setIsShareModalOpen={setIsShareModalOpen} isShareModalOpen={isShareModalOpen} />;
  }

  if (project.id === 'miscellaneous-tutor') {
    return <MiscellaneousTutorProjectPage project={project} setIsShareModalOpen={setIsShareModalOpen} isShareModalOpen={isShareModalOpen} />;
  }

  // Default project page layout
  const allNavItems = [
    { id: 'pillars', label: 'Core Pillars', icon: <BeakerIcon className="w-5 h-5 mr-3" /> },
    { id: 'implementation', label: 'Implementation', icon: <CodeBracketIcon className="w-5 h-5 mr-3" /> },
    { id: 'takeaways', label: 'Key Takeaways', icon: <LightBulbIcon className="w-5 h-5 mr-3" /> },
    { id: 'prompts', label: 'Key Prompts', icon: <SparklesIcon className="w-5 h-5 mr-3" /> },
    { id: 'timeline', label: 'Timeline', icon: <ClockIcon className="w-5 h-5 mr-3" /> },
    { id: 'result', label: 'Result & Demo', icon: <PlayCircleIcon className="w-5 h-5 mr-3" /> },
  ];

  const handleScrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
        const headerOffset = 100; // Adjusted for better spacing below the sticky header
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });

        element.classList.add('section-highlight');
        setTimeout(() => {
            element.classList.remove('section-highlight');
        }, 2000);
    }
  };

  return (
    <>
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-5xl sm:text-6xl">{project.name}</h1>
          <p className="mt-6 max-w-4xl mx-auto text-xl text-gray-400">
            {project.tagline}
          </p>
           <div className="flex flex-wrap justify-center mt-8 gap-4">
            <button
              onClick={() => setIsShareModalOpen(true)}
              className="flex items-center gap-2 bg-slate-800/50 backdrop-blur-sm text-white font-bold py-3 px-6 rounded-full transition-all duration-300 hover:scale-105 hover:bg-slate-700/70 border border-sky-400/30 shadow-lg"
              aria-label="Share project"
            >
              <ShareIcon className="w-5 h-5" />
              <span>Share Project</span>
            </button>
             {project.liveDemoUrl && (
                <a
                  href={project.liveDemoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-amber-500/80 backdrop-blur-sm text-white font-bold py-3 px-6 rounded-full transition-all duration-300 hover:scale-105 hover:bg-amber-600/90 border border-amber-400/30 shadow-lg"
                  aria-label="View live demo"
                >
                  <GlobeAltIcon className="w-5 h-5" />
                  <span>View Live Demo</span>
                </a>
            )}
            {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-gray-700/80 backdrop-blur-sm text-white font-bold py-3 px-6 rounded-full transition-all duration-300 hover:scale-105 hover:bg-gray-800/90 border border-gray-500/30 shadow-lg"
                  aria-label="View source on GitHub"
                >
                  <GitHubIcon className="w-5 h-5" />
                  <span>View on GitHub</span>
                </a>
            )}
          </div>
        </div>

        <motion.div 
            className="mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
        >
            <img src={project.heroImageUrl} alt={`${project.name} hero image`} className="w-full h-auto max-h-[400px] object-cover rounded-xl shadow-2xl" />
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
          <aside className="lg:w-1/4 lg:sticky lg:top-28 self-start">
            <nav className="space-y-2" onMouseLeave={() => setHoveredSectionId(null)}>
              <p className="px-4 text-sm font-semibold text-gray-400 uppercase tracking-wider">On this page</p>
              {allNavItems.map(item => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    handleScrollTo(item.id);
                  }}
                  onMouseEnter={() => setHoveredSectionId(item.id)}
                  className="flex items-center justify-between px-4 py-2 rounded-md text-gray-300 hover:bg-gray-800 font-medium transition-colors"
                >
                  <span className="flex items-center">
                    {item.icon}
                    {item.label}
                  </span>
                  <AnimatePresence>
                    {hoveredSectionId === item.id && (
                        <motion.span
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 10 }}
                            transition={{ duration: 0.2 }}
                            className="text-xs text-cyan-400"
                        >
                            Scroll&nbsp;to
                        </motion.span>
                    )}
                  </AnimatePresence>
                </a>
              ))}
            </nav>
          </aside>

          <main className="lg:w-3/4 space-y-20">
            {project.corePillars && (
                 <ProjectSection id="pillars" title="" isHovered={hoveredSectionId === 'pillars'}>
                    <div className="grid md:grid-cols-1 gap-8">
                        {project.corePillars.map(pillar => (
                            <FeatureCard 
                                key={pillar.title}
                                icon={pillar.icon}
                                subtitle={pillar.targetAudience}
                                title={pillar.title}
                                description={pillar.description}
                            />
                        ))}
                    </div>
                </ProjectSection>
            )}

            <ProjectSection id="implementation" title="" isHovered={hoveredSectionId === 'implementation'}>
              <InteractiveContentCard>
                <h2 className="text-3xl text-cyan-400 mb-4">{project.implementation.title}</h2>
                <div className="space-y-4 text-gray-300 text-lg">
                  {project.implementation.content.map((p, i) => <p key={i}>{renderRichText(p)}</p>)}
                </div>
              </InteractiveContentCard>
            </ProjectSection>
            
            {project.keyTakeaways && (
              <ProjectSection id="takeaways" title={project.keyTakeaways.title} isHovered={hoveredSectionId === 'takeaways'}>
                <InteractiveContentCard>
                  <ul className="space-y-4 list-disc list-inside text-gray-300 text-lg">
                    {project.keyTakeaways.content.map((point, i) => (
                      <li key={i}>{renderRichText(point)}</li>
                    ))}
                  </ul>
                </InteractiveContentCard>
              </ProjectSection>
            )}

            <ProjectSection id="prompts" title="Key Vibe Prompts 💬" isHovered={hoveredSectionId === 'prompts'}>
              <div className="max-w-4xl mx-auto space-y-8">
                {project.keyPrompts.map((p, i) => <PromptCard key={i} promptData={p} />)}
              </div>
            </ProjectSection>
            <ProjectSection id="timeline" title="Development Timeline 🗓️" isHovered={hoveredSectionId === 'timeline'}>
              <ProjectTimeline timeline={project.timeline} />
            </ProjectSection>
            <ProjectSection id="result" title="Result & Interactive Demo 🎬" isHovered={hoveredSectionId === 'result'}>
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-10 items-start">
                <InteractiveContentCard>
                  <div className="aspect-w-16 aspect-h-9 mb-6">
                    <iframe
                      className="w-full h-full rounded-lg shadow-lg"
                      src={getYouTubeEmbedUrl(project.result.videoUrl)}
                      title="Project Video"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>
                  <div className="space-y-4 text-gray-300 text-lg">
                    {project.result.summary.map((p, i) => <p key={i}>{renderRichText(p)}</p>)}
                  </div>
                </InteractiveContentCard>
                <InteractiveContentCard>
                  <h3 className="text-3xl text-cyan-400 mb-6">Try it Out!</h3>
                  <InteractiveDemo projectId={project.id} />
                </InteractiveContentCard>
              </div>
            </ProjectSection>
          </main>
        </div>
      </div>
      <ShareModal isOpen={isShareModalOpen} onClose={() => setIsShareModalOpen(false)} project={project} />
    </>
  );
};


const SSOProjectPage: React.FC<{ project: Project; setIsShareModalOpen: (isOpen: boolean) => void; isShareModalOpen: boolean }> = ({ project, setIsShareModalOpen, isShareModalOpen }) => {
    
    const [heroImage, setHeroImage] = useState(project.heroImageUrl);
    const [isImageSelectorOpen, setIsImageSelectorOpen] = useState(false);
    const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
    const [hoveredSectionId, setHoveredSectionId] = useState<string | null>(null);

    const heroRef = useRef<HTMLElement>(null);
    const { scrollYProgress } = useScroll({
        target: heroRef,
        offset: ["start start", "end start"]
    });

    const heroTextY = useTransform(scrollYProgress, [0, 1], ["0%", "-40%"]);
    const heroOpacity = useTransform(scrollYProgress, [0, 0.4], [1, 0]);

    const navItems = [
        { id: 'problem', label: 'The Problem', icon: <ExclamationTriangleIcon className="w-5 h-5 mr-3" /> },
        { id: 'vision', label: 'Our Vision', icon: <RocketLaunchIcon className="w-5 h-5 mr-3" /> },
        // Fix: Replaced UsersIcon with UserGroupIcon to match exported component.
        { id: 'pillars', label: 'Core Pillars', icon: <UserGroupIcon className="w-5 h-5 mr-3" /> },
        { id: 'functionality-matrix', label: 'Functionality Matrix', icon: <ViewColumnsIcon className="w-5 h-5 mr-3" />,
          subItems: [
              { id: 'matrix-student', label: 'Student Portal' },
              { id: 'matrix-teacher', label: 'Teacher Portal' },
              { id: 'matrix-admin', label: 'Admin Portal' },
          ]
        },
        { id: 'global-appeal', label: 'Global Appeal', icon: <GlobeAltIcon className="w-5 h-5 mr-3" /> },
        { id: 'personalization', label: 'AI Personalization', icon: <SparklesIcon className="w-5 h-5 mr-3" /> },
        { id: 'architecture', label: 'System Architecture', icon: <CpuChipIcon className="w-5 h-5 mr-3" /> },
        { id: 'deep-dive', label: 'Tech Deep Dive', icon: <CodeBracketIcon className="w-5 h-5 mr-3" /> },
        { id: 'codebase', label: 'Codebase Structure', icon: <ClipboardDocumentIcon className="w-5 h-5 mr-3" />},
        { id: 'takeaways', label: 'Key Takeaways', icon: <LightBulbIcon className="w-5 h-5 mr-3" /> },
        { id: 'prompts', label: 'Key Prompts', icon: <SparklesIcon className="w-5 h-5 mr-3" /> },
        { id: 'timeline', label: 'Timeline', icon: <ClockIcon className="w-5 h-5 mr-3" /> },
        { id: 'result', label: 'Result & Demo', icon: <PlayCircleIcon className="w-5 h-5 mr-3" /> },
    ];

    const handleScrollTo = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            const headerOffset = 100; // Adjusted for better spacing below the sticky header
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });

            element.classList.add('section-highlight');
            setTimeout(() => {
                element.classList.remove('section-highlight');
            }, 2000);
        }
    };
    
    return (
     <>
      <div className="container mx-auto px-4 py-16">
        {/* HERO */}
        <motion.section ref={heroRef}>
          <motion.div
            className="text-center mb-12"
            style={{ y: heroTextY, opacity: heroOpacity }}
          >
            <h1 className="text-5xl sm:text-6xl">{project.name}</h1>
            <p className="mt-6 max-w-4xl mx-auto text-2xl font-medium text-gray-300">
              {project.tagline}
            </p>
            <div className="mt-6 flex flex-wrap justify-center items-center gap-4">
              {project.tags?.map(tag => <Pill key={tag}>{tag}</Pill>)}
            </div>
             <div className="flex flex-wrap justify-center mt-8 gap-4">
                <button
                  onClick={() => setIsShareModalOpen(true)}
                  className="flex items-center gap-2 bg-slate-800/50 backdrop-blur-sm text-white font-bold py-3 px-6 rounded-full transition-all duration-300 hover:scale-105 hover:bg-slate-700/70 border border-sky-400/30 shadow-lg"
                  aria-label="Share project"
                >
                  <ShareIcon className="w-5 h-5" />
                  <span>Share Project</span>
                </button>
                <button
                  onClick={() => setIsVideoModalOpen(true)}
                  className="flex items-center gap-2 bg-fuchsia-500/80 backdrop-blur-sm text-white font-bold py-3 px-6 rounded-full transition-all duration-300 hover:scale-105 hover:bg-fuchsia-600/90 border border-fuchsia-400/30 shadow-lg"
                  aria-label="Watch video explanation"
                >
                  <PlayCircleIcon className="w-5 h-5" />
                  <span>Watch Video</span>
                </button>
                {project.liveDemoUrl && (
                    <a
                      href={project.liveDemoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 bg-amber-500/80 backdrop-blur-sm text-white font-bold py-3 px-6 rounded-full transition-all duration-300 hover:scale-105 hover:bg-amber-600/90 border border-amber-400/30 shadow-lg"
                      aria-label="View live demo"
                    >
                      <GlobeAltIcon className="w-5 h-5" />
                      <span>View Live Demo</span>
                    </a>
                )}
                {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 bg-gray-700/80 backdrop-blur-sm text-white font-bold py-3 px-6 rounded-full transition-all duration-300 hover:scale-105 hover:bg-gray-800/90 border border-gray-500/30 shadow-lg"
                      aria-label="View source on GitHub"
                    >
                      <GitHubIcon className="w-5 h-5" />
                      <span>View on GitHub</span>
                    </a>
                )}
            </div>
          </motion.div>

          <motion.div
            className="relative mb-16"
            style={{ opacity: heroOpacity }}
          >
              <AnimatePresence mode="wait">
                  <motion.div
                      key={heroImage}
                      className="w-full h-auto max-h-[400px] h-[400px] bg-cover bg-center rounded-xl shadow-2xl"
                      style={{ backgroundImage: `url(${heroImage})` }}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.7, ease: 'easeInOut' }}
                  />
              </AnimatePresence>
              <div className="absolute inset-0 bg-black/20 rounded-xl"></div>
              <div className="absolute bottom-5 right-5">
                  <button
                      onClick={() => setIsImageSelectorOpen(true)}
                      className="flex items-center gap-2 bg-black/50 backdrop-blur-sm text-white font-bold py-2 px-4 rounded-full transition-all duration-300 hover:scale-105 hover:bg-black/70"
                      aria-label="Change hero background image"
                  >
                      <PhotoIcon className="w-5 h-5" />
                      <span className="hidden sm:inline">Change Scene</span>
                  </button>
              </div>
          </motion.div>
        </motion.section>

        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
          {/* SIDEBAR */}
          <aside className="lg:w-1/4 lg:sticky lg:top-28 self-start">
            <nav className="space-y-1" onMouseLeave={() => setHoveredSectionId(null)}>
              <p className="px-4 text-sm font-semibold text-gray-400 uppercase tracking-wider">On this page</p>
              {navItems.map(item => (
                <div key={item.id}>
                    <a
                      href={`#${item.id}`}
                      onMouseEnter={() => setHoveredSectionId(item.id)}
                      onClick={(e) => { e.preventDefault(); handleScrollTo(item.id); }}
                      className="flex items-center justify-between px-4 py-2 rounded-md text-gray-300 hover:bg-gray-800 font-medium transition-colors"
                    >
                      <span className="flex items-center">
                        {item.icon}
                        {item.label}
                      </span>
                    </a>
                    {item.subItems && (
                        <div className="pl-8 border-l-2 border-gray-700 ml-5 my-1">
                            {item.subItems.map(subItem => (
                                <a
                                    key={subItem.id}
                                    href={`#${subItem.id}`}
                                    onMouseEnter={() => setHoveredSectionId(subItem.id)}
                                    onClick={(e) => { e.preventDefault(); handleScrollTo(subItem.id); }}
                                    className="flex items-center justify-between text-sm py-1.5 rounded-md text-gray-400 hover:text-cyan-400 hover:bg-gray-800 font-normal transition-colors"
                                >
                                    <span>{subItem.label}</span>
                                </a>
                            ))}
                        </div>
                    )}
                </div>
              ))}
            </nav>
          </aside>

          {/* MAIN CONTENT */}
          <main className="lg:w-3/4 space-y-24">
            
            {project.problemStatement && (
              <ProjectSection id="problem" title={project.problemStatement.title} isHovered={hoveredSectionId === 'problem'}>
                <InteractiveContentCard className="border-2 border-amber-500/30">
                  <div className="space-y-6 text-gray-300 text-lg">
                    {project.problemStatement.content.map((p, i) => <p key={i}>{renderRichText(p)}</p>)}
                  </div>
                </InteractiveContentCard>
              </ProjectSection>
            )}

            {project.vision && (
              <ProjectSection id="vision" title={project.vision.title} isHovered={hoveredSectionId === 'vision'}>
                <InteractiveContentCard className="border-2 border-cyan-500/30">
                  <div className="space-y-6 text-gray-300 text-lg">
                    {project.vision.content.map((p, i) => <p key={i}>{renderRichText(p)}</p>)}
                  </div>
                </InteractiveContentCard>
              </ProjectSection>
            )}

            {project.corePillars && (
                 <ProjectSection id="pillars" title="SSO: A Three-Portal Ecosystem" isHovered={hoveredSectionId === 'pillars'}>
                    <div className="grid md:grid-cols-1 gap-8">
                        {project.corePillars.map(pillar => (
                            <FeatureCard 
                                key={pillar.title}
                                icon={pillar.icon}
                                subtitle={pillar.targetAudience}
                                title={pillar.title}
                                description={pillar.description}
                            />
                        ))}
                    </div>
                </ProjectSection>
            )}

            <ProjectSection id="functionality-matrix" title="Functionality Matrix" isHovered={hoveredSectionId === 'functionality-matrix' || hoveredSectionId?.startsWith('matrix-')}>
                <FunctionalityMatrix />
            </ProjectSection>
            
            <ProjectSection id="global-appeal" title="Why Students Worldwide Choose SSO 🌍" isHovered={hoveredSectionId === 'global-appeal'}>
              <GlobalAppealGlobe />
            </ProjectSection>

            {project.personalization && (
              <ProjectSection id="personalization" title={project.personalization.title} isHovered={hoveredSectionId === 'personalization'}>
                <InteractiveContentCard>
                  <div className="space-y-6 text-gray-300 text-lg">
                    {project.personalization.content.map((p, i) => <p key={i}>{renderRichText(p)}</p>)}
                  </div>
                </InteractiveContentCard>
              </ProjectSection>
            )}

            <ProjectSection id="architecture" title="System Architecture 🏗️" isHovered={hoveredSectionId === 'architecture'}>
                <ArchitectureDiagram />
            </ProjectSection>
            
            <ProjectSection id="deep-dive" title="Tech Deep Dive 🔬" isHovered={hoveredSectionId === 'deep-dive'}>
                <TechDeepDive />
            </ProjectSection>
            
             <ProjectSection id="codebase" title="Codebase Structure 📂" isHovered={hoveredSectionId === 'codebase'}>
                <CodeDirectory />
            </ProjectSection>

            {project.keyTakeaways && (
              <ProjectSection id="takeaways" title={project.keyTakeaways.title} isHovered={hoveredSectionId === 'takeaways'}>
                <InteractiveContentCard>
                  <ul className="space-y-4 list-disc list-inside text-gray-300 text-lg">
                    {project.keyTakeaways.content.map((point, i) => (
                      <li key={i}>{renderRichText(point)}</li>
                    ))}
                  </ul>
                </InteractiveContentCard>
              </ProjectSection>
            )}

            <ProjectSection id="prompts" title="Key Prompts 💬" isHovered={hoveredSectionId === 'prompts'}>
              <div className="max-w-4xl mx-auto space-y-8">
                {project.keyPrompts.map((p, i) => <PromptCard key={i} promptData={p} />)}
              </div>
            </ProjectSection>

            <ProjectSection id="timeline" title="Development Timeline 🗓️" isHovered={hoveredSectionId === 'timeline'}>
              <ProjectTimeline timeline={project.timeline} />
            </ProjectSection>

            <ProjectSection id="result" title="A Day with SSO & Demo 🎬" isHovered={hoveredSectionId === 'result'}>
               <div className="grid grid-cols-1 xl:grid-cols-2 gap-10 items-start">
                  <InteractiveContentCard>
                    <h3 className="text-3xl text-cyan-400 mb-6">Example Scenarios</h3>
                    <div className="space-y-4 text-gray-300 text-lg">
                      {project.result.summary.map((p, i) => <p key={i}>{renderRichText(p)}</p>)}
                    </div>
                  </InteractiveContentCard>
                  <InteractiveContentCard>
                    <h3 className="text-3xl text-cyan-400 mb-6">Try a Live Simulation!</h3>
                    <InteractiveDemo projectId={project.id} />
                  </InteractiveContentCard>
              </div>
            </ProjectSection>
          </main>
        </div>
      </div>
      <HeroImageSelector 
        isOpen={isImageSelectorOpen}
        onClose={() => setIsImageSelectorOpen(false)}
        images={ssoHeroImages}
        onSelect={(url) => setHeroImage(url)}
      />
      <ShareModal isOpen={isShareModalOpen} onClose={() => setIsShareModalOpen(false)} project={project} />
      <VideoModal
        isOpen={isVideoModalOpen}
        onClose={() => setIsVideoModalOpen(false)}
        videoUrl={project.result.videoUrl}
      />
    </>
    );
};

const AskSmartProjectPage: React.FC<{ project: Project; setIsShareModalOpen: (isOpen: boolean) => void; isShareModalOpen: boolean }> = ({ project, setIsShareModalOpen, isShareModalOpen }) => {
  return (
    <>
        <section className="ask-smart-hero py-24 md:py-32 bg-cover bg-center rounded-b-3xl" style={{ backgroundImage: `url(${project.heroImageUrl})` }}>
            <div className="absolute inset-0 bg-black/60"></div>
            <div className="container mx-auto px-4 relative z-10 text-center">
                <motion.h1 
                    className="text-5xl md:text-7xl font-black text-white"
                    initial={{ opacity: 0, y: -30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    {project.name}
                </motion.h1>
                <motion.p 
                    className="mt-4 text-xl md:text-3xl text-cyan-300 font-light"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                >
                    {project.tagline}
                </motion.p>
                <motion.div
                    className="mt-6 flex justify-center items-center gap-4"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                >
                    {project.tags?.map(tag => <Pill key={tag}>{tag}</Pill>)}
                </motion.div>
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                    className="flex flex-wrap justify-center mt-8 gap-4"
                >
                    <button
                      onClick={() => setIsShareModalOpen(true)}
                      className="flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white font-bold py-3 px-6 rounded-full transition-all duration-300 hover:scale-105 hover:bg-white/20 border border-white/30 shadow-lg"
                      aria-label="Share project"
                    >
                      <ShareIcon className="w-5 h-5" />
                      <span>Share Project</span>
                    </button>
                    {project.githubUrl && (
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 bg-gray-700/80 backdrop-blur-sm text-white font-bold py-3 px-6 rounded-full transition-all duration-300 hover:scale-105 hover:bg-gray-800/90 border border-gray-500/30 shadow-lg"
                          aria-label="View source on GitHub"
                        >
                          <GitHubIcon className="w-5 h-5" />
                          <span>View on GitHub</span>
                        </a>
                    )}
                </motion.div>
            </div>
        </section>

        <div className="container mx-auto px-4 py-16 space-y-24">
            
             {project.vision && (
              <ProjectSection id="vision" title={project.vision.title}>
                <InteractiveContentCard className="border-2 border-cyan-500/30">
                  <div className="space-y-6 text-gray-300 text-lg">
                    {project.vision.content.map((p, i) => <p key={i}>{renderRichText(p)}</p>)}
                  </div>
                </InteractiveContentCard>
              </ProjectSection>
            )}

            {project.corePillars && (
                 <ProjectSection id="pillars" title="Core Features">
                    <div className="grid md:grid-cols-1 lg:grid-cols-3 gap-8">
                        {project.corePillars.map(pillar => (
                            <FeatureCard 
                                key={pillar.title}
                                icon={pillar.icon}
                                subtitle={pillar.targetAudience}
                                title={pillar.title}
                                description={pillar.description}
                            />
                        ))}
                    </div>
                </ProjectSection>
            )}

            <ProjectSection id="implementation" title={project.implementation.title}>
              <InteractiveContentCard>
                <div className="space-y-4 text-gray-300 text-lg">
                  {project.implementation.content.map((p, i) => <p key={i}>{renderRichText(p)}</p>)}
                </div>
              </InteractiveContentCard>
            </ProjectSection>
            
            {project.keyTakeaways && (
              <ProjectSection id="takeaways" title={project.keyTakeaways.title}>
                <InteractiveContentCard>
                  <ul className="space-y-4 list-disc list-inside text-gray-300 text-lg">
                    {project.keyTakeaways.content.map((point, i) => (
                      <li key={i}>{renderRichText(point)}</li>
                    ))}
                  </ul>
                </InteractiveContentCard>
              </ProjectSection>
            )}

            <ProjectSection id="prompts" title="Key System Prompt">
              <div className="max-w-4xl mx-auto space-y-8">
                {project.keyPrompts.map((p, i) => <PromptCard key={i} promptData={p} />)}
              </div>
            </ProjectSection>

            <ProjectSection id="timeline" title="Development Timeline">
              <ProjectTimeline timeline={project.timeline} />
            </ProjectSection>

             <ProjectSection id="result" title="Scenarios & Interactive Demo">
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-10 items-start">
                <InteractiveContentCard>
                  <h3 className="text-3xl text-cyan-400 mb-4">Example Scenarios</h3>
                   <div className="space-y-4 text-gray-300 text-lg">
                    {project.result.summary.map((p, i) => <p key={i}>{renderRichText(p)}</p>)}
                  </div>
                </InteractiveContentCard>
                <InteractiveContentCard>
                  <h3 className="text-3xl text-cyan-400 mb-6">Live Simulation</h3>
                  <InteractiveDemo projectId={project.id} />
                </InteractiveContentCard>
              </div>
            </ProjectSection>
        </div>
        <ShareModal isOpen={isShareModalOpen} onClose={() => setIsShareModalOpen(false)} project={project} />
    </>
  );
};

const HowItWorksStep: React.FC<{ number: number; title: string; description: string }> = ({ number, title, description }) => (
    <div className="relative pl-12 pb-8 border-l-2 border-cyan-500/30">
        <div className="absolute -left-5 top-0 w-10 h-10 bg-slate-800 border-2 border-cyan-500 rounded-full flex items-center justify-center font-bold text-lg text-cyan-400">
            {number}
        </div>
        <h4 className="text-xl font-bold">{title}</h4>
        <p className="mt-1 text-gray-400">{description}</p>
    </div>
);

const TechStackTable: React.FC = () => (
    <InteractiveContentCard>
        <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
                <thead className="bg-slate-900/50">
                    <tr>
                        <th className="p-4 text-sm font-bold uppercase text-gray-300 border-b-2 border-gray-700">Component</th>
                        <th className="p-4 text-sm font-bold uppercase text-gray-300 border-b-2 border-gray-700">Technology</th>
                        <th className="p-4 text-sm font-bold uppercase text-gray-300 border-b-2 border-gray-700">Purpose</th>
                    </tr>
                </thead>
                <tbody>
                    <tr className="hover:bg-cyan-500/5 transition-colors duration-200">
                        <td className="p-4 border-b border-gray-700/50 font-semibold text-gray-100 align-top">Frontend</td>
                        <td className="p-4 border-b border-gray-700/50 text-gray-300 align-top">HTML5, CSS3, JavaScript (ES6+)</td>
                        <td className="p-4 border-b border-gray-700/50 text-gray-300 align-top">Core application structure and functionality</td>
                    </tr>
                    <tr className="hover:bg-cyan-500/5 transition-colors duration-200">
                        <td className="p-4 border-b border-gray-700/50 font-semibold text-gray-100 align-top">AI Integration</td>
                        <td className="p-4 border-b border-gray-700/50 text-gray-300 align-top">DeepSeek API</td>
                        <td className="p-4 border-b border-gray-700/50 text-gray-300 align-top">Natural language processing and content generation</td>
                    </tr>
                    <tr className="hover:bg-cyan-500/5 transition-colors duration-200">
                        <td className="p-4 border-b border-gray-700/50 font-semibold text-gray-100 align-top">Styling</td>
                        <td className="p-4 border-b border-gray-700/50 text-gray-300 align-top">CSS Custom Properties, Flexbox/Grid</td>
                        <td className="p-4 border-b border-gray-700/50 text-gray-300 align-top">Dynamic theming and responsive layouts</td>
                    </tr>
                    <tr className="hover:bg-cyan-500/5 transition-colors duration-200">
                        <td className="p-4 border-b-0 border-gray-700/50 font-semibold text-gray-100 align-top">Typography</td>
                        <td className="p-4 border-b-0 border-gray-700/50 text-gray-300 align-top">Inter Font Family</td>
                        <td className="p-4 border-b-0 border-gray-700/50 text-gray-300 align-top">Clean, readable text throughout the application</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </InteractiveContentCard>
);

const MiscellaneousTutorProjectPage: React.FC<{ project: Project; setIsShareModalOpen: (isOpen: boolean) => void; isShareModalOpen: boolean }> = ({ project, setIsShareModalOpen, isShareModalOpen }) => {
    const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
    
    return (
    <>
        <section className="miscellaneous-tutor-hero py-24 md:py-32 bg-cover bg-center rounded-b-3xl" style={{ backgroundImage: `url(${project.heroImageUrl})` }}>
            <div className="absolute inset-0 bg-black/70"></div>
            <div className="container mx-auto px-4 relative z-10 text-center">
                <motion.h1 
                    className="text-5xl md:text-7xl font-black text-white"
                    initial={{ opacity: 0, y: -30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    {project.name}
                </motion.h1>
                <motion.p 
                    className="mt-4 text-xl md:text-3xl text-cyan-300 font-light max-w-4xl mx-auto"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                >
                    {project.tagline}
                </motion.p>
                <motion.div
                    className="mt-6 flex justify-center items-center gap-4 flex-wrap"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                >
                    {project.tags?.map(tag => <Pill key={tag}>{tag}</Pill>)}
                </motion.div>
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                    className="flex flex-wrap justify-center mt-8 gap-4"
                >
                    <button
                      onClick={() => setIsShareModalOpen(true)}
                      className="flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white font-bold py-3 px-6 rounded-full transition-all duration-300 hover:scale-105 hover:bg-white/20 border border-white/30 shadow-lg"
                      aria-label="Share project"
                    >
                      <ShareIcon className="w-5 h-5" />
                      <span>Share</span>
                    </button>
                     {project.liveDemoUrl && (
                        <a
                        href={project.liveDemoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 bg-amber-500/80 backdrop-blur-sm text-white font-bold py-3 px-6 rounded-full transition-all duration-300 hover:scale-105 hover:bg-amber-600/90 border border-amber-400/30 shadow-lg"
                        aria-label="Try Now"
                        >
                        <GlobeAltIcon className="w-5 h-5" />
                        <span>Try Now</span>
                        </a>
                    )}
                    <button
                      onClick={() => setIsVideoModalOpen(true)}
                      className="flex items-center gap-2 bg-fuchsia-500/80 backdrop-blur-sm text-white font-bold py-3 px-6 rounded-full transition-all duration-300 hover:scale-105 hover:bg-fuchsia-600/90 border border-fuchsia-400/30 shadow-lg"
                      aria-label="Watch video demo"
                    >
                      <PlayCircleIcon className="w-5 h-5" />
                      <span>Watch Demo</span>
                    </button>
                    {project.githubUrl && (
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 bg-gray-700/80 backdrop-blur-sm text-white font-bold py-3 px-6 rounded-full transition-all duration-300 hover:scale-105 hover:bg-gray-800/90 border border-gray-500/30 shadow-lg"
                          aria-label="View source on GitHub"
                        >
                          <GitHubIcon className="w-5 h-5" />
                          <span>GitHub</span>
                        </a>
                    )}
                </motion.div>
            </div>
        </section>

        <div className="container mx-auto px-4 py-16 space-y-24">
            
            <ProjectSection title="The Interactive Learning Challenge">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    {project.problemStatement && (
                        <InteractiveContentCard className="border-2 border-amber-500/30">
                            <h3 className="text-2xl text-amber-400 mb-4">{project.problemStatement.title}</h3>
                            <div className="space-y-4 text-gray-300">
                                {project.problemStatement.content.map((p, i) => <p key={i}>{p}</p>)}
                            </div>
                        </InteractiveContentCard>
                    )}
                    {project.vision && (
                        <InteractiveContentCard className="border-2 border-cyan-500/30">
                            <h3 className="text-2xl text-cyan-400 mb-4">{project.vision.title}</h3>
                            <div className="space-y-4 text-gray-300">
                                {project.vision.content.map((p, i) => <p key={i}>{p}</p>)}
                            </div>
                        </InteractiveContentCard>
                    )}
                </div>
            </ProjectSection>

            {project.corePillars && (
                 <ProjectSection title="Key Components">
                    <div className="grid md:grid-cols-1 lg:grid-cols-3 gap-8">
                        {project.corePillars.map(pillar => (
                            <FeatureCard 
                                key={pillar.title}
                                icon={pillar.icon}
                                subtitle={pillar.targetAudience}
                                title={pillar.title}
                                description={pillar.description}
                            />
                        ))}
                    </div>
                </ProjectSection>
            )}

            <ProjectSection title="Try the Tutor & See How It Works">
                <div className="grid lg:grid-cols-2 gap-12 items-start">
                    <InteractiveContentCard>
                        <h3 className="text-3xl text-cyan-400 mb-6">Live Demo</h3>
                        <InteractiveDemo projectId={project.id} />
                    </InteractiveContentCard>

                    <div className="lg:mt-12">
                         <h3 className="text-3xl mb-8">How It Works</h3>
                         <div className="space-y-4">
                            <HowItWorksStep 
                                number={1}
                                title="User Sends a Prompt"
                                description="The user types a question or a topic they want to learn about into the chat interface."
                            />
                             <HowItWorksStep 
                                number={2}
                                title="System Prompt Engineering"
                                description="The request is sent to the DeepSeek API, guided by a system prompt that instructs the model to generate responses as self-contained HTML/CSS/JS modules."
                            />
                             <HowItWorksStep 
                                number={3}
                                title="AI Generates HTML"
                                description="The language model generates a complete HTML document with styles and interactivity for lessons, quizzes, or diagrams."
                            />
                             <HowItWorksStep 
                                number={4}
                                title="Client-Side Rendering"
                                description="The application's vanilla JavaScript sanitizes the HTML and renders it directly into an iframe, creating a dynamic learning module on the fly."
                            />
                         </div>
                    </div>
                </div>
            </ProjectSection>
            
            <ProjectSection title="Technology Stack">
                <TechStackTable />
            </ProjectSection>

            {project.keyTakeaways && (
              <ProjectSection title={project.keyTakeaways.title}>
                <InteractiveContentCard>
                  <ul className="space-y-4 list-disc list-inside text-gray-300 text-lg">
                    {project.keyTakeaways.content.map((point, i) => (
                      <li key={i}>{renderRichText(point)}</li>
                    ))}
                  </ul>
                </InteractiveContentCard>
              </ProjectSection>
            )}

            <ProjectSection title="Key System Prompt">
              <div className="max-w-4xl mx-auto space-y-8">
                {project.keyPrompts.map((p, i) => <PromptCard key={i} promptData={p} />)}
              </div>
            </ProjectSection>

            <ProjectSection title="Development Timeline">
              <ProjectTimeline timeline={project.timeline} />
            </ProjectSection>
            
             <ProjectSection title="Example Interactions">
                 <InteractiveContentCard>
                    <h3 className="text-3xl text-cyan-400 mb-4">Example Scenarios</h3>
                    <div className="space-y-4 text-gray-300 text-lg">
                        {project.result.summary.map((p, i) => <p key={i}>{renderRichText(p)}</p>)}
                    </div>
                </InteractiveContentCard>
            </ProjectSection>
        </div>
        <ShareModal isOpen={isShareModalOpen} onClose={() => setIsShareModalOpen(false)} project={project} />
        <VideoModal
            isOpen={isVideoModalOpen}
            onClose={() => setIsVideoModalOpen(false)}
            videoUrl={project.result.videoUrl}
        />
    </>
  );
};


export default ProjectPage;