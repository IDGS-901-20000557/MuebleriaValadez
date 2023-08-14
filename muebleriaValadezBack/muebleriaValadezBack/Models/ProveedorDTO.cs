using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
namespace muebleriaValadezBack.Models
{
    public class ProveedorDTO
    {

        [Key]
        public long IdProveedor { get; set; }
        public string nombreEmpresa { get; set; }

        public string informacionExtra { get; set; }
        public char estatus { get; set; }

        [ForeignKey("Persona")]

        public long IdPersona { get; set; }

        public Personas? Persona { get; set; }

    }

}
