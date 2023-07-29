CREATE PROCEDURE usp_UpdateInsumo
    @IdInsumo BIGINT,
    @nombreInsumo NVARCHAR(150),
    @IdProveedor BIGINT,
    @unidad NVARCHAR(50),
    @precio FLOAT,
    @observaciones NVARCHAR(MAX),
    @cantidaAceptable FLOAT,
    @IdUsuario BIGINT
AS
BEGIN
    BEGIN TRY
        BEGIN TRANSACTION;

        -- Actualizar los datos del insumo en la tabla "Insumos"
        UPDATE Insumos
        SET nombreInsumo = @nombreInsumo,
            IdProveedor = @IdProveedor,
            unidad = @unidad,
            precio = @precio,
            observaciones = @observaciones,
            cantidadAceptable = @cantidaAceptable
        WHERE IdInsumo = @IdInsumo;

        -- Insertar el registro en la tabla "Bitacora"
        INSERT INTO Bitacora (IdUsuario, Movimiento, Modulo, Observaciones, Fecha)
        VALUES (@IdUsuario, 'Actualización', 'Insumos', 'Se actualizó el insumo con Id: ' + CAST(@IdInsumo AS NVARCHAR), GETDATE());

        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        ROLLBACK TRANSACTION;
        THROW;
    END CATCH;
END;

SELECT * FROM Insumos;

-- Probar Stored Procedured
DECLARE @IdInsumo BIGINT = 22; -- Id del insumo por actualizar
DECLARE @nombreInsumo NVARCHAR(150) = 'Clavos';
DECLARE @IdProveedor BIGINT = 3; -- Id del nuevo proveedor
DECLARE @unidad NVARCHAR(50) = 'Piezas'; -- Unidad actualizada
DECLARE @precio FLOAT = 1.50; -- Precio actualizado
DECLARE @observaciones NVARCHAR(MAX) = 'Clavo con nuevas actualizaciones'; -- Observaciones actualizadas
DECLARE @cantidaAceptable FLOAT = 2000; -- Cantidad aceptable actualizada
DECLARE @IdUsuario BIGINT = 10002; -- Id del usuario que realiza la actualización

-- Llamada al Stored Procedure usp_UpdateInsumo con los parámetros de prueba
EXEC usp_UpdateInsumo
    @IdInsumo = @IdInsumo,
    @nombreInsumo = @nombreInsumo,
    @IdProveedor = @IdProveedor,
    @unidad = @unidad,
    @precio = @precio,
    @observaciones = @observaciones,
    @cantidaAceptable = @cantidaAceptable,
    @IdUsuario = @IdUsuario;
