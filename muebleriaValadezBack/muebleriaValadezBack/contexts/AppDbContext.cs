//using IDGS901_API.models;
using Microsoft.EntityFrameworkCore;
using muebleriaValadezBack.Models;
using System.Security.Cryptography.X509Certificates;

namespace muebleriaValadezBack
{
    public class AppDbContext : DbContext
    {
        private const string connextionstring = "conexion";
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }
        public DbSet<Cliente>? Clientes { get; set; }
        public DbSet<Direccion>? Direcciones { get; set; }
        public DbSet<Domicilio>? Domicilios { get; set; }
        public DbSet<Empleado>? Empleados { get; set; }
       // public DbSet<Persona>? Persona { get; set; }
        public DbSet<Rol> Roles { get; set; }
        public DbSet<Sucursal>? Sucursales { get; set; }
       // public DbSet<Usuario>? Usuario { get; set; }
        public DbSet<Usuario> Usuarios { get; set; }
        public DbSet<Personas> Personas { get; set; }
        public DbSet<Usuario_Rol> Usuarios_Roles { get; set; }
        public DbSet<VistaAuth>? VistaAuth { get; set; }
        public DbSet<Insumo>? Insumos { get; set; }
        public DbSet<Inventario>? Inventario { get; set; }
        public DbSet<Productos>? Productos { get; set; }
        public DbSet<LibroReceta>? libroRecetas { get; set; }
        public DbSet<InsumoData>? InsumoData { get; set; }
        public DbSet<ProductosData>? ProductosData { get; set; }
        public DbSet<Lotes>? Lotes { get; set; }
        public DbSet<InsumoLote>? InsumoLote { get; set; }
        public DbSet<ProductosLote>? ProductoLote { get; set; }
        public DbSet<InventarioResult>? InventarioResult { get; set; }
        public DbSet<ProveedorDTO>? Proveedores { get; set; }
        public DbSet<Tarjetas>? Tarjetas { get; set; }
        public DbSet<Pedido>? Pedido { get; set; }
        public DbSet<OrdenesPedidos>? OrdenesPedidos { get; set; }
        public DbSet<OrdenVenta>? OrdenesVenta { get; set; }
        public DbSet<ProductosVenta>? ProductosVenta { get; set; }
        public DbSet<ClienteVentas>? ClienteVentas { get; set; }
        public DbSet<DireccionesVentas>? DireccionesVentas { get; set; }

        public DbSet<ClienteDirecciones>? cliente_Direcciones { get; set; }
        public DbSet<DomicilioResult>? DomicilioResult { get; set; }
        public DbSet<Repartidor>? Repartidor { get; set; }
        public DbSet<RepartirDetalle>? RepartirDetalle { get; set; }
        public DbSet<ProductoRepartir>? ProductoRepartir { get; set; }




    }
}
