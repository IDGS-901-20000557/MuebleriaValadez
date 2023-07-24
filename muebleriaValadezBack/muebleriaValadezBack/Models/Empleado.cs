using System.ComponentModel.DataAnnotations;

namespace muebleriaValadezBack.Models
{
    public class Empleado
    {
        [Key]
        public long IdEmpleado { get; set; }
        public String rfc { get; set; }
        public String puesto { get; set; }
        public Sucursal sucursal { get; set; }
        public Persona persona { get; set; }
      
    }
}
