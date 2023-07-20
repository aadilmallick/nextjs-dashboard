import GlassPane from "@/components/GlassPane";
import Sidebar from "@/components/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="h-screen candy-mesh p-8">
      <GlassPane className="w-[90vw] mx-auto h-full p-4 flex gap-4">
        <Sidebar />
        {children}
      </GlassPane>
      <div id="modal"></div>
    </section>
  );
}