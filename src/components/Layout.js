export function Layout({ navigation, settings, children }) {
  return (
    <div className="text-slate-800">
      <main>{children}</main>
    </div>
  );
}
