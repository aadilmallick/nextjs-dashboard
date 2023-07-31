import GlassPane from "@/components/GlassPane";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="min-h-screen rainbow-mesh p-8">
      <GlassPane className="w-[90vw] mx-auto h-full pb-12">
        {children}
      </GlassPane>
    </section>
  );
}
