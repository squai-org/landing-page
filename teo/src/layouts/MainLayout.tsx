import type { ReactNode } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import TeoIconSprite from "@/components/TeoIconSprite";

interface MainLayoutProps {
  children: ReactNode;
  onOpenWaitlist: () => void;
}

const MainLayout = ({ children, onOpenWaitlist }: Readonly<MainLayoutProps>) => (
  <>
    <TeoIconSprite />
    <Navbar onOpenWaitlist={onOpenWaitlist} />
    <main>{children}</main>
    <Footer />
  </>
);

export default MainLayout;
