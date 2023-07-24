using System.ComponentModel.DataAnnotations;

namespace muebleriaValadezBack.Models
{
    public class Persona
    {
        [Key]
        public long IdPersona { get; set; }
        public String nombres { get; set; }
        public String apellidoPaterno { get; set; }
        public String apellidoMaterno { get; set; }
        public String telefono { get; set; }
}
}
