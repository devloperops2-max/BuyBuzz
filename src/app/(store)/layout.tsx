import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { NovaChat } from "@/components/nova-chat";
import { Suspense } from "react";

export default function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <Suspense>
        <Header />
      </Suspense>
      <main className="flex-grow container mx-auto px-4 sm:px-6 py-8">
        {children}
      </main>
      <Footer />
      <NovaChat />
    </div>
  );
}
