import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ApiProvider } from "@/contexts/ApiContext";
import { ScrollRestoration } from "./components/ScrollRestoration";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import Index from "./pages/Index";
import StatsPage from "./pages/StatsPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import ProductsPage from "./pages/ProductsPage";
import InventoryPage from "./pages/InventoryPage";
import MorePage from "./pages/MorePage";
import OrdersPage from "./pages/OrdersPage";
import AlertsPage from "./pages/AlertsPage";
import UsersPage from "./pages/UsersPage";
import SettingsPage from "./pages/SettingsPage";
import DatabasePage from "./pages/DatabasePage";
import SecurityPage from "./pages/SecurityPage";
import StockReportPage from "./pages/StockReportPage";
import StockMovementPage from "./pages/StockMovementPage";
import StockOpnamePage from "./pages/StockOpnamePage";
import DocumentationPage from "./pages/DocumentationPage";
import AIStudioPage from "./pages/AIStudioPage";
import { ApiManagementPage } from "./pages/ApiManagementPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
          <BrowserRouter>
            <ScrollRestoration />
            <AuthProvider>
              <ApiProvider>
                <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/stats" element={<StatsPage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/inventory" element={<InventoryPage />} />
            <Route path="/orders" element={<OrdersPage />} />
            <Route path="/alerts" element={<AlertsPage />} />
            <Route path="/reports" element={<StockReportPage />} />
            <Route path="/stock-movement" element={<StockMovementPage />} />
            <Route path="/stock-opname" element={<StockOpnamePage />} />
            <Route path="/documentation" element={<DocumentationPage />} />
            <Route path="/stock-analytics" element={<StockMovementPage />} />
            <Route path="/users" element={<UsersPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/database" element={<DatabasePage />} />
            <Route path="/security" element={<SecurityPage />} />
            <Route path="/ai-studio" element={<AIStudioPage />} />
            <Route path="/api-management" element={<ApiManagementPage />} />
            <Route path="/more" element={<MorePage />} />
            <Route path="*" element={<NotFound />} />
                </Routes>
              </ApiProvider>
            </AuthProvider>
          </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;