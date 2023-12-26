import { useRef, useEffect } from "react";
import { Navbar, Hero, Features, Footer } from "@/components/home";
import AOS from "aos"
import "aos/dist/aos.css";
const Home = () => {
  const renderCount = useRef<number>(0)
  useEffect(() => {
   /*  if(renderCount.current <= 0){ */
      AOS.init()
      renderCount.current += 1;
   /*  } */
    
  }, []);
  console.log(renderCount.current);
  return (
    <div className="bg-white text-black/90 overflow-x-hidden">
      <Navbar />
      <Hero />
      <main>
        <Features />
      </main>
      <Footer />
    </div>
  );
};

export default Home;
