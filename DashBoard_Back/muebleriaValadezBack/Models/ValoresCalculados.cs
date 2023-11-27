using System.ComponentModel.DataAnnotations;

namespace DashBoardBack.Models
{
    public class ValoresCalculados
    {
        [Key]
        public int id { get; set; }
        public Double gross_profit { get; set; }
        public Double average_purchase_value { get; set; }
        public int total_users { get; set; }
        public int average_order_value { get; set; }
    }
}
