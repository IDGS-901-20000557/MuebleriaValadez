using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace muebleriaValadezBack.Models
{
    public class Sucursales
    {
        [Key]
        public long idSucursal { get; set; }


        [ForeignKey("direccion")]

        public long idDireccion { get; set; }


        public String razonSocial { get; set; }


        public Direccion direccion { get; set; }
   
    }
}
