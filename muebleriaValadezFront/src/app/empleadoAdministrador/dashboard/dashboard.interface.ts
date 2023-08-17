export interface ValoresCalculados{
    id:number;
    gross_profit:number;
    average_purchase_number:number;
    total_users:number;
    average_order_value:number;
}

export interface MejoresClientes{
    idClient:number;
    fullName:string;
    total:number;
}

export interface VentasMensuales{
    id:number;
    year:number;
    month:string;
    total_vendido:number;
}

export interface MejoresProductos{
    idProducto:number;
    nombre:string;
    cantidad:number;
    costo:number;
    total_obtenido:number;
}

export interface MenorProductos{
    idProducto:number;
    nombre:string;
    cantidad:number;
    costo:number;
    total_obtenido:number;
}

export interface InventarioProductos{
    id?:number;
    nameProduct:string;
    quantityAvailable:number;
}

export interface InventarioInsumos{
    id:number;
    nameIngredient:string;
    quantityAvailable:number;
}