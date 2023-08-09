using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace muebleriaValadezBack.Models
{

    //integracion del proyecto
    public class Empleado
    {
        [Key]
        public long IdEmpleado { get; set; }
        public String rfc { get; set; }
        public String puesto { get; set; }
        public Sucursal? sucursal { get; set; }
        public Personas? persona { get; set; }

        [ForeignKey("sucursal")]
        public long? IdSucursal { get; set; }

        [ForeignKey("persona")]
        public long? IdPersona { get; set; }
       

    }
}
