using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace muebleriaValadezBack.Models
{
    //integracion del proyecto
    public class ClienteDirecciones
    {
        [Key]
        public long idCliente_Direccion { get; set; }

        [ForeignKey("cliente")]

        public long idCliente { get; set; }

        [ForeignKey("direccion")]
        public long idDireccion { get; set; }
        
        public Cliente? cliente { get; set; }

        public Direccion? direccion { get; set; }
    }
}
