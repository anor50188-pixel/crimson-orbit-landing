import { createFileRoute } from '@tanstack/react-router';
import { AboutSection, Directions, FeatureStrip, FinalCTA, HowItWorks, LandingFooter, LandingHeader, PricingSection, RoadmapSection, SpaceHero } from '@/components/landing-sections';

export const Route = createFileRoute('/')({
  head: () => ({ meta: [
    { title: 'AGENTUS — No-code AI agent platformasi' },
    { name: 'description', content: "AGENTUS: AI agentlar, toollar va AI jamoalar uchun rivojlanayotgan no-code platforma. Yo'nalishlar, mahsulot rejasi va rejalashtirilgan tariflar." },
    { property: 'og:title', content: 'AGENTUS — AI agentlar uchun yangi imkoniyatlar' },
    { property: 'og:description', content: "AI agentlar yarating. Biznesingizni quring. Agentus yo'l xaritasi va rejalashtirilgan imkoniyatlari bilan tanishing." },
    { property: 'og:type', content: 'website' },
    { name: 'twitter:card', content: 'summary_large_image' },
  ] }),
  component: Landing,
});
function Landing() {
  return <div className="agentus-landing"><a className="skip-link" href="#features">Asosiy mazmunga o'tish</a><LandingHeader/><main><SpaceHero/><HowItWorks/><Directions/><AboutSection/><FeatureStrip/><RoadmapSection/><PricingSection/><FinalCTA/></main><LandingFooter/></div>;
}
