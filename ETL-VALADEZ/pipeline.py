import datetime
import subprocess
import logging


# Agregamos la configuración básica del logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Definimos una lista con los diferentes sites uids que tenemos en la configuración 

# Definimos una lista con los diferentes sites uids que tenemos en la configuración
extract = ['producto', 'pedido', 'ordenesPedido', 'ordenesVentas', 'ordenesVentaProducto', 'insumo', 'usuarios', 'clientes', 'pedidosFull']
load = ['Inventario_Insumos_', 'Inventario_Productos_', 'Mejores_Clientes_', 'Producto_Mas_Vendido_', 'Producto_Menos_Vendido_', 'Valor_Calculado_', 'Ventas_mensuales_']
def main():
    logger.info('...:::: Proceso ETL Iniciado ::::...')
    _extract()
    _transform()
    _load()
    logger.info('...:::: Proceso ETL Finalizado ::::...')


# Funcion encargada de invocar el proceso de extraccion el proceso de extraccion
def _extract():
    logger.info('...::: Iniciando el proceso de extraccion :::...')

    # Iteramos por cada uno de los nombres de la extraccion que tenemos en la configuracion
    for tabla in extract:
        # Ejecutamos la etapa de extraccion en la carpeta extract
        subprocess.run(['python', 'main.py', tabla], cwd='./extract')

    # Movemos el archivo .csv a la carpeta transform
    subprocess.run(['move', r'extract\*.csv', r'transform'], shell=True)


def _transform():
    logger.info('...::: Iniciando el proceso de transformacion :::...')
    # Ejecutamos la etapa de transformacion en la carpeta transform
    subprocess.run(['python', 'main.py'], cwd='./transform')

    # Iteramos por cada uno de los newsites que tenemos en la configuracion
    for tabla in extract:

        dirty_data = '{}.csv'.format(tabla)

        # Eliminando el archivo .csv sucio
        subprocess.run(['del', dirty_data], shell=True, cwd='./transform')

    # Movemos el archivo .csv limpio a la carpeta load.
    subprocess.run(['move', r'transform\*.csv', r'load'], shell=True)


def _load():
    logger.info('...::: Iniciando el proceso de Carga :::...')

    now = datetime.datetime.now().strftime('%Y%m%d')
    # Ejecutamos la etapa de carga en la carpeta load
    subprocess.run(['python', 'main.py'], cwd='./load')
    
    for archivo in load:
        loadFile = '{}.csv'.format(archivo)

        # Eliminando el archivo .csv sucio
        subprocess.run(['del', loadFile], shell=True, cwd='./load')

if __name__ == '__main__':
    main()