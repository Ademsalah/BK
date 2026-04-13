import AboutSection from "@/components/home/AboutSection";
import ContactSection from "@/components/home/ContactSection";
import HeroSlider from "@/components/home/HeroSlider";
import ShowsSection from "@/components/home/ShowsSection";

export default function Home() {
  return (
    <div>
      <HeroSlider />
      <ShowsSection />
      <ContactSection />
      <AboutSection />
    </div>
  );
}
