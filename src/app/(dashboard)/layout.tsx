import GlassPane from "@/components/GlassPane";
import Sidebar from "@/components/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="h-screen candy-mesh md:p-8">
      <div id="modal"></div>
      <GlassPane className="w-full md:w-[90vw] mx-auto h-full p-4 flex gap-4">
        <Sidebar />
        {children}
      </GlassPane>
    </section>
  );
}
