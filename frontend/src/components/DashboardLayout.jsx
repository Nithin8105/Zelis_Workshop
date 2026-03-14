import Sidebar from "./Sidebar";
import Header from "./Header";

export default function DashboardLayout({
  items,
  activeKey,
  onSelect,
  title,
  subtitle,
  user,
  theme,
  onToggleTheme,
  children,
}) {
  return (
    <div className="min-h-screen p-4 sm:p-6">
      <div className="mx-auto grid max-w-[1600px] gap-4 lg:grid-cols-[280px_minmax(0,1fr)]">
        <div className="lg:sticky lg:top-6 lg:h-[calc(100vh-3rem)]">
          <Sidebar items={items} activeKey={activeKey} onSelect={onSelect} />
        </div>

        <div className="min-w-0 space-y-4">
          <Header
            title={title}
            subtitle={subtitle}
            user={user}
            theme={theme}
            onToggleTheme={onToggleTheme}
          />
          <main className="min-w-0">{children}</main>
        </div>
      </div>
    </div>
  );
}
