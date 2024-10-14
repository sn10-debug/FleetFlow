
import ProtectedRoute from "@/components/ProtectedRoute";
import { AuthProvider } from "@/contexts/AuthContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    
       <AuthProvider> 
      <ProtectedRoute> {children} </ProtectedRoute>
      </AuthProvider>  
    
  );
}
