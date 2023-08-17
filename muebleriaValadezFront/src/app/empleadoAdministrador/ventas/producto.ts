export interface Producto {
  idProducto?: number;
  nombreProducto?: string;
  descripcion?: string;
  foto?: string;
  costoProduccion?: number;
  precioVenta?: number;
  observaciones?: string;
  IdInventario?: number;
  cantidadAceptable?: number;
  cantidadProducto?: number;
  estatus?: string;
  subtotal?: number;
}
