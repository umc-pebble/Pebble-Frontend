// src/pages/landing/LandingPage.tsx

import { useLayoutEffect } from 'react';

import { PublicHeader } from '@/components/layout/PublicHeader';
import { BridgeSection } from '@/features/landing/components/BridgeSection';
import { FeaturePanelsScrollSection } from '@/features/landing/components/FeaturePanelsScrollSection';
import { FinalCTASection } from '@/features/landing/components/FinalCTASection';
import { HeroSection } from '@/features/landing/components/HeroSection';
import { LandingFigmaSection } from '@/features/landing/components/LandingFigmaSection';
import { LandingShell } from '@/features/landing/components/LandingShell';
import { ReportSection } from '@/features/landing/components/ReportSection';
import { StepStructureScrollSection } from '@/features/landing/components/StepStructureScrollSection';

export function LandingPage() {
  useLayoutEffect(() => {
    const previousScrollRestoration = window.history.scrollRestoration;

    window.history.scrollRestoration = 'manual';
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'auto',
    });

    const handlePageShow = () => {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'auto',
      });
    };

    window.addEventListener('pageshow', handlePageShow);

    return () => {
      window.removeEventListener('pageshow', handlePageShow);
      window.history.scrollRestoration = previousScrollRestoration;
    };
  }, []);

  return (
    <LandingShell>
      <div className="relative overflow-x-clip bg-fill-inverse">
        <div className="absolute left-0 top-0 z-30 w-full">
          <PublicHeader variant="landing" />
        </div>

        <LandingFigmaSection
          height={1474}
          className="bg-fill-inverse"
        >
          <HeroSection />
        </LandingFigmaSection>

        <StepStructureScrollSection />

        <FeaturePanelsScrollSection />

        <LandingFigmaSection
          height={1024}
          className="bg-fill-inverse"
        >
          <BridgeSection />
        </LandingFigmaSection>

        <LandingFigmaSection
          height={1024}
          className="bg-[linear-gradient(116.7deg,#FAFAFA_3.1%,#E5E5E5_99.9%)]"
        >
          <ReportSection />
        </LandingFigmaSection>

        <LandingFigmaSection
          height={1024}
          className="bg-[#171717]"
        >
          <FinalCTASection />
        </LandingFigmaSection>
      </div>
    </LandingShell>
  );
}
