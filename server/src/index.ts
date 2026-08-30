import express from 'express';
import {
  calculateScore,
  hasListingMismatch,
  type Lead
} from './scoring.js';

const app = express();
const PORT = 3000;
// type VehicleStatus = 'available' | 'pending' | 'sold';
// type Lead = {name : string;
// vehicle : string;
// financingInterest: boolean;
// vehicleAvailable:boolean ;
// daysSinceInquiry: number ;
// daysSinceContact: number ;
// tradeInInterest:boolean; 
// inventoryStatus: VehicleStatus;
// websiteListed: boolean;}
const leads: Lead[] = [{
      name: 'Sarah Chen',
      vehicle: '2023 Porsche 911',
      financingInterest: true ,
      vehicleAvailable: true,
      daysSinceInquiry: 4,
      daysSinceContact: 1,
      tradeInInterest: false,
      inventoryStatus: 'available',
      websiteListed: true
},
    {
      name: 'James Patel',
      vehicle: '2022 Ferrari Roma',
      financingInterest: true ,
      vehicleAvailable: false,
      daysSinceInquiry: 3,
      daysSinceContact: 1,
      tradeInInterest: true,
      inventoryStatus: 'sold',
      websiteListed: true
    },

    {
      name: 'Maya Rodriguez',
      vehicle: '2021 Lamborghini Huracan EVO',
      financingInterest: false,
      vehicleAvailable: true,
      daysSinceInquiry: 3,
      daysSinceContact: 3,
      tradeInInterest: true,
      inventoryStatus: 'available',
    websiteListed: true },

];
// function calculateScore(leadItem: Lead): number {
//     let score = 0;
//     if(leadItem.financingInterest){
//         score = score + 20
//     }
//     if(leadItem.vehicleAvailable){
//       score = score + 20;
//     }
//     if(leadItem.tradeInInterest){
//       score = score + 15;
//     }
//     if(leadItem.daysSinceInquiry <= 1){
//       score = score + 10;
//     }
//     else if(leadItem.daysSinceInquiry <= 3){
//       score = score + 5
//     }
//     if(leadItem.daysSinceContact >= 3 &&
//       leadItem.daysSinceContact <= 5
//     ){
//       score = score + 10;
//     }
//     else if(
//       leadItem.daysSinceContact >= 6 &&
//       leadItem.daysSinceContact <= 10
//     ){
//       score = score + 5;
//     }
//     return score;
// }

// function hasListingMismatch(leadItem:Lead):boolean {
//     return(
//         leadItem.inventoryStatus === 'sold' &&
//         leadItem.websiteListed === true
//     );
// }

const scoredLeads = leads.map(
  (leadItem) => {
    return {
      ...leadItem,
      score: calculateScore(leadItem),
      listingMismatch: hasListingMismatch(leadItem)
    };
  }
);
scoredLeads.sort((a, b) => b.score - a.score);

app.get('/api/leads', (req, res) => {
  res.json(scoredLeads);
});

app.listen(PORT, () => {
    console.log(`DealerSignal API running on http://localhost:${PORT}`);
});