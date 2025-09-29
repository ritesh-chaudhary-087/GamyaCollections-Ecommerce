import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

const JewelryCarousel=()=> {
  const [api, setApi] = useState();
  const [count, setCount] = useState(0);
  const demoImages = [
    "/assets/Images/slider/GAMYABANNER1.png",
    "/assets/Images/slider/gamyabanner2.png",
    "/assets/Images/slider/gamyabanner3.png",
    
  ]
  useEffect(() => {
    if (!api) return;

    // Set initial count and current slide
    setCount(api.scrollSnapList().length);
   
    // Set up auto-scroll
    const interval = setInterval(() => {
      if (api) {
        const nextSlide = (api.selectedScrollSnap() + 1) % count; // Loop back to the first slide
        api.scrollTo(nextSlide);
      }
    }, 3000); // 3 seconds

    // Cleanup interval on unmount
    return () => clearInterval(interval);
  }, [api, count]);

  return (
    <div className="w-full flex justify-center items-center flex-col p-0 m-0">
      <Carousel setApi={setApi} className="w-full h-auto p-0">
        <CarouselContent className="w-full  h-auto p-0 m-0">
          {demoImages.map((src, index) => (
            <CarouselItem
            key={index}
            className=" md:basis-1/1 w-full h-auto p-0 m-0"
            
          >
            <div className="p-1 w-full h-auto">
              <Card className="overflow-hidden w-full h-auto relative transform transition-transform duration-300 ">
                {/* Demo Image */}
                <img
                  src={src}
                  alt={`Demo ${index + 1}`}
                  className="h-full w-full object-cover"
                />
                {/* Text on Hover */}
                
              </Card>
            </div>
          </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
      <div className="py-2 text-center text-sm text-muted-foreground text-black">
      </div>
    </div>
  );
}
export default JewelryCarousel;