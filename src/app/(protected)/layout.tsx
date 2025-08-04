import { Sidebar } from "@/components/sidebar";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { UserProvider } from "@/contexts/UserContext";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <UserProvider>
        <div className="flex h-screen bg-background">
          <Sidebar />
          <main className="flex-1 overflow-hidden lg:ml-64">
            <div className="h-full overflow-y-auto">
              <div className="container mx-auto px-4 py-6 lg:px-6 lg:py-8">
                {children}
              </div>
            </div>
          </main>
        </div>
      </UserProvider>
    </ProtectedRoute>
  );
}
