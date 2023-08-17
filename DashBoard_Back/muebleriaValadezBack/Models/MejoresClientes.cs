using System.ComponentModel.DataAnnotations;

namespace DashBoardBack.Models
{
    public class MejoresClientes
    {
        [Key]
        public int idClient { get; set; }
        public string fullName { get; set; }
        public int total { get; set; }
    }
}
