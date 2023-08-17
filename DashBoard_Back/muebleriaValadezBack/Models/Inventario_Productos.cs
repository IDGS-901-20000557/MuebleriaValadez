using System.ComponentModel.DataAnnotations;

namespace DashBoardBack.Models
{
    public class Inventario_Productos
    {
        [Key]
        public int id { get; set; }
        public string nameProduct { get; set; }
        public int quantityAvailable { get; set; }
    }
}
