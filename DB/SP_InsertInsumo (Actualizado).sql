USE [DBMuebleriaValadez]
GO
/****** Object:  StoredProcedure [dbo].[usp_InsertInsumo]    Script Date: 01/08/2023 11:47:50 a. m. ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
ALTER PROCEDURE [dbo].[usp_InsertInsumo]
    @nombreInsumo NVARCHAR(150),
    @IdProveedor BIGINT,
    @unidad NVARCHAR(50),
    @precio FLOAT,
    @observaciones NVARCHAR(MAX),
    @cantidaAceptable FLOAT,
    @IdUsuario BIGINT, -- Pasa el IdUsuario para la Bitacora
	@IdSucursal BIGINT -- Pasa el IdSucursal para inventario y sucursal
AS
BEGIN
    BEGIN TRY
        BEGIN TRANSACTION;

		-- Insertar en la tabla "Inventario"
        INSERT INTO Inventario (IdSucursal, cantidaDisponible)
        VALUES (@IdSucursal, 0); -- Asigna la IdSucursal correspondiente y cantidadDisponible = 0
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
