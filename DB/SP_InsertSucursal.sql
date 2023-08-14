CREATE PROCEDURE usp_InsertSucursal
    @razonSocial NVARCHAR(200),
	@IdDomicilio BIGINT,
	@calle NVARCHAR(150),
	@noExt INT,
	@noInt INT,
	@IdUsuario BIGINT
AS
BEGIN
    BEGIN TRY
        BEGIN TRANSACTION;

        -- Insertar en la tabla "Direccion"
        DECLARE @idDireccion INT;
        INSERT INTO Direcciones (IdDomicilio, calle, noExt, noInt)
        VALUES (@idDomicilio, @calle, @noExt, @noInt);
        SET @idDireccion = SCOPE_IDENTITY();

        -- Insertar en la tabla "Sucursal"
        INSERT INTO Sucursales (idDireccion, razonSocial, estatus)
        VALUES (@idDireccion, @razonSocial, 1);
		DECLARE @IdSucursal INT = SCOPE_IDENTITY(); -- Obtener el IdSucursal generado para la bitácora

		-- Insertar el registro en la tabla "Bitacora"
        INSERT INTO Bitacora (IdUsuario, Movimiento, Modulo, Observaciones, Fecha)
        VALUES (@IdUsuario, 'Inserción', 'Sucursales', 'Se insertó una sucursal con Id: ' + CAST(@IdSucursal AS VARCHAR), GETDATE());

        COMMIT TRANSACTION;

    END TRY
    BEGIN CATCH
        ROLLBACK TRANSACTION;
        THROW;
    END CATCH;
END;

-- Probar Stored Procedured
DECLARE @IdUsuario BIGINT = 10002; -- Suponiendo que el IdUsuario autenticado es 1
DECLARE @razonSocial NVARCHAR(200) = 'Sucursal Valadez Plaza Mayor';
DECLARE @IdDomicilio BIGINT = 42837;
DECLARE @calle NVARCHAR(150) = 'Blvd. Juan Alonso de Torres';
DECLARE @noExt INT = 2000;
DECLARE @noInt INT = 203;

EXEC usp_InsertSucursal @razonSocial, @IdDomicilio, @calle, @noExt, @noInt, @IdUsuario;