CREATE PROCEDURE usp_DeleteSucursal
    @idSucursal BIGINT, -- Pasa el IdSucursal como parámetro
    @idUsuario BIGINT -- Pasa el IdUsuario como parámetro
AS
BEGIN
    BEGIN TRY
        BEGIN TRANSACTION;

        -- Verificar si la sucursal existe
        IF NOT EXISTS (SELECT 1 FROM Sucursales WHERE IdSucursal = @idSucursal)
        BEGIN
            THROW 50000, 'La sucursal no existe.', 1;
        END

        -- Cambiar el estatus a 0 para "eliminar" la sucursal
        UPDATE Sucursales SET estatus = '0' WHERE IdSucursal = @idSucursal;

        -- Insertar el registro en la tabla "Sucursales"
        INSERT INTO Bitacora (IdUsuario, Movimiento, Modulo, Observaciones, Fecha)
        VALUES (@idUsuario, 'Eliminación', 'Sucursales', 'Se eliminó una sucursal con Id: ' + CAST(@idSucursal AS NVARCHAR(50)), GETDATE());

        COMMIT TRANSACTION;

    END TRY
    BEGIN CATCH
        ROLLBACK TRANSACTION;
        THROW;
    END CATCH;
END;

-- Probar Stored Procedured
DECLARE @idSucursal BIGINT = 4;
DECLARE @idUsuario BIGINT = 10002; 

EXEC usp_DeleteSucursal @idSucursal, @idUsuario;