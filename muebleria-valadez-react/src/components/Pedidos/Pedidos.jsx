/**
 * @author Jonathan
 * @version 1.0
 * @since 12/1/2023
 * @modificado 12/1/2023
 * @returns Retorna el componente de pedidos
 * @description Componente para mostrar los pedidos del usuario
 * @version 1.0 Se agrego la funcionalidad para cancelar un pedido
 * @version 1.1 Se agrego la funcionalidad para ver los detalles de un pedido
 * @version 1.2 Se agrego la funcionalidad para mostrar el estatus de un pedido
 * @version 1.3 Se agrego la funcionalidad para mostrar la fecha de entrega de un pedido
 * @version 1.4 Se agrego la funcionalidad para mostrar la direccion de entrega de un pedido
 * @version 1.5 Se agrego la funcionalidad para mostrar el total de un pedido
 * @version 1.6 Se agrego la funcionalidad para mostrar el codigo de un pedido
 * @version 1.7 Se agrego la funcionalidad para mostrar la fecha de pedido de un pedido
 * @version 1.8 Se agrego la funcionalidad para mostrar los pedidos del usuario
 * @version 1.9 Se agrego la funcionalidad para mostrar el componente de pedidos
 * 
 */

const Pedidos = ( {pedidos, direcciones, 
                   productosOrden, ordenPedidos, 
                   getDetallePedido, cancelPedido} ) => {
  return (
    <div>
      <div className="container-fluid">
        <div className="container-fluid mt-5" style={{ backgroundColor: 'white' }}>
          <h1 className="text-center text-uppercase text-secondary">Mis Pedidos <i className="fas fa-clipboard-list"></i></h1>
        </div>
        <br />
        <center>
          <hr className="col-9 border border-3 border-secondary" />
        </center>
        <br />
      <div className="container">
        <div className="row">
          <div className="form-group col-12">
            <table className="table table-striped table-hover table-bordered" cellSpacing="0" width="100%">
              <thead>
                <tr className="text-center">
                  <th>Fecha del pedido</th>
                  <th>Fecha de entrega</th>
                  <th>Estatus</th>
                  <th>Codigo asignado</th>
                  <th>Direccion</th>
                  <th>Total Pagado</th>
                  <th>Ver Detalles</th>
                  <th>Cancelar</th>
                </tr>
              </thead>
              <tbody>
                {pedidos?.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="text-center">Aun no has realizado pedidos</td>
                  </tr>
                ) : (
                  pedidos.map(pedido => (
                    <tr key={pedido.idPedido}>
                      <td className="text-center">{new Date(pedido.fechaPedido).toLocaleDateString()}</td>
                      <td className="text-center">
                        {pedido.fechaEntrega === null ? (
                          <span className="text-danger">Sin fecha de entrega</span>
                        ) : (
                          new Date(pedido.fechaEntrega).toLocaleDateString()
                        )}
                      </td>
                      <td className="text-center">
                        {pedido.estatus === '0' ? (
                          <span>Cancelado <i className="fa fa-times-circle text-danger"></i></span>
                        ) : pedido.estatus === '1' ? (
                          <span>Pendiente <i className="fa fa-clock text-warning"></i></span>
                        ) : (
                          <span>Entregado <i className="fa fa-check-circle text-success"></i></span>
                        )}
                      </td>
                      <td className="text-center"><p title="Confirma este codigo con el repartidor">{pedido.codigo}</p></td>
                      <td>
                        {direcciones.map(direccion => (
                          direccion.idDireccion === pedido.idDireccion && (
                            <span key={direccion.idDireccion} className="">
                              {direccion.calle} #{direccion.noExt}, interior {direccion.noInt}
                            </span>
                          )
                        ))}
                      </td>
                      <td className="text-center text-success">$ {pedido.total}</td>
                      <td className="text-center">
                        <button className="btn" data-bs-target="#modal" data-bs-toggle="modal" id="btnUpdate"
                          onClick={() => getDetallePedido(pedido.idPedido)}>
                          <i className="fa fa-eye"></i>
                        </button>
                      </td>
                      <td className="text-center">
                        {pedido.estatus === '0' || pedido.estatus == '2' ? (
                          pedido.estatus === '0' ? (
                            <p className="text-danger">Cancelado <i className="fa fa-cancel"></i></p>
                          ) : (
                            <p className="text-success">Entregado <i className="fa fa-check"></i></p>
                          )
                        ):
                        <button className="btn btn-danger" id="btnDelete" onClick={() => cancelPedido(pedido.idPedido)}>
                          <i className="fa fa-times"></i>
                        </button> 
                        }
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <br />
        <center>
          <hr className="col-9 border border-3 border-secondary" />
        </center>
        <br />
      {/* Modal para mostrar los detalles del pedido */}
      <div className="modal fade" id="modal" tabIndex="-1" aria-labelledby="modal" aria-hidden="false">
      <div className="modal-dialog modal-fullscreen-sm-down modal-dialog-centered modal-dialog-scrollable">
        <div className="modal-content">
          <div className="modal-header">
            <h1 className="modal-title" id="modal">Detalle del pedido</h1>
            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" ></button>
          </div>
          <div className="modal-body">
            {productosOrden.map(producto => (
              <div key={producto.idProducto} className="row">
                <div className="card mb-3" style={{ maxWidth: '540px' }}>
                  <div className="row g-0">
                    <div className="col-md-4">
                      <img src={producto.foto} className="img-fluid rounded-start" alt={producto.nombreProducto} />
                    </div>
                    <div className="col-md-8">
                      <div className="card-body">
                        <p className="card-title text-center">{producto.nombreProducto}<br/> $ {producto.precioVenta} MXN</p>
                        <p className="card-text">
                          {ordenPedidos.map(orden => (
                            orden.idProducto == producto.idProducto && (
                              <span key={orden.idOrdenPedido} className="text-center">
                                Tu pedido fue de {orden.cantidad} pieza(s)<br />
                                Subtotal {orden.subtotal} pesos
                              </span>
                            )
                          ))}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-success" data-bs-dismiss="modal">Aceptar</button>
          </div>
        </div>
      </div>
    </div>
    </div>
    </div>
  );
};

export default Pedidos;
