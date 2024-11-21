import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ShopPage from '../Pages/HomePage/ShopPage';

const PunchOutRedirect: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Získat `sid` z URL parametrů
    const urlParams = new URLSearchParams(window.location.search);
    const sid = urlParams.get('sid');

    if (sid) {
      // Uložit `sid` do localStorage
      localStorage.setItem('sid', sid);
      console.log('SID uložen do localStorage:', sid);
    } else {
      console.error('SID nebyl nalezen v URL.');
      // Zobrazit chybovou stránku nebo přesměrovat zpět na přihlašovací stránku
      navigate('/');
    }
  }, [navigate]);

  return (
    <ShopPage />
  );
};

export default PunchOutRedirect;
