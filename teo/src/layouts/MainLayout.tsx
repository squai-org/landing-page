import type { ReactNode } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import TeoIconSprite from "@/components/TeoIconSprite";

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout = ({ children }: Readonly<MainLayoutProps>) => (
  <>
    <TeoIconSprite />
    <Navbar />
    <main>{children}</main>
    <Footer />
  </>
);

export default MainLayout;
