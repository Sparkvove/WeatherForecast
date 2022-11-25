import { Injectable } from '@angular/core';
import { WeatherForecast } from '../models/weather-forecast';

@Injectable({
  providedIn: 'root',
})
export class SaveFileService {
  constructor() {}

  public createFileName(weatherForecast: WeatherForecast): string {
    let fileName =
      'weatherForecast[' +
      weatherForecast.time[0] +
      ' - ' +
      weatherForecast.time[weatherForecast.time.length - 1] +
      '].txt';

    return fileName;
  }

  public populateFileData(weatherForecast: WeatherForecast): string {
    let data: string = '';
    for (let i = 0; i < weatherForecast.temperature.length; i++) {
      data +=
        weatherForecast.time[i] + ' : ' + weatherForecast.temperature[i] + ' ';
    }
    return data;
  }
}
