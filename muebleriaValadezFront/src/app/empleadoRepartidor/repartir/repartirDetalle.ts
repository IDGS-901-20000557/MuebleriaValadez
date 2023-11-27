import { ProductoRepartir } from './ProductoRepartir';

export interface RepartirDetalle {
  IdPedido?: number;
  nombreCliente?: string;
  domicilio?: string;
  fechaPedido?: Date;
  codigo?: number;
  total?: number;
  productoRepartir: ProductoRepartir[];
}
