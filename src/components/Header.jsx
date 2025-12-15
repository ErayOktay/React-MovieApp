export default function Header({ children }) {
  return (
    <div id="header">
      <nav className="navbar navbar-expand-lg border-bottom border-body">
        <div className="container">{children}</div>
      </nav>
    </div>
  );
}
