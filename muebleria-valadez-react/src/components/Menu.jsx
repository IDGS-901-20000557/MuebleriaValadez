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

import { useState } from "react";
import Swal from "sweetalert2";

const Menu = ({items, 
              eliminarItem, 
              vaciarCarrito, 
              getTotalCart, 
              cards, 
              addresses, 
              registerOrder, 
              registerOrderDetail,
              cerrarSesion,
              agregarItem,
              productoSeleccionado,
              inventory
              }) => {

  // State para la cantidad de un producto en una venta unica	
  const [cantidadS, setCantidadS] = useState(1);

  // State para el total de un producto en una venta unica
  const [totalS, setTotalS] = useState(productoSeleccionado.precioVenta*1);

  // Funcion que calcula el total de un producto en una venta unica
  const calcularTotal = () => {
    // Busca la cantidad disponible del producto en el inventario con su id
    let inventarioP = inventory.find(inventario => inventario.idInventario === productoSeleccionado.idInventario);
    // Valida si el valor en el campo de cantidad es numerico y que no contenga guiones ni puntos
    if (/^[0-9]*$/.test(cantidadS)) {
      // Valida si la cantidad es mayor a 0
      if (cantidadS > 0) {
        // Valida si la cantidad es menor o igual a la cantidad disponible del producto
        if (cantidadS <= inventarioP.cantidaDisponible) {
          // Calcula el total del producto
          let total = productoSeleccionado.precioVenta * cantidadS;
          // Actualiza el estado del total del producto
          setTotalS(total);
        } else {
          // Si la cantidad es mayor a la cantidad disponible del producto, muestra una alerta
          Swal.fire({
            icon: 'error',
            title: '¡Error!',
            text: 'La cantidad no puede ser mayor a la cantidad disponible del producto',
            confirmButtonColor: '#20a124',
            confirmButtonText: 'Aceptar',
          });
          // Actualiza el estado de la cantidad del producto
          setCantidadS(inventarioP.cantidaDisponible);
        }
      } else {
        // Si la cantidad es menor o igual a 0, muestra una alerta
        Swal.fire({
          icon: 'error',
          title: '¡Error!',
          text: 'La cantidad no puede ser menor o igual a 0',
          confirmButtonColor: '#20a124',
          confirmButtonText: 'Aceptar',
        });
        // Actualiza el estado de la cantidad del producto
        setCantidadS(1);
      }
    } else {
      // Si la cantidad no es numerica, muestra una alerta
      Swal.fire({
        icon: 'error',
        title: '¡Error!',
        text: 'La cantidad no puede contener guiones ni puntos',
        confirmButtonColor: '#20a124',
        confirmButtonText: 'Aceptar',
      });
      // Actualiza el estado de la cantidad del producto
      setCantidadS(1);
    }
  }

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
                      <a className="nav-link" data-bs-toggle="modal" data-bs-target="#carrito" ><i className="fas fa-shopping-cart"></i></a>
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
                      <a className="nav-link" data-bs-toggle="modal" data-bs-target="#carrito"><i className="fas fa-shopping-cart"></i></a>
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
      {/* Inicia primer ventana del carrito donde solo muestra items del carrito y el boton de eliminar items sin mostrar las tarjetas ni direcciones*/}
      <div className="modal fade" id="carrito" tabIndex="-1" aria-labelledby="carrito" aria-hidden="false">
        <div className="modal-dialog modal-fullscreen-sm-down modal-dialog-centered modal-dialog-scrollable">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="carrito">Carrito de compras</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" ></button>
            </div>
            <div className="modal-body">
              <div className="row">
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
                            <div className="col-md-12" key={index} >
                              <div className="card mb-3" style={{ maxWidth: '540px' }}>
                                <div className="row g-0">
                                  <div className="col-md-4">
                                    <img src={item.foto} className="img-fluid rounded-start" alt="..." />
                                  </div>
                                  <div className="col-md-8">
                                    <div className="card-body">
                                      <h5 className="card-title text-center">{item.nombreProducto}</h5>
                                      <p className="card-text text-success">$ {item.precioVenta} MXN</p>
                                      <div className="row">
                                        <div className="col-8">
                                        <p className="card-text"><small className="text-muted">Agregaste {item.cantidad} pieza(s)</small></p>
                                        </div>
                                        <div className="col-2">
                                        <button className="btn btn-secondary" title="Agregar producto" onClick={() => agregarItem(item, item.idInventario)}>+</button>
                                        </div>
                                        <div className="col-1">
                                        <button className="btn btn-secondary" title="Quitar producto" onClick={() => eliminarItem(item)}>-</button>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                               <br />
                            </div>  
                          ))}
                      </div>
                      <div className="modal-footer">
                      <button type="button" className="btn btn-danger" data-bs-dismiss="modal">Cerrar</button>
                        <button type="button" className="btn btn-warning" onClick={vaciarCarrito}>Limpiar Carrito <i className="fa fa-shopping-cart"></i></button>
                        <button type="button" className="btn btn-success" data-bs-dismiss="modal" data-bs-toggle="modal" data-bs-target="#finVenta">Continuar Pedido</button>
              </div>
                      </>
              }
            </div>
          </div>
        </div>
      </div>
    </div>                                  
      {/* Termina primer ventana del carrito*/}

      {/* Ventana modal para confirmar la compra y datos de direccion y pago */}
      <div className="modal fade" id="finVenta"  role="dialog"  aria-hidden="true">
        <div className="modal-dialog modal-dialog-scrollable modal-fullscreen" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h2 className="modal-title text-center" >Confirmar Compra</h2>
              <button type="button" className="close btn btn-danger" data-bs-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body text-center">
                <h4>Estos son los productos en tu pedido</h4> 
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
                                      <p className="card-text"><small className="text-muted">{item.cantidad} pieza(s)</small></p>
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
                        <h5 className="text-center">Metodo de pago y direccion</h5>
                        <hr className="border border-2 border-secondary rounded"/>
                        <form>
                          <div className="form-group">
                              <div className="row">

                                {sessionStorage.getItem('idCliente') != null ?
                                  <>
                                    <div className="col-6">
                                      <label htmlFor="tarjeta" className="col-form-label text-center">Escoge tu tarjeta</label><br />
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
                                      <p><b>Tienes que iniciar sesión para seleccionar tus direcciones y tarjetas </b> </p>
                                    </div>
                                  </center>
                                  </>
                                }
                                </div>
                                <br />
                                <div className="row">
                                  <div className="col-6">
                                    <p className="h5 text-secondary text-center"> Total a pagar </p>
                                  </div>
                                  <div className="col-6">
                                      <p className="text-success h5 text-center">$ {getTotalCart()} MXN</p>
                                  </div>
                              </div>
                            </div>
                        </form>
                      </div>
                      <div className="modal-footer">
                      <button type="button" className="btn btn-warning" data-bs-dismiss="modal" data-bs-toggle="modal" data-bs-target="#carrito">Regresar al carrito</button>
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
      
      {/* Inicia ventana modal de los productos */}
      <div className="modal fade" id="ventaUnica" tabIndex="-1" role="dialog" aria-labelledby="ventaUnicaLabel" aria-hidden="true">
        <div className="modal-dialog modal-dialog-scrollable" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h2 className="modal-title text-center" id="ventaUnica">Confirmar Compra</h2>
              <button type="button" className="close btn btn-danger" data-bs-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body text-center">
              <h4>Confirma tus datos de compra</h4>
            </div>
            <div className="modal-body">
              <div className="row" id="productoS">
                <center>
                <div className="card" style={{ width: '18rem' }}>
                  <img src={productoSeleccionado.foto} className="card-img-top" alt={productoSeleccionado.nombreProducto} />
                  <div className="card-body">
                    <h3 className="card-text">{productoSeleccionado.nombreProducto}</h3>
                    <p className="card-text">{productoSeleccionado.descripcion}</p>
                  </div>
                </div>
                </center>
              </div>
              <form>
                <div className="form-group">
                  <div className="row">
                  {sessionStorage.getItem('idCliente') != null ?
                                  <>
                                    <div className="col-6">
                                      <label htmlFor="tarjetaS" className="col-form-label text-center">Escoge tu tarjeta</label><br />
                                      <select className="form-select" id="tarjetaS" name="tarjetaS" >
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
                                      <label htmlFor="direccionS" className="col-form-label text-center">Escoge tu direccion</label><br />
                                      <select className="form-select text-uppercase" id="direccionS" name="direccionS">
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
                                      <p><b>Tienes que iniciar sesión para seleccionar tus direcciones y tarjetas </b> </p>
                                    </div>
                                  </center>
                                  </>
                                }
                  </div>
                  <div className="row">
                    <div className="col-6">
                      <label htmlFor="cantidad" className="col-form-label">Cantidad</label>
                      <input value={cantidadS} onChange={(e) => setCantidadS(e.target.value)} 
                      onKeyUp={calcularTotal}
                       type="number" title="Puedes usar las teclas de flecha para aumentar la cantidad" 
                       className="form-control" id="cantidad" name="cantidad" min="1" />
                       
                    </div>
                    <div className="col-6">
                      <label htmlFor="total" className="col-form-label">Total</label>
                      <input value={totalS} type="number" className="form-control" id="total" name="total" disabled />
                    </div>
                  </div>
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-danger" data-bs-dismiss="modal">Cancelar</button>
              <button type="button" className="btn btn-success" data-bs-dismiss="modal" onClick={registerOrderDetail} >Realizar Pedido</button>
            </div>
          </div>
        </div>
      </div>
      {/* Termina ventana modal de los productos */}
    </>
  )
}

export default Menu
