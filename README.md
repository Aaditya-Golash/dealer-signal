# DealerSignal

Lead prioritization and inventory exception detection for a luxury dealership sales floor.

**Live demo:** https://dealersignal-14f5c.web.app/

DealerSignal answers two operational questions:

> Who should a salesperson follow up with next?

> Is the vehicle that customer asked about still actually available?

---

## Why I Built It

I built DealerSignal for my VaultDrive × August Luxury Motorcars application rather than submitting another generic portfolio project.

I wanted to take one dealership workflow and build the full loop around it.

Two problems shaped the scope.

**Lead attention changes over time.** A customer interested in financing, a trade-in, or an available vehicle may deserve more immediate follow-up than another lead. But that priority should also change after a salesperson actually contacts them.

**Inventory state can drift between systems.** If a vehicle is marked sold internally while still appearing as active publicly, a salesperson can follow up with a customer about a car that is no longer available.

DealerSignal models both problems. It ranks leads by current attention priority and flags a lead when internal inventory state disagrees with the modeled public listing state.

---

## The Product Loop

```text
Lead enters queue
      ↓
Backend evaluates engagement and inventory signals
      ↓
Lead receives an attention-priority score
      ↓
Salesperson sees prioritized queue
      ↓
Salesperson contacts a customer
      ↓
Log Contact
      ↓
Backend updates contact state
      ↓
Scores are recalculated
      ↓
Updated queue is returned to the frontend
```

Clicking **Log Contact** sends a PATCH request to the API.

The backend updates that lead's `daysSinceContact`, recalculates the scoring rules, sorts the queue again, and returns the refreshed lead list.

The browser does not calculate the score itself.

---

## Scoring

Scoring is deterministic and lives on the server.

| Signal | Points |
| --- | ---: |
| Financing interest | +20 |
| Vehicle available | +20 |
| Trade-in interest | +15 |
| Inquiry within 1 day | +10 |
| Inquiry within 3 days | +5 |
| Last contact 3–5 days ago | +10 |
| Last contact 6–10 days ago | +5 |

Priority levels:

- **High:** 50+
- **Medium:** 35–49
- **Low:** Below 35

The score represents **current attention priority**, not purchase probability.

For example, a customer who is currently due for follow-up can receive additional priority. Once contact is logged, that follow-up urgency is removed and the queue is recalculated.

### Why Rules Instead of a Predictive Model?

A useful predictive lead model needs historical outcomes.

You would want real examples of won and lost opportunities tied to the signals that preceded those outcomes before claiming a model can predict conversion better than a transparent heuristic.

This prototype does not have that dataset, so using machine learning here would create the appearance of intelligence without enough evidence to justify it.

Starting with explicit rules has two advantages:

1. Salespeople can understand why a lead received its priority.
2. The rules provide a measurable baseline that a future predictive model would need to outperform.

A production system could eventually capture contact events, score history, and deal outcomes to create the training data required for that next step.

---

## Inventory Exception Detection

DealerSignal also models an inventory synchronization failure.

A lead can reference a vehicle whose internal status is:

```text
sold
```

while its modeled website state is still:

```text
active
```

DealerSignal detects that disagreement and surfaces an **Inventory Exception** so the listing can be verified before a salesperson continues customer follow-up.

The Ferrari Roma mismatch in the demo is deliberately seeded to demonstrate this workflow.

It is **not** a claim that August Luxury Motorcars currently has an incorrect public listing.

In a production system, inventory reconciliation would ideally be triggered by inventory events rather than waiting for someone to load the sales dashboard.

---

## Architecture

```text
Angular 20 Frontend
        |
        | GET /api/leads
        | PATCH /api/leads/:name/contact
        v
Node.js + Express API
        |
        v
Scoring + Inventory Rules
        |
        v
In-Memory Lead State
```

### Frontend

- Angular 20
- TypeScript
- HttpClient
- Responsive custom CSS
- Firebase Hosting

The frontend is responsible for presentation and user actions.

It does not independently calculate lead scores.

### Backend

- Node.js
- Express
- TypeScript
- Vitest
- Render

The backend owns:

- Lead state
- Scoring rules
- Inventory mismatch detection
- Queue ordering
- Contact-state updates

Keeping those rules on the server gives the system one source of truth.

If scoring were duplicated in the browser, every future client would need to reproduce the same rules and those implementations could drift apart.

---

## Where to Look

`server/src/scoring.ts`

Contains the core scoring and inventory-mismatch business rules.

`server/src/index.ts`

Handles API routes, current lead state, and request orchestration.

`server/src/scoring.test.ts`

Contains Vitest coverage for the scoring and mismatch rules.

```text
dealer-signal/
├── src/
│   └── app/
│       ├── app.ts
│       ├── app.html
│       └── app.css
│
├── server/
│   └── src/
│       ├── index.ts
│       ├── scoring.ts
│       └── scoring.test.ts
│
├── firebase.json
└── README.md
```

---

## API

### Get the Lead Queue

```http
GET /api/leads
```

Returns the currently scored and sorted lead queue.

### Log Customer Contact

```http
PATCH /api/leads/:name/contact
```

Updates the selected lead's contact state, recalculates the queue, sorts it again, and returns the refreshed lead list.

---

## Running Locally

### Frontend

From the repository root:

```bash
npm install
npm start
```

Angular runs at:

```text
http://localhost:4200
```

### Backend

In a second terminal:

```bash
cd server
npm install
npx tsx src/index.ts
```

The Express API runs at:

```text
http://localhost:3000
```

> The deployed frontend currently targets the hosted Render API. The local backend can be run and tested independently.

---

## Testing

From the `server` directory:

```bash
npx vitest run
```

Run the TypeScript compiler without emitting files:

```bash
npx tsc --noEmit
```

Verify the Angular production build:

```bash
npm run build
```

---

## Current Scope

DealerSignal is intentionally a vertical-slice prototype rather than a production dealership platform.

Current limitations:

- Lead state is stored in memory.
- State resets when the backend restarts or redeploys.
- Customer records are synthetic.
- Vehicle examples are used to demonstrate the workflow.
- No authentication or role-based access control.
- No persistent database.
- No live CRM or DMS integration.
- No background workers or queues.
- Inventory synchronization is modeled rather than connected to a live inventory feed.
- No historical contact-event or score log.
- Lead scoring is deterministic and is not presented as AI or machine learning.

---

## What I Would Build Next

The next steps deliberately mirror parts of VaultDrive's published technology direction without pretending they exist in this prototype today.

### 1. PostgreSQL for Persistent State

Move leads, vehicles, and customer activity into persistent tables.

Instead of representing contact history only as a mutable `daysSinceContact` value, store contact events as an append-only activity history.

That would allow:

- Auditing
- Reconstructing score history
- Sales activity reporting
- Future model training

### 2. Event-Driven Inventory Reconciliation

Connect DMS and CRM inventory events to the API.

Events could be placed onto **BullMQ backed by Redis**, allowing workers to process inventory reconciliation outside the request path.

For example:

```text
Vehicle marked sold
      ↓
Inventory event
      ↓
Queue
      ↓
Worker
      ↓
Reconcile public/internal state
      ↓
Re-evaluate affected leads
```

### 3. Identity Resolution

Real dealership customer data can contain duplicate customers, inconsistent contact information, and inconsistent vehicle identifiers.

Those records need to be reconciled before scoring becomes trustworthy.

### 4. SLA and Value-Aware Prioritization

The current score treats attention priority primarily as a function of engagement and availability.

A production system could also incorporate:

- Vehicle value
- Lead source
- Sales-stage progression
- Time without salesperson action
- Manager-defined service levels

A high-priority lead that remains untouched beyond an SLA could escalate rather than simply remaining near the top of the queue.

### 5. Automatic Activity Capture

Manual **Log Contact** is useful for demonstrating the state transition.

In production, calls, emails, and messages should ideally be captured automatically through CRM and communications integrations.

Otherwise the scoring system is only as accurate as the activity salespeople remember to enter.

### 6. Predictive Scoring

Once enough historical activity and deal outcomes exist, the deterministic score becomes:

- A baseline
- A feature source
- A benchmark for evaluating a predictive model

A model should only replace or augment the rules if it can demonstrate better decision quality on real dealership outcomes.

---
## About Me

I am a recent computer science graduate from UBCO who enjoys building and shipping software, especially systems where product decisions, architecture, and implementation are tightly connected.

I am particularly interested in fast-moving engineering environments, AI-assisted development, and end-to-end product work. I may be earlier in my career than the title suggests, but I learn quickly, move fast, and am comfortable taking ownership of unfamiliar technical problems.

I am BIG car nerd. This is part of why I chose to build DealerSignal around a real dealership workflow rather than a generic portfolio project.

Having studied and worked in Kelowna, I am familiar with the city and the UBC Okanagan environment and would be excited to build something long term in the region.I am also genuinely interested in cars and the automotive industry. My favourite car is the red Mercedes-Benz 300 SL Gullwing, which is part of why building something around a luxury dealership workflow felt especially natural to me.

This opportnity particularly excites me because it would allow me to combine both my nerdy interests together builiding software and cars.

---

## Why the Scope Is Small

I could have added a form for manually creating leads.

I deliberately did not.

In a real dealership environment, leads would primarily arrive through websites, marketplaces, CRM systems, and other integrations. A manual CRUD form would demonstrate another form workflow without addressing the harder product question.

Instead, I focused on one complete operational loop:

**detect → prioritize → act → update → reprioritize**

That kept the project narrow enough to finish while still exercising frontend state, API design, backend business logic, testing, deployment, and product reasoning.
