import Card from "@/components/shared/Card";
import Footer from "@/components/shared/Footer";
import Header from "@/components/shared/Header";
import { SyncUser } from "@/lib/utils";

SyncUser();
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen flex-col">
      <Header />
      <main className="flex-1">{children}</main>

      <Footer />
    </div>
  );
}
