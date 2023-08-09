using System.ComponentModel.DataAnnotations;

namespace muebleriaValadezBack.Models
{

    //integracion del proyecto
    public class Personas
    {
        [Key]
        public long IdPersona { get; set; }

        public string nombres { get; set; }
        public string apellidoPaterno { get; set; }
        public string apellidoMaterno { get; set; }
        public string telefono { get; set; }
    }
}