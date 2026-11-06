import { t, localized, useI18n, getLocale, formatNumber, relativeTime, plural } from '@/i18n';
import { createFileRoute } from '@tanstack/react-router';
import { AboutSection, Directions, FeatureStrip, FinalCTA, HowItWorks, LandingFooter, LandingHeader, PricingSection, RoadmapSection, SpaceHero } from '@/components/landing-sections';

export const Route = createFileRoute('/')({
  head: () => ({ meta: [
    { title: t("app.landing.agentus_nocode_ai_agent_platformasi") },
    { name: 'description', content: t("app.landing.agentus_ai_agentlar_toollar_va_ai") },
    { property: 'og:title', content: t("app.landing.agentus_ai_agentlar_uchun_yangi_imkoniyatlar") },
    { property: 'og:description', content: t("app.landing.ai_agentlar_yarating_biznesingizni_quring_agentus") },
    { property: 'og:type', content: 'website' },
    { name: 'twitter:card', content: 'summary_large_image' },
  ] }),
  component: Landing,
});
function Landing() {
  useI18n();
  return <div className="agentus-landing"><a className="skip-link" href="#features">{t("app.landing.asosiy_mazmunga_otish")}</a><LandingHeader/><main><SpaceHero/><HowItWorks/><Directions/><AboutSection/><FeatureStrip/><RoadmapSection/><PricingSection/><FinalCTA/></main><LandingFooter/></div>;
}
