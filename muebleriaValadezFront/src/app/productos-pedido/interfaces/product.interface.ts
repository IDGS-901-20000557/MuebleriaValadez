/*
  Clase desarrollada por Jonathan
  Interface para el uso de carrito de compras en el componente producto-pedido
*/

export interface Producto {
    idProducto: number;
    nombreProducto: string;
    descripcion:string;
    foto : string;
    costoProduccion:number;
    precioVenta: number;
    cantidadAceptable: number;
    idInventario: number;
    cantidad:number;
}
