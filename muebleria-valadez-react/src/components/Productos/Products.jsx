/**
 * Componente que muestra los productos
 * @file: Products.jsx
 * @argument none
 * @returns {Products}
 * @description Este componente se encarga de mostrar los productos disponibles en la tienda.
 * @version 1.0.0
 * @since 1.0.0
 * @created 2021-11-24
 * @modified 2021-11-24
 */

import { useEffect, useState } from 'react'

const Products = () => {
  // Define el estado de los productos
  const [products, setProducts] = useState([]);
  // Define el estado del inventario
  const [inventory, setInventory] = useState([]);

  // Actualiza los productos
  useEffect(() => {
    // Obtiene los productos
    getProducts();
    // Obtiene el inventario
    getInventory();
  }, []);

  // Función que obtiene los productos desde la API de .NET
  const getProducts = async () => {
    // Obtiene los productos desde la API de .NET
    const response = await fetch('https://localhost:7010/api/Productos');
    // Convierte la respuesta a JSON
    const data = await response.json();
    // Imprime los productos en consola
    setProducts(data);
  }

  // Funcion para obtener el inventario de los productos
  const getInventory = async () => {
    // Obtiene los productos desde la API de .NET
    const response = await fetch(`https://localhost:7010/api/Inventario/GetAll`);
    // Convierte la respuesta a JSON
    const data = await response.json();
    // Imprime los productos en consola
    setInventory(data);
  }


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
                      <p className="card-text text-muted"> { inventory.cantidaDisponible } pzs en existencia</p>
                      </>
                      :
                      null
                    ))
                  }
                  <hr />
                  <center>
                    <div className="row">
                      <div className="col-md-6">
                        <a href="#" className="btn btn-outline-primary btn-block"> 
                          <i className="fa fa-shopping-bag"></i> 
                          Comprar Ahora
                        </a>
                      </div>
                      <div className="col-md-6">
                        <a href="#" className="btn btn-outline-primary btn-block">
                          <i className="fa fa-cart-plus"></i> Agregar al carrito
                        </a>
                      </div>
                    </div>
                  </center>
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