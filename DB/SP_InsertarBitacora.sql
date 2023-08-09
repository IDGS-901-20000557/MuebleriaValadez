CREATE PROCEDURE sp_InsertarBitacora
    @idUsuario INT,
    @movimiento NVARCHAR(100),
    @modulo NVARCHAR(100),
    @observaciones NVARCHAR(500),
    @fecha DATETIME
AS
BEGIN
    INSERT INTO [DBMuebleriaValadez].[dbo].[Bitacora] (idUsuario, movimiento, modulo, observaciones, fecha)
    VALUES (@idUsuario, @movimiento, @modulo, @observaciones, @fecha)
END