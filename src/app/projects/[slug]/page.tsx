import { projects } from '@/data/projects';
import CaseStudyLayout from '@/components/CaseStudyLayout';
import { notFound } from 'next/navigation';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

const caseStudyContent: Record<string, { sections: Array<{ title: string; body: string; images?: string[] }> }> = {
  velocity: {
    sections: [
      {
        title: 'Problem',
        body: 'Mercedes-Benz needed a digital launch experience for their EQ lineup that matched the ambition of their electric future. Existing automotive sites felt static, dated — more brochure than experience. We were asked to reimagine what a car website could feel like.',
      },
      {
        title: 'Process',
        body: "We spent three weeks prototyping different interaction models before landing on a scroll-driven cinematic approach. Every transition was choreographed to the vehicle's design language — smooth, purposeful, with weight. The result was built with WebGL, custom GLSL shaders, and frame-perfect scroll animation.",
        images: ['/media/project-1.png'],
      },
      {
        title: 'Outcome',
        body: 'The site launched to critical acclaim across the automotive and design press. It won a Webby Award and was shortlisted for the FWA Site of the Year. More importantly, time-on-site doubled compared to the previous EQ campaign — people explored rather than bounced.',
      },
    ],
  },
  drape: {
    sections: [
      {
        title: 'Problem',
        body: 'Fashion discovery is broken. Apps flood users with algorithmic noise — endless scrolling with no sense of personal curation. Drape set out to build a swipe-first styling experience that actually learns your aesthetic over time, not just your click history.',
      },
      {
        title: 'Process',
        body: 'We started with gesture. Everything was designed around the swipe — the foundational micro-interaction that signals yes, no, maybe. The design system built outward from that single gesture: typography that supports quick scanning, a color palette that recedes behind the clothes, interactions that feel like handling real fabric.',
        images: ['/media/project-2.png'],
      },
      {
        title: 'Outcome',
        body: 'Drape launched on iOS to a 4.8-star rating. The average session length was 11 minutes — rare for a utility app. Within six months of launch, the recommendation accuracy hit 73%, meaning nearly 3 in 4 swipe-right items were purchased or saved within the week.',
      },
    ],
  },
};

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) notFound();

  const content = caseStudyContent[slug];
  if (!content) notFound();

  const currentIndex = projects.findIndex((p) => p.slug === slug);
  const nextProject = projects[(currentIndex + 1) % projects.length];

  return (
    <CaseStudyLayout
      project={project}
      sections={content.sections}
      nextProject={nextProject}
    />
  );
}
