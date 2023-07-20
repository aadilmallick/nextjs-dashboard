import GlassPane from "@/components/GlassPane";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="h-screen rainbow-mesh p-8">
      <GlassPane className="w-[90vw] mx-auto h-full">{children}</GlassPane>
    </section>
  );
}
