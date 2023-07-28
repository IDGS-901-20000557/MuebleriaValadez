using Microsoft.AspNetCore.Mvc;

namespace muebleriaValadezBack.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProveedorController : ControllerBase
    {
        private readonly AppDbContext _context;
        public ProveedorController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet(Name = "GetAllProveedores")] // api/<Proveedores> GET ALL
        public IActionResult Get()
        {
            try
            {
                return Ok(_context.Proveedor.ToList());

            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

    }
}
