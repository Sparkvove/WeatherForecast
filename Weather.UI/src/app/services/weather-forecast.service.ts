import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Coordinates } from '../models/coordinates';
import { WeatherForecast } from '../models/weather-forecast';

@Injectable({
  providedIn: 'root',
})
export class WeatherForecastService {
  private url = 'https://localhost:7171/api/WeatherForecast';
  constructor(private http: HttpClient) {}

  public getWeatherForecast(cords: Coordinates): Observable<WeatherForecast> {
    return this.http.post<WeatherForecast>(this.url, cords);
  }
}
