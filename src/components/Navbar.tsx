import SnowIcon from "./SnowIcon";

interface NavBarProps {
    isDark: boolean;
}

function NavBar( {isDark} : NavBarProps) {
  return (
    <nav>
      <div>
        <div className={`flex items-center justify-center h-12 ${isDark ? 'bg-slate-900 text-slate-100' : 'bg-blue-50 text-slate-900' }`}>
          <SnowIcon size={36} />
          <span className="ml-4 font-bold text-lg">Weather Watch</span>
        </div>
      </div>
    </nav>
  );
}

export default NavBar;
