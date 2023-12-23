import { Navbar, Hero, Features, Footer } from "@/components/home";

const Home = () => {
  return (
    <>
      <Navbar />
      <Hero />
      <main>
        <Features />
      </main>
      <Footer />
    </>
  );
};

export default Home;
