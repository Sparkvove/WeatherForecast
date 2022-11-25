using Microsoft.AspNetCore.Mvc;
using WeatherApi.DAL;
using WeatherApi.Models;

namespace WeatherApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class WeatherForecastController : ControllerBase
    {
 
        private readonly ILogger<WeatherForecastController> _logger;
        private readonly IWeatherForecastRepository _weatherForecastRepository;

        public WeatherForecastController(ILogger<WeatherForecastController> logger, IWeatherForecastRepository weatherForecastRepository)
        {
            _logger = logger;
            _weatherForecastRepository = weatherForecastRepository;
        }

        [HttpPost(Name = "GetAvgTempForCoordinates")]
        public async Task<IActionResult> GetAvgTempForCoordinates(Coordinates coordinates)
        { 
           return Ok(await _weatherForecastRepository.GetAvgTempForCoordinates(coordinates));
        }
    }
}