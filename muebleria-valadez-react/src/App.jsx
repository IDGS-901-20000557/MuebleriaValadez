import { useEffect, useState } from 'react'
import Menu from './components/Menu';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import Products from './components/Productos/Products';
import US from './components/us/US';
import Contacto from './components/Contacto/Contacto';
import Footer from './components/Footer/Footer';
import Login from './components/Login/Login';
import SignUp from './components/SignUp/SignUp';
import Swal from 'sweetalert2';
import Pedidos from './components/Pedidos/Pedidos';

const App = () => {
  // useEffect(() => {
  //   // Prueba de SweetAlert al cargar la página
  //   Swal.fire('SweetAlert funcionando!', 'Bienvenido a tu aplicación.', 'success');
  // }, []);

 /**
   * ============================================================
   *          Inicia lógica del carrito de compras
   * ============================================================
   */

  const [items, setItems] = useState(localStorage.getItem('items') ? JSON.parse(localStorage.getItem('items')) : []);
  const [cards, setCards] = useState([]);
  const [addresses, setAddresses] = useState([]);
  /* Si elimino esta linea no jala */
  //const [product, setProduct] = useState({});

  // Estado para activar una alerta
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {}, [showAlert]);
  
  // Obtiene las tarjetas y direcciones de la API
  useEffect(() => {
    getCards();
    getAdresses();
  }, []);

  // Función que obtiene las tarjetas de la API
  const getCards = async () => {
    if(sessionStorage.getItem('idCliente') === null) {
      return;
    }else{
    // Obtiene las tarjetas desde la API de .NET con el id del usuario del session storages
    const response = await fetch(`https://localhost:7010/api/Tarjeta/${sessionStorage.getItem('idCliente')}`);
    // Convierte la respuesta a JSON
    const data = await response.json();
    // Agrega los registros en el estado de tarjetas
    setCards(data);
    }
  }

  // Función que obtiene las direcciones de la API
  const getAdresses = async () => {
    if(sessionStorage.getItem('idCliente') === null) {
      return;
    }else{
    // Obtiene las direcciones desde la API de .NET con el id del usuario del session storages
    const response = await fetch(`https://localhost:7010/api/Direccion/${sessionStorage.getItem('idCliente')}`);
    // Convierte la respuesta a JSON
    const data = await response.json();
    // Agrega los registros en el estado de direcciones
    setAddresses(data);
    }
  }

  // Funcion que permite agregar item al carrito
  // Si el item ya fue agregado se le suma la cantidad
  const agregarItem = (item) => {
    const newItems = [...items];
    const index = newItems.findIndex(i => i.idProducto === item.idProducto);
    if (index > -1) {
      newItems[index].cantidad += 1;
    } else {
      newItems.push({ ...item, cantidad: 1 });
    }
    setItems(newItems);
    localStorage.removeItem('items');
    localStorage.setItem('items', JSON.stringify(newItems));
     // Mostrar la alerta
      setShowAlert(true);
     // Ocultar la alerta después de 3 segundos 
     setTimeout(() => {
       setShowAlert(false);
     }, 3000);
  };

  // Funcion que permite eliminar cantidad de un item del carrito
  // Si la cantidad es 1, se elimina el item del carrito
  const eliminarItem = (item) => {
    const newItems = [...items];
    const index = newItems.findIndex(i => i.idProducto === item.idProducto);
    if (index > -1) {
      if (newItems[index].cantidad > 1) {
        newItems[index].cantidad -= 1;
      } else {
        newItems.splice(index, 1);
      }
    }
    setItems(newItems);
    localStorage.removeItem('items');
    localStorage.setItem('items', JSON.stringify(newItems));
  };

  // Funcion que permite vaciar el carrito al finalizar la compra
  const vaciarCarrito = () => {
    setItems([]);
    localStorage.removeItem('items');
  };

  // Funcion que permite obtener el total del carrito
  const getTotalCart = () => {
    let itemsC = localStorage.getItem('items') ? JSON.parse(localStorage.getItem('items')) : items;
    return itemsC.reduce((acc, item) => acc + item.cantidad * item.precioVenta, 0);
  };
  /**
   * ============================================================
   *          Termina lógica del carrito de compras
   * ============================================================
   */

  /**
   * ============================================================
   *          Inicia lógica para el pedidos
   * ============================================================
   */
  // API de pedidos
  const apiPedidos = "https://localhost:7010/api/Pedido";
  // State que almacena los pedidos
  const [pedidos, setPedidos] = useState([]);
  // State que almacena las ordenes de un pedido
  const [ordenPedidos, setOrdenPedidos] = useState([]);

  // State que almacena los productos de un pedido
  const [productosOrden, setProductosOrden] = useState([]);

  // Función que registra el pedido completo en la base de datos
  const registerOrder = async () => {
    if(sessionStorage.getItem('idCliente') != null) {
      // Obtiene el id del usuario del session storage
      const idCliente = sessionStorage.getItem('idCliente');
      const idCl = idCliente !== null ? parseInt(idCliente, 10) : 0;
      // Obtiene el id de la tarjeta del session storage
      const idTarjeta = document.getElementById('tarjeta').value;
      // Obtiene el id de la dirección del session storage
      const idDireccion = document.getElementById('direccion').value;
      // Obtiene el total del carrito
      const total = getTotalCart();
      // Obtiene los items del carrito
      const itemsC = localStorage.getItem('items') ? JSON.parse(localStorage.getItem('items')) : items;

      try {
        const pedidoResponse = await addPedido(total, idCl, idTarjeta, idDireccion);
        console.log("La respuesta del pedido dice "+pedidoResponse);
        let errors = 0;
        for (let i = 0; i < itemsC.length; i++) {
          try {
            const ordenResponse = await addOrden(itemsC[i], itemsC[i].cantidad);
            console.log("La respuesta del producto "+i+" en el carrito dice: "+ordenResponse);
          } catch (error) {
            errors++;
            console.error('Error al agregar la orden:', error);
          }
        }

        if (errors === 0) {
          Swal.fire({
            icon: 'success',
            title: '¡Pedido realizado!',
            text: 'Tu pedido se ha realizado correctamente.',
            timer: 5000,
          });
          vaciarCarrito();
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Hubo un error al realizar tu pedido, por favor intenta de nuevo',
            timer: 5000,
          });
        } 
      } catch (error) {
        console.error('Error al realizar el pedido:', error);
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Hubo un error al realizar tu pedido, por favor intenta de nuevo',
          timer: 5000,
        }); 
      } 
  }else{
    Swal.fire('Inicia sesión para realizar el pedido', 'Nosotros guardamos tu carrito por ti.', 'warning');
  }
  }

  // Función que agrega un pedido a la base de datos
  async function addPedido(totalS, idClientes, idTarjeta, IdDireccion) {
    const codigoAleatorio = Math.floor(Math.random() * 100000);
    const codigoBD = codigoAleatorio.toString().padStart(3, '0');

    const pedido = {
      idPedido: 0,
      IdCliente: idClientes,
      IdTarjeta: idTarjeta,
      fechaPedido: new Date(),
      fechaEntrega: new Date(),
      codigo: codigoBD,
      total: totalS,
      idDireccion: IdDireccion,
      IdEmpleadoEntrega: 0,
      estatus: '1'
    };

    const response = await fetch(`${apiPedidos}/AgregarPedido/${sessionStorage.getItem('idUsuario')}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(pedido)
    });

    const data = await response.json();
    return data;
  }

  // Función que agrega una orden a la base de datos
  async function addOrden(producto, cantidadR) {
    const idUsuario = sessionStorage.getItem('idUsuario');
    const ordenPedido = {
      idOrdenPedido: 0,
      cantidad: cantidadR,
      subtotal: 0,
      idProducto: producto.idProducto,
      idPedido: 0
    };

    const response = await fetch(`${apiPedidos}/AgregarOrden/${producto.precioVenta}&&${idUsuario}&&${producto.idInventario}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(ordenPedido)
    });

    const data = await response.json();
    return data;
  }

  // Función que obtiene los pedidos de un cliente
  async function getPedidos() {
    let idCliente = sessionStorage.getItem('idCliente');
    const response = await fetch(`${apiPedidos}/${idCliente}`);
    const data = await response.json();
    setPedidos(data);
  }

  // Función que obtiene los productos de un pedido
  async function getDetallePedido(idPedido) {
    const response = await fetch(`${apiPedidos}/ObtenerProductoPedido/${idPedido}`);
    const data = await response.json();
    getProductosOrden(idPedido);
    setProductosOrden(data);
  }

  // Función que obtiene los productos de un pedido
  async function getProductosOrden(idPedido) {
    const response = await fetch(`${apiPedidos}/ObtenerDetalle/${idPedido}`);
    const data = await response.json();
    setOrdenPedidos(data);
  }

  // Función que cancela un pedido
  async function cancelPedido(idPedido) {
    var pedido = {
      idPedido:idPedido,
      IdCliente : 0,
      IdTarjeta:0,
      fechaPedido:new Date(),
      fechaEntrega:new Date(),
      codigo: '',
      total: 0,
      idDireccion:0,
      IdEmpleadoEntrega:0,
      estatus:'0'
  };

    const response = await fetch(`${apiPedidos}/CancelarPedido/${idPedido}&&${sessionStorage.getItem('idUsuario')}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(pedido)
    });

    const data = await response.json();
    if (data === 1) {
      Swal.fire({
        icon: 'success',
        title: '¡Pedido cancelado!',
        text: 'Tu pedido se ha cancelado correctamente.',
        timer: 5000,
      });
      getPedidos();
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Hubo un error al cancelar tu pedido, por favor intenta de nuevo',
        timer: 5000,
      });
    }
  }

  // Hook que se ejecuta al cargar la página
  // Obtiene los pedidos del cliente
  // Obtiene los productos de un pedido
  // Obtiene los detalles de un pedido
  useEffect(() => {
    if(sessionStorage.getItem('idCliente') != null) {
      getPedidos();
    }
  }, []);
  


/**
 * ============================================================
 *          Termina lógica para pedidos
 * ============================================================
 */


  // Función que verifica si el usuario está autenticado o no.
  const isAllowed = () => {
    // Valida que el session storage no esté vacío.
    if (sessionStorage.getItem('idCliente') === null ||
      sessionStorage.getItem('idCliente') === undefined ||
      sessionStorage.getItem('idCliente') === '' ||
      sessionStorage.getItem('idCliente') === 'null') {
      return false;
    } else {
      return true;
    }
  }

  // Funcion para cerrar sesión y limpiar el session storage
  const cerrarSesion = () => {
    sessionStorage.clear();
    window.location.href = '/shop';
  }

  return (
    <>
      <Menu 
      items={localStorage.getItem('items') ? JSON.parse(localStorage.getItem('items')) : items}
      eliminarItem={eliminarItem}
      vaciarCarrito={vaciarCarrito}
      registerOrder={registerOrder}
      getTotalCart={getTotalCart}
      cards={cards}
      addresses={addresses}
      cerrarSesion={cerrarSesion}
    />

      <BrowserRouter>
        <Routes>
          <Route index path="/" element={<Login />} />
          <Route
            path="/myOrders"
            element={
              <ProtectedRoute
                redirectTo="/"
                isAllowed={isAllowed()}
              >
                <Pedidos 
                pedidos={pedidos}
                direcciones={addresses}
                productosOrden={productosOrden}
                ordenPedidos={ordenPedidos}
                getDetallePedido={getDetallePedido}
                cancelPedido={cancelPedido}
                />
              </ProtectedRoute>
            }
          />

          <Route index path="/shop" element={
            <Products agregarItem={agregarItem} 
            showAlert={showAlert} 
            setShowAlert={setShowAlert}/>
          } />
          <Route index path="/us" element={
            <US />
          } />
          <Route index path="/contact" element={
            <Contacto />
          } />
          <Route index path="/login" element={
            <Login />
          } />
          <Route index path="/SignUp" element={
            <SignUp />
          } />
        </Routes>
      </BrowserRouter>
      <Footer></Footer>
    </>
  )
}

export default App
