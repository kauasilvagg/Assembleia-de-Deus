import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import Index from "./pages/Index";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import Events from "./pages/Events";
import Blog from "./pages/Blog";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/eventos" element={<Events />} />
            <Route path="/blog" element={<Blog />} />
            {/* Placeholder routes for future pages */}
            <Route path="/sobre" element={<div className="min-h-screen flex items-center justify-center"><h1 className="text-3xl">Página Sobre - Em Desenvolvimento</h1></div>} />
            <Route path="/ministerios" element={<div className="min-h-screen flex items-center justify-center"><h1 className="text-3xl">Página Ministérios - Em Desenvolvimento</h1></div>} />
            <Route path="/sermoes" element={<div className="min-h-screen flex items-center justify-center"><h1 className="text-3xl">Página Sermões - Em Desenvolvimento</h1></div>} />
            <Route path="/contato" element={<div className="min-h-screen flex items-center justify-center"><h1 className="text-3xl">Página Contato - Em Desenvolvimento</h1></div>} />
            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
