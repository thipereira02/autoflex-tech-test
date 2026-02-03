import { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Package, Settings, LogOut, Sun, Moon, Menu, ChevronLeft } from 'lucide-react';
import { useTheme } from 'next-themes';

export function MainLayout() {
  const location = useLocation();
  const { theme, setTheme } = useTheme();
  
  // Controle do Sidebar
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="flex min-h-screen transition-colors duration-300 relative">
      
      {/* Sidebar Lateral */}
      <aside 
        className={`${
          isSidebarOpen ? 'w-72' : 'w-20'
        } bg-slate-900 text-white flex flex-col fixed h-full z-30 shadow-2xl transition-all duration-300 ease-in-out border-r border-slate-800`}
      >
        {/* Header da Sidebar (Logo + Toggle) */}
        {/* Lógica: Se fechado, centraliza o botão. Se aberto, espaça entre logo e botão. */}
        <div className={`h-24 flex items-center shrink-0 transition-all duration-300 ${
          isSidebarOpen ? 'justify-between px-6' : 'justify-center'
        }`}>
          
          <div className={`transition-all duration-300 overflow-hidden flex items-center gap-3 ${
            isSidebarOpen ? 'w-auto opacity-100' : 'w-0 opacity-0 hidden'
          }`}>
            <img 
              src="/img.png" 
              alt="Autoflex Logo" 
              className="h-50 w-50 object-contain" 
            />
          </div>

          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            {isSidebarOpen ? <ChevronLeft size={24} /> : <Menu size={24} />}
          </button>
        </div>

        <nav className="flex-1 py-6 space-y-2 overflow-y-auto overflow-x-hidden">
          <NavItem 
            to="/" 
            icon={<LayoutDashboard size={24} />} 
            label="Dashboard" 
            isActive={isActive('/')} 
            isOpen={isSidebarOpen} 
          />
          <NavItem 
            to="/products" 
            icon={<Package size={24} />} 
            label="Produtos" 
            isActive={isActive('/products')} 
            isOpen={isSidebarOpen} 
          />
        </nav>

        <div className="p-4 border-t border-slate-800 space-y-2 mb-2 shrink-0">
           <NavItem 
            to="#" 
            icon={<Settings size={24} />} 
            label="Configurações" 
            isActive={false} 
            isOpen={isSidebarOpen} 
          />
           <button className={`w-full flex items-center gap-3 py-3 rounded-xl text-sm font-medium transition-all group text-red-400 hover:text-red-300 hover:bg-red-900/20 relative overflow-hidden
             ${isSidebarOpen ? 'pl-5' : 'pl-[1.4rem]'}
           `}>
            <LogOut size={24} className="shrink-0" />
            <span className={`transition-all duration-300 whitespace-nowrap ${
              isSidebarOpen ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10 absolute'
            }`}>
              Sair
            </span>
          </button>
        </div>
      </aside>

      <main className={`flex-1 transition-all duration-300 flex flex-col min-w-0 ${isSidebarOpen ? 'ml-72' : 'ml-20'}`}>
        
        <header className="h-20 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 sm:px-8 sticky top-0 z-20 transition-colors duration-300">
          
          <div className="flex flex-col justify-center">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-white leading-tight">
              Olá, <span className="text-blue-600 dark:text-blue-400">bem-vindo!</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 hidden sm:block">
              Visão geral da sua operação hoje.
            </p>
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:scale-110 transition-transform border border-slate-200 dark:border-slate-700 shadow-sm"
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            
            <div className="flex items-center gap-3 pl-4 border-l border-slate-200 dark:border-slate-700">
              <div className="text-right hidden md:block">
                <p className="text-sm font-bold text-slate-800 dark:text-white leading-none mb-1">Admin</p>
              </div>
              <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-md ring-2 ring-white dark:ring-slate-800">
                A
              </div>
            </div>
          </div>
        </header>

        <div className="p-4 sm:p-8 animate-in fade-in duration-500 flex-1 overflow-x-hidden">
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
      className={`flex items-center gap-3 py-3 relative transition-all duration-300 group overflow-hidden
        ${isActive 
          ? 'text-white bg-white/10 border-r-4 border-blue-500' 
          : 'text-slate-400 hover:text-white hover:bg-white/5'
        }
        /* AQUI ESTÁ A MÁGICA: Padding dinâmico */
        ${isOpen ? 'pl-6' : 'pl-[1.75rem]'}
      `}
    >
      <div className={`shrink-0 transition-transform duration-300 ${!isActive && 'group-hover:scale-110'}`}>
        {icon}
      </div>
      
      <span className={`whitespace-nowrap transition-all duration-300 origin-left ${
        isOpen ? 'opacity-100 translate-x-0 w-auto' : 'opacity-0 translate-x-4 w-0'
      }`}>
        {label}
      </span>

      {!isOpen && (
        <div className="absolute left-16 ml-4 px-3 py-1.5 bg-slate-900 text-white text-xs font-semibold rounded-md opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 z-50 whitespace-nowrap border border-slate-700 shadow-xl translate-x-2 group-hover:translate-x-0">
          {label}
        </div>
      )}
    </Link>
  )
}