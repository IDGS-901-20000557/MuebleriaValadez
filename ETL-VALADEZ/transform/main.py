import argparse
import datetime
import logging
import pandas as pd

# Importamos la librería logging para mostrar mensajes al usuario
import logging

# Obtenemos una referencia al logger
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Definimos la función principal
def main():
    # Leer los archivos CSV y cargar los datos en DataFrames
    df_user = pd.read_csv('usuarios.csv')
    df_detallePedido = pd.read_csv('ordenesPedido.csv')
    df_pedido = pd.read_csv('pedido.csv')
    df_pedido_full = pd.read_csv('pedidosFull.csv')
    df_compra = pd.read_csv('ordenesVentas.csv')
    df_detalleCompra = pd.read_csv('ordenesVentaProducto.csv')
    df_producto = pd.read_csv('producto.csv')
    df_clientes = pd.read_csv('clientes.csv')
    df_materia_prima = pd.read_csv('insumo.csv', header=0)


    # Realizar las transformaciones y análisis de datos
    gross_profit = calculate_gross_profit(df_compra, df_pedido)
    average_purchase_value = calculate_average_purchase_value(df_detalleCompra, df_producto)
    top_selling_products = get_top_selling_products(df_detalleCompra, df_producto, 5)
    bottom_selling_products = get_bottom_selling_products(df_detalleCompra, df_producto, 5)
    bestClients = get_top_clients(df_pedido, df_clientes)
    total_users = get_user_statistics(df_user)
    average_order_value=calculate_average_order_value(df_detallePedido)
    product_sales_by_month = get_product_sales_by_month(df_pedido_full)
    
    # Estado del inventario
    inventoryProduct = calculateInventoryProduct(df_producto)
    inventoryIngredients = calculateInventoryIngredients(df_materia_prima)
    
    # Imprimir los resultados
    print("Beneficio Bruto:", gross_profit)
    print("Valor de compra promedio:", average_purchase_value)
    
    print("Valor de venta promedio",average_order_value)
    print("Top 5 productos más vendidos:")
    print(top_selling_products)
    print("Top 5 productos menos vendidos:")
    print(bottom_selling_products)
    print("-----------------------------------------------------")
    print("Ventas mensuales por producto:")
    print(product_sales_by_month)
    print("Total de usuarios:", total_users)

    
    # Crear un DataFrame con los resultados
    Valor_Calculado = pd.DataFrame({
        'Beneficio Bruto'         : [gross_profit],
        'Valor de compra promedio': [average_purchase_value],
        'Total de usuarios'       : [total_users],
        'Valor de venta promedio' : [average_order_value],
    })
    # Crear DataFrame para los productos menos vendidos
    
    Producto_Mas_Vendido = pd.DataFrame(
      top_selling_products, columns=['idProducto', 'nombreProducto', 'cantidad', 'precioVenta', 'total_obtenido'])

    Producto_Menos_Vendido = pd.DataFrame(
        bottom_selling_products, columns=['idProducto', 'nombreProducto', 'cantidad', 'precioVenta', 'total_obtenido'])

    Ventas_mensuales = pd.DataFrame(
        product_sales_by_month, columns=['year','month', 'nombreProducto','total_vendido']
    )

    # Obtener la fecha actual para utilizarla en el nombre del archivo CSV
    current_date = datetime.datetime.now().strftime("")

    # Guardar el DataFrame en un archivo CSV
    Valor_Calculado.to_csv(f'Valor_Calculado_{current_date}.csv', index=False)
    Producto_Menos_Vendido.to_csv(f'Producto_Menos_Vendido_{current_date}.csv', index=False)
    Producto_Mas_Vendido.to_csv(f'Producto_Mas_Vendido_{current_date}.csv', index=False)
    Ventas_mensuales.to_csv(f'Ventas_mensuales_{current_date}.csv', index=False)
    inventoryProduct.to_csv(f'Inventario_Productos_{current_date}.csv', index=False)
    inventoryIngredients.to_csv(f'Inventario_Insumos_{current_date}.csv', index=False)
    bestClients.to_csv(f'Mejores_Clientes_{current_date}.csv', index=False)

    print("Los archivos CSV se han generado exitosamente.")

def calculateInventoryProduct(df_producto):
    df_inventory_product = pd.DataFrame({
        'nombreProducto'       : df_producto['nombreProducto'],
        'cantidadDisponible'   : df_producto['cantidaDisponible']
    })
    
    return df_inventory_product

def calculateInventoryIngredients(df_materia_prima):
    df_inventory_ingredients = pd.DataFrame({
        'nombreInsumo'       : df_materia_prima['nombreInsumo'],
        'cantidadDisponible' : df_materia_prima['cantidaDisponible']
    })
    
    return df_inventory_ingredients

# Obtener los 5 mejores clientes
def get_top_clients(df_pedido, df_clientes):
    df_merged = pd.merge(df_pedido, df_clientes, left_on='idCliente', right_on='idCliente')
    df_grouped = df_merged.groupby('idCliente').agg({'idCliente':'first','total': 'sum','nombreCompleto':'first', 'fechaPedido': 'first'})
    df_sorted = df_grouped.sort_values('total', ascending=False).head(5)
    return df_sorted[['idCliente', 'nombreCompleto','total']]

# Beneficio Bruto
def calculate_gross_profit(df_detalleCompra, df_detallePedido):
    costo_total = df_detalleCompra['costoProdFin']
    ingreso_total = df_detallePedido['total']
    
    beneficio_bruto = round (ingreso_total.sum() - costo_total.sum())
    return beneficio_bruto


# Valor de compra promedio
def calculate_average_purchase_value(df_detalleCompra, df_producto):
    # Merge para obtener los precios de los productos
    df_merged = pd.merge(df_detalleCompra, df_producto, left_on='idProducto', right_on='idProducto')
    # Cálculo del valor total de compra
    df_merged['valor_total'] = df_merged['cantidad'] * df_merged['precioVenta']
    
    # Cálculo del valor promedio de compra
    average_purchase_value =round (df_merged['valor_total'].sum() / df_detalleCompra['idOrdenVentaProducto'].nunique(),2)
    return average_purchase_value

# Función para calcular el valor promedio del pedido
def calculate_average_order_value(df_detallePedido):
    # Calcular el valor promedio del pedido
    average_order_value = df_detallePedido['subtotal'].mean()

    return round(average_order_value, 2)

# Obtener los 5 productos más vendidos
def get_top_selling_products(df_detalleCompra, df_producto, num_products):
    df_merged = pd.merge(df_detalleCompra, df_producto, left_on='idProducto', right_on='idProducto')
    df_grouped = df_merged.groupby('idProducto').agg({'idProducto':'first','cantidad': 'sum', 'nombreProducto': 'first', 'precioVenta': 'first'})
    df_grouped['total_obtenido'] = df_grouped['cantidad'] * df_grouped['precioVenta']
    df_sorted = df_grouped.sort_values('cantidad', ascending=False).head(num_products)
    return df_sorted[['idProducto','nombreProducto', 'cantidad', 'precioVenta', 'total_obtenido']]

# Obtener los 5 productos menos vendidos
def get_bottom_selling_products(df_detalleCompra, df_producto, num_products):
    df_merged = pd.merge(df_detalleCompra, df_producto, left_on='idProducto', right_on='idProducto')
    df_grouped = df_merged.groupby('idProducto').agg(
                {'idProducto': 'first', 'cantidad': 'sum', 'nombreProducto': 'first', 'precioVenta': 'first'})
    df_grouped['total_obtenido'] = df_grouped['cantidad'] * df_grouped['precioVenta']
    df_sorted = df_grouped.sort_values('cantidad').head(num_products)
    return df_sorted[['idProducto', 'nombreProducto', 'cantidad', 'precioVenta', 'total_obtenido']]


def get_product_sales_by_month(df_pedido_Full):
    # Convertir la columna 'fechaPedido' a tipo datetime
    df_pedido_Full['fechaP'] = pd.to_datetime(df_pedido_Full['fechaPedido'])
    
    # Agregar columnas para el año y el mes
    df_pedido_Full['year'] = df_pedido_Full['fechaP'].dt.year
    df_pedido_Full['month'] = df_pedido_Full['fechaP'].dt.month.apply(lambda x: 
        'Enero' if x == 1 else
        'Febrero' if x == 2 else
        'Marzo' if x == 3 else
        'Abril' if x == 4 else
        'Mayo' if x == 5 else
        'Junio' if x == 6 else
        'Julio' if x == 7 else
        'Agosto' if x == 8 else
        'Septiembre' if x == 9 else
        'Octubre' if x == 10 else
        'Noviembre' if x == 11 else
        'Diciembre'
    )
    
    # Agrupar por año, mes, y sumar las cantidades vendidas
    df_grouped = df_pedido_Full.groupby(['year', 'month'])['cantidad'].sum().reset_index()
    
    # Renombrar la columna 'cantidad' a 'total_vendido'
    df_grouped.rename(columns={'cantidad': 'total_vendido'}, inplace=True)
    
    return df_grouped

# Número de usuarios y nuevos usuarios semanales
def get_user_statistics(df_user):
    total_users = df_user.shape[0]
    return total_users

if __name__ == '__main__':
    main()
