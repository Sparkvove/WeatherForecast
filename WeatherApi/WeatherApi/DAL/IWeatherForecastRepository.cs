using WeatherApi.Models;

namespace WeatherApi.DAL
{
    public interface IWeatherForecastRepository
    {
        public Task<WeatherForecast> GetAvgTempForCoordinates(Coordinates coordinates);
    }
}
