CREATE PROCEDURE usp_DeleteInsumo
    @idInsumo BIGINT, -- Pasa el IdInsumo como parámetro
    @idUsuario BIGINT -- Pasa el IdUsuario como parámetro
AS
BEGIN
    BEGIN TRY
        BEGIN TRANSACTION;

        -- Verificar si el insumo existe
        IF NOT EXISTS (SELECT 1 FROM Insumos WHERE IdInsumo = @idInsumo)
        BEGIN
            THROW 50000, 'El insumo no existe.', 1;
        END

        -- Verificar si existen productos vinculados con el insumo a través del IdInventario
        IF EXISTS (SELECT 1 FROM Productos WHERE IdInventario = (SELECT IdInventario FROM Insumos WHERE IdInsumo = @idInsumo) AND estatus = '1')
        BEGIN
            THROW 50001, 'No se puede eliminar el insumo porque existen productos vinculados a él.', 1;
        END

        -- Cambiar el estatus a 0 para "eliminar" el insumo
        UPDATE Insumos SET estatus = '0' WHERE IdInsumo = @idInsumo;

        -- Insertar el registro en la tabla "Bitacora"
        INSERT INTO Bitacora (IdUsuario, Movimiento, Modulo, Observaciones, Fecha)
        VALUES (@idUsuario, 'Eliminación', 'Insumos', 'Se eliminó un insumo con Id: ' + CAST(@idInsumo AS NVARCHAR(50)), GETDATE());

        COMMIT TRANSACTION;

    END TRY
    BEGIN CATCH
        ROLLBACK TRANSACTION;
        THROW;
    END CATCH;
END;

-- Probar Stored Procedured
DECLARE @idInsumo BIGINT = 20;
DECLARE @idUsuario BIGINT = 10002; 

EXEC usp_DeleteInsumo @idInsumo, @idUsuario;