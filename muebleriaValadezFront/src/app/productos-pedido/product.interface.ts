/*
  Clase desarrollada por Jonathan
  Interface para el uso de carrito de compras en el componente producto-pedido
*/

export interface Producto {
    id: number;
    nombre: string;
    descripcion:string;
    foto : string;
    costoProduccion:number;
    precioVenta: number;
    cantidadAceptable: number;
    cantidad: number;
}
