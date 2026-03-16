import { t } from "@/lib/content";
import { useLang } from "@/hooks/use-lang";
import { Code, GraduationCap, Briefcase, ShoppingCart, Users } from "lucide-react";

const icons = [Code, GraduationCap, Briefcase, ShoppingCart, Users];
const marqueeCopies = ["first", "second"] as const;

const IndustriesSection = () => {
  const { lang } = useLang();
  const { industries } = t(lang);

  return (
    <section id="industries" className="py-10 sm:py-16 relative">
      <div className="w-full relative">
        
        <h2 className="font-headline font-black text-[1.75rem] sm:text-3xl md:text-5xl lg:text-[56px] text-center mb-8 sm:mb-10 px-5">
          {industries.marqueeTitle}
        </h2>

        <div className="relative mx-auto flex overflow-hidden w-full">

          <div className="flex w-max animate-marquee">
            {marqueeCopies.map((copyId) => (
              <div key={copyId} className="flex justify-around items-center gap-6 sm:gap-10 md:gap-20 pr-6 sm:pr-10 md:pr-20">
                {industries.items.map((item, i) => {
                  const Icon = icons[i];
                  return (
                    <div
                      key={`${copyId}-${item}`}
                      className="flex items-center gap-2 sm:gap-3 group opacity-60 hover:opacity-100 transition-opacity duration-300 cursor-default"
                    >
                      <Icon className="text-foreground shrink-0" size={24} strokeWidth={1.5} />
                      <span className="font-headline font-semibold text-base sm:text-xl md:text-3xl text-foreground whitespace-nowrap">
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
