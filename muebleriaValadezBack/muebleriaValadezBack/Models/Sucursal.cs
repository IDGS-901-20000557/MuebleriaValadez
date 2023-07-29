using System.ComponentModel.DataAnnotations;

namespace muebleriaValadezBack.Models
{
    public class Sucursal
    {
        [Key]
        public long idSucursal { get; set; }
        public Direccion direccion { get; set; }
        public String razonSocial { get; set; }
    }
}
