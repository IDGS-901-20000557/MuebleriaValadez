import argparse
import logging

import pandas as pd
from base import Base, engine, Session
from structure import TopSellingProduct, BottomSellingProduct, CalculatedValues, MonthlySales, InventoryIngredients, InventoryProduct, BestClients

# Agregamos la configuración del logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def main():
    # Generamos el esquema de la BD
    Base.metadata.create_all(engine)

    # Iniciamos la sesión
    session = Session()
    logger.info('....::: Eliminacion de datos en la BD:::....')

    truncate_tables(session)

    logger.info('....::: Cargando datos en la BD:::....')

    # Cargar los datos desde los archivos CSV
    df_top_selling = pd.read_csv('Producto_Mas_Vendido_.csv', encoding='utf-8')
    df_bottom_selling = pd.read_csv('Producto_Menos_Vendido_.csv', encoding='utf-8')
    df_calculated_values = pd.read_csv('Valor_Calculado_.csv', encoding='utf-8')
    df_calculated_values.columns = df_calculated_values.columns.str.strip()
    df_monthly_sales = pd.read_csv('Ventas_mensuales_.csv', encoding='utf-8')
    
    df_inventory_products = pd.read_csv('Inventario_Productos_.csv', encoding='utf-8')
    df_inventory_ingredients = pd.read_csv('Inventario_Insumos_.csv', encoding='utf-8')
    df_best_clients = pd.read_csv('Mejores_Clientes_.csv', encoding='utf-8')

    # Cargar los datos en las tablas correspondientes
    for _, row in df_top_selling.iterrows():
        top_selling_product = TopSellingProduct(row['idProducto'], row['nombreProducto'], row['cantidad'], row['precioVenta'], row['total_obtenido'])
        session.add(top_selling_product)

    for _, row in df_bottom_selling.iterrows():
        bottom_selling_product = BottomSellingProduct(row['idProducto'], row['nombreProducto'], row['cantidad'], row['precioVenta'], row['total_obtenido'])
        session.add(bottom_selling_product)

    for _, row in df_calculated_values.iterrows():
        calculated_values = CalculatedValues(row['Beneficio Bruto'], row['Valor de compra promedio'], row['Total de usuarios'], row['Valor de venta promedio'])
        session.add(calculated_values)

    for _, row in df_monthly_sales.iterrows():
        year = int(row['year'])
        month = str(row['month'])
        total_vendido = int(row['total_vendido'])
        monthly_sales = MonthlySales(year=year, month=month ,total_vendido=total_vendido)
        session.add(monthly_sales)
        
    for _, row in df_inventory_products.iterrows():
        quantityAvailable = int(row['cantidadDisponible'])
        nameProduct = str(row['nombreProducto'])
        inventory_products = InventoryProduct(nameProduct=nameProduct, quantityAvailable=quantityAvailable)
        session.add(inventory_products)
        
    for _, row in df_inventory_ingredients.iterrows():
        quantityAvailable = int(row['cantidadDisponible'])
        nameIngredient = str(row['nombreInsumo'])
        inventoryIngredients = InventoryIngredients(nameIngredient=nameIngredient, quantityAvailable=quantityAvailable)
        session.add(inventoryIngredients)

    for _, row in df_best_clients.iterrows():
        idCliente = int(row['idCliente'])
        nombre = str(row['nombreCompleto'])
        total = int(row['total'])
        bestClients = BestClients(fullName=nombre, idClient=idCliente, total=total)
        session.add(bestClients)

    # Guardar los cambios en la base de datos
    session.commit()
    logger.info('Los datos se han cargado correctamente en la base de datos.')

    # Cerrar la sesión de la base de datos
    session.close()

def truncate_tables(session):
    try:
        # Eliminar los datos de las tablas existentes
        with session.begin():
            for table in reversed(Base.metadata.sorted_tables):
                session.execute(table.delete())
        logger.info('Registros eliminados en las tablas existentes')
    except Exception as e:
        logger.error(f'Error al eliminar registros de las tablas: {e}')

if __name__ == '__main__':
    """ 
    # Creamos el parser de argumentos
    parser = argparse.ArgumentParser()

    # Creamos argumentos obligatorios para los cuatro archivos
    parser.add_argument('filename1', help='El archivo del top de productos más vendidos', type=str)
    parser.add_argument('filename2', help='El archivo del top de productos menos vendidos', type=str)
    parser.add_argument('filename3', help='El archivo de los valores calculados', type=str)
    parser.add_argument('filename4', help='El archivo de las ventas mensuales', type=str)

    args = parser.parse_args()

    main(args.filename1, args.filename2, args.filename3, args.filename4) 
    """
    main()    
