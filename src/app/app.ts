import { Component, signal, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HttpClient } from '@angular/common/http';

type Lead = {
  name: string;
  vehicle: string;
  financingInterest: boolean;
  vehicleAvailable: boolean;
  daysSinceInquiry: number;
  daysSinceContact: number;
  tradeInInterest: boolean;
  inventoryStatus: 'available' | 'pending' | 'sold';
  websiteListed: boolean;
  score: number;
  listingMismatch: boolean;
};

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('DealerSignal');
  private readonly http = inject(HttpClient);
  protected leads: Lead[] = []; 
  loadLeads() {
  return this.http.get<Lead[]>('http://localhost:3000/api/leads');
}
constructor() {
  this.loadLeads().subscribe((data) => {
    this.leads = data;
  });
}
    //{
//       name: 'Sarah Chen',
//       vehicle: '2023 Porsche 911',
//       financingInterest: true ,
//       vehicleAvailable: true,
//       daysSinceInquiry: 4,
//       daysSinceContact: 1,
//       tradeInInterest: false


//     },
//     {
//       name: 'James Patel',
//       vehicle: '2022 Ferrari Roma',
//       financingInterest: true ,
//       vehicleAvailable: false,
//       daysSinceInquiry: 3,
//       daysSinceContact: 1,
//       tradeInInterest: true
//     },
//     {
//       name: 'Maya Rodriguez',
//       vehicle: '2021 Lamborghini Huracan EVO',
//       financingInterest: false,
//       vehicleAvailable: true,
//       daysSinceInquiry: 3,
//       daysSinceContact: 3,
//       tradeInInterest: true
// } 
//   ];

  // calculateScore(leadItem: Lead ) {
  //   let score = 0;

  //   if(leadItem.financingInterest){
  //     score = score + 20;
  //   }
  //   if(leadItem.vehicleAvailable){
  //     score = score + 20;
  //   }
  //   if(leadItem.tradeInInterest){
  //     score = score + 15;
  //   }
  //   if(leadItem.daysSinceInquiry <= 1){
  //     score = score + 10;
  //   }
  //   else if(leadItem.daysSinceInquiry <= 3){
  //     score = score + 5
  //   }
  //   if(leadItem.daysSinceContact >= 3 &&
  //     leadItem.daysSinceContact <= 5
  //   ){
  //     score = score + 10;
  //   }
  //   else if(
  //     leadItem.daysSinceContact >= 6 &&
  //     leadItem.daysSinceContact <= 10
  //   ){
  //     score = score + 5;
  //   }
  //   return score;
  // }

  getPriorityScore(score: number){
    if(score>=50){
      return 'High';
    }
    else if(score>= 35){
      return 'Medium';
    }
    else {
    return 'Low';
  }
  }

  // getSortedLeads(){
  //   const copiedLeads = [...this.leads];
  //   copiedLeads.sort(
  //     (a,b) => this.calculateScore(b) - this.calculateScore(a)
  //   );
  //   return copiedLeads;
  // }
}
