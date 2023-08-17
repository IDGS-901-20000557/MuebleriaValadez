import { Producto } from "./producto";

export interface OrdenVenta {
  idOrdenVenta?: number;
  fechaVenta?: Date;
  fechaEntrega?: Date;
  total?: number;
  idCliente?: number;
  IdUsuario?: number;
  IdDireccion?: number;
  IdEmpleadoMostrador?: number;
  tipoPago?: string;
  estatus?: string;
  productosVenta?: Producto[];
}
