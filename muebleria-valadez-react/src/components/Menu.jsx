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


const Menu = ({items, 
              eliminarItem, 
              vaciarCarrito, 
              getTotalCart, 
              cards, 
              addresses, 
              registerOrder, 
              cerrarSesion
              }) => {
  // Funcion que comprueba si el usuario esta logueado
  let isLogged = () => {
    if (sessionStorage.getItem('idCliente') != null ) {
      return true;
    } else {
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
            style={{ height: "60px", marginLeft: "2%" }} /></a>
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
                      <a className="nav-link" href="/myOrders">Mis Pedidos</a>
                    </li>
                    <li className="nav-item">
                      <a className="nav-link" data-bs-toggle="modal" data-bs-target="#finVenta" ><i className="fas fa-shopping-cart"></i></a>
                    </li>
                    <li className="nav-item">
                      <a className="nav-link" onClick={cerrarSesion}>Cerrar Sesión</a>
                    </li>
                  </>
                  :
                  <>
                    {/* Si el usuario no esta logueado, mostrar los modulos informativos e inicio de sesión */}
                    <li className="nav-item">
                      <a className="nav-link active" href="/us">Sobre nosotros</a>
                    </li>
                    <li className="nav-item">
                      <a className="nav-link active" href="/contact">Contacto</a>
                    </li>
                    <li className="nav-item">
                      <a className="nav-link" data-bs-toggle="modal" data-bs-target="#finVenta"><i className="fas fa-shopping-cart"></i></a>
                    </li>s
                    <li className="nav-item">
                      <a className="nav-link active" href="/">Iniciar Sesión</a>
                    </li>
                  </>
              }
            </ul>
          </div>
        </div>
      </nav>
      {/* Ventana modal para mostrar el carrito */}
      <div className="modal fade" id="finVenta"  role="dialog"  aria-hidden="true">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h2 className="modal-title text-center" >Confirmar Compra</h2>
              <button type="button" className="close btn btn-danger" data-bs-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body text-center">
                <h4>Confirma tus datos de compra</h4> 
                </div>
            <div className="modal-body">
                <div className="row" >
                    {
                        items.length === 0 ?
                        <div className="col-md-12">
                            <div className="alert alert-warning" role="alert">
                                No hay productos en el carrito
                            </div>
                        </div>
                        :
                        <>
                        <div className="row">
                          {// Recorre el carrito para mostrar los productos
                          items.map((item, index) => (
                            <div className="col-md-6" key={index} >
                              <div className="card mb-3" style={{ maxWidth: '540px' }}>
                                <div className="row g-0">
                                  <div className="col-md-4">
                                    <img src={item.foto} className="img-fluid rounded-start" alt="..." />
                                  </div>
                                  <div className="col-md-8">
                                    <div className="card-body">
                                      <h5 className="card-title">{item.nombreProducto}</h5>
                                      <p className="card-text text-success">$ {item.precioVenta} MXN</p>
                                      <p className="card-text"><small className="text-muted">{item.cantidad} pieza(s)</small></p>
                                      <button className="btn btn-danger" onClick={() => eliminarItem(item)}>-</button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <br />
                            </div>
                          ))}
                          </div>
                          <div className="row">                
                      <div className="col-md-12">
                        <form>
                          <div className="form-group">
                              <div className="row">

                                {sessionStorage.getItem('idCliente') != null ?
                                  <>
                                    <div className="col-6">
                                      <label htmlFor="tarjeta" className="col-form-label">Escoge tu tarjeta</label><br />
                                      <select className="form-select" id="tarjeta" name="tarjeta" >
                                        {
                                          cards.map(card => (
                                            <option key={card.idTarjeta} value={card.idTarjeta}> 
                                              {card.numeroTarejta}
                                            </option>
                                          ))
                                        }
                                      </select>
                                    </div>
                                    <div className="col-6">
                                      <label htmlFor="direccion" className="col-form-label text-center">Escoge tu direccion</label><br />
                                      <select className="form-select text-uppercase" id="direccion" name="direccion">
                                        {
                                          addresses.map(address => (
                                            <option key={address.idDireccion} value={address.idDireccion}> 
                                              {address.calle} #{address.noExt} 
                                            </option>
                                          ))
                                        }
                                      </select>
                                    </div>
                                  </>
                                  :
                                  <>
                                  <center>
                                    <div className="col-md-12">
                                      <p><b>Tienes que iniciar sesión para poder ver tus direcciones y tarjetas </b> </p>
                                    </div>
                                  </center>
                                  </>
                                }
                                </div>
                                <br />
                                <div className="row">
                                  <div className="col-6">
                                    <p className="h5 text-primary"> Total: </p>
                                  </div>
                                  <div className="col-6">
                                      <p className="text-success h5">$ {getTotalCart()} MXN</p>
                                  </div>
                              </div>
                            </div>
                        </form>
                      </div>
                      <div className="modal-footer">
                      <button type="button" className="btn btn-danger" data-bs-dismiss="modal">Cancelar</button>
                        <button type="button" className="btn btn-warning" onClick={vaciarCarrito}>Limpiar Carrito <i className="fa fa-shopping-cart"></i></button>
                        <button type="button" className="btn btn-success" data-bs-dismiss="modal" onClick={registerOrder}>Realizar Pedido</button>
                      </div>
                </div>
                        </>
                        }
                      </div>
            </div>
          </div>
        </div>
      </div>
  {/* Termina ventana modal del carrito */}

    </>
  )
}

export default Menu
