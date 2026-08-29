import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('DealerSignal');
  protected readonly lead = {
    name : 'Sarah Chen',
    vehicle: '2023 Porsche 911',
    daysSinceContact: 4,
    financingInterest: true ,
    vehicleAvailable: true
  };
  protected readonly leadNames = [
    'Sarah Chen',
    'James Patel',
    'Maya Rodriguez'
  ];
  protected readonly leads = [ 
    {
      name: 'Sarah Chen',
      vehicle: '2023 Porsche 911'

    },
    {
      name: 'James Patel',
      vehicle: '2022 Ferrari Roma'
    }
  ];

  calculateScore(){
    let score = 0;

    if(this.lead.financingInterest){
      score = score + 20;
    }
    if(this.lead.vehicleAvailable){
      score = score + 20;
    }
    return score;
  }
}
