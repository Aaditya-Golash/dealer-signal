import { calculateScore, hasListingMismatch, type Lead } from './scoring.js';
import { describe, it, expect } from 'vitest';

describe('DealerSignal business logic', () => {

  it('detects a sold vehicle that is still listed', () => {
    const soldLead: Lead = {
      name: 'Test Customer',
      vehicle: '2022 Ferrari Roma',
      financingInterest: false,
      vehicleAvailable: false,
      daysSinceInquiry: 3,
      daysSinceContact: 1,
      tradeInInterest: false,
      inventoryStatus: 'sold',
      websiteListed: true,
      stockNumber: 'TEST-001',
      priceCad: null,
      odometerKm: 0,
    };

    expect(hasListingMismatch(soldLead)).toBe(true);
  });

  it('does not flag an available vehicle that is still listed', () => {
    const availableLead: Lead = {
      name: 'Test Customer',
      vehicle: '2023 Porsche 911',
      financingInterest: false,
      vehicleAvailable: true,
      daysSinceInquiry: 3,
      daysSinceContact: 1,
      tradeInInterest: false,
      inventoryStatus: 'available',
      websiteListed: true,
      stockNumber: 'TEST-001',
      priceCad: null,
      odometerKm: 0,
    };

    expect(hasListingMismatch(availableLead)).toBe(false);
  });

  it('returns 0 when a lead has no scoring signals', () => {
    const zeroScoreLead: Lead = {
      name: 'Zero Score Customer',
      vehicle: 'Test Vehicle',
      financingInterest: false,
      vehicleAvailable: false,
      daysSinceInquiry: 10,
      daysSinceContact: 11,
      tradeInInterest: false,
      inventoryStatus: 'available',
      websiteListed: true,
      stockNumber: 'TEST-001',
      priceCad: null,
      odometerKm: 0,
    };

    expect(calculateScore(zeroScoreLead)).toBe(0);
  });

  it('adds the follow-up bonus at exactly 3 days since contact', () => {
    const boundaryLead: Lead = {
      name: 'Boundary Customer',
      vehicle: 'Test Vehicle',
      financingInterest: false,
      vehicleAvailable: false,
      daysSinceInquiry: 10,
      daysSinceContact: 3,
      tradeInInterest: false,
      inventoryStatus: 'available',
      websiteListed: true,
      stockNumber: 'TEST-001',
      priceCad: null,
      odometerKm: 0,
    };

    expect(calculateScore(boundaryLead)).toBe(10);
  });

  it('combines multiple scoring signals correctly', () => {
    const combinedLead: Lead = {
      name: 'Combined Score Customer',
      vehicle: 'Test Vehicle',
      financingInterest: true,
      vehicleAvailable: true,
      daysSinceInquiry: 3,
      daysSinceContact: 3,
      tradeInInterest: true,
      inventoryStatus: 'available',
      websiteListed: true,
      stockNumber: 'TEST-001',
      priceCad: null,
      odometerKm: 0,
    };

    expect(calculateScore(combinedLead)).toBe(70);
  });

});