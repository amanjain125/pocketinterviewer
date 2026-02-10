import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

interface EntryAnimationProps {
  onComplete: () => void;
}

export function EntryAnimation({ onComplete }: EntryAnimationProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const emojiRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          // Exit animation
          gsap.to(cardRef.current, {
            scale: 0.8,
            opacity: 0,
            y: '-18vh',
            duration: 0.6,
            ease: 'power2.inOut',
            onComplete,
          });
          gsap.to(emojiRef.current, {
            x: '-6vw',
            rotation: -10,
            opacity: 0,
            duration: 0.5,
            delay: 0.1,
            ease: 'power2.inOut',
          });
          gsap.to(textRef.current, {
            x: '6vw',
            opacity: 0,
            duration: 0.5,
            delay: 0.1,
            ease: 'power2.inOut',
          });
        },
      });

      // Entrance animation
      tl.fromTo(
        cardRef.current,
        { scale: 0.65, opacity: 0, y: '10vh' },
        { scale: 1, opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }
      )
        .fromTo(
          emojiRef.current,
          { scale: 0.6, rotation: -12, opacity: 0 },
          { scale: 1, rotation: 0, opacity: 1, duration: 0.6, ease: 'back.out(1.7)' },
          '-=0.4'
        )
        .fromTo(
          textRef.current,
          { y: 24, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out' },
          '-=0.3'
        );

      // Hold for 1 second then trigger exit
      tl.to({}, { duration: 0.8 });
    }, containerRef);

    return () => ctx.revert();
  }, [onComplete]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[100] bg-[#2B0B57] flex items-center justify-center"
    >
      {/* Gradient blob behind */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[60vw] h-[60vw] max-w-[800px] max-h-[800px] rounded-full gradient-blob animate-blob-drift" />
      </div>

      {/* Logo Card */}
      <div
        ref={cardRef}
        className="relative w-[22vw] h-[22vw] max-w-[320px] max-h-[320px] bg-[#4B2086] rounded-[28px] shadow-[0_28px_70px_rgba(0,0,0,0.35)] border border-white/10 flex flex-col items-center justify-center"
      >
        {/* Briefcase Emoji */}
        <div
          ref={emojiRef}
          className="text-[10vw] max-text-[120px] leading-none mb-4"
        >
          💼
        </div>

        {/* Wordmark */}
        <div ref={textRef} className="text-center px-4">
          <h1 className="font-display font-bold text-white text-[2vw] max-text-[24px] tracking-tight">
            Pocket Interviewer
          </h1>
        </div>
      </div>
    </div>
  );
}
