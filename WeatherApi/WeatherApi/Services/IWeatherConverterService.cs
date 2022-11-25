using WeatherApi.Models;

namespace WeatherApi.Services
{
    public interface IWeatherConverterService
    {
        public WeatherForecast GetAverageDailyTemperature(string weatherForecast);
    }
}
