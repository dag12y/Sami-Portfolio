import {
  AudioLines,
  Blend,
  Captions,
  ChevronLeft,
  ChevronRight,
  Clapperboard,
  Crop,
  Film,
  Gauge,
  KeyRound,
  Laptop2,
  Palette,
  Sparkles,
  Wand2,
} from 'lucide-react';
import { useEffect, useState } from 'react';

function About() {
  const skills = [
    {
      name: 'Video cutting, trimming, and sequencing',
      icon: Crop,
      detail: 'Tight edits with smooth flow and attention control.',
    },
    {
      name: 'Motion graphics and visual effects (VFX)',
      icon: Sparkles,
      detail: 'Clean visual polish that supports the story.',
    },
    {
      name: 'Color correction and cinematic color grading',
      icon: Palette,
      detail: 'Balanced tones and cinematic looks for stronger mood.',
    },
    {
      name: 'Audio editing and sound balancing',
      icon: AudioLines,
      detail: 'Clear voice, controlled levels, and impactful sound.',
    },
    {
      name: 'Keyframing and smooth animation',
      icon: KeyRound,
      detail: 'Precise movement that feels natural and intentional.',
    },
    {
      name: 'Transitions, filters, and text effects',
      icon: Wand2,
      detail: 'Stylized transitions and typography that stay readable.',
    },
    {
      name: 'Video stabilization and correction',
      icon: Gauge,
      detail: 'Cleaner motion and corrected shots for a pro finish.',
    },
    {
      name: 'Subtitles and captions',
      icon: Captions,
      detail: 'Readable captions that boost retention and accessibility.',
    },
    {
      name: 'Storytelling and pacing for engaging visuals',
      icon: Clapperboard,
      detail: 'Narrative-first pacing designed to keep attention.',
    },
    {
      name: 'Creative visual design and aesthetic composition',
      icon: Blend,
      detail: 'Strong composition and visual identity across edits.',
    },
  ];
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const tools = [
    {
      name: 'CapCut PC',
      icon: Laptop2,
      detail: 'Fast short-form editing, social cuts, captions, and quick motion styling.',
    },
    {
      name: 'DaVinci Resolve',
      icon: Film,
      detail: 'Cinematic grading, timeline precision, audio cleanup, and finishing.',
    },
  ];
  const [activeToolIndex, setActiveToolIndex] = useState(0);
  const activeSkill = skills[activeIndex];
  const ActiveIcon = activeSkill.icon;
  const activeTool = tools[activeToolIndex];
  const ActiveToolIcon = activeTool.icon;

  useEffect(() => {
    if (isPaused) {
      return;
    }

    const intervalId = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % skills.length);
    }, 2500);

    return () => window.clearInterval(intervalId);
  }, [isPaused, skills.length]);

  const showNext = () => {
    setActiveIndex((current) => (current + 1) % skills.length);
  };

  const showPrevious = () => {
    setActiveIndex((current) => (current - 1 + skills.length) % skills.length);
  };

  return (
    <section id="about" className="py-24 bg-beige dark:bg-slate-900">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="text-4xl sm:text-5xl font-display font-bold text-text-dark dark:text-slate-100 mb-4">
            About Me
          </h2>
          <div className="w-16 h-1 bg-sage mx-auto rounded-full"></div>
        </div>

        <div className="max-w-3xl mx-auto">
          <p className="text-lg text-text-dark/80 dark:text-slate-300 leading-relaxed mb-16 text-center animate-fade-in-up">
            I&apos;m the person who sees raw footage and thinks, &ldquo;Let&apos;s make this tell a
            story people can&apos;t look away from.&rdquo; I&apos;m a professional video editor with one year
            of experience, specializing in short-form promotional, tutorial, and self-improvement
            content. I bring ideas to life through high-quality, engaging edits that capture
            attention instantly and communicate messages clearly. I also craft long-form videos
            with smooth pacing and compelling storytelling. With a strong understanding of social
            media trends and audience behavior, I shape every project to connect, engage, and
            leave a lasting impression.
          </p>

          <div className="text-center mb-8 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            <h3 className="text-2xl font-display font-bold text-text-dark dark:text-slate-100 mb-8">My Skills</h3>
          </div>
          <div className="max-w-4xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.15s' }}>
            <div
              className="bg-white dark:bg-slate-800 border border-slate-light dark:border-slate-700 rounded-2xl p-6 md:p-8 text-center shadow-elegant"
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
            >
              <div className="flex items-center justify-between mb-4">
                <button
                  onClick={showPrevious}
                  className="inline-flex items-center justify-center w-10 h-10 rounded-full border border-slate-light dark:border-slate-700 text-text-dark dark:text-slate-100 hover:border-sage hover:text-sage transition-colors"
                  aria-label="Previous skill"
                >
                  <ChevronLeft size={18} />
                </button>
                <p className="text-xs uppercase tracking-wide text-text-dark/60 dark:text-slate-400">
                  Skill {activeIndex + 1} of {skills.length}
                </p>
                <button
                  onClick={showNext}
                  className="inline-flex items-center justify-center w-10 h-10 rounded-full border border-slate-light dark:border-slate-700 text-text-dark dark:text-slate-100 hover:border-sage hover:text-sage transition-colors"
                  aria-label="Next skill"
                >
                  <ChevronRight size={18} />
                </button>
              </div>

              <div className="min-h-[140px] flex flex-col items-center justify-center">
                <ActiveIcon className="w-9 h-9 text-sage mx-auto mb-3" />
                <h4 className="text-text-dark dark:text-slate-100 font-semibold mb-2">{activeSkill.name}</h4>
                <p className="text-text-dark/70 dark:text-slate-300 text-sm">{activeSkill.detail}</p>
              </div>

              <div className="flex items-center justify-center gap-2 mt-5">
                {skills.map((skill, index) => (
                  <button
                    key={skill.name}
                    onClick={() => setActiveIndex(index)}
                    className={`h-2.5 rounded-full transition-all ${
                      index === activeIndex
                        ? 'w-7 bg-sage'
                        : 'w-2.5 bg-slate-300 dark:bg-slate-600 hover:bg-sage/60'
                    }`}
                    aria-label={`Go to skill ${index + 1}`}
                  />
                ))}
              </div>
            </div>

            <div className="mt-6 text-center">
              <h4 className="text-lg font-display font-bold text-text-dark dark:text-slate-100 mb-3">My Tools</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4 max-w-xl mx-auto">
                {tools.map((tool, index) => {
                  const ToolIcon = tool.icon;
                  const isActive = index === activeToolIndex;
                  return (
                    <button
                      key={tool.name}
                      onClick={() => setActiveToolIndex(index)}
                      onMouseEnter={() => setActiveToolIndex(index)}
                      className={`rounded-xl border p-4 text-left transition-all duration-300 ${
                        isActive
                          ? 'bg-sage/20 border-sage shadow-elegant'
                          : 'bg-white dark:bg-slate-800 border-slate-light dark:border-slate-700 hover:border-sage/70'
                      }`}
                    >
                      <ToolIcon className="w-5 h-5 text-taupe mb-2" />
                      <p className="text-sm font-semibold text-text-dark dark:text-slate-100">{tool.name}</p>
                    </button>
                  );
                })}
              </div>

              <div className="bg-white dark:bg-slate-800 border border-slate-light dark:border-slate-700 rounded-2xl p-5 text-left">
                <div className="flex items-start gap-3">
                  <span className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-sage/20">
                    <ActiveToolIcon className="w-5 h-5 text-sage" />
                  </span>
                  <div>
                    <p className="text-text-dark dark:text-slate-100 font-semibold">{activeTool.name}</p>
                    <p className="text-sm text-text-dark/70 dark:text-slate-300 mt-1">{activeTool.detail}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default About;
