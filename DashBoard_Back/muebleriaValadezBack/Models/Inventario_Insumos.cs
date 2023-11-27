using System.ComponentModel.DataAnnotations;

namespace DashBoardBack.Models
{
    public class Inventario_Insumos
    {
        [Key]
        public int id { get; set; }
        public string nameIngredient { get; set; }
        public int quantityAvailable { get; set; }
    }
}
