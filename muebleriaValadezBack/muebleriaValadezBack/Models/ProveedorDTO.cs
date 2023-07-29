using System.ComponentModel.DataAnnotations;

namespace muebleriaValadezBack.Models
{
    public class ProveedorDTO
    {
        [Key]
        public long IdProveedor { get; set; }
        public string nombreEmpresa { get; set; }
        public string informacionExtra { get; set; }
        public char estatus { get; set; }
    }

}
