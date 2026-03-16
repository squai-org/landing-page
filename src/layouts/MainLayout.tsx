import type { ReactNode } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import GradientBackground from "./GradientBackground";

interface MainLayoutProps {
  children: ReactNode;
  onOpenContact?: () => void;
}

const MainLayout = ({ children, onOpenContact }: MainLayoutProps) => (
  <div className="min-h-screen relative overflow-x-clip">
    <GradientBackground />
    <div className="relative z-10">
      <Navbar />
      <main>{children}</main>
      <Footer onOpenContact={onOpenContact} />
    </div>
  </div>
);

export default MainLayout;
