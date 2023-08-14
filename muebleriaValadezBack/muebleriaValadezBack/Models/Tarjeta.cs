using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace muebleriaValadezBack.Models
{
    //integracion del proyecto
    public class Tarjetas
    {
        [Key]
        public long IdTarjeta { get; set; }
        public long numeroTarejta { get; set; }
        public String nombreTitular { get; set; }
        public String vencimiento { get; set; }
        public int cvv { get; set; }
        public String tipo { get; set; }

        [ForeignKey("Cliente")]
        public long IdCliente { get; set; }

        public Cliente? Cliente { get; set; }
    }
}
