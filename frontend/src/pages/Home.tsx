import { Navbar, Hero, Features, Footer } from "@/components/home";

const Home = () => {
  return (
    <div className="bg-white text-black/90">
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
