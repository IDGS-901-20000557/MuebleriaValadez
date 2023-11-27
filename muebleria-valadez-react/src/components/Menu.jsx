/**
 * @fileoverview Menu component
 * @returns MenuComponent
 * @imports N/A
 * @exports Menu
 * @requires N/A
 * @version 1.0.0
 * @since 1.0.0
 * @description Componente que muestra la barra de navegación a los módulos
 *             correspondientes
 * @created 2021-11-24
 * @modified 2021-11-24
 */

const Menu = () => {
    // Funcion que comprueba si el usuario esta logueado
    let isLogged = () => {
        if(sessionStorage.getItem('user')) {
            return true;
        }else{
            return false;
        }
    } 

  return (
    <>
    {/* NavBar */}
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container-fluid">
        <a className="navbar-brand" href="/"><img src="../../public/Logo Negro.png" 
        alt="Valadez Logo"
        style={{height: "60px", marginLeft : "2%"}}/></a>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarColor02" aria-controls="navbarColor02" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
  
        <div className="collapse navbar-collapse" id="navbarColor02">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <a className="nav-link active" href="/shop">Productos
                <span className="visually-hidden">(current)</span>
              </a>
            </li>
            
            {/* Si el usuario esta logueado, mostrar las opciones del carrito y cerrar sesión */
                isLogged() ? 
                <>
                <li className="nav-item">
                    <a className="nav-link" href="/carrito"><i className="fas fa-shopping-cart"></i></a>
                </li>
                <li className="nav-item">
                    <a className="nav-link" href="/logout">Cerrar Sesión</a>
                </li> 
                </>
                : 
                <>
                {/* Si el usuario no esta logueado, mostrar los modulos informativos e inicio de sesión */}
                <li className="nav-item">
                <a className="nav-link" href="/about">Sobre nosotros</a>
                </li>
                <li className="nav-item">
                <a className="nav-link" href="/contact">Contacto</a>
                </li>
                <li className="nav-item">
                    <a className="nav-link" href="/login">Iniciar Sesión</a>
                </li>
              </>
            }
          </ul>
        </div>
      </div>
    </nav>
    </>
  )
}

export default Menu
