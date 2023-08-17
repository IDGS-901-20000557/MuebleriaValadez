//using IDGS901_API.models;
using Microsoft.EntityFrameworkCore;
using DashBoardBack.Models;
using System.Security.Cryptography.X509Certificates;

namespace DashBoardBack
{
    public class AppDbContext : DbContext
    {
        private const string connextionstring = "conexion";
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }
        public DbSet<Inventario_Productos>? inventario_Productos { get; set; }
        public DbSet<Inventario_Insumos>? inventario_Insumos { get; set; }
        public DbSet<VentasMensuales>? ventasMensuales { get; set; }
        public DbSet<ValoresCalculados> valoresCalculados { get; set; }
        public DbSet<MejoresClientes>? mejoresClientes { get; set; }
        public DbSet<Productos> productos { get; set; }


        // public DbSet<Usuario>? Usuario { get; set; }


    }
}
