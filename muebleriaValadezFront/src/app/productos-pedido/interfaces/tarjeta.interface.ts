/*
  Clase desarrollada por Jonathan
  Interface para el almacenamiento y manipulacion de las tarjetas en la base de datos
*/

export interface Tarjeta {
    IdTarjeta: number;
    IdCliente: number;
    tipo:number;
    numeroTarejta: string;
    nombreTitular: string;
    vencimiento: string;
    cvv: number;
}