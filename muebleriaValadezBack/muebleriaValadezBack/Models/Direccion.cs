using System.ComponentModel.DataAnnotations;

namespace muebleriaValadezBack.Models
{
    public class Direccion
    {
        [Key]
        public long IdDireccion { get; set; }
        public String calle { get; set; }
        public int noExt { get; set; }
        public int? noInt { get; set; }
        public Domicilio domicilio { get; set; }
    }
}
