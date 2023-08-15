CREATE PROCEDURE usp_UpdateSucursal
    @IdSucursal BIGINT,
    @razonSocial NVARCHAR(200),
	@IdDireccion BIGINT,
	@IdDomicilio BIGINT,
    @calle NVARCHAR(150),
	@noExt INT,
	@noInt INT,
	@IdUsuario BIGINT
AS
BEGIN
    BEGIN TRY
        BEGIN TRANSACTION;

		-- Actualizar los datos de la sucursal en la tabla "Sucursales"
        UPDATE Sucursales
        SET razonSocial = @razonSocial
        WHERE idSucursal = @IdSucursal;

		-- Actualizar los datos en la tabla "Direccion"
		UPDATE Direcciones
		SET IdDomicilio = @IdDomicilio,
			calle = @calle,
			noExt = @noExt,
			noInt = @noInt
        WHERE IdDireccion = @IdDireccion;

        -- Insertar el registro en la tabla "Bitacora"
        INSERT INTO Bitacora (IdUsuario, Movimiento, Modulo, Observaciones, Fecha)
        VALUES (@IdUsuario, 'Actualización', 'Sucursales', 'Se actualizó la sucursal con Id: ' + CAST(@IdSucursal AS NVARCHAR), GETDATE());

        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        ROLLBACK TRANSACTION;
        THROW;
    END CATCH;
END;