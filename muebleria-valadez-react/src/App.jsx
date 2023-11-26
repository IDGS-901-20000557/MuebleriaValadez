import React, { useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCoffee } from '@fortawesome/free-solid-svg-icons';
import Menu from './components/Menu';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import Products from './components/Productos/Products';

const App = () => {
  useEffect(() => {
    // Prueba de SweetAlert al cargar la página
    Swal.fire('SweetAlert funcionando!', 'Bienvenido a tu aplicación.', 'success');
  }, []);

    // Función que verifica si el usuario está autenticado o no.
  const isAllowed = () =>{
      // Valida que el session storage no esté vacío.
      if (sessionStorage.getItem('user') === null || 
          sessionStorage.getItem('user') === undefined || 
          sessionStorage.getItem('user') === '' || 
          sessionStorage.getItem('user') === 'null') {
        return false;
      } else {
        return true;
      }
  }

  return (
    <>
      <Menu />

      <BrowserRouter>
          <Routes>
            <Route index path="/" element={<h1>Login</h1>} />
            {/* Esta es una ruta protegida */}
            <Route
            path="/menu"
            element={
            <ProtectedRoute
              redirectTo="/"
              isAllowed={isAllowed()}
            >
              <h1>Menu</h1>
            </ProtectedRoute>
          }
          />
          {/* Termina ruta protegida */}
          <Route index path="/shop" element={
            <Products />
          } />
          </Routes>
        </BrowserRouter>
    </>
  )
}

export default App