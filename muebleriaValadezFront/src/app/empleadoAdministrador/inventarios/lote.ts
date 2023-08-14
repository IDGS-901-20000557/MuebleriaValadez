import { Insumo } from "./insumo";
import { Producto } from "./producto";

export interface Lote {
  idLote?: number;
  idUsuario?: number;
  idSucursal?: number;
  noLote?: number;
  observaciones?: string;
  fechaGenerado?: Date;
  fechaObtencion?: Date;
  estatus?: string;
  costo?: number;
  insumosLote?: Insumo[];
  productosLote?: Producto[];
}
