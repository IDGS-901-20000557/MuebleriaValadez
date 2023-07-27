using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace muebleriaValadezBack.Models
{
    public class Empleados
    {
        [Key]
        public long IdEmpleado { get; set; }
        public String rfc { get; set; }
        public String puesto { get; set; }
        [ForeignKey("sucursal")]

        public long idSucursal { get; set; }

        public Sucursales sucursal { get; set; }

        [ForeignKey("Personas")]
        public long IdPersona { get; set; }
        public Personas Personas { get; set; }
      
    }
}
