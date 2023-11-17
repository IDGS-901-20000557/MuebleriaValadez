import React, { useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCoffee } from '@fortawesome/free-solid-svg-icons';

const App = () => {
  useEffect(() => {
    // Prueba de SweetAlert al cargar la página
    Swal.fire('SweetAlert funcionando!', 'Bienvenido a tu aplicación.', 'success');
  }, []);

  return (
    <div className="container mt-4">
      <h1>Prueba de Bootstrap y SweetAlert</h1>
      <button className="btn btn-primary mr-2" onClick={() => Swal.fire('¡Hola!', 'Esto es SweetAlert.', 'info')}>
        Mostrar SweetAlert
      </button>
      <button className="btn btn-success ms-2" onClick={() => alert('Esto es Bootstrap!')}>
        <FontAwesomeIcon icon={faCoffee} /> Mostrar Bootstrap Alert
      </button>
    </div>
  )
}

export default App
