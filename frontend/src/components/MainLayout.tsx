import { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Package, Settings, LogOut, Sun, Moon, Menu, ChevronLeft } from 'lucide-react';
import { useTheme } from 'next-themes';

export function MainLayout() {
  const location = useLocation();
  const { theme, setTheme } = useTheme();
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen flex transition-colors duration-300">
      
      <aside 
        className={`${
          isSidebarOpen ? 'w-72' : 'w-20'
        } bg-slate-900 text-white flex flex-col fixed h-full z-20 shadow-xl transition-all duration-300 ease-in-out border-r border-slate-800`}
      >
        <div className="h-20 flex items-center justify-between px-4 border-b border-slate-800">
          
          <div className={`overflow-hidden transition-all duration-300 ${isSidebarOpen ? 'w-auto opacity-100' : 'w-0 opacity-0'}`}>
            <h1 className="text-2xl font-extrabold bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent whitespace-nowrap tracking-tight">
              AUTOFLEX
            </h1>
            <p className="text-[10px] text-slate-400 font-medium tracking-widest uppercase mt-0.5">PRO SYSTEM</p>
          </div>

          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            {isSidebarOpen ? <ChevronLeft size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <nav className="flex-1 p-3 space-y-2 mt-4">
          <NavItem 
            to="/" 
            icon={<LayoutDashboard size={22} />} 
            label="Dashboard" 
            isActive={isActive('/')} 
            isOpen={isSidebarOpen} 
          />
          <NavItem 
            to="/products" 
            icon={<Package size={22} />} 
            label="Produtos" 
            isActive={isActive('/products')} 
            isOpen={isSidebarOpen} 
          />
        </nav>

        <div className="p-3 border-t border-slate-800 space-y-2 mb-2">
           <NavItem 
            to="#" 
            icon={<Settings size={22} />} 
            label="Configurações" 
            isActive={false} 
            isOpen={isSidebarOpen} 
          />
           <button className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all group ${
             isSidebarOpen ? 'justify-start' : 'justify-center'
           } text-red-400 hover:text-red-300 hover:bg-red-900/20`}>
            <LogOut size={22} />
            <span className={`transition-all duration-300 ${isSidebarOpen ? 'opacity-100 w-auto' : 'opacity-0 w-0 overflow-hidden'}`}>
              Sair
            </span>
          </button>
        </div>
      </aside>

      <main className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'ml-72' : 'ml-20'}`}>
        
        <header className="h-20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-8 sticky top-0 z-10 transition-colors duration-300">
          
          <div>
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white">
              Bem-vindo!
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 hidden sm:block">
              Aqui está o resumo da sua operação hoje.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:scale-105 transition-all border border-slate-200 dark:border-slate-700"
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            
            <div className="flex items-center gap-3 pl-4 border-l border-slate-200 dark:border-slate-700">
              <div className="text-right hidden md:block">
                <p className="text-sm font-bold text-slate-800 dark:text-white">Admin</p>
                <p className="text-xs text-slate-500">Admin</p>
              </div>
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                A
              </div>
            </div>
          </div>
        </header>

        <div className="p-8 animate-in fade-in duration-500">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

function NavItem({ to, icon, label, isActive, isOpen }: any) {
  return (
    <Link
      to={to}
      className={`flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all group relative ${
        isActive 
          ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50' 
          : 'text-slate-400 hover:text-white hover:bg-slate-800'
      } ${isOpen ? 'justify-start' : 'justify-center'}`}
    >
      <div className={`${!isActive && 'group-hover:scale-110'} transition-transform duration-200`}>
        {icon}
      </div>
      
      <span className={`whitespace-nowrap transition-all duration-300 ${
        isOpen ? 'opacity-100 w-auto translate-x-0' : 'opacity-0 w-0 -translate-x-4 overflow-hidden absolute'
      }`}>
        {label}
      </span>

      {!isOpen && (
        <div className="absolute left-full ml-4 px-2 py-1 bg-slate-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 whitespace-nowrap border border-slate-700">
          {label}
        </div>
      )}
    </Link>
  )
}