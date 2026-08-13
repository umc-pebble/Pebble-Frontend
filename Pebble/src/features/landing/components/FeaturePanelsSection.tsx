// src/features/landing/components/FeaturePanelsSection.tsx

import type { ReactNode } from 'react';

import {
  FEATURE_PANEL_DATA,
  type FeaturePanelId,
} from '@/features/landing/constants/featurePanelData';

import { CategoryPreviewCard } from './CategoryPreviewCard';
import { FeatureCalendarPreview } from './FeatureCalendarPreview';
import { FeaturePanel } from './FeaturePanel';
import { TaskColorPreview } from './TaskColorPreview';

interface FeaturePanelsSectionProps {
  activeStep?: number;
  isSectionVisible?: boolean;
}

const PREVIEW_COMPONENTS: Record<FeaturePanelId, ReactNode> = {
  category: <CategoryPreviewCard />,
  taskColor: <TaskColorPreview />,
  calendar: <FeatureCalendarPreview />,
};

export function FeaturePanelsSection({
  activeStep = 0,
  isSectionVisible = false,
}: FeaturePanelsSectionProps) {
  const normalizedActiveStep = Math.min(
    Math.max(activeStep, 0),
    FEATURE_PANEL_DATA.length - 1,
  );

  return (
    <div className="relative h-[1024px] w-[1440px] overflow-hidden bg-transparent">
      <article className="absolute left-[100px] top-[200px] h-[624px] w-[1240px] overflow-hidden rounded-token-l bg-fill-surface">
        {FEATURE_PANEL_DATA.map((panel, index) => (
          <FeaturePanel
            key={panel.id}
            title={panel.title}
            description={panel.description}
            isActive={index === normalizedActiveStep}
            hasPassed={index < normalizedActiveStep}
            isSectionVisible={isSectionVisible}
          >
            {PREVIEW_COMPONENTS[panel.id]}
          </FeaturePanel>
        ))}
      </article>
    </div>
  );
}
