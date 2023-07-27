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
        public DbSet<Cliente>? Cliente { get; set; }
        public DbSet<Direccion>? Direccion { get; set; }
        public DbSet<Domicilio>? Domicilio { get; set; }
        public DbSet<Empleado>? Empleado { get; set; }
        public DbSet<Persona>? Persona { get; set; }
        public DbSet<Rol>? Rol { get; set; }
        public DbSet<Sucursal>? Sucursal { get; set; }
        public DbSet<Usuario>? Usuario { get; set; }
        public DbSet<Usuario_Rol>? Usuario_Rol { get; set; }
        public DbSet<VistaAuth>? VistaAuth { get; set; }
        public DbSet<Insumo>? Insumos { get; set; }
        public DbSet<Inventario>? Inventario { get; set; }
        public DbSet<Productos>? Productos { get; set; }


    }
}
