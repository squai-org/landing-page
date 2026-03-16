import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";

const Privacy = lazy(() => import("./pages/Privacy"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

function detectLang(): "en" | "es" {
  const browserLang = navigator.language ?? "";
  return browserLang.startsWith("es") ? "es" : "en";
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}>
        <Routes>
          <Route path="/" element={<Navigate to={`/${detectLang()}`} replace />} />
          <Route path="/privacy" element={<Navigate to={`/${detectLang()}/privacy`} replace />} />

          <Route path="/:lang" element={<Index />} />
          <Route path="/:lang/privacy" element={<Suspense fallback={null}><Privacy /></Suspense>} />
          <Route path="*" element={<Suspense fallback={null}><NotFound /></Suspense>} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
