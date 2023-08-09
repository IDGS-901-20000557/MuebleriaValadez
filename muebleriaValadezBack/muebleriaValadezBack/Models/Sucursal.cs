using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace muebleriaValadezBack.Models
{
    public class Sucursal
    {
        [Key]
        public long IdSucursal { get; set; }

        [ForeignKey("direccion")]
        public long IdDireccion { get; set; }

        public Direccion direccion { get; set; }
        public String razonSocial { get; set; }


    }
}
