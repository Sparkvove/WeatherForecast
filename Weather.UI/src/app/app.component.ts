import { Component } from '@angular/core';
import { WeatherForecast } from './models/weather-forecast';
import { WeatherForecastService } from './services/weather-forecast.service';
import { Chart, registerables } from 'node_modules/chart.js';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import { Coordinates } from './models/coordinates';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  Cooridnates: FormGroup = this.fb.group({
    Latitude: new FormControl('', [
      Validators.required,
      // float numbers regex
      Validators.pattern('[+-]?([0-9]*[.])?[0-9]+'),
    ]),
    Longitude: new FormControl('', [
      Validators.required,
      Validators.pattern('[+-]?([0-9]*[.])?[0-9]+'),
    ]),
  });

  constructor(
    private weatherForecastService: WeatherForecastService,
    private fb: FormBuilder
  ) {}

  getForecast() {
    this.deleteCurrentChart();
    this.weatherForecastService
      .getWeatherForecast(this.Cooridnates.value)
      .subscribe((result: WeatherForecast) => {
        this.createChart(this.Cooridnates.value, result);
      });
  }

  getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position: any) => {
          if (position) {
            this.Cooridnates.patchValue({
              Latitude: position.coords.latitude,
              Longitude: position.coords.longitude,
            });
          }
        },
        (error: any) => console.log(error)
      );
    } else {
      alert('Geolocation is not supported by this browser.');
    }
  }

  createChart(cords: Coordinates, weatherForecast: WeatherForecast) {
    Chart.register(...registerables);
    var chart = new Chart('chart', {
      type: 'line',
      data: {
        labels: weatherForecast.time,
        datasets: [
          {
            label:
              'Weather Forecast for Lat:' +
              cords.Latitude +
              ' Long:' +
              cords.Longitude,
            data: weatherForecast.temperature,
            borderWidth: 1,
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  }

  deleteCurrentChart() {
    let chartStatus = Chart.getChart('chart');
    if (chartStatus != undefined) {
      chartStatus.destroy();
    }
  }
}
