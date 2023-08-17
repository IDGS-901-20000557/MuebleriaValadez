using System.ComponentModel.DataAnnotations;

namespace DashBoardBack.Models
{
    public class VentasMensuales
    {
        [Key]
        public int id { get; set; }
        public int year { get; set; }
        public string month { get; set; }
        public int total_vendido { get; set; }
    }
}
