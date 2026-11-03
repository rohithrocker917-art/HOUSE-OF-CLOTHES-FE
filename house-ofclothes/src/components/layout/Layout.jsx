import Navbar from './Navbar';
import Footer from './Footer';
export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-[#f8f7f3] font-sans text-[#22231f] transition-colors dark:bg-[#171815] dark:text-[#f4f2ec]">
      <Navbar />
      <main className="mx-auto w-[calc(100%-2rem)] max-w-[1240px] md:w-[calc(100%-4rem)]">
        {children}
      </main>
      <Footer />
    </div>
  );
}
