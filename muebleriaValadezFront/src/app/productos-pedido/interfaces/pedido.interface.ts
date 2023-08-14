/*
  Clase desarrollada por Jonathan
  Interface para el almacenamiento de pedidos en la base de datos
*/

export interface Pedido {
    idPedido: number;
    IdCliente: number;
    IdTarjeta: number;
    fechaPedido: Date;
    fechaEntrega: Date;
    codigo:string;
    total: number;
    idDireccion: number;
    IdEmpleadoEntrega: number;
    estatus: string;
}