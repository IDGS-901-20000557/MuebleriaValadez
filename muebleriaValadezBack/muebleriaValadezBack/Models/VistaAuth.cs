using System.ComponentModel.DataAnnotations;

namespace muebleriaValadezBack.Models
{
    public class VistaAuth
    {
        [Key]
        public long idUsuario { get; set; }
        public String email { get; set; }
        public long idPersona { get; set; }
        public String nombres { get; set; }
        public String apellidoPaterno { get; set; }
        public String apellidoMaterno { get; set; }
        public String telefono  { get; set; }
        public String rfc  { get; set; }
        public String sucursal  { get; set; }
        public long idDireccionSucursal { get; set; }
        public String rol { get; set; }
        public long idRol { get; set; }



    }
}
