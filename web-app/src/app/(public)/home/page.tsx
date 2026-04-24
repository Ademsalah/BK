import AboutSection from "@/components/home/AboutSection";
import ContactSection from "@/components/home/ContactSection";
import HeroSlider from "@/components/home/HeroSlider";
import ShowsSection from "@/components/home/ShowsSection";

export default function Home() {
  return (
    <main className="flex flex-col w-full overflow-x-hidden">
      <HeroSlider />

      <div className="space-y-0">
        <ShowsSection />
        <AboutSection />
        <ContactSection />
      </div>
    </main>
  );
}