using System.ComponentModel.DataAnnotations;

namespace muebleriaValadezBack.Models
{
    public class Rol
    {
        [Key]
        public long IdRol { get; set; }
        public String nombre { get; set; }
        public String descripcion { get; set; }
    }
}
