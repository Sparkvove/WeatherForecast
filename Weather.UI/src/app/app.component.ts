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
import { SaveFileService } from './services/save-file.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  weatherForecast!: WeatherForecast;
  isSaveButtonDisabled: boolean = true;
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
    private saveFileService: SaveFileService,
    private fb: FormBuilder
  ) {}

  public getForecast() {
    this.deleteCurrentChart();
    this.weatherForecastService
      .getWeatherForecast(this.Cooridnates.value)
      .subscribe((result: WeatherForecast) => {
        this.weatherForecast = result;
        this.createChart(this.Cooridnates.value, result);
        this.isSaveButtonDisabled = false;
      });
  }

  public getLocation() {
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

  public createChart(cords: Coordinates, weatherForecast: WeatherForecast) {
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

  public deleteCurrentChart() {
    let chartStatus = Chart.getChart('chart');
    if (chartStatus != undefined) {
      chartStatus.destroy();
    }
  }

  public saveFile(): void {
    const dlink: HTMLAnchorElement = document.createElement('a');
    dlink.download = this.saveFileService.createFileName(this.weatherForecast);
    dlink.href =
      'data:text/plain;charset=utf-16,' +
      this.saveFileService.populateFileData(this.weatherForecast);
    dlink.click(); // this will trigger the dialog window
    dlink.remove();
  }
}
