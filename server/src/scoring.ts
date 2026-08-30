export type VehicleStatus = 'available' | 'pending' | 'sold';

export type Lead = {
  name: string;
  vehicle: string;
  financingInterest: boolean;
  vehicleAvailable: boolean;
  daysSinceInquiry: number;
  daysSinceContact: number;
  tradeInInterest: boolean;
  inventoryStatus: VehicleStatus;
  websiteListed: boolean;
};

export function calculateScore(leadItem: Lead): number {
    let score = 0;
    if(leadItem.financingInterest){
        score = score + 20
    }
    if(leadItem.vehicleAvailable){
      score = score + 20;
    }
    if(leadItem.tradeInInterest){
      score = score + 15;
    }
    if(leadItem.daysSinceInquiry <= 1){
      score = score + 10;
    }
    else if(leadItem.daysSinceInquiry <= 3){
      score = score + 5
    }
    if(leadItem.daysSinceContact >= 3 &&
      leadItem.daysSinceContact <= 5
    ){
      score = score + 10;
    }
    else if(
      leadItem.daysSinceContact >= 6 &&
      leadItem.daysSinceContact <= 10
    ){
      score = score + 5;
    }
    return score;
}

export function hasListingMismatch(leadItem: Lead): boolean {
  return (
    leadItem.inventoryStatus === 'sold' &&
    leadItem.websiteListed === true
  );
}