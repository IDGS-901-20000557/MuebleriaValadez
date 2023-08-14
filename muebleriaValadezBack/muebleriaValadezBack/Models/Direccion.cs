using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace muebleriaValadezBack.Models
{
    //integracion del proyecto
    public class Direccion
    {
        [Key]
        public long IdDireccion { get; set; }
        public String calle { get; set; }
        public int noExt { get; set; }
        public int? noInt { get; set; }

        [ForeignKey("domicilio")]
        public long IdDomicilio { get; set; }

        public Domicilio? domicilio { get; set; }

    }

}




