using System.ComponentModel.DataAnnotations;

namespace DashBoardBack.Models
{
    public class Productos
    {
        [Key]
        public int idProducto { get; set; }
        public string nombre { get; set; }
        public int cantidad { get; set; }
        public Double costo { get; set; }
        public Double total_obtenido { get; set; }

    }
}
