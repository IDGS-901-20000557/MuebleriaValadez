CREATE PROCEDURE usp_InsertInsumo
    @nombreInsumo NVARCHAR(150),
    @IdProveedor BIGINT,
    @unidad NVARCHAR(50),
    @precio FLOAT,
    @observaciones NVARCHAR(MAX),
    @cantidaAceptable FLOAT,
    @IdUsuario BIGINT -- Pasa el IdUsuario como parámetro
AS
BEGIN
    BEGIN TRY
        BEGIN TRANSACTION;

		-- Insertar en la tabla "Inventario"
        INSERT INTO Inventario (IdSucursal, cantidaDisponible)
        VALUES (1, 0); -- Asigna la IdSucursal correspondiente y cantidadDisponible = 0
        DECLARE @IdInventario INT = SCOPE_IDENTITY(); -- Obtener el IdInventario generado

        -- Insertar el insumo en la tabla "Insumo"
        INSERT INTO Insumos (nombreInsumo, IdProveedor, IdInventario, unidad, precio, observaciones, cantidadAceptable, estatus)
        VALUES (@nombreInsumo, @IdProveedor, @IdInventario, @unidad, @precio, @observaciones, @cantidaAceptable, '1');
        DECLARE @IdInsumo INT = SCOPE_IDENTITY(); -- Obtener el IdInsumo generado

        -- Insertar el registro en la tabla "Bitacora"
        INSERT INTO Bitacora (IdUsuario, Movimiento, Modulo, Observaciones, Fecha)
        VALUES (@IdUsuario, 'Inserción', 'Insumos', 'Se insertó un insumo con Id: ' + CAST(@IdInsumo AS VARCHAR), GETDATE());

        COMMIT TRANSACTION;

    END TRY
    BEGIN CATCH
        ROLLBACK TRANSACTION;
        THROW;
    END CATCH;
END;


-- Probar Stored Procedured
DECLARE @IdUsuario BIGINT = 10002; -- Suponiendo que el IdUsuario autenticado es 1
DECLARE @nombreInsumo NVARCHAR(150) = 'Insumo de prueba';
DECLARE @IdProveedor BIGINT = 4;
DECLARE @unidad NVARCHAR(50) = 'Litros';
DECLARE @precio FLOAT = 100;
DECLARE @observaciones NVARCHAR(MAX) = 'Observaciones de prueba';
DECLARE @cantidaAceptable FLOAT = 50;

EXEC usp_InsertInsumo @nombreInsumo, @IdProveedor, @unidad, @precio, @observaciones, @cantidaAceptable, @IdUsuario;