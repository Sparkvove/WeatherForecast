using Newtonsoft.Json;
using WeatherApi.Helpers;
using WeatherApi.Models;
using WeatherApi.Services;

namespace WeatherApi.DAL
{
    public class WeatherForecastRepository : IWeatherForecastRepository
    {
        private readonly ILogger<IWeatherForecastRepository> _logger;
        private readonly IWeatherConverterService _weatherConverterService;

        public WeatherForecastRepository(ILogger<IWeatherForecastRepository> logger, IWeatherConverterService weatherConverterService)
        {
            _logger = logger;
            _weatherConverterService = weatherConverterService;
        }

        public async Task<WeatherForecast> GetAvgTempForCoordinates(Coordinates coordinates)
        {

            string url = $"forecast?latitude={coordinates.Latitude.ToString().Replace(",", ".")}&longitude={coordinates.Longitude.ToString().Replace(",", ".")}&hourly=temperature_2m";

            using(HttpResponseMessage response = await ApiHelper.ApiClient.GetAsync(url))
            {
                if (response.IsSuccessStatusCode)
                {
                    var responseBody = await response.Content.ReadAsStringAsync();
                    try
                    {
                        return _weatherConverterService.GetAverageDailyTemperature(responseBody);
                    }
                    catch
                    {
                        throw new Exception("Problem with Converting Data From OpenAPI");
                    }
                   
                }
                else
                {
                    throw new Exception(response.ReasonPhrase);
                }
            }
        }
    }
}
