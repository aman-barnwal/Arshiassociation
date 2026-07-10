import { useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { Toaster } from "sonner";
import "@/App.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import Home from "@/pages/Home";
import About from "@/pages/About";
import Programs from "@/pages/Programs";
import Projects from "@/pages/Projects";
import ProjectDetail from "@/pages/ProjectDetail";
import Impact from "@/pages/Impact";
import Gallery from "@/pages/Gallery";
import Reports from "@/pages/Reports";
import Transparency from "@/pages/Transparency";
import Partners from "@/pages/Partners";
import Volunteer from "@/pages/Volunteer";
import Donate from "@/pages/Donate";
import Contact from "@/pages/Contact";
import AdminLogin from "@/pages/AdminLogin";
import Admin from "@/pages/Admin";
import DynamicProject from "@/pages/DynamicProject";

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [pathname]);
  return null;
};

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <div className="min-h-screen flex flex-col bg-white font-body text-slate-800">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/programs" element={<Programs />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/projects/view/:id" element={<DynamicProject />} />
            <Route path="/projects/:slug" element={<ProjectDetail />} />
            <Route path="/impact" element={<Impact />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/annual-reports" element={<Reports />} />
            <Route path="/transparency" element={<Transparency />} />
            <Route path="/partners" element={<Partners />} />
            <Route path="/volunteer" element={<Volunteer />} />
            <Route path="/donate" element={<Donate />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </main>
        <Footer />
        <Toaster position="top-center" richColors />
      </div>
    </BrowserRouter>
  );
}

export default App;
