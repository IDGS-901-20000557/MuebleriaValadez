SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Claudio Tamayo
-- Create date: 23/07/2023
-- Description:	SP que inicie Sesión
-- =============================================
CREATE PROCEDURE [SP_ConsultarInicioSesion] 
	@Pemail nvarchar(100),
	@Ppassword nvarchar(MAX)
AS
BEGIN TRY
	SET LANGUAGE 'ESPAÑOL';
	DECLARE @CidUsuario bigInt;
	DECLARE @CidPersona bigInt;

	BEGIN TRAN
		-- Variable de tabla para almacenar los resultados de la consulta
		DECLARE @UsuariosTable TABLE (
			IdUsuario bigInt,
			email nvarchar(100),
			IdPersona bigInt,
			nombres nvarchar(MAX),
			apellidoPaterno nvarchar(MAX),
			apellidoMaterno nvarchar(MAX),
			telefono nvarchar(MAX),
			RFC nvarchar(MAX),
			puesto nvarchar(MAX),
			sucursal nvarchar(MAX),
			idDireccionSucursal nvarchar(MAX),
			Rol nvarchar(MAX),
			IdRol int
		);

		-- Realizamos la consulta y almacenamos los resultados en la variable de tabla
		INSERT INTO @UsuariosTable
		SELECT U.IdUsuario, email,
			P.IdPersona, nombres, apellidoPaterno, apellidoMaterno, telefono,
			(CASE WHEN R.IdRol=3 THEN '----' ELSE rfc END) AS RFC, 
			(CASE WHEN R.IdRol=3 THEN '----' ELSE puesto END) AS puesto, 
			(CASE WHEN R.IdRol=3 THEN '----' ELSE razonSocial END) AS sucursal, 
			(CASE WHEN R.IdRol=3 THEN '----' ELSE idDireccion END) AS idDireccionSucursal, 
			R.nombre AS 'Rol',
			R.IdRol
		FROM Usuarios AS U
		INNER JOIN Personas AS P ON P.IdPersona=U.IdPersona
		LEFT JOIN Empleados AS E ON E.IdPersona=P.IdPersona
		LEFT JOIN sucursales AS S ON S.IdSucursal= E.IdSucursal
		LEFT JOIN Clientes AS C ON C.IdPersona=P.IdPersona
		INNER JOIN Usuarios_Roles AS UR ON UR.IdUsuario=U.IdUsuario
		INNER JOIN Roles AS R ON R.IdRol=UR.IdRol
		WHERE U.estatus=1 AND U.email=@Pemail AND U.password=@Ppassword;

		-- Verificamos si el usuario existe
		IF EXISTS (SELECT 1 FROM @UsuariosTable)
		BEGIN
			-- Obtenemos el ID del usuario
			SELECT TOP 1 @CidUsuario = IdUsuario FROM @UsuariosTable;

			-- Insertamos en la bitácora la acción (Siempre que se hagan inserts, updates o deletes se inserta en bitácora).
			INSERT INTO Bitacora VALUES(@CidUsuario, 'Inicio Sesion', 'Usuarios', CONCAT('Inicio Sesion: ', @Pemail), GETUTCDATE() AT TIME ZONE 'UTC' AT TIME ZONE 'Central Standard Time');
		END

		-- Devolvemos los resultados de la consulta
		SELECT * FROM @UsuariosTable;

		COMMIT
END TRY
BEGIN CATCH
	-- Todo esto es necesario para capturar el error (en caso de que haya un error en la transacción)
	ROLLBACK
    SELECT  
        ERROR_NUMBER() AS ErrorNumber,
        ERROR_SEVERITY() AS ErrorSeverity,
        ERROR_STATE() AS ErrorState,
        ERROR_PROCEDURE() AS ErrorProcedure,
        ERROR_MESSAGE() AS ErrorMessage;
END CATCH
