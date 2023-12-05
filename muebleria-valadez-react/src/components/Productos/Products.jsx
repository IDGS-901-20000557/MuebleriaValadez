/**
 * Componente que muestra los productos
 * @file: Products.jsx
 * @argument none
 * @returns {Products}
 * @description Este componente se encarga de mostrar los productos disponibles en la tienda.
 * @version 1.0.0
 * @since 1.0.0
 * @property {Object} props Propiedades del componente
 * @property {Function} props.agregarItem Función que permite agregar un item al carrito
 * @property {Function} props.showAlert Función que permite mostrar una alerta
 * @property {Object} state Estado del componente
 * @property {Array} state.products Arreglo que contiene los productos
 * @property {Array} state.inventory Arreglo que contiene el inventario
 * @property {Function} state.setProducts Función que permite actualizar el estado de los productos
 * @property {Function} state.setInventory Función que permite actualizar el estado del inventario
 * @property {Function} state.getProducts Función que permite obtener los productos desde la API
 * @property {Function} state.getInventory Función que permite obtener el inventario desde la API
 * @property {Function} state.useEffect Hook que permite ejecutar código cuando el componente se monta
 * @created 2021-11-24
 * @modified 2021-11-24
 */
const Products = ({products, inventory,
                  agregarItem, 
                  showAlert, 
                  setShowAlert, 
                  selectProduct,
                  limpiarCampo
                }) => {
  


  return (
    <>
      <div className="container-fluid">
        {/* Muestra el banner y el carrusel */}
      <div id="carouselExampleIndicators" className="carousel slide" data-bs-ride="carousel">
        <div className="carousel-indicators">
          <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="0" className="active" aria-current="true" aria-label="Slide 1"></button>
          <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="1" aria-label="Slide 2"></button>
          <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="2" aria-label="Slide 3"></button>
        </div>
        <div className="carousel-inner">
          <div className="carousel-item active">
            <img src="../../../public/img/Banner-web.png" className="d-block w-100" alt="..." height="auto" />
          </div>
          <div className="carousel-item">
            <img src="../../../public/img/Banner-web-2.png" className="d-block w-100" alt="..." height="auto" />
          </div>
          <div className="carousel-item">
            <img src="../../../public/img/Banner-web-3.png" className="d-block w-100" alt="..." height="auto" />
          </div>
        </div>
        <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="prev">
          <span className="carousel-control-prev-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Previous</span>
        </button>
        <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="next">
          <span className="carousel-control-next-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Next</span>
        </button>
      </div>
      {/* Termina el banner y el carrusel */}
      <div className="row">
        <div className="col-12">
            <h3 className="text-uppercase text-center mb-4">Revisa nuestro cátalogo</h3>
        </div>
        <hr className="border border-5" />
        </div>
        <div className="row">
          {/* Muestra una ventana de alerta al agregar al carrito */}
          {showAlert && (
        <div className="alert alert-success alert-dismissible fade show fixed-bottom fixed-end"
        role="alert"
        style={{ position: 'fixed', bottom: '20px', right: '60px' }}
        >
          <center> Producto agregado al carrito <i className="fa fa-check"></i> </center>
          <button
            type="button"
            className="btn-close"
            data-bs-dismiss="alert"
            aria-label="Close"
            onClick={() => setShowAlert(false)}
          ></button>
        </div>
          )}
          {/* Muestra los productos */}
          {products.map(product => (
            <div className="col-md-4 shadow" key={product.id}>
              <div className="card mb-3">
                <img src={product.foto} className="card-img-top" alt={product.nombreProducto} height={300}/>
                <div className="card-body">
                  <h5 className="card-title text-center">{product.nombreProducto}</h5><hr />
                  <p className="card-text text-success"> $ {product.precioVenta} MXN</p>
                  <p className="card-text text-muted">{ product.descripcion }</p>

                  {/* Recorre el inventario para validar las existencias de ese producto */}
                  {
                    inventory.map(inventory => (
                      inventory.idInventario === product.idInventario ?
                      <>
                      {
                        inventory.cantidaDisponible > 0 ?
                        <>
                        <p className="card-text text-success">Existencias: {inventory.cantidaDisponible}</p>
                        <hr />
                      <center>
                        <div className="row">
                          <div className="col-md-6">
                            <a href="#" className="btn btn-outline-primary btn-block" data-bs-toggle="modal" 
                            data-bs-target="#ventaUnica" onClick={() => {selectProduct(product); limpiarCampo();}}> 
                              <i className="fa fa-shopping-bag"></i> 
                              Comprar Ahora
                            </a>
                          </div>
                          <div className="col-md-6">
                            <a className="btn btn-outline-primary btn-block" onClick={() => agregarItem(product, product.idInventario)}>
                              <i className="fa fa-cart-plus"></i> Agregar al carrito
                            </a>
                          </div>
                        </div>
                      </center>
                        </>
                        :
                        <center>
                          <p className="card-text text-danger text-uppercase">Agotado</p>
                          <hr />
                        <center>
                          <div className="row">
                            <div className="col-md-6">
                            </div>
                            <div className="col-md-6">
                            </div>
                          </div>
                        </center>
                        </center>
                      }
                      </>
                      :
                      null
                    ))
                  }
                </div>
              </div>
            </div>
          ))}

        </div>
      </div>
    
    </>
  )
}

export default Products
