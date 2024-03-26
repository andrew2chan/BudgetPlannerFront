function App({ updatemenustate: updateMenuState, menustate: menuState }) {
  const handleMenuClick = () => {
    updateMenuState(menuState === "menu" ? "close": "menu");
  };

  return (
    <div className="w-full relative">
      <header className="max-sm:flex max-sm:items-center max-sm:justify-between max-sm:border-b-2 max-sm:shadow max-sm:py-3 max-sm:px-2">
        <span className="max-sm:text-4xl">LOGO</span>
        <span className="material-symbols-outlined max-sm:text-4xl" onClick={handleMenuClick}><button>{menuState}</button></span>
      </header>
    </div>
  );
}

export default App;
