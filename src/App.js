import { useState } from 'react';
import SlidingNavbar from './Components/SlidingNavbar';

function App() {
  const [menuState, updateMenuState] = useState("menu");

  const handleMenuClick = () => {
    updateMenuState(menuState === "menu" ? "close": "menu")
  };

  return (
    <div className="max-sm:flex max-sm:flex-col h-screen w-screen">
      <header className="max-sm:flex max-sm:items-center max-sm:justify-between max-sm:border-b-2 max-sm:shadow max-sm:py-3 max-sm:px-2">
        <span className="max-sm:text-4xl">LOGO</span>
        <span className="material-symbols-outlined max-sm:text-4xl" onClick={handleMenuClick}><button>{menuState}</button></span>
      </header>
      <main className="max-sm:flex-1 relative">
        <SlidingNavbar menustate={menuState} handlemenuclick={handleMenuClick}/>
      </main>
    </div>
  );
}

export default App;
