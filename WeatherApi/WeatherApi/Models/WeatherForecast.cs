namespace WeatherApi.Models
{
    public class WeatherForecast
    {
        public List<float> Temperature { get; set; }
        public List<string> Time { get; set; }

        public WeatherForecast()
        {
            Temperature = new List<float>();
            Time = new List<string>();
        }
    }
}
