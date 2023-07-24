using System.ComponentModel.DataAnnotations;

namespace muebleriaValadezBack.Models
{
    public class Domicilio
    {
        [Key]
        public long idDomicilio { get; set; }
        public int cp { get; set; }
        public String colonia { get; set; }
        public String ciudad { get; set; }
        public String estado { get; set; }
    }
}
