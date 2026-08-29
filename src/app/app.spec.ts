import { TestBed } from '@angular/core/testing';
import { App } from './app';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render title', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('DealerSignal');
  });
  it('should calculate Maya lead score as 50', () => {
  const fixture = TestBed.createComponent(App);
  const app = fixture.componentInstance;

  const lead = {
    name: 'Maya Rodriguez',
    vehicle: '2021 Lamborghini Huracan EVO',
    financingInterest: false,
    vehicleAvailable: true,
    daysSinceInquiry: 3,
    daysSinceContact: 3,
    tradeInInterest: true
  };

  const result = app.calculateScore(lead);

  expect(result).toBe(50);
});
  it('should return 0 when no scoring signals apply', () => { 
  const fixture = TestBed.createComponent(App);
  const app = fixture.componentInstance;
    const lead = {  
  name: 'Test Lead',
    vehicle: 'Test Vehicle',
    financingInterest: false,
    vehicleAvailable: false,
    daysSinceInquiry: 10,
    daysSinceContact: 11,
    tradeInInterest: false
  };

  const result = app.calculateScore(lead);

  expect(result).toBe(0);
});
});