
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          {/* Placeholder routes for future pages */}
          <Route path="/sobre" element={<div className="min-h-screen flex items-center justify-center"><h1 className="text-3xl">Página Sobre - Em Desenvolvimento</h1></div>} />
          <Route path="/ministerios" element={<div className="min-h-screen flex items-center justify-center"><h1 className="text-3xl">Página Ministérios - Em Desenvolvimento</h1></div>} />
          <Route path="/eventos" element={<div className="min-h-screen flex items-center justify-center"><h1 className="text-3xl">Página Eventos - Em Desenvolvimento</h1></div>} />
          <Route path="/sermoes" element={<div className="min-h-screen flex items-center justify-center"><h1 className="text-3xl">Página Sermões - Em Desenvolvimento</h1></div>} />
          <Route path="/blog" element={<div className="min-h-screen flex items-center justify-center"><h1 className="text-3xl">Página Blog - Em Desenvolvimento</h1></div>} />
          <Route path="/contato" element={<div className="min-h-screen flex items-center justify-center"><h1 className="text-3xl">Página Contato - Em Desenvolvimento</h1></div>} />
          {/* Catch-all route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
