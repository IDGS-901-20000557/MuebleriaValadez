import { Insumo } from "./insumo";
import { Producto } from "./producto";

export interface LibroReceta {
  idLibroReceta?: number;
  insumosLibroRecetas?: Insumo[];
  productoLibroRecetas?: Producto;
  idUsuario?: number;
  idSucursal?: number;
}
