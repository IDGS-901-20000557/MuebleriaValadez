export interface Sucursal {
    idSucursal: number;
    razonSocial: string;
    direccion: Direccion;
    estatus: string;
}

export interface Direccion {
    idDireccion: number;
    calle: string;
    noExt: number;
    noInt?: number;
    idDomicilio: number;
}