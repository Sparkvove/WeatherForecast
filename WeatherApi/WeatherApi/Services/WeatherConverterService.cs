using Newtonsoft.Json;
using System.Linq;
using WeatherApi.Models;

namespace WeatherApi.Services
{
    public class WeatherConverterService : IWeatherConverterService
    {
        public WeatherForecast GetAverageDailyTemperature(string weatherForecast)
        {
            return ConvertWeather(weatherForecast);
        }

        private WeatherForecast ConvertWeather(string weatherForecast)
        {
            WeatherForecast? deserializedObject;


           deserializedObject = JsonConvert.DeserializeObject<WeatherForecast>(FormatToCorrectJsonString(weatherForecast));

            WeatherForecast averageDaily = new();

            // +24 beacuse there is 24hours in a day, we retriving data hourly. - converting to daily
            for (var index = 0;index< deserializedObject?.Time.Count(); index+=24)
            {
                // already formating to get yyyy-mm-dd format
                averageDaily.Time.Add(deserializedObject.Time.ElementAt(index).Split("T")[0]);
                averageDaily.Temperature.Add(CalculateDailyTemp(deserializedObject, index));
            }

            return averageDaily;
        }

        private string FormatToCorrectJsonString(string value)
        {
            int searchIndex = value.IndexOf("\"hourly\"");
            string weather = value.Substring(searchIndex + 11);
            // a lot of replaces to convert retriving string, to string convertable to object
            string replaced = weather.Replace("\\", " ").Replace("\"", " ").Replace("[", "[\"").Replace("]", "\"]")
                .Replace(",", "\",\"").Replace("time", "\"time\"").Replace("\",\" temperature_2m", ", \"temperature\"").Replace("}}}}", "}").Replace(" ", "");
            string jsonString = $"{{{replaced}".Replace("}}", "}");

            return jsonString;
        }

        private float CalculateDailyTemp(WeatherForecast weatherForecast, int currentDayIndex)
        {
            float averageTemp = 0;
            // +24 beacuse there is 24hours in a day, we retriving data hourly. - converting to daily
            for (var i = 0; i < 24; i++)
            {
                averageTemp += weatherForecast.Temperature.ElementAt(currentDayIndex + i);
            }

            return averageTemp/24;
        }
    }
}
