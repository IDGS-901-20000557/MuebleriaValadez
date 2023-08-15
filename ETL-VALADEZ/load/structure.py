from sqlalchemy import Column, Integer, Float, String
from base import Base

class TopSellingProduct(Base):
    __tablename__ = 'mayor_vendido_producto'

    idProducto = Column(Integer, primary_key=True)
    nombre = Column(String)
    cantidad = Column(Integer)
    costo = Column(Float)
    total_obtenido = Column(Float)

    def __init__(self,idProducto, nombre, cantidad, costo, total_obtenido):
        self.idProducto=idProducto
        self.nombre = nombre
        self.cantidad = cantidad
        self.costo = costo
        self.total_obtenido = total_obtenido

class BottomSellingProduct(Base):
    __tablename__ = 'menor_vendido_producto'

    idProducto = Column(Integer, primary_key=True)
    nombre = Column(String)
    cantidad = Column(Integer)
    costo = Column(Float)
    total_obtenido = Column(Float)

    def __init__(self, idProducto,nombre, cantidad, costo, total_obtenido):
        self.idProducto=idProducto
        self.nombre = nombre
        self.cantidad = cantidad
        self.costo = costo
        self.total_obtenido = total_obtenido


class CalculatedValues(Base):
    __tablename__ = 'valores_calculados'

    id = Column(Integer, primary_key=True)
    gross_profit = Column(Float)
    average_purchase_value = Column(Float)
    total_users = Column(Integer)
    average_order_value = Column(Integer)

    def __init__(self, gross_profit, average_purchase_value, total_users, average_order_value):
        self.gross_profit = gross_profit
        self.average_purchase_value = average_purchase_value
        self.total_users = total_users
        self.average_order_value = average_order_value

class MonthlySales(Base):
    __tablename__ = 'ventas_mensuales'

    id = Column(Integer, primary_key=True)
    year = Column(Integer)
    month = Column(String)
    total_vendido= Column(Integer)

    def __init__(self,year, month,total_vendido):
        self.year = year
        self.month = month
        self.total_vendido = total_vendido
        
class InventoryProduct(Base):
    __tablename__ = 'Inventory_Products'

    id = Column(Integer, primary_key=True)
    nameProduct = Column(String)
    quantityAvailable = Column(Integer)

    def __init__(self, nameProduct, quantityAvailable):
        self.nameProduct = nameProduct
        self.quantityAvailable = quantityAvailable
        
    
class InventoryIngredients(Base):
    __tablename__ = 'Inventory_Ingredients'

    id = Column(Integer, primary_key=True)
    nameIngredient = Column(String)
    quantityAvailable = Column(Integer)

    def __init__(self, nameIngredient, quantityAvailable):
        self.nameIngredient = nameIngredient
        self.quantityAvailable = quantityAvailable

class BestClients(Base):
    __tablename__ = 'Best_Clients'

    idClient = Column(Integer, primary_key=True)
    fullName = Column(String)
    total = Column(Integer)

    def __init__(self, idClient, fullName, total):
        self.idClient = idClient
        self.fullName = fullName
        self.total = total