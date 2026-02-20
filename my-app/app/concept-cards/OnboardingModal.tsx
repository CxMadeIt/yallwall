"use client";

import { useState, useEffect } from "react";
import { X, MapPin, Heart, Zap, Gift, ChevronRight, Check } from "lucide-react";

const COLORS = {
  navy: "#0D1B2A",
  yellow: "#F5A623",
  cream: "#FAF8F5",
};

const ONBOARDING_STEPS = [
  {
    title: "Welcome to YallWall! 👋",
    subtitle: "Your hyper-local community",
    description: "Connect with people in Cenla and Boyce, LA. Share real-time updates, discover local deals, and support your neighbors.",
    icon: MapPin,
    color: COLORS.yellow,
  },
  {
    title: "YallPoints Economy 🪙",
    subtitle: "Tip & earn rewards",
    description: "Get 250 free YallPoints every month. Tip great posts, earn when others tip you, and unlock exclusive local perks!",
    icon: Gift,
    color: "#22C55E",
  },
  {
    title: "Four Feeds, One Wall 📱",
    subtitle: "Live • Hot • Alerts • Deals",
    description: "Switch between Live updates, Hot trending posts, emergency Alerts, and local Deals from businesses near you.",
    icon: Zap,
    color: "#3B82F6",
  },
  {
    title: "Good Deeds Matter 💛",
    subtitle: "Support your community",
    description: "Recognize helpful neighbors by tipping their posts. Build karma, climb the leaderboard, and make Cenla better together!",
    icon: Heart,
    color: "#EC4899",
  },
];

interface OnboardingModalProps {
  isOpen: boolean;
  onComplete: () => void;
  onSkip: () => void;
}

export default function OnboardingModal({ isOpen, onComplete, onSkip }: OnboardingModalProps) {
  const [step, setStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => setIsVisible(true), 50);
    } else {
      setIsVisible(false);
      setStep(0);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const currentStep = ONBOARDING_STEPS[step];
  const Icon = currentStep.icon;
  const isLastStep = step === ONBOARDING_STEPS.length - 1;

  const handleNext = () => {
    if (isLastStep) {
      onComplete();
    } else {
      setStep(step + 1);
    }
  };

  return (
    <div className={`fixed inset-0 z-[100] flex items-center justify-center p-4 transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onSkip} />
      
      {/* Modal */}
      <div 
        className={`relative w-full max-w-md rounded-3xl overflow-hidden transition-all duration-300 ${isVisible ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'}`}
        style={{ backgroundColor: COLORS.cream }}
      >
        {/* Progress bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gray-200">
          <div 
            className="h-full transition-all duration-300"
            style={{ 
              width: `${((step + 1) / ONBOARDING_STEPS.length) * 100}%`,
              backgroundColor: COLORS.yellow 
            }}
          />
        </div>

        {/* Skip button */}
        <button 
          onClick={onSkip}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-black/5 transition-colors z-10"
        >
          <X className="w-5 h-5" style={{ color: COLORS.navy }} />
        </button>

        {/* Content */}
        <div className="p-8 pt-10 text-center">
          {/* Icon */}
          <div 
            className="w-20 h-20 rounded-2xl mx-auto mb-6 flex items-center justify-center"
            style={{ backgroundColor: `${currentStep.color}20` }}
          >
            <Icon className="w-10 h-10" style={{ color: currentStep.color }} />
          </div>

          {/* Step indicator */}
          <p className="text-xs font-medium mb-2 uppercase tracking-wider" style={{ color: currentStep.color }}>
            Step {step + 1} of {ONBOARDING_STEPS.length}
          </p>

          {/* Title */}
          <h2 className="text-2xl font-bold mb-2" style={{ color: COLORS.navy }}>
            {currentStep.title}
          </h2>

          {/* Subtitle */}
          <p className="text-sm font-medium mb-4" style={{ color: COLORS.yellow }}>
            {currentStep.subtitle}
          </p>

          {/* Description */}
          <p className="text-sm leading-relaxed mb-8" style={{ color: `${COLORS.navy}99` }}>
            {currentStep.description}
          </p>

          {/* Dots */}
          <div className="flex justify-center gap-2 mb-8">
            {ONBOARDING_STEPS.map((_, idx) => (
              <div 
                key={idx}
                className="w-2 h-2 rounded-full transition-all duration-300"
                style={{ 
                  backgroundColor: idx === step ? currentStep.color : `${COLORS.navy}20`,
                  transform: idx === step ? 'scale(1.2)' : 'scale(1)'
                }}
              />
            ))}
          </div>

          {/* Buttons */}
          <div className="space-y-3">
            <button
              onClick={handleNext}
              className="w-full py-3.5 rounded-xl font-semibold text-white flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98]"
              style={{ backgroundColor: COLORS.yellow }}
            >
              {isLastStep ? (
                <>
                  <Check className="w-5 h-5" />
                  Get Started
                </>
              ) : (
                <>
                  Next
                  <ChevronRight className="w-5 h-5" />
                </>
              )}
            </button>
            
            {!isLastStep && (
              <button
                onClick={onSkip}
                className="w-full py-3 rounded-xl font-medium text-sm transition-colors hover:bg-black/5"
                style={{ color: `${COLORS.navy}80` }}
              >
                Skip Tutorial
              </button>
            )}
          </div>
        </div>

        {/* Bottom decoration */}
        <div 
          className="h-2 w-full"
          style={{ background: `linear-gradient(90deg, ${COLORS.yellow} 0%, ${currentStep.color} 100%)` }}
        />
      </div>
    </div>
  );
}
