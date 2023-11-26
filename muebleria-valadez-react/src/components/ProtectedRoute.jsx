/***
 * @function ProtectedRoute
 * @author Jonathan Hernandez
 * @param {Object} props Propiedades del componente
 * @param {Boolean} props.isAllowed Bandera que indica si el usuario está autenticado o no
 * @param {String} props.redirectTo Ruta a la cual redirigir al usuario si no está autenticado
 * @param {Object} props.children Elemento a mostrar en la ruta
 * @returns ProtectedRoute Component; Componente que se encarga de dar acceso a las rutas si el usuario está autenticado o no.
 * @description Este componente se encarga de dar acceso a las rutas si el usuario está autenticado o no.
 */

// Importa las librerías necesarias para el componente
import { Navigate, Outlet } from "react-router-dom";

// Este componente recibe como prop un elemento, una bandera que indica si el usuario está autenticado 
// o no y una ruta a la cual redirigir al usuario si no está autenticado.

// !!! Ignorar los warnings de ESLint en esta sección del código
export const ProtectedRoute = ({
  isAllowed,
  redirectTo = "/",
  children
}) => {
  // Si el usuario no está autenticado se redirige a la ruta de inicio de sesión.
  if (!isAllowed) {
    return <Navigate to={redirectTo} replace />;
  }
  
  // Si el usuario está autenticado se muestra el componente indicado.
  return children ? children : <Outlet />;
};


export default ProtectedRoute;