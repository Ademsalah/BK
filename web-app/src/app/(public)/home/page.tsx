import AboutSection from "@/components/home/AboutSection";
import ContactSection from "@/components/home/ContactSection";
import Divider from "@/components/home/divider";
import HeroSlider from "@/components/home/HeroSlider";
import ShowsSection from "@/components/home/ShowsSection";
import StatsSection from "@/components/home/Stats";

export default function Home() {
  return (
    <main className="flex flex-col w-full overflow-x-hidden">
      <HeroSlider />
        <Divider/>

      <div className="space-y-0">
        <ShowsSection />
        <StatsSection/>
        <AboutSection />
        <ContactSection />
      </div>
    </main>
  );
}