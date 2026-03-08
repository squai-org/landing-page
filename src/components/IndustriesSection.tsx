import { content, type Lang } from "@/lib/content";
import { Code, GraduationCap, Briefcase, ShoppingCart, Users } from "lucide-react";

const icons = [Code, GraduationCap, Briefcase, ShoppingCart, Users];

const IndustriesSection = ({ lang }: { lang: Lang }) => {
  const t = content.industries;

  return (
    <section id="industries" className="py-16 relative">
      <div className="w-full relative">
        
        <h2 className="font-headline font-black text-3xl md:text-5xl lg:text-[56px] text-center mb-10 px-4">
          {lang === "en" ? "Trusted by organizations in" : "Confiado por organizaciones en"}
        </h2>

        <div className="relative mx-auto flex overflow-hidden w-full">

          {/* Marquee Container */}
          <div className="flex w-max animate-marquee">
            {/* We duplicate the array to create a seamless infinite loop scrolling effect */}
            {[...Array(2)].map((_, arrayIndex) => (
              <div key={arrayIndex} className="flex justify-around items-center gap-10 md:gap-20 pr-10 md:pr-20">
                {t.items[lang].map((item, i) => {
                  const Icon = icons[i];
                  return (
                    <div
                      key={i}
                      className="flex items-center gap-3 group opacity-60 hover:opacity-100 transition-opacity duration-300 cursor-default"
                    >
                      <Icon className="text-foreground" size={36} strokeWidth={1.5} />
                      <span className="font-headline font-semibold text-xl md:text-3xl text-foreground whitespace-nowrap">
                        {item}
                      </span>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default IndustriesSection;
