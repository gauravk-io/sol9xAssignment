import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, GraduationCap, User, LayoutDashboard } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <nav className="sticky top-0 z-40 w-full border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        <Link to="/dashboard" className="flex items-center gap-2 text-xl font-bold tracking-tight">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/20 bg-white/5 shadow-inner">
            <GraduationCap size={20} className="text-white" />
          </div>
          <span className="text-white">
            sol9x
          </span>
        </Link>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-4">
            <div className="flex flex-col items-end">
              <span className="text-xs font-bold leading-none text-white">{user.name}</span>
              <span className="mt-1 text-[10px] font-black uppercase tracking-tighter text-white">
                {user.role}
              </span>
            </div>
            <button 
              onClick={handleLogout}
              className="inline-flex shrink-0 items-center justify-center rounded-lg p-2 text-white transition-all hover:bg-zinc-800 hover:text-white"
              title="Logout"
            >
              <LogOut size={18} className="shrink-0" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
