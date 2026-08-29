import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

type Lead = {
  name: string;
  vehicle: string;
  financingInterest: boolean;
  vehicleAvailable: boolean;
  daysSinceInquiry: number;
  daysSinceContact: number;
  tradeInInterest: boolean;
};

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('DealerSignal');
  protected readonly leads: Lead[] = [ 
    {
      name: 'Sarah Chen',
      vehicle: '2023 Porsche 911',
      financingInterest: true ,
      vehicleAvailable: true,
      daysSinceInquiry: 1,
      daysSinceContact: 4,
      tradeInInterest: false


    },
    {
      name: 'James Patel',
      vehicle: '2022 Ferrari Roma',
      financingInterest: true ,
      vehicleAvailable: false,
      daysSinceInquiry: 3,
      daysSinceContact: 1,
      tradeInInterest: true
    }
  ];

  calculateScore(leadItem: Lead ) {
    let score = 0;

    if(leadItem.financingInterest){
      score = score + 20;
    }
    if(leadItem.vehicleAvailable){
      score = score + 20;
    }
    if(leadItem.tradeInInterest){
      score = score + 15;
    }
    return score;
  }
}
