

## File: 80-days-day-01/README.md

```md
# Day 1: Understanding The Data

## What We're Building With

> *"Follow the money. Every startup that raises venture capital leaves a paper trail—and that trail leads straight to the SEC."*

## What is SEC Form D?

**Form D** is a notice that U.S. companies must file with the Securities and Exchange Commission (SEC) within **15 days** of raising private capital from investors. Think of it as the government's registry of who's raising money, how much, and when.

### The Law in Plain English:

When a startup raises money from VCs or angel investors, they have two choices:
1. **Register publicly** like an IPO (expensive, complex, public disclosure)
2. **Claim an exemption** under Regulation D (simpler, stays private)

Nearly **every VC-backed startup** in America chooses option 2 and files Form D to document the exemption.

## Why This Data is Gold for Visa Sponsorship

**The Simple Truth:** Companies that just raised $5M+ have money. Companies with money can afford to:
- Hire new employees
- Pay visa sponsorship fees ($5K-$10K)
- Navigate immigration paperwork
- Take risks on H1B lottery

**But here's the problem:** These companies don't show up on traditional job boards with "visa sponsorship" tags. They're growing quietly, building teams, and often overlooked by visa holders searching on LinkedIn or Indeed.

**That's where we come in.** We're turning SEC filings into job leads.

## What Information Form D Contains

Every Form D filing gives us:

### Company Identity
- **Legal name** - Exact company name
- **Location** - City and state (Boston biotech? SF AI startup?)
- **Year incorporated** - How new/established they are
- **Industry group** - Biotech, software, medical devices, etc.

### Funding Details
- **Total offering amount** - How much they're trying to raise
- **Amount sold** - How much they've actually raised (the key number!)
- **Amount remaining** - Is the round still open?
- **Date of first sale** - When did money start flowing?

### Investor Information
- **Number of investors** - 3 investors = institutional VCs, 50+ = party round
- **Exemption type** - 506(b) vs 506(c) (tells us their strategy)

### Leadership
- **Executive officers** - The founders and C-suite
- **Directors** - Board members (often includes VC partners!)
- **Names and titles** - Direct contact points

## Why This is Better Than Alternatives

| Feature | Form D (Free) | Crunchbase ($99/mo) | LinkedIn | AngelList |
|---------|---------------|---------------------|----------|-----------|
| **Cost** | $0 | $99/month | $0 | $0 |
| **Funding amounts** | ✅ Exact | ✅ Exact | ❌ Approximate | ❌ Varies |
| **Recency** | ✅ 15 days | ⚠️ Delayed | ❌ No data | ⚠️ Self-reported |
| **Completeness** | ✅ All US companies | ⚠️ Curated subset | ❌ No financial | ⚠️ Opt-in only |
| **Official source** | ✅ Government | ❌ Aggregated | ❌ User-generated | ❌ Self-reported |
| **Founder names** | ✅ Yes | ⚠️ Sometimes | ✅ Yes | ⚠️ Sometimes |
| **Investor count** | ✅ Yes | ⚠️ Sometimes | ❌ No | ❌ No |

**Bottom line:** Form D is the **most complete, most current, most reliable** source of startup funding data in America. And it's completely free.

## Accessing the Data

### Main Portal
🔗 **https://www.sec.gov/data-research/sec-markets-data/form-d-data-sets**

### Direct Download Format
```
https://www.sec.gov/files/structureddata/data/form-d-data-sets/[YEAR]q[QUARTER]_d.zip
```

### For Our Week 1 MVP (Last 9 Months)

**2025 Q1** (Jan-Mar 2025)  
https://www.sec.gov/files/structureddata/data/form-d-data-sets/2025q1_d.zip

**2024 Q4** (Oct-Dec 2024)  
https://www.sec.gov/files/structureddata/data/form-d-data-sets/2024q4_d.zip

**2024 Q3** (Jul-Sep 2024)  
https://www.sec.gov/files/structureddata/data/form-d-data-sets/2024q3_d.zip

**2024 Q2** (Apr-Jun 2024)  
https://www.sec.gov/files/structureddata/data/form-d-data-sets/2024q2_d.zip

## What's Inside Each Zip File

When you download a quarterly file, you get:

```
2024q4_d.zip
├── OFFERING.tsv          # Main company/offering data
├── SIGNATURES.tsv        # Who signed the filing
├── PRIMARY_ISSUER.tsv    # Company details
├── RELATED_PERSONS.tsv   # Founders, executives, directors
├── SUBMISSION.tsv        # Filing metadata
└── [XML files/]          # Raw filings (if you want them)
```

**The TSV files are already parsed!** You don't have to deal with XML unless you want to. The SEC has done the heavy lifting for us.

## Data Coverage & Quality

### Historical Coverage
- **Start date:** 2008 (17 years of data!)
- **Update frequency:** Quarterly
- **Total filings:** ~2 million+ Form D submissions
- **Cost:** FREE (no API key, no limits)

### What We'll Find for Week 1

Based on typical quarterly patterns:

**Expected in 3 quarters (Q2-Q4 2024, Q1 2025):**
- ~40,000-50,000 total Form D filings
- ~500-700 biotech companies nationwide
- **~200-300 in Boston/SF/NYC with $5M+ funding**

**Industries well-represented:**
- ✅ Biotechnology (our focus!)
- ✅ Pharmaceutical  
- ✅ Medical devices
- ✅ Software/AI
- ✅ Financial services
- ✅ Real estate funds

### Data Limitations (Important!)

What Form D **DOES NOT** give us:
- ❌ Job openings (we'll scrape career pages - Day 3)
- ❌ Company websites (we'll infer/search - Day 2)
- ❌ Employee headcount (we'll estimate from funding/age)
- ❌ Company descriptions (we'll scrape websites - Day 2)
- ❌ Email addresses (we'll find on LinkedIn - Day 4)
- ❌ Post-money valuation (we can infer from amount/stage)

**But that's okay!** Form D gives us the **foundation**: who raised money, how much, and when. We'll enrich it with other free sources.

## The Filing Timeline

Understanding when companies file helps us prioritize:

```
Day 0:  Company closes funding round (wires money)
Day 1:  Starts hiring (they have cash now!)
↓
Day 15: MUST file Form D with SEC (legally required)
↓
Day 16-30: SEC processes and publishes data
↓
Day 31-90: Appears in quarterly bulk download
↓
Day 91: WE find them and add to our database!
```

**The sweet spot:** Companies that filed 1-6 months ago are actively hiring but haven't been picked over yet.

## Why Companies File Form D

This isn't optional—it's federal law:

**Securities Act of 1933** says:
- You can't sell securities without registering them with the SEC
- **UNLESS** you claim an exemption (Regulation D)
- To claim the exemption, you **must** file Form D within 15 days
- Penalty for not filing: Up to $10,000 + potential loss of exemption

**Translation:** If a company raised VC money, they filed Form D. It's not a suggestion—it's the law.

## Real Example: What We Can Learn

Let's decode a real Form D filing:

**Company:** BioTech Therapeutics Inc  
**CIK:** 0001234567  
**Location:** Boston, MA  
**Amount sold:** $15,000,000  
**Investors:** 3  
**Date:** October 15, 2024  
**Exemption:** Rule 506(b)  

**What this tells us:**

✅ **Recently funded** (3 months ago) = actively hiring  
✅ **Significant capital** ($15M) = can afford sponsorship  
✅ **Few investors** (3) = institutional VC backing, not a party round  
✅ **Series A stage** (based on amount) = establishing core team  
✅ **Boston biotech** = matches our target  
✅ **Traditional raise** (506b) = professional, experienced founders  

**Our action:** HIGH PRIORITY for database, find their website, scrape jobs, get founder contacts.

## Day 1 Mission: Data Team

Your job today:

1. ✅ **Download** 3-4 recent quarters (Q2 2024 - Q1 2025)
2. ✅ **Parse** the TSV files (or use our Python script)
3. ✅ **Filter** for:
   - States: MA, CA, NY (Boston, SF, NYC)
   - Amount sold: $5M+
   - Industry: Biotech, pharmaceutical, medical devices
   - Filed: Last 18 months
4. ✅ **Export** to CSV for database loading
5. ✅ **Target:** 200-300 companies by end of day

**No coding experience?** That's fine—our Python script automates all of this. Just run it and watch it work.

## The Bottom Line

Form D filings are **treasure maps** to funded startups. Every filing represents:
- A company that just got money
- Founders who are hiring
- An opportunity that visa holders are missing

**Our mission:** Turn these public filings into private job offers. Turn bureaucratic data into second chances. Turn 80 days into a lifetime of opportunity.

---

## Resources

📄 **SEC Form D Overview:** https://www.sec.gov/smallbusiness/exemptofferings  
📊 **Data Sets Page:** https://www.sec.gov/data-research/sec-markets-data/form-d-data-sets  
📖 **Form D Instructions:** https://www.sec.gov/about/forms/formd.pdf  
🔍 **Search Individual Filings:** https://www.sec.gov/edgar/searchedgar/companysearch.html  

## Questions?

**"How accurate is this data?"**  
Very. It's filed under penalty of law, with company executives signing under oath.

**"Do ALL startups file?"**  
About 95% compliance for Series A+. Smaller seed rounds (~$500K) have spottier filing.

**"How fast is it updated?"**  
Companies must file within 15 days. SEC publishes quarterly (3-month lag for bulk data).

**"Can we trust the amounts?"**  
Yes. The "Amount Sold" field is what actually closed, not aspirational.

**"What if a company raised more later?"**  
They file an amendment (Form D/A). We'll catch it in the next quarter.

---

**Next:** [Day 2 - Building the Pipeline](DAY2_PIPELINE.md)

*"Data without action is just noise. Let's turn this into signal."* - Nik Bear Brown

```


---


## File: 80-days-day-02/README.md

```md
# Day 02

# Day 2 Summary: SEC Form D Data Acquisition & Processing

## What We Built Today

# SEC Form D Analysis: Key Findings (2014-2025)

## Overall Statistics

**Total Dataset:**
- **568,707** total companies filed Form D
- **246,572** companies (43.4%) raised $5M+
- **190** states/territories covered

---

## Geographic Distribution

### Top 3 States by Volume

**1. New York**
- 91,662 total companies
- 53,355 raised $5M+ (58% high-value rate)
- Highest concentration of high-value deals

**2. California**
- 81,782 total companies
- 35,608 raised $5M+ (44% high-value rate)
- Strong tech/startup ecosystem

**3. Texas**
- 41,017 total companies
- 14,342 raised $5M+ (35% high-value rate)
- Emerging market

### Your Target Geography (MA/CA/NY)

**Combined Market Power:**
- 199,174 total companies (35% of national total)
- 103,008 companies raised $5M+ (42% of all high-value companies)
- Represents the most concentrated opportunity for high-quality prospects

---

## Industry Breakdown

### Top 5 Industries Overall

| Rank | Industry | Total Companies | % Over $5M |
|------|----------|----------------|------------|
| 1 | Pooled Investment Funds | 57,014 | 67% |
| 2 | Real Estate | 23,931 | 50% |
| 3 | Commercial | 14,507 | 40% |
| 4 | Banking & Financial Services | 11,668 | 43% |
| 5 | Other | 11,127 | 46% |

**Note:** Pooled Investment Funds includes hedge funds, VC funds, and private equity

### Tech-Related Industries (High Visa Sponsorship Potential)

| Industry | Total Companies | % Over $5M | Sponsorship Likelihood |
|----------|----------------|------------|----------------------|
| Pharmaceuticals | 5,425 | 54% | Very High |
| Biotechnology | 9,835 | 49% | Very High |
| Computers/Technology | 10,480 | 47% | High |
| Telecommunications | 8,697 | 39% | Moderate-High |

**Combined tech sector: ~34,437 companies, ~48% raised $5M+**

---

## Strategic Implications for Your Database Product

### The Filtering Funnel

```
568,707 total companies
    ↓ Filter: MA/CA/NY
199,174 companies (35% of total)
    ↓ Filter: Raised $5M+
103,008 high-value companies (42% of all $5M+ companies)
    ↓ Filter: Tech/Bio/Pharma industries
~30,000 highly relevant companies
    ↓ Filter: Filed within last 12 months
~5,000-8,000 actively hiring NOW
```

### Your $10 Database Sweet Spot

**Target Profile:**
- **Geography:** MA, CA, or NY
- **Funding Level:** $5M+ (demonstrates growth capacity)
- **Industry:** Tech, Biotech, Pharma (high sponsorship rates)
- **Recency:** <12 months (actively scaling/hiring)

**Expected Database Size:** 5,000-8,000 premium prospects

**Value Proposition:** 
- Pre-qualified for financial stability
- Geographic concentration in visa-friendly states
- Industry focus on high-sponsorship sectors
- Timing optimized for active hiring cycles

---

## Competitive Advantage

Your dataset uniquely combines:
1. **SEC validation** (verified funding levels)
2. **Geographic targeting** (highest-value states)
3. **Industry filtering** (visa-sponsorship correlation)
4. **Temporal relevance** (recent filers = active growth)

This is exponentially more valuable than generic company lists.

### 1. Understanding SEC Form D Data Structure
- **Learned the data model**: Each quarterly ZIP contains 4 key TSV files:
  - `OFFERING.tsv` - Funding amounts, industry, investor counts
  - `ISSUERS.tsv` - Company details, address, incorporation year
  - `RELATEDPERSONS.tsv` - Executives, directors, founders
  - `FORMDSUBMISSION.tsv` - Filing metadata, dates
- **Key insight**: `ACCESSIONNUMBER` is the primary key linking everything
- **Column names**: No underscores (e.g., `TOTALAMOUNTSOLD` not `TOTAL_AMOUNT_SOLD`)

### 2. Python Environment Setup (macOS Challenges)
- Dealt with macOS "externally-managed-environment" error
- Solution: `pip3 install --user --break-system-packages pandas`
- Rejected virtual environments (complexity for students)
- Installed core packages: pandas, numpy, requests, etc.

### 3. Single Quarter Parser (`sec_form_d.py`)
- Parses one quarterly folder of TSV files
- Auto-detects column names (handles variations)
- Outputs MongoDB-ready JSON with nested structure:
  - Company info with full address
  - Funding details with amounts and dates
  - Related persons array (executives with roles)
  - Metadata placeholders for ML predictions
- **First run**: 87 companies from 2025Q1

### 4. Bulk Data Acquisition
- **Manual approach**: Downloaded 10+ years via browser (2014-2025)
- Created `download_sec_data.py` script (handles SEC's User-Agent requirements)
- **Challenge**: SEC returns 403 without proper headers
- **Total dataset**: 40+ quarterly folders, ~10 years of filings

### 5. Multi-Quarter Batch Processor (`process_all_quarters.py`)
**Key philosophy shift**: Don't filter for "startups" - capture ALL companies with recent funding. A 10-year-old company that raised $75M yesterday has more hiring budget than a 2-month-old seed company.

**Features:**
- **No filtering** - outputs everything, filter later
- Automatically walks current directory for quarterly folders
- Processes all quarters in one run (~40 quarters)
- Deduplicates companies (if multiple rounds, keeps most recent)
- **Adds enrichment metadata**:
  - `years_since_incorporation` - company age
  - `months_since_funding` - how recent is the money?
  - `funding_recency` - categorical (very_recent, recent, moderate, older)
  - `stage_estimate` - Pre-Seed, Seed, Series A/B/C/D+ based on amount

**Outputs:**
1. **`startups_master.json`** - Complete dataset, all companies (~10,000+)
2. **`startups_stats.csv`** - Descriptive statistics:
   - Overall totals (all vs. >$5M)
   - **By State**: Every state, total + over $5M breakdown
   - **By Industry**: Every industry, total + over $5M breakdown
   - By Stage: Distribution across funding stages
   - By Recency: How fresh is the funding?
   - Target States: MA/CA/NY special breakdown

### 6. Data Quality & Insights
- **Expected output**: 1,000-1,500 unique companies over 10 years
- **Deduplication**: Same company raising multiple rounds = one record (most recent)
- **Age distribution**: Mix from fresh (<6 months) to established (5+ years)
- **Stage distribution**: Seed through Series D+, based on funding amounts
- **Geographic spread**: All 50 states, but concentrated in tech hubs

## Key Decisions Made

1. **No filtering during processing** - Output everything, let users filter by state/industry/amount later based on statistics
2. **Company age matters less than funding recency** - A 10-year-old company with fresh $50M is better than a 3-month-old with $2M
3. **Stage estimation** - Algorithmic based on amount ($5-15M = Series A, etc.)
4. **Recency categories** - <6mo = very_recent (actively hiring NOW)

## File Structure Created

```
sec_data/
├── 2014q1-d/ ... 2025q3-d/     # 40+ quarterly folders (TSV files)
├── startups_master.json         # Complete dataset (~10K companies)
├── startups_stats.csv           # Descriptive statistics
└── process_all_quarters.py      # Batch processor script
```

## What's Next (Day 2)

**Enrichment Pipeline:**
1. Find company websites (Google search, domain inference)
2. Scrape career pages for job postings
3. Extract company descriptions and tech stack
4. Identify international team members (LinkedIn)
5. Build ML models for prediction scores:
   - `international_hiring` likelihood (0-1)
   - `recent_grad_hiring` likelihood (0-1)

## Commands to Reproduce

```bash
# Setup
pip3 install --user --break-system-packages pandas numpy requests

# Download data (manual or script)
# Extract to sec_data/

# Process everything
cd sec_data
python3 ../process_all_quarters.py

# Output: startups_master.json + startups_stats.csv
```

## Student Takeaways

- **GIGO principles**: Government data is high-quality (filed under penalty of law) but has limitations
- **Data enrichment strategy**: Start with authoritative source, enrich with other public data
- **Filter late, not early**: Capture everything, analyze statistics, then decide what to filter
- **Practical ML**: Company age + funding amount + time since funding = strong hiring likelihood proxy

---

*Total time investment: ~2 hours of development, ~10 minutes of processing for 10 years of data*

```


---


## File: 80-days-day-03/README.md

```md
# Day 03
# Development Sprint Abstract 

Over the next steps, we will transform raw SEC Form D data into a functional, crowdsourced verification platform. The sprint begins with data filtering: processing the 568,707 company dataset to extract 8,000-12,000 high-potential targets by applying funding thresholds ($1M+), geographic filters (MA/CA/NY/WA/TX/IL), and industry exclusions (removing real estate, pooled investment funds, and other low-sponsorship sectors). Days 2-3 focus on domain discovery and verification: implementing pattern-based inference to generate candidate domains for each company, validating existence through DNS and HTTP checks, and supplementing with CommonCrawl API searches to achieve 80%+ domain coverage, establish the technical infrastructure: setting up Vercel Postgres database with three-tier schema (companies, verification_submissions, published_companies), deploying a Next.js application to Vercel, and building the public-facing verification form interface. The latter half of the week implements the quality control pipeline: developing bot validation functions that automatically verify domain existence, careers page accessibility, visa text claims, and spam detection; creating submission APIs that trigger asynchronous bot checks; and building aggregation logic that publishes company data only after 3+ bot-verified human submissions with no spam flags. By week's end, we'll have a working prototype where users can submit verifications, bots automatically validate submissions, and verified data publishes to a searchable database—establishing the foundation for volunteer recruitment and Google Ads campaigns that will scale verification through crowdsourced traffic.


**Week Development Goals:**
- **Data Pipeline:** Filter SEC data from 568K → 10K companies, infer and verify domains (80% coverage), extract careers pages and ATS platforms
- **Database Infrastructure:** Deploy Vercel Postgres with three-tier schema, migrate filtered companies, establish verification workflow tables
- **Web Application:** Build Next.js verification form, deploy to Vercel, create submission API with bot validation triggers
- **Quality Control:** Implement automated bot checks (domain, careers page, visa text, spam detection), aggregation logic for publishing verified data
- **Milestone:** Working prototype where users verify companies → bots validate → data publishes automatically after 3+ confirmations
# 80 Days to Stay - Evening Work ToDo List

## Day 1 (Tonight) - Data Filtering & Setup (2-3 hours)

### Priority 1: Filter SEC Data
```
☐ Load your startups_master.json from SEC processing
☐ Apply filters:
   - Funding >= $1M
   - Remove Europe/non-US addresses
   - Keep only: MA, CA, NY (maybe WA, TX, IL)
   - Remove industries: Real Estate, Pooled Investment, Oil/Gas, Agriculture, Retail, Construction
☐ Output: filtered_companies.json (~8,000-12,000 companies)
☐ Generate stats: How many companies per state, per industry, per funding range

Expected Output: Clean dataset ready for domain discovery
```

### Priority 2: Domain Inference Script
```
☐ Write/refine infer_domain() function
   - Handle: "Inc", "LLC", "Corp", "Ltd" removal
   - Try patterns: .com, .io, .bio, -bio.com, etc.
☐ Run on filtered dataset
☐ For each company, test 3-5 domain patterns
☐ Output: companies_with_domains.json (70-80% should have guesses)

Expected Output: Most companies have inferred domains to check
```

## Day 2 (Tomorrow Night) - Domain Verification (2-3 hours)

### Priority 1: DNS/HTTP Verification
```
☐ Write verify_domain_exists() function
   - DNS check (socket.gethostbyname)
   - HTTP HEAD request
☐ Run on all inferred domains
☐ Mark which domains actually exist
☐ Output: domains_verified.json

Expected Output: Know which 70-80% of domains are real
```

### Priority 2: CommonCrawl Check (If Time)
```
☐ Write CommonCrawl CDX API search function
☐ For companies with no verified domain, search CommonCrawl
☐ Extract domain from any results
☐ Add to verified list

Expected Output: Another 5-10% of domains found
```

## Day 3 (Next Night) - Web Scraping Setup (2-3 hours)

### Priority 1: Basic Crawler
```
☐ Write fetch_homepage() function
☐ Write verify_company_match() function
   - Check if company name appears on page
   - Extract title, meta description
☐ Test on 20 companies manually
☐ Refine matching logic

Expected Output: Working verification system
```

### Priority 2: Find Important Pages
```
☐ Write find_important_pages() function
   - Look for /careers, /jobs, /team URLs
   - Check for Greenhouse/Lever/Workday
☐ Test on 50 companies
☐ Save results

Expected Output: Know which companies have careers pages
```

## Day 4 - Database Schema & Setup (2 hours)

### Priority 1: Choose Database
```
☐ Decide: Vercel Postgres vs MongoDB Atlas vs Supabase
☐ Create free tier account
☐ Set up database

Recommendation: Vercel Postgres (best integration)
```

### Priority 2: Create Tables
```
☐ Create companies table (from SEC data)
☐ Create verification_submissions table
☐ Create published_companies table
☐ Insert filtered companies into database

Expected Output: Data in database, ready for verification system
```

## Day 5 - Verification Form Prototype (3 hours)

### Priority 1: Next.js Setup on Vercel
```
☐ Create new Next.js project
☐ Deploy to Vercel (should take 10 minutes)
☐ Connect to database
☐ Test basic query

Expected Output: Live website at [yourproject].vercel.app
```

### Priority 2: Single Company Verification Page
```
☐ Create /verify/[companyId] page
☐ Display company info
☐ Show verification checklist form
☐ Submit button (doesn't need to work yet)

Expected Output: Can see a company and the form
```

## Day 6 - Backend API Setup (2-3 hours)

### Priority 1: Submission Endpoint
```
☐ Create /api/submit-verification
☐ Accept form data
☐ Insert into verification_submissions table
☐ Return success
☐ Test with Postman or curl

Expected Output: Can submit verification data to database
```

### Priority 2: Bot Check Functions (Start)
```
☐ Write verifyDomain() bot function
☐ Write verifyCareersPage() bot function
☐ Test both manually

Expected Output: Bot checks work independently
```

## Day 7 - Bot Pipeline (2-3 hours)

### Priority 1: Complete Bot Checks
```
☐ Write verifyVisaText() function
☐ Write checkForSpam() function
☐ Wire all bot checks together
☐ Test on real submissions

Expected Output: Full bot verification pipeline works
```

### Priority 2: Aggregation Logic
```
☐ Write aggregateAndPublish() function
☐ Test with 3+ submissions for same company
☐ Verify data appears in published_companies

Expected Output: Can publish verified companies
```

## Weekend Milestone Check

**By end of Week 1, you should have:**
- [ ] 8,000-12,000 filtered companies in database
- [ ] 70-80% with verified domains
- [ ] Working verification form (live on Vercel)
- [ ] Bot validation pipeline functional
- [ ] Can manually test full submission → verification → publication flow

## Week 2 Preview - Google Ads & Volunteer Setup

```
☐ Apply for Google Ad Grants (if not done)
☐ Create volunteer onboarding guide
☐ Set up Airtable or Google Sheet for volunteer assignments
☐ Create landing page explaining the mission
☐ Write Google Ads campaigns
☐ Recruit first 20 volunteers (Humanitarians AI fellows)
```

## Quick Reference - Estimated Time Per Task

```
Data Filtering:           1 hour
Domain Inference:         1.5 hours
DNS/HTTP Verification:    2 hours
CommonCrawl Check:        1.5 hours
Basic Crawler:            2 hours
Find Important Pages:     1.5 hours
Database Setup:           1 hour
Next.js + Vercel Deploy:  1 hour
Verification Form UI:     2 hours
Submission API:           1.5 hours
Bot Check Functions:      3 hours
Aggregation Logic:        2 hours

Total: ~19 hours = about 7 evening sessions (2-3 hours each)
```

## Priority Order (If Short on Time)

**Must Have (Week 1):**
1. Filter SEC data
2. Domain inference + verification
3. Database setup
4. Basic verification form (even if just UI)

**Should Have (Week 1):**
5. Bot validation pipeline
6. Submit endpoint working

**Nice to Have (Can Wait to Week 2):**
7. CommonCrawl integration
8. Aggregation/publication logic
9. Admin review interface

## Tools You'll Need Installed

```
☐ Node.js 18+ (for Next.js)
☐ Python 3.9+ (for data processing)
☐ PostgreSQL client (or use Vercel dashboard)
☐ Git (for version control)
☐ VS Code or your preferred editor

Python packages:
☐ pandas
☐ requests
☐ beautifulsoup4
```

## First Thing Tonight

**Start here (30 minutes):**
1. Open your SEC data: `startups_master.json`
2. Count total companies: `len(data)`
3. Apply $1M+ filter: see how many remain
4. Apply MA/CA/NY filter: see how many remain
5. Print sample of 10 companies to verify data looks good

This gives you immediate progress and validates your approach.

```


---


## File: 80-days-day-04/README.md

```md
# Day 04

## Scraping Results Summary

**Massive success on the data collection:**
- ✅ **25,748 companies** fully scraped (100% success rate, 0 failures)
- 📄 **425,233 HTML pages** collected
- 📊 **16.5 pages per company** on average
- ⏱️ **59 hours** of continuous scraping (3,549 minutes)
- 🎯 **62% verification rate** from original 41,299 companies

## What We're Doing Now

**Converting raw HTML → LLM-ready markdown for company analysis**

The script processes all 25,748 company directories in `WWW/` and:

1. **Skips login walls** - Ignores single-page directories (likely authentication required)
2. **Consolidates each company** - Converts all HTML pages into ONE markdown file per company
3. **Adds SEC metadata** - Company name, funding ($), location, industry at the top
4. **Preserves originals** - Keeps HTML files, just adds `.md` alongside them

**Output:** 25,748 markdown files ready for LLM analysis to answer:
- What does this company do?
- Do they hire recent graduates? Why?
- Do they hire international students? Why?
- Current job openings and types?

**Mission:** Feed these to LLMs to identify which funded startups are most likely to sponsor visas for the **80 Days to Stay** project—connecting international students with companies that have the money but don't advertise sponsorship. 🚀


```


---


## File: 80-days-day-05/README.md

```md
# Day 05
# 80 Days to Stay - Day 5 Progress Report

> *"Data collected. Now we separate the willing from the wealthy."*

## 🎯 Mission Status: Week 1 Complete

**Progress:** 45% of Week 1 goals achieved

---

## 📊 Scraping Results: Beyond Expectations

### What We Built
✅ **Complete company website scraper** using public SEC Form D data  
✅ **Zero failures** - 100% success rate on data collection  
✅ **Automated domain verification** - 62% of companies have working websites  

### The Numbers

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📈 SCRAPING STATISTICS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Companies Processed:      25,748 / 25,748 (100%)
Failed Attempts:          0
Total HTML Pages:         425,233
Average Pages/Company:    16.5
Total Runtime:            3,549.8 minutes (59.2 hours)
Processing Rate:          0.12 companies/second

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎯 VERIFICATION PIPELINE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Initial Companies:        41,299 (from filtered SEC data)
Domains Attempted:        141,236
Verified Companies:       25,748
Success Rate:             62.3%
Budget Spent:             $0

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### What This Means

**Before this scrape:**
- International students searching blind
- No way to know which funded startups are hiring
- Companies with capital remain invisible

**After this scrape:**
- 25,748 funded companies mapped
- 425,233 pages of hiring signals
- Complete website content for LLM analysis

---

## 🔄 Strategic Pivot: Adding H1B Sponsorship Data

### The Realization

We have **companies with money** (SEC data). But we need **companies with willingness** (H1B data).

**The gap:** 
- A company raising $50M doesn't automatically mean they sponsor visas
- Some well-funded startups have NEVER sponsored
- Others sponsor dozens of H1Bs every year

**The solution:** Cross-reference our SEC companies with proven H1B sponsors

### New Data Sources: Official US Government

#### 1. **Department of Labor - Labor Condition Applications (LCA)**
**Link:** https://www.dol.gov/agencies/eta/foreign-labor/performance

**What it contains:**
- Every H1B sponsorship application filed
- Company names, job titles, salaries
- Approval/denial status
- Historical data back to 2001

**Why it matters:**
- Proves which companies actually sponsor
- Shows sponsorship frequency (1 vs. 100+ per year)
- Reveals job titles they sponsor (engineer, scientist, analyst)

**Data volume:** 6+ million LCA records

---

#### 2. **USCIS - H1B Employer Data Hub**
**Link:** https://www.uscis.gov/tools/reports-and-studies/h-1b-employer-data-hub

**What it contains:**
- Top H1B employers by volume
- Approval rates by company
- Quarterly processing trends
- Geographic distribution

**Why it matters:**
- Identifies reliable sponsors (high approval rates)
- Shows seasonal hiring patterns
- Filters out companies with low success rates

**Updated:** Quarterly

---

#### 3. **DOL - PERM Labor Certification Data**
**Link:** https://www.dol.gov/agencies/eta/foreign-labor/performance

**What it contains:**
- Green card sponsorship applications
- Companies willing to sponsor permanent residency
- Job requirements and qualifications

**Why it matters:**
- PERM sponsorship = long-term commitment
- Shows companies investing in international talent
- Even stronger signal than H1B alone

**Data volume:** Millions of applications

---

#### 4. **DOL - Prevailing Wage Determinations**
**Link:** https://www.dol.gov/agencies/eta/foreign-labor/performance

**What it contains:**
- Required salary ranges by job/location
- Skill level classifications
- Industry wage standards

**Why it matters:**
- Helps students know realistic salary expectations
- Shows which jobs qualify for sponsorship
- Validates company job postings

---

## 🎯 The Killer Combination

### What We're Building

```
SEC Form D Data              H1B/LCA Data              Smart Matching
─────────────────────   +   ──────────────────   =   ─────────────────────

• Company just raised       • Sponsored 15 H1Bs       HIGH PROBABILITY
  $50M Series B              last year                 MATCH! 🌟🌟🌟
                            • All software roles
                            • 95% approval rate

vs.

• Company raised            • Zero H1B history        Maybe needs education
  $30M Series A             • Never filed LCA          Lower priority ⭐
```

### Proposed Scoring System

**🌟🌟🌟 VERY LIKELY (Score: 80-100)**
- ✅ Raised $5M+ (last 2 years)
- ✅ Sponsored 10+ H1Bs (last 2 years)
- ✅ High approval rate (>80%)
- ✅ Multiple relevant job titles

**🌟🌟 LIKELY (Score: 60-79)**
- ✅ Raised $5M+ (last 2 years)
- ✅ Sponsored 3-10 H1Bs (last 3 years)
- ✅ Some relevant roles

**🌟 POSSIBLE (Score: 40-59)**
- ✅ Raised $5M+ (last 2 years)
- ❓ Limited or old H1B history
- ❓ No recent LCA filings

**❌ UNLIKELY (Score: <40)**
- ⚠️ Has funding but never sponsored
- ⚠️ Or low approval rates

---

## 📈 Why This Changes Everything

### Before (SEC Data Only)
```
User searches: "Biotech companies in Boston"
Results: 500 companies with funding
Problem: Which ones actually sponsor?
User action: Apply to all 500, hope for best
```

### After (SEC + H1B Data)
```
User searches: "Biotech companies in Boston"
Results: 500 companies with funding
Filtered: 127 have H1B history 🌟🌟🌟
         89 sponsored recently 🌟🌟
         284 unknown (worth trying) 🌟
User action: Focus on proven 127 first
```

### The Impact

**For students:**
- Stop wasting time on companies that never sponsor
- Focus on proven sponsors first
- See which job titles get sponsored

**For companies:**
- Get matched with qualified candidates
- Learn they're already in H1B databases
- Discover their sponsorship reputation

**For the mission:**
- Higher success rate per application
- Better use of students' limited time
- Faster path to that first success story

---

## 🛠️ Technical Implementation Plan

### Phase 1: Data Collection (Days 5-7)
```python
# Target datasets to download/scrape:
1. DOL LCA Disclosure Data (2022-2025)
2. USCIS H1B Employer Data Hub
3. PERM Labor Certification Data
4. Prevailing Wage Data

# Estimated volume:
- LCA records: 6M+ rows
- Companies: 100K+ unique employers
- Our intersection: ~10-15K matches expected
```

### Phase 2: Cross-Reference (Days 8-10)
```python
# Match SEC companies with H1B sponsors
sec_companies = 25,748
h1b_sponsors = 100,000+

# Expected outcomes:
- Exact matches: 8,000-12,000 companies
- Fuzzy matches: 3,000-5,000 companies
- No H1B history: 10,000-14,000 companies
```

### Phase 3: Scoring Engine (Days 11-14)
```python
# Calculate sponsorship likelihood
factors = {
    'h1b_count_recent': 0.30,      # Volume (last 2 years)
    'approval_rate': 0.25,          # Success rate
    'recency': 0.20,                # Recent activity
    'relevant_titles': 0.15,        # Job match
    'perm_history': 0.10           # Green card signal
}

# Output: Score 0-100 per company
```

---

## 📊 Current Data Assets

### What We Have Now
1. ✅ **25,748 company profiles** (SEC Form D + websites)
2. ✅ **425,233 HTML pages** for LLM analysis
3. ✅ **Funding data** (amounts, stages, dates)
4. ✅ **Geographic data** (city, state)
5. ✅ **Industry classifications**

### What We're Adding (Days 5-10)
1. 🔄 **H1B sponsorship history** per company
2. 🔄 **LCA filing patterns** (frequency, recency)
3. 🔄 **Approval rates** (success metrics)
4. 🔄 **Job title data** (which roles sponsored)
5. 🔄 **Salary ranges** (prevailing wage data)

### Combined Power
```
Company Profile:
├── SEC Data
│   ├── Funding: $80M Series B
│   ├── Location: Cambridge, MA
│   └── Industry: Biotechnology
├── Website Data
│   ├── 23 pages scraped
│   ├── "Careers" page exists
│   └── "We're hiring!" signals
└── H1B Data (NEW!)
    ├── 47 H1Bs sponsored (2022-2024)
    ├── 43 approved (91% rate) 🌟
    ├── Job titles: Research Scientist (23), 
    │   Biotech Engineer (15), Data Analyst (9)
    └── Avg salary: $95K

Score: 95/100 - VERY LIKELY TO SPONSOR 🌟🌟🌟
```

---

## 🎯 Success Metrics Update

### Week 1 Goals (Original)
- [x] Build SEC data pipeline
- [x] Verify 300+ company domains → **Achieved 25,748** ✅
- [x] Scrape company websites
- [ ] Create searchable database (in progress)

### Week 1 Goals (Revised)
- [x] SEC data pipeline (complete)
- [x] Website scraping (complete)
- [🔄] Integrate H1B data sources (Days 5-7)
- [ ] Build cross-reference matching (Days 8-10)
- [ ] Deploy MVP with sponsorship scores (Days 11-14)

### The North Star
**Can we help one international student find visa sponsorship in 80 days?**

**Answer so far:** We have 25,748 funded companies mapped. Now we're adding H1B data to show which ones actually sponsor. This dramatically improves our odds.

---

## 💡 Key Insights from Day 5

### What Worked
1. **Async scraping at scale** - 25K companies in 59 hours
2. **Zero budget** - All free, public data sources
3. **High-quality data** - 16.5 pages per company average
4. **Stable pipeline** - 0 failures, clean runs

### What We Learned
1. **Funding ≠ Sponsorship** - Need to verify actual H1B history
2. **Government data is treasure** - 6M+ LCA records available free
3. **Combination is key** - SEC + H1B = actionable insights
4. **Quality over quantity** - 25K with scores > 40K without

### What's Next
1. **Days 5-7:** Download and clean H1B/LCA data
2. **Days 8-10:** Cross-reference SEC companies with sponsors
3. **Days 11-14:** Build scoring engine and deploy MVP
4. **Days 15-20:** User testing and validation

---

## 📚 Resources

### Official Data Sources
- [DOL Foreign Labor Certification](https://www.dol.gov/agencies/eta/foreign-labor/performance)
- [USCIS H1B Employer Data Hub](https://www.uscis.gov/tools/reports-and-studies/h-1b-employer-data-hub)
- [H1B Salary Database](https://h1bdata.info/) (community-maintained)
- [My Visa Jobs](https://www.myvisajobs.com/) (aggregated H1B data)

### Technical Stack
```
Data Pipeline:    Python + Pandas + asyncio
H1B Data:         CSV processing (6M+ rows)
Matching:         Fuzzy string matching (company names)
Database:         PostgreSQL (Supabase)
API:              FastAPI
Frontend:         React + Tailwind
Hosting:          Railway (backend) + Vercel (frontend)
Budget:           Still $0/month
```

---

## 🎬 The Story So Far

**Day 1-3:** Built SEC scraper, filtered 568K companies to 41K targets  
**Day 4:** Verified domains, discovered 25,748 working websites  
**Day 5:** Scraped 425K pages, discovered H1B data goldmine  
**Next:** Combine funding data with sponsorship history for smart matching

**The mission:** Turn data into second chances. Every company profile we complete is another opportunity for someone to stay with their family, continue their research, build their career in America.

**Days remaining:** 75  
**Companies mapped:** 25,748  
**Success stories:** 0 (yet)

---

## 🚀 Join the Mission

**Current needs:**
- Data engineers (H1B data processing)
- Backend developers (scoring algorithms)
- Frontend developers (search interface)
- Researchers (company validation)

**Time commitment:** 5-10 hours/week  
**Skills learned:** Data pipelines, web scraping, matching algorithms, production deployment  
**Impact:** Help someone stay in America

**Get involved:** https://www.humanitarians.ai/fellows

---

*"The best time to plant a tree was 20 years ago. The second best time is now. The third best time is when you're racing a 60-day unemployment clock."*

**Project Lead:** Nik Bear Brown  
**Organization:** Humanitarians AI (501c3)  
**Day:** 5 of 80  
**Budget:** $0  
**Impact:** Building...

```


---


## File: 80-days-day-06/README.md

```md
# Day 06

# 80 Days to Stay - Day 6 Progress Report

> *"We're not just finding jobs. We're cracking the entire application system."*

## 🎯 Mission Status: The ATS Revelation

**Progress:** Week 1 → Week 2 Transition  
**New Discovery:** ATS systems are a **triple win**, not just a data source

---

## 💡 The Big Realization

We started thinking Greenhouse was just about **job listings**. But it's actually three critical insights in one API call:

### Win #1: Live Job Postings ✅
*"What jobs are open RIGHT NOW?"*

### Win #2: Resume Strategy Intelligence ✅
*"What format should my resume be in?"*

### Win #3: Company Sophistication Signal ✅
*"How modern is their hiring process?"*

Let's break down why each matters for international students.

---

## 🎯 Win #1: Live Job Postings (The Obvious One)

### What We Get
```json
GET https://boards-api.greenhouse.io/v1/boards/{company}/jobs

Returns:
{
  "jobs": [
    {
      "title": "Senior Software Engineer",
      "location": "Cambridge, MA",
      "department": "Engineering",
      "updated_at": "2025-11-25",
      "absolute_url": "https://boards.greenhouse.io/company/jobs/123",
      "content": "Full job description..."
    }
  ]
}
```

### Why It Matters
- **Real-time openings** - Apply today, not "someday"
- **Structured data** - Clean JSON, no HTML parsing
- **Direct apply links** - One-click applications
- **Auto-updates** - Jobs appear/disappear as posted/filled
- **Zero scraping** - APIs are faster and more reliable

### The Impact
```
Before: "This company might be hiring"
After:  "This company has 5 open positions posted 2 days ago"
```

**For students with 60-day unemployment clocks:** Every day counts. Real-time job data means zero wasted applications on filled positions.

---

## 📝 Win #2: Resume Strategy Intelligence (The Hidden Gold)

### The ATS Problem (From Prof. Bear's Research)

**The reality:**
- Big companies (Microsoft, Amazon, Tesla) often use **legacy ATS systems**
- Some still use **pre-2020 technology**, even OCR-based parsers
- These systems **can't read sophisticated resumes**
- They look for **keyword matching**, simple layouts, plain text

**The paradox:**
> *"Modern LLMs can read any resume format. But companies use 10-year-old systems that can't."*

### Strategic Minimalism Approach

**What works for BOTH humans and ATS:**
- ✅ Clear typefaces (readable by OCR and humans)
- ✅ Clean layouts (parseable by ATS, pleasant for humans)
- ✅ Standard section headers (EXPERIENCE, EDUCATION, SKILLS)
- ✅ Simple formatting (no tables, columns, or graphics)

**What works for humans but FAILS ATS:**
- ❌ Creative layouts
- ❌ Multiple columns
- ❌ Graphics and icons
- ❌ Embedded tables
- ❌ Fancy fonts

**The strategy:** Research which ATS the company uses, then format accordingly.

### How ATS Detection Changes Resume Strategy

#### Scenario A: Company Uses Greenhouse (Modern)
```
Company: Crossbow Therapeutics
ATS: Greenhouse (2023)

Resume Strategy:
├── Modern LLM-based parsing ✅
├── Can handle sophisticated layouts
├── Reads PDFs perfectly
├── Extracts structured data reliably
└── RECOMMENDATION: Use "Strategic Minimalism" 
    → Clean but professional design
    → Stand out visually while staying parseable
```

#### Scenario B: Company Uses Legacy Workday (Pre-2020)
```
Company: [Large Corporation]
ATS: Workday (2018 version)

Resume Strategy:
├── OCR-based parsing ⚠️
├── Keywords matter heavily
├── Simple layout required
├── Plain text preferred
└── RECOMMENDATION: Use "ATS-Optimized"
    → Plain text format
    → Keyword-heavy
    → No creativity, pure function
```

#### Scenario C: Startup (No ATS / Manual Review)
```
Company: [3-person startup]
ATS: None (founders read directly)

Resume Strategy:
├── Human review only 👤
├── Design matters more than keywords
├── Storytelling > bullet points
└── RECOMMENDATION: Use "Human-First"
    → Creative, memorable design
    → Show personality
    → Make it stand out
```

### The Intelligence Layer We're Building

**For each company in our database:**
```python
company_profile = {
    'name': 'Crossbow Therapeutics',
    'ats_system': 'greenhouse',  # ← NEW!
    'ats_version': '2023',        # ← NEW!
    'ats_capabilities': {
        'pdf_parsing': True,
        'llm_based': True,
        'legacy_ocr': False
    },
    'resume_recommendation': 'strategic_minimalism'  # ← NEW!
}
```

**What this enables:**
```
User uploads resume → Platform detects format → 
Analyzes target company's ATS →
Suggests: "This company uses Greenhouse. Your creative resume 
          will work fine, but consider moving skills section 
          higher for better keyword matching."

vs.

"This company uses legacy Workday. Your resume has 
 multiple columns and graphics that will fail parsing. 
 Here's an ATS-safe version optimized for their system."
```

### Real-World Example

**Student applying to two companies:**

**Company A: Modern Biotech Startup (Greenhouse)**
- ✅ Uses resume with clean design, subtle colors, clear sections
- ✅ ATS parses it perfectly
- ✅ Hiring manager sees professional, readable resume
- ✅ Gets interview

**Company B: Fortune 500 (Legacy Workday 2017)**
- ❌ Uses same creative resume
- ❌ ATS fails to parse columns correctly
- ❌ Data extracted incorrectly (experience years wrong)
- ❌ Auto-rejected before human sees it

**With our platform:**
- Platform detects Company B uses legacy ATS
- Suggests: "Convert to plain-text format for this application"
- Student submits ATS-optimized version
- ✅ Gets past ATS filter
- ✅ Human reviewer sees correct data

---

## 🔍 Win #3: Company Sophistication Signal (The Surprise)

### Why ATS Choice Reveals Company Culture

**Modern ATS (Greenhouse, Lever, Ashby) = Progressive Company**
```
Signals:
├── Invested in modern hiring tools ($$)
├── Cares about candidate experience
├── Likely uses data-driven hiring
├── Probably tech-savvy organization
└── More likely to understand visa processes? 🤔
```

**Legacy ATS (Old Workday, iCIMS) = Traditional Company**
```
Signals:
├── Resistant to change
├── "If it ain't broke..." mentality
├── May have bureaucratic processes
├── Possibly less flexible on visa policies
└── More likely to auto-reject "requires sponsorship"? 🤔
```

**No ATS / Custom System = Wild Card**
```
Signals:
├── Either very small OR very custom
├── Could be cutting-edge tech company
├── Could be disorganized startup
└── Need to research case-by-case
```

### Hypothesis: ATS Modernity Correlates with Visa Friendliness

**Our theory (to be tested):**

Companies that invest in modern hiring infrastructure are **more likely** to:
- Understand complex employment regulations (like OPT vs. H1B)
- Have HR capacity to handle sponsorship
- Be data-driven about candidate evaluation (less bias)
- Have experience with international hiring

**We can test this:**
```python
# Cross-reference our data:
modern_ats_companies = companies.filter(ats IN ['greenhouse', 'lever', 'ashby'])
legacy_ats_companies = companies.filter(ats IN ['workday_old', 'icims'])

# Compare H1B sponsorship rates:
modern_ats_h1b_rate = calculate_h1b_sponsorship_rate(modern_ats_companies)
legacy_ats_h1b_rate = calculate_h1b_sponsorship_rate(legacy_ats_companies)

# Our hypothesis: modern_ats_h1b_rate > legacy_ats_h1b_rate
```

If true, this becomes **another scoring factor** in our algorithm.

---

## 🛠️ Major ATS Systems: The Landscape

### Tier 1: Modern, API-Friendly (Target These First)

#### **Greenhouse** 🌟🌟🌟
**API:** https://developers.greenhouse.io/  
**Public Jobs:** `https://boards-api.greenhouse.io/v1/boards/{company}/jobs`  
**Market:** Startups, mid-size tech, modern biotech  
**Parsing:** LLM-based, excellent PDF handling  
**Resume Strategy:** Strategic minimalism works well

**Estimated coverage in our data:** 8,000-12,000 companies (30-45%)

#### **Lever** 🌟🌟🌟
**API:** https://hire.lever.co/developer/documentation  
**Public Jobs:** `https://api.lever.co/v0/postings/{company}?mode=json`  
**Market:** Startups, tech companies  
**Parsing:** Modern, good PDF support  
**Resume Strategy:** Similar to Greenhouse

**Estimated coverage:** 3,000-5,000 companies (12-20%)

#### **Ashby** 🌟🌟
**API:** https://developers.ashbyhq.com/  
**Market:** Newer, growing fast in startup world  
**Parsing:** Very modern, AI-powered  
**Resume Strategy:** Most flexible

**Estimated coverage:** 1,000-2,000 companies (4-8%)

---

### Tier 2: Enterprise Systems (Require Research)

#### **Workday**
**Market:** Large corporations, universities  
**Parsing:** **Highly variable** - depends on version  
**Modern versions (2022+):** Good parsing  
**Legacy versions (2020-):** OCR-based, problematic  
**Resume Strategy:** **Research version first!**

**Key issue:** Same name, dramatically different capabilities depending on when deployed.

#### **iCIMS**
**Market:** Mid-large companies  
**Parsing:** Generally good, but can be keyword-heavy  
**Resume Strategy:** Keyword optimization important

#### **SmartRecruiters**
**Market:** Enterprise  
**Public Jobs:** XML feeds available  
**Parsing:** Decent

---

### Tier 3: Unknown / Custom

**Many companies:** ~5,000-10,000 in our dataset (20-40%)
- Custom built systems
- Very old systems
- No public job board
- Manual HR processes

**Strategy:** Case-by-case research needed

---

## 📊 The Triple-Win Data Model

### Enhanced Company Profile

```json
{
  "company": {
    "name": "Crossbow Therapeutics",
    "industry": "Biotechnology",
    "location": "Cambridge, MA"
  },
  
  "funding": {
    "amount": 80000000,
    "stage": "Series B",
    "date": "2025-09-17"
  },
  
  "h1b_history": {
    "total_sponsored": 23,
    "recent_2_years": 18,
    "approval_rate": 0.91,
    "job_titles": ["Research Scientist", "Bioinformatics", "Lab Tech"]
  },
  
  "ats_data": {  // ← NEW SECTION!
    "system": "greenhouse",
    "system_modernity": "modern",
    "public_api": true,
    "resume_parsing": "llm_based",
    "pdf_support": true,
    
    "live_jobs": [
      {
        "title": "Senior Research Scientist",
        "location": "Cambridge, MA",
        "department": "R&D",
        "posted": "2025-11-23",
        "url": "https://boards.greenhouse.io/crossbow/jobs/123",
        "matches_h1b_history": true  // ← SMART!
      }
    ],
    
    "resume_recommendation": {
      "format": "strategic_minimalism",
      "reason": "Modern ATS can handle clean designs",
      "tips": [
        "Use clear section headers",
        "PDF format recommended",
        "Subtle design elements okay",
        "Ensure keywords match job description"
      ]
    },
    
    "hiring_sophistication_score": 85  // ← NEW METRIC!
  },
  
  "overall_score": 95
}
```

### How This Transforms User Experience

#### Before (Just SEC + H1B Data)
```
User: "Show me biotech jobs in Boston"

Platform: "Here are 50 companies with H1B history"

User: "Which ones are hiring?"
Platform: "Check their websites"

User: "What resume should I use?"
Platform: "¯\_(ツ)_/¯"
```

#### After (SEC + H1B + ATS Intelligence)
```
User: "Show me biotech jobs in Boston"

Platform: 
"Found 50 companies with H1B history
 → 34 are actively hiring (127 open positions)
 → Sorted by best match for your profile
 
🌟🌟🌟 Crossbow Therapeutics (Score: 95/100)
├── Funding: $80M Series B
├── H1B History: 23 sponsored (91% approval)
├── ATS: Greenhouse (modern, candidate-friendly)
│
├── 📋 5 LIVE JOBS:
│   ├── Senior Research Scientist [APPLY NOW]
│   │   Posted: 2 days ago
│   │   Match: HIGH (they've sponsored 15x for this role)
│   │
│   ├── Computational Biologist [APPLY NOW]
│   │   Posted: 5 days ago
│   │   Match: MEDIUM (they've sponsored 5x similar)
│   │
│   └── Associate Scientist [APPLY NOW]
│       Posted: 1 week ago
│       Match: HIGH (entry-level, often sponsored)
│
└── 📝 RESUME TIPS FOR THIS COMPANY:
    ├── Format: Use your professional design resume
    ├── Their ATS: Greenhouse (reads PDFs perfectly)
    ├── Keywords: Include "antibody discovery", "protein engineering"
    ├── Tip: They value research publications - list yours prominently
    └── [OPTIMIZE MY RESUME FOR THIS JOB] ← button

User: *clicks optimize, gets tailored resume, applies in 5 minutes*
```

---

## 🎯 The Complete Intelligence Stack

### Layer 1: Financial Capability
**Source:** SEC Form D  
**Question:** Can they afford to hire?  
**Answer:** $80M raised = Yes ✅

### Layer 2: Historical Willingness
**Source:** H1B/LCA Database  
**Question:** Do they actually sponsor?  
**Answer:** 23 H1Bs in 2 years = Yes ✅

### Layer 3: Current Openings
**Source:** ATS APIs (Greenhouse, Lever)  
**Question:** Are they hiring NOW?  
**Answer:** 5 open positions = Yes ✅

### Layer 4: Application Strategy (NEW!)
**Source:** ATS System Detection  
**Question:** How should I apply?  
**Answer:** Modern ATS + keyword optimization = Strategic minimalism ✅

### Layer 5: Success Prediction (NEW!)
**Source:** Cross-referencing all data  
**Question:** Will my application succeed?  
**Answer:** 
- Job matches past H1B sponsorships ✅
- Company actively hiring for this role ✅
- Modern ATS won't auto-reject ✅
- Resume optimized for their system ✅
= **HIGH PROBABILITY** 🎯

---

## 🚀 Implementation Roadmap

### Days 6-8: ATS Detection & Integration

**Task 1: Build ATS Detection**
```python
def detect_ats(domain):
    """
    Check which ATS system a company uses
    """
    ats_endpoints = {
        'greenhouse': f'https://boards.greenhouse.io/{domain}',
        'lever': f'https://jobs.lever.co/{domain}',
        'ashby': f'https://jobs.ashbyhq.com/{domain}',
        'workday': f'https://{domain}.wd1.myworkdayjobs.com'
    }
    
    for ats, url in ats_endpoints.items():
        if check_url_exists(url):
            return {
                'system': ats,
                'url': url,
                'api_available': ats in ['greenhouse', 'lever', 'ashby']
            }
    
    return {'system': 'unknown', 'api_available': False}
```

**Task 2: Fetch Live Jobs**
```python
def get_greenhouse_jobs(company_slug):
    """
    Get all current openings from Greenhouse
    """
    url = f"https://boards-api.greenhouse.io/v1/boards/{company_slug}/jobs"
    response = requests.get(url)
    
    if response.status_code == 200:
        return parse_greenhouse_jobs(response.json())
    return []

def parse_greenhouse_jobs(data):
    """
    Extract relevant fields from Greenhouse response
    """
    return [
        {
            'id': job['id'],
            'title': job['title'],
            'location': job['location']['name'],
            'department': job['departments'][0]['name'] if job['departments'] else 'Other',
            'posted_date': job['updated_at'],
            'url': job['absolute_url'],
            'description': job['content']
        }
        for job in data['jobs']
    ]
```

**Task 3: Resume Strategy Recommendations**
```python
def generate_resume_strategy(ats_data, job_posting):
    """
    Generate resume optimization tips based on ATS system
    """
    if ats_data['system'] == 'greenhouse':
        return {
            'format': 'strategic_minimalism',
            'tips': [
                'PDF format recommended',
                'Clean, professional design works well',
                'Clear section headers (EXPERIENCE, EDUCATION, SKILLS)',
                f"Include keywords: {extract_keywords(job_posting['description'])}",
                'Highlight metrics and achievements'
            ]
        }
    
    elif ats_data['system'] == 'workday':
        # Need to check version...
        return {
            'format': 'ats_optimized',
            'tips': [
                'Plain text formatting recommended',
                'Avoid tables, columns, graphics',
                'Heavy keyword optimization needed',
                'Standard fonts only (Arial, Times New Roman)',
                'Single column layout'
            ],
            'warning': 'This company may use legacy Workday - research their version'
        }
    
    elif ats_data['system'] == 'unknown':
        return {
            'format': 'safe_default',
            'tips': [
                'Use strategic minimalism approach',
                'Optimize for both humans and parsers',
                'Include keywords but maintain readability',
                'PDF or DOCX both acceptable'
            ]
        }
```

### Days 9-10: Cross-Reference with H1B Data

**Match job postings with H1B history:**
```python
def match_jobs_with_h1b_history(job_posting, h1b_history):
    """
    Check if current job matches previously sponsored roles
    """
    job_title_normalized = normalize_job_title(job_posting['title'])
    
    matching_sponsorships = [
        sponsorship for sponsorship in h1b_history
        if similar_job_titles(job_title_normalized, sponsorship['title'])
    ]
    
    return {
        'matches_history': len(matching_sponsorships) > 0,
        'times_sponsored': len(matching_sponsorships),
        'confidence': calculate_confidence(matching_sponsorships),
        'message': f"This company has sponsored {len(matching_sponsorships)} " 
                  f"{job_title_normalized}s in the past 3 years"
    }
```

### Days 11-14: Build Resume Optimization Tool

**The "Strategic Minimalism" resume analyzer:**
```python
def analyze_resume(resume_pdf, target_job, target_ats):
    """
    Analyze resume and provide optimization suggestions
    """
    # Extract text from PDF
    resume_text = extract_text_from_pdf(resume_pdf)
    
    # Parse resume structure
    resume_data = parse_resume_structure(resume_text)
    
    # Check ATS compatibility
    ats_issues = check_ats_compatibility(resume_data, target_ats)
    
    # Keyword analysis
    job_keywords = extract_keywords(target_job['description'])
    resume_keywords = extract_keywords(resume_text)
    missing_keywords = set(job_keywords) - set(resume_keywords)
    
    return {
        'ats_compatibility': {
            'score': calculate_ats_score(ats_issues),
            'issues': ats_issues,
            'recommendations': generate_ats_fixes(ats_issues)
        },
        'keyword_match': {
            'score': len(resume_keywords & job_keywords) / len(job_keywords),
            'missing': list(missing_keywords),
            'suggestions': f"Add these keywords: {', '.join(list(missing_keywords)[:5])}"
        },
        'overall_recommendation': generate_overall_recommendation(
            ats_issues, missing_keywords, target_ats
        )
    }
```

---

## 📊 Expected Impact

### On Our 25,748 Companies

**ATS Detection Results (Projected):**
```
Estimated ATS Distribution:
├── Greenhouse: ~10,000 companies (38%)
│   └── Can fetch ~40,000-60,000 live jobs
├── Lever: ~4,000 companies (16%)
│   └── Can fetch ~15,000-25,000 live jobs
├── Ashby: ~1,500 companies (6%)
│   └── Can fetch ~5,000-8,000 live jobs
├── Other modern ATS: ~3,000 companies (12%)
├── Legacy/unknown: ~7,248 companies (28%)
└── Total API-accessible jobs: 60,000-93,000 positions
```

### On User Success Rates

**Current (without ATS intelligence):**
```
100 applications sent →
  80 pass ATS (20% auto-rejected due to format)
  40 seen by human (50% filtered by keywords)
  4 interviews (10% response rate)
  1 offer (25% conversion)
= 1% overall success rate
```

**With ATS intelligence:**
```
100 applications sent →
  95 pass ATS (optimized for each system)
  60 seen by human (better keyword matching)
  9 interviews (15% response rate - better targeting)
  2-3 offers (higher quality matches)
= 2-3% overall success rate

PLUS: Less time wasted per application
PLUS: Applications only to companies actually hiring
PLUS: Focus on companies with H1B history
```

**Net result:** 2-3x more offers with 50% less time spent applying

---

## 🎯 Week 2 Goals (Revised)

### Original Week 2 Goals
- [🔄] Expand to 500+ companies
- [ ] Build searchable API
- [ ] Launch frontend MVP

### Enhanced Week 2 Goals
- [✅] 25,748 companies (exceeded goal!)
- [🔄] ATS detection for all companies (Days 6-8)
- [🔄] Integrate live job feeds (Days 6-8)
- [🔄] Build resume optimization engine (Days 9-14)
- [ ] Launch MVP with "triple-win" features (Day 14)

### The New MVP Features

**Core features:**
1. Search companies by location, industry, funding
2. Filter by H1B sponsorship history
3. See live job openings (Greenhouse, Lever, Ashby)
4. Get ATS-specific resume recommendations
5. Track which jobs match your profile

**Killer feature:**
> *"Upload your resume → Select target job → Get optimized version for that company's ATS → Apply with confidence"*

---

## 💡 Why This Is Revolutionary

### Before: Spray and Pray
```
Student approach:
1. Find 100 random companies
2. Send same resume to all
3. 80% auto-rejected by ATS
4. 15% wrong format for that company
5. 5% actually considered
6. Hope for the best
```

### After: Surgical Precision
```
Our platform approach:
1. Show only funded companies with H1B history
2. Show only companies actively hiring NOW
3. Show only jobs matching your background
4. Optimize resume for each company's ATS
5. Apply with confidence to 10-20 best matches
6. 2-3x higher success rate
```

### The Time Savings

**Without our platform:**
- Research 100 companies: 20 hours
- Apply to 100 jobs: 40 hours
- Wait for responses: 4-6 weeks
- Result: 1-2 interviews maybe

**With our platform:**
- Platform pre-researched 25,748 companies
- Find 20 perfect matches: 30 minutes
- Optimize resume for each: 2 hours
- Apply to 20 jobs: 3 hours
- Result: 3-6 interviews likely

**Savings:** 55 hours + higher success rate + less stress

---

## 🎬 The Story So Far

**Days 1-3:** Built SEC scraper, filtered 568K companies  
**Day 4:** Verified 25,748 working domains  
**Day 5:** Scraped 425K pages, discovered H1B data goldmine  
**Day 6:** Realized ATS systems are a triple-win intelligence source  
**Next:** Build the smartest job platform for international students ever created

**The mission:** Every feature we add increases the probability that someone finds sponsorship before their visa expires.

**Days remaining:** 74  
**Companies mapped:** 25,748  
**Live jobs accessible:** 60,000-93,000  
**Success stories:** 0 (yet)  
**Probability of success:** Increasing daily 📈

---

## 🚀 Volunteer Opportunities

**New roles needed for Week 2:**

### ATS Integration Specialists
- Build Greenhouse/Lever API integrations
- Parse job postings into structured data
- Create job matching algorithms

### Resume Optimization Engineers  
- Build resume parsing (PDF → text → structure)
- Implement keyword extraction
- Create ATS compatibility checkers
- Design optimization algorithms

### Data Scientists
- Analyze ATS vs. H1B sponsorship correlations
- Build scoring algorithms
- Create prediction models

**Time commitment:** 5-10 hours/week  
**Impact:** Help international students beat the ATS systems that reject them

**Join:** https://www.humanitarians.ai/fellows

---

*"The difference between a good job platform and a great one isn't the quantity of listings. It's understanding the entire system - the money, the willingness, the process, and how to beat it."*

**Project Lead:** Nik Bear Brown  
**Organization:** Humanitarians AI (501c3)  
**Day:** 6 of 80  
**Budget:** Still $0  
**Innovation:** Triple-win ATS strategy  
**Impact:** Building...

```


---


## File: 80-days-day-07/README.md

```md
# Day 07

_Documentation coming soon..._


I'll search for the official government databases that contain H1B sponsorship and visa filing information.Perfect! Here are the key government databases for H1B sponsorship and visa filing data:

## **Primary Data Sources**

### **1. Department of Labor (DOL) - LCA Disclosure Data**
**Main Page:** https://www.dol.gov/agencies/eta/foreign-labor/performance

This is the primary source with **millions** of Labor Condition Application (LCA) records. The most recent data covers October 2024 through June 2025 (Q3 FY2025).

**Download Links for LCA Programs (H-1B, H-1B1, E-3):**
- Latest Q3 FY2025: https://www.dol.gov/sites/dolgov/files/ETA/oflc/pdfs/LCA_Disclosure_Data_FY2025_Q3.xlsx
- Historical data available back to FY2008 on the same page

**Key Features:**
- Contains company names, addresses, job titles, wage data, case status
- Updated quarterly
- Includes all certified LCA applications (required before H-1B petition filing)
- Excel format with record layouts provided

### **2. USCIS H-1B Employer Data Hub**
**Main Page:** https://www.uscis.gov/tools/reports-and-studies/h-1b-employer-data-hub

**Download Files:** https://www.uscis.gov/archive/h-1b-employer-data-hub-files

**Key Features:**
- Data from FY2009 through FY2025 (Q4)
- Includes approval and denial rates by employer
- Initial and continuing employment data
- Searchable by employer name, city, state, ZIP, NAICS code
- CSV/Excel downloads available

### **3. Other Related Programs**
The DOL also provides similar data for:
- **H-2A** (temporary agricultural workers)
- **H-2B** (temporary non-agricultural workers)
- **PERM** (permanent labor certification)

## **Important Notes for Your Project:**

1. **Data Volume:** The DOL LCA database has 6+ million records spanning multiple years
2. **Filtering Strategy:** You'll want to filter by:
   - **Decision Date** (last 2-3 years for active companies)
   - **Case Status** (Certified cases)
   - **Frequency** (number of applications per company)

3. **Data Quality:** 
   - Contains company FEIN (Federal Employer Identification Number)
   - Worksite addresses
   - Job titles and SOC codes
   - Wage information
   - Certification dates

4. **Complementary to Your SEC Data:** This gives you a different angle - companies that have **proven history** of visa sponsorship, not just funding status.

The DOL LCA data is particularly valuable because every H-1B petition **must** have a certified LCA first, so this represents actual sponsorship activity, not just potential.


I'll search for the major ATS systems currently used by companies.Based on the latest research, here are the **major ATS systems** you should focus on:

## **Top 5 ATS Systems (Fortune 500 - 2025 Data)**

### **1. Workday** - 39.3% market share
- **The #1 ATS** among Fortune 500 companies by far
- Enterprise-level, all-in-one HR platform
- Known for lengthy applications requiring unique account creation
- Resume parser often needs manual correction (15-20 min per application)
- Used by major retailers, banks, healthcare companies

### **2. SuccessFactors (SAP)** - 13.2% market share
- Second most popular among Fortune 500
- Part of SAP's HR suite
- Enterprise-focused

### **3. Taleo (Oracle)** - Declining but still significant
- Was previously tied with Workday (~22% in 2019)
- One of the oldest, most established systems
- Known for lengthy multi-page applications
- Heavy use of "knockout questions" (wrong answer = auto-rejection)
- Used by large banks, retail, manufacturing

### **4. iCIMS** - ~7-8% market share
- Enduring presence in enterprise
- Growing steadily

### **5. Greenhouse** - Growing rapidly
- **The one you mentioned!** 
- Modern, tech-focused ATS
- Very popular with startups and tech companies
- **Publicly accessible JSON feeds** (as you discovered!)
- Easy to detect via URL pattern: `greenhouse.io/[company-name]`
- Clean, fast application process
- Started at 0.4% of Fortune 500 in 2019, now growing

## **Other Major Modern ATS Systems**

### **Lever** 
- Greenhouse's main competitor
- Modern recruiting platform with CRM features
- Popular with tech and high-growth companies
- Fast, user-friendly

### **SmartRecruiters**
- Growing among mid-size to large companies
- Modern interface

### **Jobvite**
- Social recruiting features

### **BambooHR**
- Popular with SMBs
- Seamless transition from candidate to employee

### **Others Worth Noting:**
- **Workable** - Mid-market favorite
- **JazzHR** - Small business focus
- **Eightfold** - AI-powered, skills-based matching
- **PhenomPeople** - AI chatbots and personalization

## **Key Stats:**
- **97.8%** of Fortune 500 companies use a detectable ATS
- **Combined dominance**: Workday + SuccessFactors = 52.4% of Fortune 500
- Among **12,820+ companies** (broader market), distribution is much more varied

## **For Your "80 Days to Stay" Project:**

Since you're building detection for the top systems, I'd focus on:

1. **Greenhouse** ✓ (you've already got this working!)
2. **Workday** 
3. **Lever**
4. **Taleo**
5. **iCIMS**

These five will likely cover the majority of companies that international students would target. Your assumption is correct - if it's not one of the top 5-10, they're probably reviewing manually or using a proprietary system.

The Greenhouse approach you described (trying `company-name.greenhouse.io`) works well. Similar patterns exist for other systems:
- **Lever**: `jobs.lever.co/[company-name]`
- **Workday**: More complex, usually `[company].wd1.myworkdayjobs.com` or similar

```


---


## File: 80-days-day-08/README.md

```md
# Day 08: Mapping the Treasure Map

This README outlines the technical requirements and mission for **Day 08**. Our goal is to intersect financial capacity (SEC data) with historical willingness (Department of Labor data) and deploy LLM agents to act as "Recruiting Experts" for international talent.

---

## 1. Mapping the Visa Data Goldmine

To move from "likely to hire" to "historically proven to hire," we will map our SEC startup list against official US Government datasets.

### Data Sources to Download

* **DOL LCA Disclosure Data:** [LCA Performance Data](https://www.dol.gov/agencies/eta/foreign-labor/performance). This contains every H-1B, H-1B1, and E-3 application.
* **USCIS H-1B Employer Data Hub:** [USCIS Data Hub](https://www.uscis.gov/tools/reports-and-studies/h-1b-employer-data-hub). This provides approval/denial rates and counts for "Initial" (new hires) vs "Continuing" employment.

### The Mapping Logic

**The Challenge:** Company names in SEC filings (*Acme Bio, Inc.*) often differ from DOL filings (*Acme Bio LLC*).

1. **Normalization:** Strip suffixes (Inc, LLC, Corp), remove punctuation, and lowercase all names.
2. **Fuzzy Matching:** Use the `RapidFuzz` library to join the 25,000 SEC companies with the 100,000+ unique employers in the LCA database.
3. **Resulting Schema:**
* `company_id` (SEC Accession Number)
* `total_h1b_filings` (Last 3 years)
* `approval_rate` (%)
* `top_job_titles_sponsored` (e.g., Software Engineer, Data Scientist)
* `median_salary_offered`



---

## 2. LLM Recruiting Expert: The Inquiry Agent

We will use an LLM (Gemini 1.5 Pro or GPT-4o) to analyze the stripped website text. It will act as a **Tenacious Recruiting Advocate** for an international student.

### Expert Prompt Strategy

> "You are a Senior Technical Recruiter specializing in international talent mobility. Analyze the provided company text and generate a 'Sponsorship Intelligence Report.' If you were advising an international student, what 3 critical questions would you ask this company’s Head of Talent? Always provide the strategic 'Why' for each question."

### Sample Questions & Reasons the LLM Should Generate:

1. **"What is your policy on hiring candidates currently on STEM OPT?"**
* *Reason:* It tests if the company knows that STEM OPT requires **zero** immediate cost or paperwork for the first 3 years.


2. **"Does your legal budget currently support H-1B cap-subject petitions?"**
* *Reason:* High-growth startups often have the money but haven't allocated a "line item" for legal fees ($5k-$10k).


3. **"Have you previously used an 'Employer of Record' (EOR) for global hires?"**
* *Reason:* If they use Deel or Remote.com, they already have a "Global First" mindset, making them more open to US-based visa holders.



---

## 3. Finding "Hidden" Opportunity Startups

We want to identify startups that have **never** sponsored before but are **Prime Targets** based on Day 06 intelligence.

### Target Profile:

* **The "Talent Starved" Founder:** Series A tech startups with <20 employees and $10M+ in funding. They are likely struggling to outbid Google for US talent.
* **Modern Infrastructure:** Companies using **Greenhouse** or **Lever**. These systems make it easy to manage complex paperwork if they choose to start sponsoring.
* **International DNA:** Founders who were international students themselves (easily detectable by LLM analysis of "About" page bios mentioning non-US universities).

---

## 🚀 Google Cloud Next Steps for the Team

Since we have **Google Cloud Credits**, the team will move the pipeline from local scripts to a production-ready cloud environment:

1. **Cloud Storage (GCS):** Upload the 425k scraped HTML pages and the multi-GB DOL datasets.
2. **BigQuery:** Load the SEC and DOL datasets into BigQuery. Use **BigQuery ML** or standard SQL to handle the massive fuzzy-join operation. This is significantly faster than local Python for millions of rows.
3. **Vertex AI (Batch API):** Use the Batch Prediction API to run our "Recruiting Expert" LLM prompt against all 25,748 verified companies in one parallelized swoop.
4. **Cloud Functions:** Build a trigger that automatically scrapes and analyzes a company the moment a new Form D is filed with the SEC.

---

**Mission for tonight:** Finalize the SQL join between `startups_master.json` and the `LCA_Disclosure_Data.csv`. If a company has $5M+ and 1+ historical H-1B, they are **Tier 1 Priority**.

```


---


## File: 80-days-day-08/urls-agent/README.md

```md
## How to run this script

This script takes a list of company names and creates a CSV with their websites.

---

## 1. What you need to edit

- **In `agent.py`** (near the bottom) find:

```python
company_names = []
```

- Replace it with one of these options:

- **Use `data_websites.csv` (recommended)**:

```python
import pandas as pd

df = pd.read_csv("data_websites.csv")
company_names = df["company_name"].dropna().tolist()  # or .iloc[:50] for a small test
```

- **Or: simple manual test list**:

```python
company_names = [
    "Google LLC",
    "Microsoft Corporation",
]
```

Nothing else in the code needs to be changed for normal use.

---

## 2. Environment variables (`.env`)

This zip **already contains a `.env` file** in the project root (same folder as `agent.py`).

- Open `.env` and **replace the values with your own keys**:

```bash
you=YOUR_YOU_DOT_COM_API_KEY
GEMINI_API_KEY=YOUR_GEMINI_API_KEY
```

These are required for:
- **`you`**: You.com search (used to fetch web results).
- **`GEMINI_API_KEY`**: Gemini model (used to pick the website).


---

## 3. Install and run

This zip **already contains a virtual environment** (`myenv`).

From this folder in a terminal:

```bash
source myenv/bin/activate  # Windows: myenv\Scripts\activate
python agent.py
```

Make sure you have already edited `.env` with your own keys (section 2).

If the bundled env ever breaks, you can create a new one:

```bash
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate
pip install langgraph pydantic pandas requests python-dotenv google-genai youdotcom
python agent.py
```

You will see progress logs in the terminal while it runs.

---

## 4. Input and output

- **Input**:
  - The `company_names` list you set in `agent.py`.
  - Typically sourced from `data_websites.csv` → column `company_name`.

- **Output**:
  - A file called **`Websites_data.csv`** in this folder.
  - Each row has:
    - `company_name`
    - `website` (chosen official website or blank if not confident)
    - `reasoning`
    - `alternative_url` (optional backup URL)

You only need to:
- Set `company_names` in `agent.py`.
- Put your keys in `.env`.
- Run `python agent.py` and use `Websites_data.csv` as the result.


```


---


## File: 80-days-day-08/urls-agent/agent.py

```py
from langgraph.graph import StateGraph, START, END 
from pydantic import BaseModel, AnyUrl
from typing import TypedDict, Optional, Dict, List
from concurrent.futures import ThreadPoolExecutor, as_completed
import requests
import pandas as pd 
from dotenv import load_dotenv
import os 
from google import genai
import threading
import time 
from prompt import WEBSITE_EXTRACTION_PROMPT
from rate_limiting import RateLimiter
from config import MODEL, THREAD_WORKERS
from utils import search, normalize_url

load_dotenv()
start = time.time()
rate_limiter = RateLimiter()

class WebsiteFinder(TypedDict):
    company_name: str 
    searched_results: List[Dict[str, str]] 
    results: Dict[str, str]
    tried_enhanced: bool = False

class Content(BaseModel):
    official_website: Optional[str] = None
    reasoning: str 
    alternative_url: Optional[str] = None
    error: bool = False

def enhanced_search(state: WebsiteFinder) -> WebsiteFinder:
    company = state['company_name']
    cleaned = company.replace(" INC", "").replace(" LLC", "").replace(" CORP", "").strip()
    query = f'{cleaned} company'
    print(f'Enhanced search for {company} → Query: {query}')
    state['searched_results'] = search(query)
    state['tried_enhanced'] = True
    return state

def search_web(state: WebsiteFinder) -> WebsiteFinder:
    state['searched_results'] = search(state['company_name'] + ' company')
    return state 

def llm_extraction(state: WebsiteFinder) -> WebsiteFinder:
    rate_limiter.wait()
    client = genai.Client(api_key=os.environ.get("GEMINI_API_KEY"))

    if not state['searched_results']:
        return state
    max_retries = 2
    for attempt in range(max_retries):
        try:
            prompt = WEBSITE_EXTRACTION_PROMPT.format(
            company_name = state['company_name'], search_results = state['searched_results'])

            response = client.models.generate_content(
                model=MODEL,
                contents=prompt,
                config={
                    "response_mime_type": "application/json",
                    "response_schema": Content,
                }
            )

            result: Content = response.parsed
            state['results'] = result.model_dump()
            return state
        
        except genai.errors.ServerError as e:
            # 503 Service Unavailable
            if attempt < max_retries - 1:
                wait_time = 2 ** attempt 
                print(f"503 error from Gemini for {state['company_name']}, retry {attempt+1} in {wait_time}s")
                time.sleep(wait_time)
                continue
            else:
                print(f"Failed from Gemini after {max_retries} retries: {state['company_name']}")

        except Exception as e:
            # Unexpected errors
            print(f"Unexpected error from Gemini for {state['company_name']}: {e}")
            break

    # All retries exhausted
    state['results'] = {
        'official_website': None,
        'reasoning': f'API failed after {max_retries} retries',
        'alternative_url': None,
        'error': True
    }
    return state

def router(state: WebsiteFinder) -> str:
    results = state['results']
    if results.get('official_website') or results.get('alternative_url'):
        return 'validate_url'
    elif not state.get('tried_enhanced', False):
        return 'enhanced_search'
    else:
        return 'END'

def validation(state: WebsiteFinder) -> WebsiteFinder:    
    url1 = normalize_url(state['results'].get('official_website'))
    url2 = normalize_url(state['results'].get('alternative_url'))
    
    if url1:
        state['results']['official_website'] = url1
    if url2:
        state['results']['alternative_url'] = url2
    
    headers = {'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)'}

    if url1:
        try:
            r = requests.get(url1, headers=headers, allow_redirects=True, timeout=10, stream=True)
            r.close()
        except requests.exceptions.RequestException:
            print(f"{url1} unreachable")
            state['results']['official_website'] = None
            
            if url2:
                try:
                    r = requests.get(url2, headers=headers, allow_redirects=True, timeout=10, stream=True)
                    r.close()
                except requests.exceptions.RequestException:
                    print(f"{url2} also unreachable")
                    state['results']['alternative_url'] = None

    return state

def process_one(company_name):
    initial_state = {
        "company_name": company_name, 
        "results": {},
        "searched_results": [],
        "tried_enhanced": False
    }
    output_state = workflow.invoke(initial_state)
    return output_state

graph = StateGraph(WebsiteFinder)

# Nodes
graph.add_node("Search_Web", search_web)
graph.add_node("LLM_Extraction", llm_extraction)
graph.add_node("enhanced_search", enhanced_search)
graph.add_node("Validate_Url", validation)

# Edges
graph.add_edge(START, "Search_Web")
graph.add_edge("Search_Web", "LLM_Extraction")
graph.add_conditional_edges("LLM_Extraction", router, {"enhanced_search": "enhanced_search",
                                                       "validate_url": "Validate_Url" ,
                                                       "END": END})
graph.add_edge("enhanced_search", "LLM_Extraction")
graph.add_edge("Validate_Url", END)

workflow = graph.compile()

# Main processing
successful = []
failed = []

company_names = []

write_lock = threading.Lock()

print(f"Processing {len(company_names)} companies...")

with ThreadPoolExecutor(max_workers=THREAD_WORKERS) as executor:
    futures = {executor.submit(process_one, c): c for c in company_names}
    
    for i, future in enumerate(as_completed(futures), 1):
        output_state = future.result()
        
        with write_lock:
            if output_state.get('error'):
                failed.append({
                    'company': output_state['company_name'],
                    'error': output_state['results']['error']
                })
            else:
                row = {
                    "company_name": output_state['company_name'],
                    "website": output_state['results']['official_website'],
                    "reasoning": output_state['results']['reasoning'],
                    "alternative_url": output_state['results']['alternative_url']
                }
                successful.append(row)
                
                pd.DataFrame([row]).to_csv(
                    'Websites_data.csv',
                    mode='a',
                    header=not os.path.exists('Websites_data.csv'),
                    index=False
                )
            
            # Progress every 100
            if i % 100 == 0:
                print(f"Progress: {i}/{len(company_names)} | "
                      f"Success: {len(successful)} | Failed: {len(failed)}")
end = time.time()
print(f"\n Done! Success: {len(successful)}, Failed: {len(failed)}, time taken: {end - start}")

    









```


---


## File: 80-days-day-08/urls-agent/config.py

```py
MODEL = "gemini-2.5-flash"
RPM_LIMIT = 900
THREAD_WORKERS = 40
```


---


## File: 80-days-day-08/urls-agent/graph_image_render.py

```py
from IPython.display import Image, display

workflow = None 
# Generate PNG
png_bytes = workflow.get_graph().draw_mermaid_png()

# Save to file
with open("workflow.png", "wb") as f:
    f.write(png_bytes)

```


---


## File: 80-days-day-08/urls-agent/prompt.py

```py
# WEBSITE_EXTRACTION_PROMPT = """Extract official website for: {company_name}

# RULES:
# 1. URLs must exist in search results
# 2. Never generate URLs

# MATCHING:

# Direct Match:
# - Domain = company name (ignore spaces/hyphens)
# - Domain = acronym shown in results

# Fuzzy Match (STRICT - all must be true):
# - Names similar (removing suffixes/spaces)
# - Business type matches (same industry)
# - Geographic location compatible (if location-specific)
# - Company scale similar (both startups OR both enterprises)

# Relationships (needs EXPLICIT phrase):
# - "acquired by X" / "subsidiary of X" → X's root domain
# - "company behind X" / "maker of X" → X's site
# - "formerly X" / "rebranded to X" → current name

# DO NOT infer relationships from:
# - "Holdings" in name
# - Listing properties/portfolios
# - Similar names alone
# - Industry overlap

# URL CLEANING:
# Strip these paths: /news/, /press/, /blog/, /team/, /property/, /article/
# Extract root domain only 

# EXCLUDE:
# linkedin, facebook, twitter, instagram, crunchbase, bloomberg, pitchbook, zoominfo, dnb, glassdoor, indeed, wikipedia

# CRITICAL REASONING RULES:
# ✓ Use: "explicitly states", "directly matches", "confirmed by"
# ✗ Avoid: "suggests", "indicates", "likely", "presumed", "aligns with"

# Multiple signals required (2+):
# - Appears multiple times
# - Has official pages (/about, /contact, /company)
# - Self-describes as company
# - Description matches business
# - Do not try to overguess, you have to have highly confident and provide enough evidence for reasoning

# SEARCH RESULTS:
# {search_results}
# """


WEBSITE_EXTRACTION_PROMPT = """Extract official website for: {company_name}

ABSOLUTE RULES:
1. URLs MUST exist in search results
2. NEVER generate URLs
3. NULL if ANY doubt

VALIDATION - Step 1:
Company name (or variation: no INC/LLC, acronym, no spaces) MUST appear.
Not found → NULL

MATCHING - Step 2:

A) Direct Match ONLY:
✓ Domain = exact company name (ignore spaces/hyphens/INC/LLC)
✓ Domain = acronym EXPLICITLY shown in results

B) Fuzzy Match FORBIDDEN unless ALL true:
✓ Business descriptions EXPLICITLY identical
✓ Locations EXPLICITLY compatible
✓ Scale EXPLICITLY similar
✗ Missing even ONE → NULL

C) Explicit Relationships ONLY:
✓ Text MUST say: "acquired by X", "X acquired Y", "subsidiary of X"
✓ Extract X's root domain (remove /news/, /press/, /blog/)
✗ No relationship text → NULL

ABSOLUTE PROHIBITIONS:

✗ ZERO character substitutions allowed
  Examples of FORBIDDEN matches:
  - Company ≠ Cumpany (o≠u)
  - ANY letter change = NULL

✗ ZERO number/word conversions
  - 1 ≠ One
  - 2 ≠ Two
  - Unless EXPLICIT text shows both

✗ ZERO Holdings assumptions
  - "X Holdings" does NOT own "X Brand"
  - Needs text like: "X Holdings owns Y" or "X Holdings operates Y"

✗ ZERO property/portfolio inferences
✗ ZERO similar name assumptions

EXCLUDE:
linkedin, facebook, twitter, instagram, crunchbase, bloomberg, pitchbook, zoominfo, dnb, glassdoor, indeed, wikipedia

VALIDATE (need 2+ signals):
- Multiple appearances
- Has /about, /contact, /company
- Self-describes as company
- Business matches

REASONING MUST include:
1. Which rule (A/B/C) applied
2. Exact matching evidence
3. Multiple validation signals
4. High confident decisions should be made, else better to leave null 
5. If you still believe but are not 100 percent sure, you have a alternate url attribute. 

FORBIDDEN REASONING WORDS:
"suggests", "likely", "variation", "resembles", "similar to", "allowing for"

REQUIRED REASONING WORDS:
"explicitly states", "directly matches", "confirmed by"

WHEN IN DOUBT → NULL
Better 100 false negatives than 1 false positive

SEARCH RESULTS:
{search_results}
"""

```


---


## File: 80-days-day-08/urls-agent/rate_limiting.py

```py
import threading
import time 
from config import RPM_LIMIT

class RateLimiter:
    def __init__(self) -> None:
        self.max_per_minute = RPM_LIMIT
        self.calls = []
        self.lock = threading.Lock()

    def wait(self):
        now = time.time()
        self.calls = [t for t in self.calls if now - t < 60]

        if len(self.calls) >= self.max_per_minute:
            oldest_call = self.calls[0]
            time_since_oldest_call = now - oldest_call
            wait_time = 60 - time_since_oldest_call + 0.1
            time.sleep(wait_time)

        self.calls.append(now)
```


---


## File: 80-days-day-08/urls-agent/utils.py

```py
import time
from youdotcom import You
from youdotcom.errors import YouDefaultError
from typing import List, Dict
import os 

def search(query: str) -> List[Dict[str, str]]:
    max_retries = 3
    
    for attempt in range(max_retries):
        try:
            with You(os.getenv('you')) as you:
                result = you.search.unified(query=query)
            
            search_results = []
            for web_item in result.results.web[:10]:
                search_results.append({
                    "Title": web_item.title,
                    "URL": web_item.url,
                    "Description": web_item.description,
                })
            
            return search_results
        
        except YouDefaultError as e:
            error_msg = str(e).lower()
            status = getattr(e, 'status_code', 0)
            
            # 429 Rate Limit
            if status == 429 or "rate limit" in error_msg:
                if attempt < max_retries - 1:
                    wait = 10
                    print(f"Search rate limit, waiting {wait}s...")
                    time.sleep(wait)
                    continue
                else:
                    print(f"Search rate limit exhausted for: {query}")
                    return []
            
            # 503 Service Unavailable
            elif status in [503, 504] or "network error" in error_msg or "timeout" in error_msg:
                if attempt < max_retries - 1:
                    wait = 3 ** attempt  
                    print(f"Search {status} error, retry {attempt+1} in {wait}s: {query[:50]}")
                    time.sleep(wait)
                    continue
                else:
                    print(f"Search failed after {max_retries} retries: {query[:50]}")
                    return []
            
            # Other errors
            else:
                print(f"Search error for '{query[:50]}': {e}")
                if attempt < max_retries - 1:
                    time.sleep(2)
                    continue
                return []
        
        except Exception as e:
            print(f"Unexpected search error for '{query[:50]}': {e}")
            if attempt < max_retries - 1:
                time.sleep(2)
                continue
            return []
    
    return []  

def normalize_url(url):
    if not url:
        return None
    url = url.strip()
    if not url.startswith(('http://', 'https://')):
        return f'https://{url}'
    return url
```


---


## File: 80-days-csv/README.md

```md
# 80 Days to Stay: 30K+ Leads Ready for Action

**80 Days to Stay** is an open-source initiative turning SEC financial filings into a *visa goldmine*—helping international students identify funded startups that have a history of H-1B sponsorship **before deadlines expire**.

We’ve officially released our **master dataset with 30,000+ leads**, intersecting:
- Recent company funding data  
- Historical H-1B sponsorship records  

## Help Us Stress-Test the Data

### Try It Out
Use **`mapped_student_employment_targets.csv`** to identify potential employers aligned with your visa timeline.

### Report Errors
Found broken links or misaligned data? Please flag them.

### Suggest Improvements
What columns, filters, or features would make your job search faster or more effective?

All feedback, error reports, and feature ideas are welcome—post them in this thread or submit via GitHub.  
Every issue you surface helps keep a talented professional in the U.S. innovation ecosystem.

---

**Technical Overview**  
Watch this short video to understand the methodology behind the 80 Days to Stay data pipeline:  
https://www.youtube.com/watch?app=desktop&v=5nNZlq40e6c

---

Best,  
**Nik Bear Brown**  
*80 Days to Stay*  
Humanitarians AI (501c3)


```


---


## File: ats-scripts/Scope.MD

```MD
# ATS Job Scraper & Job Board Platform
## Product Scope Document

**Project Name:** 80 Days to Stay — ATS Job Aggregation & Job Board  
**Version:** 1.0  
**Date:** February 16, 2025  
**Prepared By:** Project Management  
**Team Size:** 8 Members  
**Status:** Active — Phase 1 In Progress

---
a
## TABLE OF CONTENTS

1. Executive Summary
2. Project Objectives & Vision
3. Current Status & Completed Work
4. System Architecture Overview
5. ATS Platform Target List & Tiering
6. Unified Output Schema
7. Phase Breakdown & Scope of Work
8. Team Roles & Work Assignment (8 Members)
9. Project Timeline & Milestones
10. Technical Standards & Conventions
11. Risk Register
12. Definition of Done
13. Appendix

---

## 1. EXECUTIVE SUMMARY

This project builds an end-to-end job aggregation platform that discovers, scrapes, normalizes, and stores job listings from all major Applicant Tracking Systems (ATS) used by companies — with a focus on companies likely to sponsor visas for international students. The scraped data will be stored in a NoSQL database and served through a public-facing job board web application.

Every ATS scraper follows a proven **two-phase architecture**:

- **Phase 1 — Discovery:** Identify live company career endpoints on a given ATS, validate them, and harvest all job listing URLs via pagination.
- **Phase 2 — Extraction:** Visit each discovered job URL, extract full structured details (title, description, location, department, apply link, etc.), and output normalized JSON + CSV.

This pattern scales across all ATS platforms. Complexity varies from simple public REST API calls (Greenhouse, Lever) to full browser-automated scraping for JavaScript-heavy enterprise systems (Workday, Taleo).

**Primary Use Case:** International students searching for jobs at companies that sponsor work visas. Greenhouse and Lever alone cover an estimated 60–70%+ of visa-sponsoring tech companies, while enterprise ATS systems like Workday, iCIMS, and Taleo cover the Fortune 500 segment.

---

## 2. PROJECT OBJECTIVES & VISION

| # | Objective | Success Metric |
|---|-----------|---------------|
| 1 | Build scrapers for all major ATS platforms, tiered by market share and complexity | Scrapers completed and tested for 10+ ATS platforms |
| 2 | Produce normalized JSON metadata for every scraped job | 100% of jobs output with unified schema (company, role, description, location, date, apply URL, etc.) |
| 3 | Build an ATS–Company mapping registry | Database of 1,000+ companies mapped to their ATS provider with URL patterns |
| 4 | Store all job data in a NoSQL database | MongoDB/DynamoDB with deduplication, timestamps, and source tracking |
| 5 | Build a cloud pipeline for scheduled scraping | Automated runs at configurable intervals (daily/hourly) |
| 6 | Launch a frontend job board application | Public web app with search, filter, and browse for end users |

---

## 3. CURRENT STATUS

### ✅ Tier 1 Scrapers — in Progress (Shared by Prof. Nik)

**Greenhouse Scraper**
- Public API endpoint: `https://boards-api.greenhouse.io/v1/boards/{company}/jobs`
- No authentication required; returns clean JSON
- Handles company name normalization (strips Inc., LLC, Corp., etc.)
- Auto-creates subdirectories; outputs `jobs.json` + `metadata.json`
- **Status: Needs testing & validation by team**

**Lever Scraper**
- Public API endpoint: `https://api.lever.co/v0/postings/{company}`
- Same architecture and ease of access as Greenhouse
- Identical input format (company list via CLI or file)
- **Status: Needs testing & validation by team**

**Technical Notes (Both Scripts):**
- Handle encoding issues (UTF-8, UTF-16, etc.)
- Rate limit respectfully (0.5s delay, configurable)
- Normalize company names intelligently
- Generate both raw data (`jobs.json`) and metadata
- Can process from CLI or file input
- ~200 lines each, clean Python

### Reference Architecture — Avature Scraper (Prior Project)

A separate prior project implemented the same two-phase pattern for the Avature ATS:

- `phase1_discovery.py` — Parses seed URLs → extracts domains/site paths → validates live endpoints → harvests job URLs via pagination → deduplicates → outputs `discovered_jobs.csv` + `live_endpoints.csv`
- `phase2_extraction.py` — Visits each job URL → extracts full details (title, location, date, department, description, apply URL) → saves progress every 100 jobs (resumable) → outputs `jobs_full_details.csv` + `jobs_full_details.json`
- Configuration: `REQUEST_TIMEOUT`, `PAGE_SIZE`, `MAX_PAGES`, `DELAY_BETWEEN_REQUESTS`, `MAX_RETRIES`, `SAVE_INTERVAL`

**This two-phase (Discovery → Extraction) architecture is the template every team member should follow when building their assigned ATS scraper.**

---

## 4. SYSTEM ARCHITECTURE OVERVIEW

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        DATA COLLECTION LAYER                            │
│                                                                         │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐     │
│  │Greenhouse│ │  Lever   │ │ Workday  │ │  iCIMS   │ │  Taleo   │ ... │
│  │ Scraper  │ │ Scraper  │ │ Scraper  │ │ Scraper  │ │ Scraper  │     │
│  └────┬─────┘ └────┬─────┘ └────┬─────┘ └────┬─────┘ └────┬─────┘     │
│       │             │            │             │            │            │
│       ▼             ▼            ▼             ▼            ▼            │
│  ┌──────────────────────────────────────────────────────────────┐       │
│  │              UNIFIED JSON OUTPUT (Normalized Schema)         │       │
│  │  { company, title, location, description, apply_url,        │       │
│  │    date_posted, department, employment_type, ats_source,     │       │
│  │    source_url, scraped_at }                                  │       │
│  └──────────────────────────────┬───────────────────────────────┘       │
└─────────────────────────────────┼───────────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                        DATA STORAGE LAYER                               │
│                                                                         │
│  ┌──────────────────────┐    ┌──────────────────────────┐               │
│  │   Jobs Collection    │    │ ATS-Company Registry     │               │
│  │   (NoSQL — MongoDB)  │    │ (company → ATS + pattern │               │
│  │   - All scraped jobs │    │  + career URL + slug)    │               │
│  │   - Deduplication    │    │                          │               │
│  │   - Timestamps       │    │                          │               │
│  └──────────┬───────────┘    └──────────────────────────┘               │
└─────────────┼───────────────────────────────────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                     PIPELINE & ORCHESTRATION LAYER                       │
│                                                                         │
│  ┌──────────────────────────────────────────────────┐                   │
│  │  Cloud Scheduler (cron / AWS Lambda / Cloud Fn)  │                   │
│  │  - Runs scrapers at set intervals                │                   │
│  │  - Handles retries & error logging               │                   │
│  │  - Updates DB with new/changed/removed jobs      │                   │
│  └──────────────────────────────────────────────────┘                   │
└─────────────────────────────────────────────────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                        PRESENTATION LAYER                               │
│                                                                         │
│  ┌──────────────────────────────────────────────────┐                   │
│  │  Job Board Web Application (Frontend)            │                   │
│  │  - Search & filter jobs                          │                   │
│  │  - Browse by company, ATS, location, role        │                   │
│  │  - Job detail pages with apply links             │                   │
│  │  - Responsive / mobile-friendly                  │                   │
│  └──────────────────────────────────────────────────┘                   │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 5. ATS PLATFORM TARGET LIST & TIERING

Each scraper is assigned a **Tier** based on complexity and a **Priority** based on market relevance.

### Tier 1 — Easy (Public REST APIs, no auth, clean JSON)

| ATS Platform | Market Coverage | API / Endpoint Pattern | Complexity | Status |
|---|---|---|---|---|
| **Greenhouse** | 15–20% of tech/startups | `boards-api.greenhouse.io/v1/boards/{company}/jobs` | LOW | ✅ Script received — needs testing |
| **Lever** | Startups & scale-ups | `api.lever.co/v0/postings/{company}` | LOW | ✅ Script received — needs testing |
| **Ashby** | Growing mid-market | Public API available | LOW | 🔲 To build |
| **SmartRecruiters** | Mid-market | Public job API available | LOW | 🔲 To build |
| **Jobvite** | Mid-market | Public career page API | LOW-MED | 🔲 To build |

### Tier 2 — Medium (Semi-structured, HTML scraping required)

| ATS Platform | Market Coverage | Approach | Complexity | Status |
|---|---|---|---|---|
| **BambooHR** | SMBs | Scrape structured career pages | MEDIUM | 🔲 To build |
| **JazzHR** | SMBs | Scrape career page feeds | MEDIUM | 🔲 To build |
| **Recruitee** | SMBs / EU market | Public API + scraping | MEDIUM | 🔲 To build |
| **Workable** | SMBs & growing cos | Scrape career site widgets | MEDIUM | 🔲 To build |
| **Teamtailor** | Growing in EU | Career site scraping | MEDIUM | 🔲 To build |
| **Avature** | Enterprise/niche | `*/SearchJobs/` pagination pattern | MEDIUM | ✅ Reference architecture exists |

### Tier 3 — Hard (No public API, JS-heavy, browser automation likely needed)

| ATS Platform | Market Coverage | Approach | Complexity | Status |
|---|---|---|---|---|
| **Workday** | ~37% of Fortune 500 | Scrape `*.myworkdayjobs.com/*`; JS-heavy | HIGH | 🔲 To build |
| **iCIMS** | ~10.7% market share | Scrape career page implementations | HIGH | 🔲 To build |
| **Taleo / Oracle** | ~13.4% of Fortune 500 | Scrape public career pages; auth-gated APIs | HIGH | 🔲 To build |
| **SAP SuccessFactors** | Enterprise HR suites | Deep enterprise scraping | HIGH | 🔲 To build |
| **Cornerstone OnDemand** | Enterprise | HTML/JS scraping | HIGH | 🔲 To build |

### Strategic Note
Tier 1 platforms (especially Greenhouse + Lever) cover the companies most likely to sponsor visas for international students (tech startups, scale-ups). Tier 3 enterprise platforms add Fortune 500 coverage but require 3–4× the development effort. The team should **nail Tier 1 first**, then decide on Tier 2/3 based on data from test runs.

---

## 6. UNIFIED OUTPUT SCHEMA

**Every scraper, regardless of ATS platform, MUST output data conforming to this schema.**

### Job Record — JSON Schema

```json
{
  "job_id": "string — unique ID (ATS-native ID or generated hash)",
  "title": "string — job title",
  "company_name": "string — normalized company name",
  "company_slug": "string — URL-safe company identifier",
  "ats_source": "string — e.g. greenhouse, lever, workday, icims",
  "source_url": "string — original job listing URL",
  "apply_url": "string — direct application URL",
  "location": "string — job location (city, state, remote, etc.)",
  "department": "string — department or team (if available)",
  "employment_type": "string — Full-time, Part-time, Contract, Intern",
  "date_posted": "string — ISO 8601 date or null",
  "description_text": "string — clean plain-text job description",
  "description_html": "string — raw HTML description (if available)",
  "salary_range": "string — salary info if posted (often null)",
  "metadata": {
    "scraped_at": "string — ISO 8601 timestamp of scrape",
    "scraper_version": "string — e.g. v1.0",
    "extraction_status": "string — success | error | partial",
    "raw_response_hash": "string — MD5/SHA hash for deduplication"
  }
}
```

### ATS–Company Registry Record

```json
{
  "company_name": "string — normalized name",
  "company_slug": "string — URL-safe slug",
  "ats_platform": "string — greenhouse, lever, workday, etc.",
  "career_page_url": "string — base career page URL",
  "api_endpoint_pattern": "string — API URL template if applicable",
  "url_slug_on_ats": "string — the company's slug on the ATS platform",
  "last_scraped_at": "string — ISO 8601",
  "total_jobs_last_scrape": "integer",
  "is_active": "boolean",
  "discovery_source": "string — how we found this company (SEC, manual, etc.)",
  "notes": "string"
}
```

---

## 7. PHASE BREAKDOWN & SCOPE OF WORK

---

### PHASE 1: Research & ATS Discovery (Week 1 — Feb 16–22, 2025)

**Goal:** Every team member understands how ATS systems work, how career page URLs are structured, how job data is exposed, and what the scraping approach looks like for each platform.

| Task ID | Task | Description | Deliverable |
|---------|------|-------------|-------------|
| 1.1 | ATS Fundamentals Research | Each member studies their assigned ATS: how companies post jobs, how career pages are generated, what URL patterns exist, whether APIs are public | Research doc per ATS (1–2 pages) |
| 1.2 | URL Pattern Documentation | Document the URL structure for career pages and job listings on each ATS (e.g., `boards-api.greenhouse.io/v1/boards/{slug}/jobs`) | URL pattern cheat sheet |
| 1.3 | Compile Master Company List | Gather a list of companies and identify which ATS each uses. Sources: SEC Form D filings, public data, manual research, builtwith.com | `company_ats_mapping.csv` |
| 1.4 | Test Existing Scripts | Team members assigned to Greenhouse/Lever: pull Prof. Nik's scripts, run them against a sample company list, verify output, document bugs | Test report with pass/fail per company |
| 1.5 | Set Up Shared Repository | Create a monorepo with folder structure: `/scrapers/{ats_name}/`, `/data/`, `/docs/`, `/tests/`, shared `requirements.txt` | GitHub repo initialized |

---

### PHASE 2: Scraper Development — Tier 1 & Tier 2 (Week 1–2 — Feb 16–Mar 1, 2025)

**Goal:** All assigned scrapers built, tested, and producing valid JSON output conforming to the unified schema.

**Every scraper must implement:**

1. **Discovery Module** (`discovery.py`)
   - Accept a company list (file or CLI)
   - Normalize company names (strip Inc., LLC, Corp., etc.)
   - Construct ATS-specific career page / API URL
   - Validate if endpoint is live and has active jobs
   - Handle pagination to discover ALL job URLs
   - Output: `discovered_jobs.csv` + `live_endpoints.csv`

2. **Extraction Module** (`extraction.py`)
   - Read `discovered_jobs.csv`
   - Visit each job URL and extract full details
   - Map extracted data to the unified JSON schema
   - Save progress periodically (resumable)
   - Output: `jobs_full_details.json` + `jobs_full_details.csv` + `metadata.json`

3. **Configuration**
   - `REQUEST_TIMEOUT`, `DELAY_BETWEEN_REQUESTS`, `MAX_RETRIES`, `MAX_PAGES`, `SAVE_INTERVAL`
   - All configurable at top of script

4. **Error Handling & Rate Limiting**
   - Respectful delays between requests (minimum 0.3–0.5s)
   - Retry logic with exponential backoff
   - Graceful handling of 404s, timeouts, encoding issues
   - Logging to file

| Task ID | Task | Assignee Guidance | Deliverable |
|---------|------|-------------------|-------------|
| 2.1 | Test & Validate Greenhouse Scraper | Run against 50+ companies, fix bugs, ensure schema compliance | Validated `greenhouse_scraper.py` + test results JSON |
| 2.2 | Test & Validate Lever Scraper | Same as above for Lever | Validated `lever_scraper.py` + test results JSON |
| 2.3 | Build Ashby Scraper | Research Ashby's public API, build discovery + extraction | `ashby_scraper.py` + output samples |
| 2.4 | Build SmartRecruiters Scraper | Research SmartRecruiters API, build full scraper | `smartrecruiters_scraper.py` + output samples |
| 2.5 | Build Workable Scraper | Research Workable's career widget/API, build scraper | `workable_scraper.py` + output samples |
| 2.6 | Build BambooHR Scraper | Research career page structure, build scraper | `bamboohr_scraper.py` + output samples |
| 2.7 | Build Jobvite Scraper | Research Jobvite career pages/API, build scraper | `jobvite_scraper.py` + output samples |
| 2.8 | Begin Workday Scraper R&D | Research `*.myworkdayjobs.com` patterns, prototype discovery (browser automation may be needed) | Research doc + prototype script |
| 2.9 | ATS–Company Registry Population | Continuously add companies to the registry as scrapers discover them | Growing `company_ats_mapping.csv` → DB import ready |

---

### PHASE 3: Testing, Validation & JSON Output (End of Week 2 — Feb 28–Mar 1, 2025)

**Goal:** All Tier 1 scrapers pass validation. Output JSONs conform to unified schema. Metadata is accurate.

| Task ID | Task | Description | Deliverable |
|---------|------|-------------|-------------|
| 3.1 | Schema Validation Script | Build a Python script that validates any scraper's JSON output against the unified schema | `validate_schema.py` |
| 3.2 | Cross-ATS Test Suite | Run all scrapers against a shared list of 100 known companies, compare results | Test report: hit rate per ATS, error rate, data completeness |
| 3.3 | Deduplication Logic | Implement hash-based deduplication across scrapers (same job posted on multiple ATS) | Dedup utility function |
| 3.4 | Metadata Quality Audit | Verify metadata fields: `company_name` normalization, `date_posted` parsing, `location` extraction | Audit report with fix list |
| 3.5 | Generate Sample Result JSONs | Produce clean, validated sample outputs for each ATS scraper (10 companies each) | `/samples/{ats}/` directory with JSONs |

---

### PHASE 4: Database Design & Data Storage (Week 3 — Mar 2–8, 2025)

**Goal:** NoSQL database is designed, provisioned, and populated with scraped job data + ATS registry.

| Task ID | Task | Description | Deliverable |
|---------|------|-------------|-------------|
| 4.1 | Database Selection & Setup | Select NoSQL DB (MongoDB Atlas recommended), create cluster, set up access | Running DB instance |
| 4.2 | Collections Design | Design collections: `jobs`, `companies`, `ats_registry`, `scrape_runs` | Schema documentation |
| 4.3 | Ingestion Script | Build a script that reads scraper JSON output and upserts into the database (handles dedup, updates, new inserts) | `ingest_to_db.py` |
| 4.4 | Indexing Strategy | Create indexes on key query fields: `company_name`, `ats_source`, `location`, `date_posted`, `title` | Index configuration doc |
| 4.5 | ATS–Company Registry DB | Import the ATS–Company mapping into a dedicated collection | Populated `ats_registry` collection |
| 4.6 | Data Validation & Integrity Checks | Ensure no orphan records, no schema violations, counts match scraper output | Validation report |

**Database Collections Overview:**

```
┌─────────────────────────────────────────────────────────┐
│  MongoDB Database: ats_job_board                        │
│                                                         │
│  ├── jobs              (all scraped job listings)       │
│  ├── companies         (company profiles + metadata)    │
│  ├── ats_registry      (company → ATS mapping)          │
│  ├── scrape_runs       (log of each scraper execution)  │
│  └── scrape_errors     (failed extractions for retry)   │
└─────────────────────────────────────────────────────────┘
```

---

### PHASE 5: Cloud Pipeline & Scheduled Scraping (Week 4 — Mar 9–15, 2025)

**Goal:** Scrapers run automatically in the cloud on a schedule, with logging, error handling, and DB writes.

| Task ID | Task | Description | Deliverable |
|---------|------|-------------|-------------|
| 5.1 | Containerize Scrapers | Dockerize each scraper for consistent cloud execution | `Dockerfile` per scraper + `docker-compose.yml` |
| 5.2 | Cloud Deployment | Deploy to AWS (Lambda / ECS / EC2) or GCP (Cloud Run / Cloud Functions) | Running cloud instances |
| 5.3 | Scheduler Setup | Configure cron-based scheduler (CloudWatch Events / Cloud Scheduler) for daily or hourly runs | Scheduler config + documentation |
| 5.4 | Pipeline Orchestration | Build a master runner script that: triggers scrapers → collects output → runs ingestion → logs results | `run_pipeline.py` |
| 5.5 | Monitoring & Alerting | Set up logging (CloudWatch / Stackdriver), error alerts (email/Slack), and a dashboard for scrape stats | Monitoring dashboard |
| 5.6 | Retry & Recovery | Implement retry queues for failed scrapes, dead-letter handling for persistent errors | Retry logic in pipeline |

---

### PHASE 6: Frontend Job Board Application (Weeks 5–7 — Mar 16–Apr 5, 2025)

**Goal:** A public-facing web application where users can search, filter, and browse aggregated job listings.

| Task ID | Task | Description | Deliverable |
|---------|------|-------------|-------------|
| 6.1 | API Layer (Backend-for-Frontend) | Build a REST API that queries the MongoDB `jobs` collection with search, filter, pagination | `/api/jobs`, `/api/companies`, `/api/stats` endpoints |
| 6.2 | Frontend Framework Setup | Initialize frontend (React / Next.js recommended), configure routing, state management | Scaffolded frontend project |
| 6.3 | Job Listing Page | Paginated list of jobs with search bar, filters (location, company, ATS, employment type, date) | Working listing page |
| 6.4 | Job Detail Page | Full job detail view: title, company, description, location, apply button (links to original) | Working detail page |
| 6.5 | Company Profile Page | Page showing all jobs from a given company, their ATS, career page link | Working company page |
| 6.6 | Search & Filter Engine | Full-text search on title + description, faceted filters, sort by date/relevance | Working search |
| 6.7 | Responsive Design & Polish | Mobile-friendly, accessibility basics, loading states, error handling | Polished UI |
| 6.8 | Deployment | Deploy frontend (Vercel / Netlify / AWS Amplify) + backend API | Live URL |

---

## 8. TEAM ROLES & WORK ASSIGNMENT (8 Members)

### Role Assignments

| Member | Role | Primary Responsibilities |
|--------|------|------------------------|
| **Member 1** | Scraper Lead — Tier 1 API Scrapers | Test & validate Greenhouse + Lever scripts from Prof. Nik; build Ashby scraper; own Tier 1 quality |
| **Member 2** | Scraper Dev — Mid-Market ATS | Build SmartRecruiters + Workable scrapers; research their APIs and career page structures |
| **Member 3** | Scraper Dev — SMB ATS | Build BambooHR + JazzHR scrapers; research career page HTML patterns |
| **Member 4** | Scraper Dev — Enterprise ATS (Workday) | Deep R&D on Workday scraping (`*.myworkdayjobs.com`); prototype browser automation approach; this is the hardest scraper |
| **Member 5** | Scraper Dev — Enterprise ATS (iCIMS + Taleo) | Research and build iCIMS and Taleo/Oracle scrapers; career page scraping focus |
| **Member 6** | Data & Database Engineer | Design NoSQL schema; build ingestion scripts; populate ATS–Company registry; handle dedup and data integrity |
| **Member 7** | Pipeline & DevOps Engineer | Containerize scrapers; set up cloud deployment, scheduler, monitoring, retry logic; own the pipeline |
| **Member 8** | Frontend & API Developer | Build the REST API layer; build the frontend job board UI; deploy the web application |

### Work Distribution — Phase by Phase

#### PHASE 1 (Week 1): Research & Discovery — ALL MEMBERS

| Member | Phase 1 Task |
|--------|-------------|
| Member 1 | Research Greenhouse + Lever + Ashby; test existing scripts; document URL patterns |
| Member 2 | Research SmartRecruiters + Workable; document APIs and URL patterns |
| Member 3 | Research BambooHR + JazzHR; document career page structures |
| Member 4 | Deep research on Workday scraping approaches; document `myworkdayjobs.com` patterns |
| Member 5 | Research iCIMS + Taleo; document career page scraping strategies |
| Member 6 | Compile master company list (SEC filings, public data); begin ATS–Company mapping; set up MongoDB |
| Member 7 | Set up GitHub monorepo; establish project structure, CI/CD skeleton; research cloud options |
| Member 8 | Research frontend frameworks; wireframe job board UI; study API design for job search |

#### PHASE 2 (Weeks 1–2): Scraper Development — SCRAPER DEVS

| Member | Phase 2 Task |
|--------|-------------|
| Member 1 | Validate Greenhouse + Lever; build Ashby scraper; ensure all output matches unified schema |
| Member 2 | Build SmartRecruiters scraper; build Workable scraper |
| Member 3 | Build BambooHR scraper; build JazzHR scraper |
| Member 4 | Prototype Workday scraper (discovery phase at minimum); document browser automation needs |
| Member 5 | Prototype iCIMS scraper; begin Taleo research |
| Member 6 | Build `company_ats_mapping.csv`; build schema validation script; support scrapers with data questions |
| Member 7 | Set up shared test infrastructure; write common utility functions (rate limiting, logging, retry); Dockerfiles |
| Member 8 | Begin API layer design; mock endpoints for frontend work |

#### PHASE 3 (End of Week 2): Testing & Validation — ALL MEMBERS

| Member | Phase 3 Task |
|--------|-------------|
| Members 1–5 | Run their scrapers against shared 100-company test list; fix bugs; produce validated sample JSONs |
| Member 6 | Run schema validation across all outputs; produce data quality audit report |
| Member 7 | Set up automated test runner; integrate scraper tests into CI |
| Member 8 | Build frontend prototype with mock data from sample JSONs |

#### PHASE 4 (Week 3): Database — MEMBER 6 leads, ALL support

| Member | Phase 4 Task |
|--------|-------------|
| Member 6 | Lead: design collections, indexing, build ingestion scripts, load data |
| Members 1–5 | Support: run scrapers to produce data for DB load; fix any schema issues |
| Member 7 | Support: set up DB infrastructure in cloud; manage access/networking |
| Member 8 | Connect API endpoints to live database instead of mock data |

#### PHASE 5 (Week 4): Cloud Pipeline — MEMBER 7 leads

| Member | Phase 5 Task |
|--------|-------------|
| Member 7 | Lead: containerize all scrapers, deploy to cloud, set up scheduler and monitoring |
| Members 1–5 | Support: ensure their scrapers work in Docker containers; test cloud runs |
| Member 6 | Support: validate DB writes from pipeline; monitor data integrity |
| Member 8 | Continue frontend development |

#### PHASE 6 (Weeks 5–7): Frontend — MEMBER 8 leads, MEMBERS 6–7 support

| Member | Phase 6 Task |
|--------|-------------|
| Member 8 | Lead: build complete job board frontend + API |
| Member 6 | Support: optimize DB queries for frontend performance; add any needed indexes |
| Member 7 | Support: deploy frontend; set up CDN, SSL, domain |
| Members 1–5 | Tier 2/3 scraper improvements; add more companies to registry; fix bugs from pipeline runs |

---

## 9. PROJECT TIMELINE & MILESTONES

```
WEEK 1: Feb 16 – Feb 22, 2025
├── M1: Research complete — all ATS research docs submitted ✦ Feb 20
├── M2: Repo & project structure set up ✦ Feb 18
├── M3: Greenhouse + Lever tested & validated ✦ Feb 22
└── All Tier 1 scraper development begins

WEEK 2: Feb 23 – Mar 1, 2025
├── M4: All Tier 1 scrapers complete & producing valid JSON ✦ Feb 28
├── M5: Workday/iCIMS R&D prototypes documented ✦ Feb 28
├── M6: Schema validation passing for all scrapers ✦ Mar 1
├── M7: ATS–Company registry has 500+ entries ✦ Mar 1
└── M8: Sample result JSONs generated for all ATS ✦ Mar 1

WEEK 3: Mar 2 – Mar 8, 2025
├── M9: MongoDB fully set up with all collections ✦ Mar 4
├── M10: Ingestion scripts working; DB populated ✦ Mar 7
└── M11: API endpoints connected to live DB ✦ Mar 8

WEEK 4: Mar 9 – Mar 15, 2025
├── M12: All scrapers containerized and running in cloud ✦ Mar 12
├── M13: Scheduler running daily automated scrapes ✦ Mar 14
└── M14: Monitoring & alerting operational ✦ Mar 15

WEEK 5–6: Mar 16 – Mar 29, 2025
├── M15: Frontend MVP live (search, listing, detail pages) ✦ Mar 22
├── M16: Company pages and filters working ✦ Mar 29
└── Tier 2/3 scrapers continue improving in parallel

WEEK 7: Mar 30 – Apr 5, 2025
├── M17: Frontend polished, responsive, deployed ✦ Apr 3
├── M18: Full end-to-end system operational ✦ Apr 5
└── M19: PROJECT LAUNCH ✦ Apr 5
```

### Summary Timeline Table

| Phase | Duration | Dates | Key Milestone |
|-------|----------|-------|--------------|
| Phase 1: Research & Discovery | 1 week | Feb 16–22 | All ATS research docs + Greenhouse/Lever tested |
| Phase 2: Scraper Development | 2 weeks | Feb 16–Mar 1 | All Tier 1 scrapers complete with valid JSON output |
| Phase 3: Testing & Validation | Overlaps with Phase 2 end | Feb 28–Mar 1 | Schema validation passing; sample JSONs generated |
| Phase 4: Database & Storage | 1 week | Mar 2–8 | MongoDB live; data ingested; API connected |
| Phase 5: Cloud Pipeline | 1 week | Mar 9–15 | Automated scheduled scraping in production |
| Phase 6: Frontend Job Board | 3 weeks | Mar 16–Apr 5 | Public job board live and deployed |

---

## 10. TECHNICAL STANDARDS & CONVENTIONS

### Language & Dependencies
- **Python 3.9+** for all scrapers
- `requests` for HTTP (Tier 1/2); `playwright` or `selenium` for Tier 3 (JS-heavy)
- `beautifulsoup4` / `lxml` for HTML parsing
- `pymongo` for MongoDB interaction
- **Node.js / React / Next.js** for frontend (Member 8's choice with team input)

### Code Standards
- All scrapers live in `/scrapers/{ats_name}/` within the monorepo
- Each scraper folder contains: `discovery.py`, `extraction.py`, `config.py`, `README.md`
- Use Python logging module (not print statements)
- All configurable values at top of script or in `config.py`
- Type hints on all functions
- Docstrings on all public functions

### Rate Limiting & Ethics
- Minimum 0.3s delay between requests (configurable per ATS)
- Respect `robots.txt` where applicable
- Identify as a bot in User-Agent string where appropriate
- Do NOT scrape pages that require login or authentication bypass
- Do NOT store personal candidate data — only job posting data

### Git Workflow
- `main` branch is protected; no direct pushes
- Feature branches: `feature/{ats_name}-scraper`, `feature/db-setup`, etc.
- Pull requests require 1 reviewer before merge
- Commit messages: `[ATS_NAME] Brief description` (e.g., `[GREENHOUSE] Fix pagination edge case`)

---

## 11. RISK REGISTER

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Workday scraping is too complex for 2-week timeline | HIGH | MEDIUM | Designate as R&D in Phase 2; defer full build to Phase 5 if needed; consider third-party (Apify) as fallback |
| ATS platforms change their URL patterns or APIs | MEDIUM | HIGH | Store patterns in the registry DB; build monitoring for broken scrapers; alert on failure |
| Rate limiting / IP blocking by ATS providers | MEDIUM | HIGH | Respectful delays; rotating user agents; proxy rotation if needed; exponential backoff |
| Company name normalization inconsistencies across ATS | HIGH | MEDIUM | Centralized normalization utility; fuzzy matching library; human review for edge cases |
| Team members unfamiliar with web scraping | MEDIUM | MEDIUM | Phase 1 research week provides ramp-up; pair programming; reference architecture as template |
| MongoDB schema changes needed mid-project | LOW | MEDIUM | NoSQL is flexible by design; version the schema; use migration scripts |
| Frontend scope creep | MEDIUM | LOW | Strict MVP feature set defined in Phase 6; polish in final week only |

---

## 12. DEFINITION OF DONE

### For Each Scraper:
- [ ] Discovery module runs successfully against 20+ companies
- [ ] Extraction module produces valid JSON for all discovered jobs
- [ ] Output passes schema validation script (`validate_schema.py`)
- [ ] Rate limiting is implemented (≥ 0.3s delay)
- [ ] Error handling covers: timeouts, 404s, encoding issues, empty responses
- [ ] Resume capability works (extraction can be stopped and restarted)
- [ ] README.md documents: usage, config, known limitations
- [ ] Code reviewed and merged to `main` via PR

### For Database:
- [ ] All collections created with proper indexes
- [ ] Ingestion script handles upserts (insert new, update existing, skip duplicates)
- [ ] Data count in DB matches scraper output counts
- [ ] Queries run in <500ms for common frontend operations

### For Pipeline:
- [ ] All scrapers run successfully in Docker
- [ ] Scheduler triggers automated runs at configured intervals
- [ ] Logs are centralized and searchable
- [ ] Failed scrapes are retried; persistent failures are alerted

### For Frontend:
- [ ] Users can search jobs by keyword
- [ ] Users can filter by location, company, ATS source, employment type
- [ ] Job detail page shows full description + apply link
- [ ] Page loads in <2 seconds
- [ ] Mobile responsive

---

## 13. APPENDIX

### A. Useful Research Links

| Resource | URL |
|----------|-----|
| Greenhouse Boards API Docs | `https://developers.greenhouse.io/job-board.html` |
| Lever Postings API | `https://github.com/lever/postings-api` |
| Ashby Job Board API | `https://developers.ashbyhq.com` |
| SmartRecruiters Public API | `https://dev.smartrecruiters.com` |
| Workday Job Search Pattern | `*.myworkdayjobs.com/*/job/*` |
| iCIMS Career Sites | Various `careers.{company}.icims.com` patterns |
| Apify ATS Scrapers (Tier 2/3 fallback) | `https://apify.com/fantastic-jobs/career-site-job-listing-api` |
| BuiltWith (identify ATS used) | `https://builtwith.com` |

### B. Company List Sources
- SEC EDGAR Form D filings (companies that have raised capital — likely hiring)
- Crunchbase (funded startups)
- Y Combinator company directory
- Manual research / LinkedIn career pages

### C. Quick-Start for New Scraper Development

```
1. Create folder: /scrapers/{ats_name}/
2. Copy template: discovery.py, extraction.py, config.py, README.md
3. Research the ATS:
   - How do career pages work?
   - Is there a public API?
   - What URL pattern do company career pages follow?
   - How is pagination handled?
   - What data is available on listing vs. detail pages?
4. Implement discovery.py — find companies + harvest job URLs
5. Implement extraction.py — visit each URL + extract to unified schema
6. Test against 20+ companies
7. Run validate_schema.py against output
8. Write README, create PR, request review
```

---

**END OF DOCUMENT**

*This is a living document. It will be updated as the project progresses, decisions are made on Tier 2/3 priorities, and the ATS–Company registry grows.*

```


---


## File: ats-scripts/docs/SCRAPER_DEV_GUIDE.md

```md
# Scraper Development Guide

How to build a new ATS scraper using the two-phase template.

## Prerequisites

```bash
cd ats-scripts
pip install -r requirements.txt
```

## Step-by-Step

### 1. Start with your scraper directory

Your scraper directory already has an `__init__.py` package marker. You need to create:
```
scrapers/{ats_name}/
    __init__.py       # Already set up
    config.py         # Create: ATS_NAME, URL patterns, override global defaults
    discovery.py      # Create: implement discover()
    extraction.py     # Create: implement extract() + transform_to_unified_schema()
    README.md         # Create: document your work as you go
```

### 2. Research your ATS

Before writing code, answer these questions:
- Is there a public API? What's the endpoint format?
- How are career pages structured? (URL patterns)
- How is pagination handled?
- What data is available on listing vs. detail pages?
- Are pages JS-rendered? (If yes, you may need `playwright`)

### 3. Implement discovery.py

This is Phase 1: find companies on your ATS and harvest job URLs.

```python
from scrapers.common.logger import get_logger
from scrapers.common.normalize import normalize_company_name, read_companies_from_file
from scrapers.common.rate_limiter import RateLimiter
from scrapers.common.retry import retry_request
from .config import ATS_NAME, BASE_API_URL, DELAY_BETWEEN_REQUESTS

logger = get_logger(ATS_NAME)

def discover(companies, output_dir):
    limiter = RateLimiter(min_delay=DELAY_BETWEEN_REQUESTS)

    for company in companies:
        slug = normalize_company_name(company)
        limiter.wait()

        # Make your API call / scrape the page
        response = retry_request(url)

        # Process response...
        # Write to discovered_jobs.csv and live_endpoints.csv
```

**Output files:**
- `discovered_jobs.csv` — columns: `company_name`, `company_slug`, `job_id`, `job_url`, `title`
- `live_endpoints.csv` — columns: `company_name`, `company_slug`, `endpoint_url`, `job_count`
- `discovery_summary.json` — run metadata

Reference: `script-for-reference/greenhouse_scraper.py` for a working example of Greenhouse API usage.

### 4. Implement extraction.py

This is Phase 2: fetch full details and output the unified schema.

```python
def transform_to_unified_schema(job, company_name, company_slug):
    return {
        "job_id": ...,
        "title": ...,
        "company_name": company_name,
        "company_slug": company_slug,
        "ats_source": ATS_NAME,
        "source_url": ...,
        "apply_url": ...,
        "location": ...,
        "department": ...,
        "employment_type": ...,   # "Full-time", "Part-time", "Contract", "Intern", or ""
        "date_posted": ...,       # ISO 8601 format
        "description_text": ...,
        "description_html": ...,
        "salary_range": ...,
        "metadata": {
            "scraped_at": datetime.now(timezone.utc).isoformat(),
            "scraper_version": SCRAPER_VERSION,
            "extraction_status": "success",  # or "error" or "partial"
            "raw_response_hash": hashlib.md5(...).hexdigest(),
        },
    }
```

**Key points:**
- Always validate output: `validate_job_record(record)`
- Save progress periodically for resumability
- Handle errors gracefully (log and continue, don't crash)

Reference: `script-for-reference/greenhouse_scraper.py` and `script-for-reference/lever_scraper.py` for working examples of API response handling.

### 5. Validate output

```python
from scrapers.common.schema_validator import validate_job_record, validate_batch

# Single record
is_valid, errors = validate_job_record(job)

# Full batch
report = validate_batch(all_jobs, strict=True)
print(f"Pass rate: {report['pass_rate']}")
```

### 6. Test against 20+ companies

Run your scraper against at least 20 companies and verify:
- [ ] Discovery finds active companies
- [ ] Extraction produces valid JSON
- [ ] Output passes schema validation
- [ ] Rate limiting works (check delay between requests)
- [ ] Error handling works (test with invalid companies)
- [ ] Resume capability works (stop and restart extraction)

### 7. Create a PR

```bash
git checkout -b {your_name}/feature-{ats_name}-scraper
git add ats-scripts/scrapers/{ats_name}/
git commit -m "[{ATS_NAME}] Implement discovery and extraction"
git push -u origin {your_name}/feature-{ats_name}-scraper
# Create PR on GitHub, tag @abhinavpklg as reviewer
```

## Shared Utilities Reference

| Module | Import | Use for |
|--------|--------|---------|
| Logger | `from scrapers.common.logger import get_logger` | Structured logging |
| Normalizer | `from scrapers.common.normalize import normalize_company_name` | Company slug generation |
| Rate Limiter | `from scrapers.common.rate_limiter import RateLimiter` | Respectful request throttling |
| Retry | `from scrapers.common.retry import retry_request` | HTTP with exponential backoff |
| Validator | `from scrapers.common.schema_validator import validate_job_record, validate_batch` | Output validation |
| Config | `from scrapers.common.config import *` | Global defaults |
| Timestamp | `from scrapers.common.normalize import epoch_ms_to_iso8601` | Convert epoch ms to ISO 8601 |

## Tier-Specific Notes

### Tier 1 (API-based: Greenhouse, Lever, Ashby, SmartRecruiters)
- Use `retry_request()` for HTTP calls
- JSON responses — straightforward parsing
- Focus on pagination handling

### Tier 2 (HTML scraping: BambooHR, JazzHR, Workable)
- Use `beautifulsoup4` + `lxml` for parsing
- Check for JSON-LD structured data before scraping HTML
- Handle inconsistent HTML structures across companies

### Tier 3 (JS-heavy: Workday, iCIMS, Taleo)
- Try to find hidden JSON APIs first (browser network tab)
- Fall back to `playwright` for browser automation
- Use longer delays (2.0s+) and higher retry counts
- These are the hardest — budget extra R&D time

```


---


## File: ats-scripts/pyproject.toml

```toml
[tool.pytest.ini_options]
pythonpath = ["."]
testpaths = ["tests"]

```


---


## File: ats-scripts/scrapers/__init__.py

```py
# ATS Job Scrapers — 80 Days to Stay
# Each subdirectory contains a scraper for a specific ATS platform.

```


---


## File: ats-scripts/scrapers/ashby/__init__.py

```py
# Ashby ATS Scraper
# Public API (POST-based — check docs for payload format)
# Tier 1 — Easy — Public API

```


---


## File: ats-scripts/scrapers/bamboohr/__init__.py

```py
# Bamboohr ATS Scraper
# Scrape structured career pages at {company}.bamboohr.com/careers
# Tier 2 — Medium — HTML Scraping

```


---


## File: ats-scripts/scrapers/common/README.md

```md
# Shared Utilities — `scrapers/common/`

Common modules used by all ATS scrapers. Import from here instead of duplicating code.

## Modules

| Module | Purpose | Key Functions/Classes |
|--------|---------|----------------------|
| `config.py` | Global defaults (timeouts, delays, retries) | Constants only |
| `logger.py` | Structured logging (replaces `print()`) | `get_logger(name)` |
| `normalize.py` | Company name normalization, file reading | `normalize_company_name()`, `read_companies_from_file()`, `epoch_ms_to_iso8601()` |
| `rate_limiter.py` | Thread-safe request throttling | `RateLimiter(min_delay)` |
| `retry.py` | HTTP requests with exponential backoff | `retry_request(url)` |
| `schema_validator.py` | Validate output against unified schema | `validate_job_record()`, `validate_batch()` |

## Quick Start

```python
from scrapers.common import (
    get_logger,
    normalize_company_name,
    RateLimiter,
    retry_request,
    validate_job_record,
    validate_batch,
)

logger = get_logger("greenhouse")
limiter = RateLimiter(min_delay=0.5)

slug = normalize_company_name("Databricks, Inc.")  # -> "databricks"

limiter.wait()
response = retry_request(f"https://boards-api.greenhouse.io/v1/boards/{slug}/jobs")

# After building your job record:
is_valid, errors = validate_job_record(job_record)
```

## Overriding Defaults

Each scraper can override global config values in its own `config.py`:

```python
# scrapers/workday/config.py
from scrapers.common.config import *

# Override for Workday (slower, more cautious)
DELAY_BETWEEN_REQUESTS = 2.0
MAX_RETRIES = 5
REQUEST_TIMEOUT = 30
```

```


---


## File: ats-scripts/scrapers/common/__init__.py

```py
# Shared utilities for all ATS scrapers
from .logger import get_logger
from .normalize import normalize_company_name, read_companies_from_file
from .rate_limiter import RateLimiter
from .retry import retry_request
from .schema_validator import validate_job_record, validate_batch

__all__ = [
    "get_logger",
    "normalize_company_name",
    "read_companies_from_file",
    "RateLimiter",
    "retry_request",
    "validate_job_record",
    "validate_batch",
]

```


---


## File: ats-scripts/scrapers/common/config.py

```py
"""
Global configuration defaults for all ATS scrapers.
Individual scrapers can override these in their own config.py.
"""

# --- HTTP Request Settings ---
REQUEST_TIMEOUT = 10          # seconds
DELAY_BETWEEN_REQUESTS = 0.5  # seconds (minimum 0.3 per project standards)
MAX_RETRIES = 3
RETRY_BACKOFF_FACTOR = 2      # exponential backoff multiplier
RETRYABLE_STATUS_CODES = [429, 500, 502, 503, 504]

# --- Pagination ---
MAX_PAGES = 100               # safety limit to prevent infinite pagination
PAGE_SIZE = 100               # default page size where applicable

# --- Output ---
SAVE_INTERVAL = 100           # save progress every N jobs (for resumability)
OUTPUT_ENCODING = "utf-8"

# --- Scraper Metadata ---
SCRAPER_VERSION = "1.0.0"

# --- User Agent ---
USER_AGENT = (
    "80DaysToStay-JobScraper/1.0 "
    "(+https://github.com/nikbearbrown/80-Days-to-Stay; "
    "research project; respectful scraping)"
)

# --- File Encodings to Try ---
FILE_ENCODINGS = [
    "utf-8", "utf-8-sig", "utf-16",
    "utf-16-le", "utf-16-be", "latin-1"
]

# --- Company Name Suffixes to Strip ---
# IMPORTANT: Longer patterns MUST come before shorter ones
# (e.g., "Corporation" before "Corp", "Company" before "Co")
# All patterns are anchored to end-of-string ($) to avoid partial matches
# (e.g., "Co" in "Cola" should NOT be stripped)
COMPANY_SUFFIXES = [
    r',?\s+Ltd\s+Liability\s+Co\.?$',
    r',?\s+Liability\s+Co\.?$',
    r',?\s+Corporation$',
    r',?\s+Corp\.?$',
    r',?\s+Company$',
    r',?\s+Co\.?$',
    r',?\s+Limited$',
    r',?\s+Ltd\.?$',
    r',?\s+LTD\.?$',
    r',?\s+L\.L\.C\.?$',
    r',?\s+LLC\.?$',
    r',?\s+Inc\.?$',
    r',?\s+L\.P\.?$',
    r',?\s+LP\.?$',
    r',?\s+PLC\.?$',
]

```


---


## File: ats-scripts/scrapers/common/logger.py

```py
"""
Centralized logging configuration for all ATS scrapers.
Replaces print() statements with structured logging.

Usage:
    from scrapers.common.logger import get_logger
    logger = get_logger("greenhouse")
    logger.info("Found %d jobs for %s", job_count, company)
"""

import logging
import sys
from datetime import datetime
from pathlib import Path


def get_logger(
    name: str,
    level: int = logging.INFO,
    log_dir: str = "logs",
    console: bool = True,
    file: bool = True,
) -> logging.Logger:
    """
    Create a configured logger for a scraper module.

    Args:
        name: Logger name, typically the ATS platform name
              (e.g., "greenhouse", "lever").
        level: Logging level (default: INFO).
        log_dir: Directory for log files (default: "logs").
        console: Whether to log to console (default: True).
        file: Whether to log to file (default: True).

    Returns:
        Configured logging.Logger instance.
    """
    logger = logging.getLogger(f"ats_scraper.{name}")

    # Clear existing handlers so the logger is fully reconfigured
    # with the current console/file/level settings on every call.
    for handler in logger.handlers[:]:
        handler.close()
        logger.removeHandler(handler)

    logger.setLevel(level)

    formatter = logging.Formatter(
        fmt="%(asctime)s | %(name)s | %(levelname)-8s | %(message)s",
        datefmt="%Y-%m-%d %H:%M:%S",
    )

    # Console handler
    if console:
        console_handler = logging.StreamHandler(sys.stdout)
        console_handler.setLevel(level)
        console_handler.setFormatter(formatter)
        logger.addHandler(console_handler)

    # File handler
    if file:
        log_path = Path(log_dir)
        log_path.mkdir(parents=True, exist_ok=True)

        today = datetime.now().strftime("%Y-%m-%d")
        log_file = log_path / f"{name}_{today}.log"

        file_handler = logging.FileHandler(log_file, encoding="utf-8")
        file_handler.setLevel(level)
        file_handler.setFormatter(formatter)
        logger.addHandler(file_handler)

    return logger

```


---


## File: ats-scripts/scrapers/common/normalize.py

```py
"""
Company name normalization and file-reading utilities.
Extracted from professor's reference scripts to avoid duplication.

Usage:
    from scrapers.common.normalize import normalize_company_name, read_companies_from_file

    slug = normalize_company_name("Databricks, Inc.")  # -> "databricks"
    companies = read_companies_from_file("companies.txt")
"""

import re
from datetime import datetime, timezone
from typing import List

from .config import COMPANY_SUFFIXES, FILE_ENCODINGS
from .logger import get_logger

logger = get_logger("normalize", file=False)


def normalize_company_name(name: str) -> str:
    """
    Convert a company name to a URL-safe slug for ATS lookups.

    Strips common legal suffixes (Inc., LLC, Corp., etc.),
    removes special characters, and lowercases.

    Args:
        name: Raw company name (e.g., "Databricks, Inc.").

    Returns:
        URL-safe slug (e.g., "databricks").
    """
    cleaned = name.strip()

    # Loop until no more suffixes match (handles chained suffixes
    # like "Mega Corporation Inc." → "Mega Corporation" → "Mega")
    changed = True
    while changed:
        changed = False
        for suffix in COMPANY_SUFFIXES:
            result = re.sub(suffix, "", cleaned, flags=re.IGNORECASE)
            if result != cleaned:
                cleaned = result
                changed = True

    # Remove commas, periods, spaces, hyphens, ampersands, apostrophes
    cleaned = cleaned.strip()
    cleaned = re.sub(r"[,.\s\-&\']", "", cleaned)

    return cleaned.lower()


def read_companies_from_file(filepath: str) -> List[str]:
    """
    Read company names from a text file, one per line.
    Tries multiple encodings to handle various file formats.

    Args:
        filepath: Path to the company list file.

    Returns:
        List of company name strings, or an empty list if the file
        contains no non-blank lines.

    Raises:
        FileNotFoundError: If file does not exist.
        ValueError: If file cannot be decoded with any supported encoding.
    """
    for encoding in FILE_ENCODINGS:
        try:
            with open(filepath, "r", encoding=encoding) as f:
                companies = [line.strip() for line in f if line.strip()]
                # Successfully decoded — return even if empty
                if companies:
                    logger.info(
                        "Read %d companies from %s (encoding: %s)",
                        len(companies),
                        filepath,
                        encoding,
                    )
                else:
                    logger.warning("File %s is empty (no non-blank lines)", filepath)
                return companies
        except (UnicodeDecodeError, UnicodeError):
            continue
        except FileNotFoundError:
            logger.error("File not found: %s", filepath)
            raise

    logger.error("Could not decode file %s with any supported encoding", filepath)
    raise ValueError(f"Could not decode file {filepath} with any supported encoding")


def epoch_ms_to_iso8601(epoch_ms: int) -> str:
    """
    Convert epoch milliseconds (e.g., from Lever API) to ISO 8601 string.

    Args:
        epoch_ms: Unix timestamp in milliseconds.

    Returns:
        ISO 8601 formatted datetime string.
    """
    dt = datetime.fromtimestamp(epoch_ms / 1000, tz=timezone.utc)
    return dt.isoformat()

```


---


## File: ats-scripts/scrapers/common/rate_limiter.py

```py
"""
Rate limiter for respectful scraping across all ATS platforms.

Usage:
    from scrapers.common.rate_limiter import RateLimiter

    limiter = RateLimiter(min_delay=0.5)
    for url in urls:
        limiter.wait()
        response = requests.get(url)
"""

import time
import threading
from .config import DELAY_BETWEEN_REQUESTS
from .logger import get_logger

logger = get_logger("rate_limiter", file=False)


class RateLimiter:
    """
    Thread-safe rate limiter that enforces a minimum delay between requests.

    Attributes:
        min_delay: Minimum seconds between requests.
    """

    def __init__(self, min_delay: float = DELAY_BETWEEN_REQUESTS):
        """
        Initialize rate limiter.

        Args:
            min_delay: Minimum delay in seconds between requests
                       (default from config, minimum 0.3 per project standards).
        """
        if min_delay < 0.3:
            logger.warning(
                "min_delay %.2f is below project minimum 0.3s — overriding to 0.3s",
                min_delay,
            )
            min_delay = 0.3

        self.min_delay = min_delay
        self._last_request_time: float = 0.0
        self._lock = threading.Lock()

    def wait(self) -> None:
        """
        Block until enough time has passed since the last request.
        Thread-safe.
        """
        with self._lock:
            now = time.monotonic()
            elapsed = now - self._last_request_time
            if elapsed < self.min_delay:
                sleep_time = self.min_delay - elapsed
                time.sleep(sleep_time)
            self._last_request_time = time.monotonic()

    def reset(self) -> None:
        """Reset the timer (e.g., when switching to a new ATS domain)."""
        with self._lock:
            self._last_request_time = 0.0

```


---


## File: ats-scripts/scrapers/common/retry.py

```py
"""
Retry logic with exponential backoff for HTTP requests.

Usage:
    from scrapers.common.retry import retry_request

    response = retry_request("https://api.example.com/jobs", timeout=10)
"""

import time
from typing import Optional, Dict, Any

import requests

from .config import (
    MAX_RETRIES,
    REQUEST_TIMEOUT,
    RETRY_BACKOFF_FACTOR,
    RETRYABLE_STATUS_CODES,
    USER_AGENT,
)
from .logger import get_logger

logger = get_logger("retry", file=False)


def retry_request(
    url: str,
    method: str = "GET",
    max_retries: int = MAX_RETRIES,
    timeout: int = REQUEST_TIMEOUT,
    backoff_factor: float = RETRY_BACKOFF_FACTOR,
    retryable_status_codes: Optional[list] = None,
    headers: Optional[Dict[str, str]] = None,
    params: Optional[Dict[str, Any]] = None,
    **kwargs,
) -> Optional[requests.Response]:
    """
    Make an HTTP request with automatic retry and exponential backoff.

    Args:
        url: The URL to request.
        method: HTTP method (default: "GET").
        max_retries: Maximum number of retry attempts.
        timeout: Request timeout in seconds.
        backoff_factor: Multiplier for exponential backoff
                        (wait = backoff_factor ** attempt).
        retryable_status_codes: HTTP status codes that should trigger a retry.
        headers: Optional request headers.
        params: Optional query parameters.
        **kwargs: Additional arguments passed to requests.request().

    Returns:
        requests.Response on success or after all retries are exhausted
        (including error responses, so callers can inspect the status code).
        Returns None only if a network-level error (timeout, connection
        error, or unrecoverable exception) occurs and all retries are
        exhausted.
    """
    if retryable_status_codes is None:
        retryable_status_codes = RETRYABLE_STATUS_CODES

    if headers is None:
        headers = {}
    headers.setdefault("User-Agent", USER_AGENT)

    for attempt in range(max_retries + 1):
        try:
            response = requests.request(
                method=method,
                url=url,
                headers=headers,
                params=params,
                timeout=timeout,
                **kwargs,
            )

            # Success
            if response.status_code < 400:
                return response

            # Non-retryable client error (e.g., 404)
            if response.status_code not in retryable_status_codes:
                logger.warning(
                    "Non-retryable status %d for %s", response.status_code, url
                )
                return response

            # Retryable server error
            if attempt < max_retries:
                wait_time = backoff_factor ** attempt
                logger.warning(
                    "Status %d for %s — retrying in %.1fs (attempt %d/%d)",
                    response.status_code,
                    url,
                    wait_time,
                    attempt + 1,
                    max_retries,
                )
                time.sleep(wait_time)
            else:
                logger.error(
                    "All %d retries exhausted for %s (last status: %d)",
                    max_retries,
                    url,
                    response.status_code,
                )
                return response

        except requests.exceptions.Timeout:
            if attempt < max_retries:
                wait_time = backoff_factor ** attempt
                logger.warning(
                    "Timeout for %s — retrying in %.1fs (attempt %d/%d)",
                    url,
                    wait_time,
                    attempt + 1,
                    max_retries,
                )
                time.sleep(wait_time)
            else:
                logger.error("All %d retries exhausted for %s (timeout)", max_retries, url)
                return None

        except requests.exceptions.ConnectionError:
            if attempt < max_retries:
                wait_time = backoff_factor ** attempt
                logger.warning(
                    "Connection error for %s — retrying in %.1fs (attempt %d/%d)",
                    url,
                    wait_time,
                    attempt + 1,
                    max_retries,
                )
                time.sleep(wait_time)
            else:
                logger.error(
                    "All %d retries exhausted for %s (connection error)",
                    max_retries,
                    url,
                )
                return None

        except requests.exceptions.RequestException as e:
            logger.error("Unrecoverable request error for %s: %s", url, e)
            return None

    return None

```


---


## File: ats-scripts/scrapers/common/schema_validator.py

```py
"""
Validates scraper output against the unified job record schema.

Usage:
    from scrapers.common.schema_validator import validate_job_record, validate_batch

    is_valid, errors = validate_job_record(job_dict)
    report = validate_batch(list_of_jobs)
"""

from typing import Any, Dict, List, Tuple
from datetime import datetime

from .logger import get_logger

logger = get_logger("schema_validator", file=False)

# --- Unified Job Record Schema ---
# Defines required fields, types, and allowed values.

REQUIRED_FIELDS = {
    "job_id": str,
    "title": str,
    "company_name": str,
    "company_slug": str,
    "ats_source": str,
    "source_url": str,
}

OPTIONAL_FIELDS = {
    "apply_url": str,
    "location": str,
    "department": str,
    "employment_type": str,
    "date_posted": str,
    "description_text": str,
    "description_html": str,
    "salary_range": str,
}

METADATA_REQUIRED_FIELDS = {
    "scraped_at": str,
    "scraper_version": str,
    "extraction_status": str,
}

METADATA_OPTIONAL_FIELDS = {
    "raw_response_hash": str,
}

VALID_ATS_SOURCES = [
    "greenhouse", "lever", "ashby", "smartrecruiters", "workable",
    "bamboohr", "jazzhr", "workday", "icims", "taleo",
    "jobvite", "recruitee", "teamtailor", "avature",
    "sap_successfactors", "cornerstone",
]

VALID_EMPLOYMENT_TYPES = [
    "Full-time", "Part-time", "Contract", "Intern", "",
]

VALID_EXTRACTION_STATUSES = ["success", "error", "partial"]


def _is_iso8601(value: str) -> bool:
    """Check if a string is a valid ISO 8601 datetime."""
    if not value:
        return True  # empty/null dates are acceptable
    try:
        datetime.fromisoformat(value.replace("Z", "+00:00"))
        return True
    except (ValueError, AttributeError):
        return False


def validate_job_record(job: Dict[str, Any]) -> Tuple[bool, List[str]]:
    """
    Validate a single job record against the unified schema.

    Args:
        job: A dictionary representing a job record.

    Returns:
        Tuple of (is_valid: bool, errors: list of error strings).
    """
    errors: List[str] = []

    # Check required fields
    for field, expected_type in REQUIRED_FIELDS.items():
        if field not in job:
            errors.append(f"Missing required field: '{field}'")
        elif not isinstance(job[field], expected_type):
            errors.append(
                f"Field '{field}' should be {expected_type.__name__}, "
                f"got {type(job[field]).__name__}"
            )
        elif not job[field].strip():
            errors.append(f"Required field '{field}' is empty")

    # Check optional fields types (only when present)
    for field, expected_type in OPTIONAL_FIELDS.items():
        if field in job and not isinstance(job[field], expected_type):
            errors.append(
                f"Optional field '{field}' should be {expected_type.__name__}, "
                f"got {type(job[field]).__name__}"
            )

    # Check ats_source value
    if job.get("ats_source") and job["ats_source"] not in VALID_ATS_SOURCES:
        errors.append(
            f"Invalid ats_source: '{job['ats_source']}' "
            f"(valid: {VALID_ATS_SOURCES})"
        )

    # Check employment_type value
    if job.get("employment_type") and job["employment_type"] not in VALID_EMPLOYMENT_TYPES:
        errors.append(
            f"Invalid employment_type: '{job['employment_type']}' "
            f"(valid: {VALID_EMPLOYMENT_TYPES})"
        )

    # Check date_posted format
    if job.get("date_posted") and not _is_iso8601(job["date_posted"]):
        errors.append(
            f"Field 'date_posted' is not valid ISO 8601: '{job['date_posted']}'"
        )

    # Check metadata block
    metadata = job.get("metadata")
    if metadata is None:
        errors.append("Missing required field: 'metadata'")
    elif not isinstance(metadata, dict):
        errors.append(
            f"Field 'metadata' should be dict, got {type(metadata).__name__}"
        )
    else:
        for field, expected_type in METADATA_REQUIRED_FIELDS.items():
            if field not in metadata:
                errors.append(f"Missing required metadata field: '{field}'")
            elif not isinstance(metadata[field], expected_type):
                errors.append(
                    f"Metadata field '{field}' should be {expected_type.__name__}, "
                    f"got {type(metadata[field]).__name__}"
                )

        # Check optional metadata fields types (only when present)
        for field, expected_type in METADATA_OPTIONAL_FIELDS.items():
            if field in metadata and not isinstance(metadata[field], expected_type):
                errors.append(
                    f"Optional metadata field '{field}' should be "
                    f"{expected_type.__name__}, got {type(metadata[field]).__name__}"
                )

        # Validate scraped_at is ISO 8601
        if metadata.get("scraped_at") and not _is_iso8601(metadata["scraped_at"]):
            errors.append(
                f"Metadata 'scraped_at' is not valid ISO 8601: "
                f"'{metadata['scraped_at']}'"
            )

        # Validate extraction_status
        if (
            metadata.get("extraction_status")
            and metadata["extraction_status"] not in VALID_EXTRACTION_STATUSES
        ):
            errors.append(
                f"Invalid extraction_status: '{metadata['extraction_status']}'"
            )

    is_valid = len(errors) == 0
    return is_valid, errors


def validate_batch(
    jobs: List[Dict[str, Any]], strict: bool = False
) -> Dict[str, Any]:
    """
    Validate a batch of job records and produce a summary report.

    Args:
        jobs: List of job record dictionaries.
        strict: If True, any single error fails the entire batch.

    Returns:
        Report dict with counts and per-job errors.
    """
    total = len(jobs)
    valid_count = 0
    invalid_count = 0
    all_errors: List[Dict[str, Any]] = []

    for i, job in enumerate(jobs):
        is_valid, errors = validate_job_record(job)
        if is_valid:
            valid_count += 1
        else:
            invalid_count += 1
            all_errors.append({
                "index": i,
                "job_id": job.get("job_id", "UNKNOWN"),
                "errors": errors,
            })

    report = {
        "total": total,
        "valid": valid_count,
        "invalid": invalid_count,
        "pass_rate": f"{(valid_count / total * 100):.1f}%" if total > 0 else "N/A",
        "errors": all_errors,
        "batch_passed": invalid_count == 0 if strict else (valid_count > 0 or total == 0),
        "has_valid_records": valid_count > 0,
        "partial_success": valid_count > 0 and invalid_count > 0,
        "strict": strict,
    }

    if all_errors:
        logger.warning(
            "Validation: %d/%d records invalid (%.1f%% pass rate)",
            invalid_count,
            total,
            valid_count / total * 100 if total > 0 else 0,
        )
    else:
        logger.info("Validation: all %d records passed", total)

    return report

```


---


## File: ats-scripts/scrapers/greenhouse/__init__.py

```py
# Greenhouse ATS Scraper
# API: https://boards-api.greenhouse.io/v1/boards/{company}/jobs
# Tier 1 — Public REST API, no auth required

```


---


## File: ats-scripts/scrapers/icims/__init__.py

```py
# Icims ATS Scraper
# Scrape career page implementations at careers.{company}.icims.com
# Tier 3 — Hard — JS-Heavy, Browser Automation

```


---


## File: ats-scripts/scrapers/jazzhr/__init__.py

```py
# Jazzhr ATS Scraper
# Scrape career page feeds at {company}.applytojob.com
# Tier 2 — Medium — HTML Scraping

```


---


## File: ats-scripts/scrapers/lever/__init__.py

```py
# Lever ATS Scraper
# API: https://api.lever.co/v0/postings/{company}
# Tier 1 — Public REST API, no auth required

```


---


## File: ats-scripts/scrapers/smartrecruiters/__init__.py

```py
# Smartrecruiters ATS Scraper
# Public REST API with JSON responses
# Tier 1 — Easy — Public API

```


---


## File: ats-scripts/scrapers/taleo/__init__.py

```py
# Taleo ATS Scraper
# Scrape public career pages at {company}.taleo.net/careersection
# Tier 3 — Hard — Auth-Gated, Browser Automation

```


---


## File: ats-scripts/scrapers/workable/__init__.py

```py
# Workable ATS Scraper
# Career site widget scraping or undocumented API
# Tier 2 — Medium — HTML/Widget Scraping

```


---


## File: ats-scripts/scrapers/workday/__init__.py

```py
# Workday ATS Scraper
# Scrape *.myworkdayjobs.com/* — JS rendering, possible hidden API
# Tier 3 — Hard — JS-Heavy, Browser Automation

```


---


## File: ats-scripts/script-for-reference/combine_greenhouse_jobs.py

```py
#!/usr/bin/env python3
"""
Combine all Greenhouse job JSON files into a single dated file.
"""

import argparse
import json
import sys
from pathlib import Path
from datetime import datetime
from typing import List, Dict


def combine_greenhouse_jobs(input_dir: str = "greenhouse_jobs", output_dir: str = ".") -> str:
    """
    Combine all jobs.json files from company subdirectories into a single file.
    
    Returns:
        Path to the combined output file
    """
    base_path = Path(input_dir)
    
    if not base_path.exists():
        print(f"❌ Error: Directory '{input_dir}' not found")
        sys.exit(1)
    
    # Get all company subdirectories
    company_dirs = [d for d in base_path.iterdir() if d.is_dir()]
    
    if not company_dirs:
        print(f"❌ Error: No company directories found in '{input_dir}'")
        sys.exit(1)
    
    print(f"🔍 Found {len(company_dirs)} company directories")
    print(f"📦 Combining job data...\n")
    
    all_jobs = []
    companies_processed = 0
    companies_with_jobs = 0
    total_jobs = 0
    
    for company_dir in sorted(company_dirs):
        jobs_file = company_dir / "jobs.json"
        metadata_file = company_dir / "metadata.json"
        
        if not jobs_file.exists():
            continue
        
        try:
            # Load jobs data
            with open(jobs_file, 'r', encoding='utf-8') as f:
                jobs_data = json.load(f)
            
            # Load metadata for company info
            metadata = {}
            if metadata_file.exists():
                with open(metadata_file, 'r', encoding='utf-8') as f:
                    metadata = json.load(f)
            
            jobs = jobs_data.get('jobs', [])
            
            # Add company context to each job
            company_name = metadata.get('original_name', company_dir.name)
            company_url = metadata.get('url', '')
            
            for job in jobs:
                job['_company_name'] = company_name
                job['_company_greenhouse_url'] = company_url
                job['_company_slug'] = company_dir.name
                all_jobs.append(job)
            
            companies_processed += 1
            if len(jobs) > 0:
                companies_with_jobs += 1
                total_jobs += len(jobs)
                print(f"  ✓ {company_name}: {len(jobs)} jobs")
        
        except Exception as e:
            print(f"  ⚠️  Error processing {company_dir.name}: {e}")
            continue
    
    # Create output filename with today's date
    today = datetime.now().strftime('%Y-%m-%d')
    output_file = Path(output_dir) / f"Greenhouse_jobs_{today}.json"
    
    # Create combined output structure
    output_data = {
        "metadata": {
            "generated_at": datetime.now().isoformat(),
            "total_companies": companies_processed,
            "companies_with_jobs": companies_with_jobs,
            "total_jobs": total_jobs,
            "source_directory": input_dir
        },
        "jobs": all_jobs
    }
    
    # Write combined file
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(output_data, f, indent=2, ensure_ascii=False)
    
    # Print summary
    print("\n" + "="*60)
    print("SUMMARY")
    print("="*60)
    print(f"📊 Companies processed: {companies_processed}")
    print(f"💼 Companies with jobs: {companies_with_jobs}")
    print(f"🎯 Total jobs collected: {total_jobs:,}")
    print(f"\n✅ Combined file created: {output_file}")
    print(f"📦 File size: {output_file.stat().st_size / 1024 / 1024:.2f} MB")
    
    return str(output_file)


def main():
    parser = argparse.ArgumentParser(
        description='Combine all Greenhouse job JSON files into a single dated file',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  %(prog)s
  %(prog)s -i greenhouse_jobs -o combined_data
  %(prog)s --input-dir ./data/greenhouse --output-dir ./exports
  
Output file will be named: Greenhouse_jobs_YYYY-MM-DD.json
        """
    )
    
    parser.add_argument(
        '-i', '--input-dir',
        default='greenhouse_jobs',
        help='Input directory containing company subdirectories (default: greenhouse_jobs)'
    )
    
    parser.add_argument(
        '-o', '--output-dir',
        default='.',
        help='Output directory for combined file (default: current directory)'
    )
    
    args = parser.parse_args()
    
    combine_greenhouse_jobs(args.input_dir, args.output_dir)


if __name__ == '__main__':
    main()
```


---


## File: ats-scripts/script-for-reference/combine_lever_jobs.py

```py
#!/usr/bin/env python3
"""
Combine all Lever job JSON files into a single dated file.
"""

import argparse
import json
import sys
from pathlib import Path
from datetime import datetime
from typing import List, Dict


def combine_lever_jobs(input_dir: str = "lever_jobs", output_dir: str = ".") -> str:
    """
    Combine all jobs.json files from company subdirectories into a single file.
    
    Returns:
        Path to the combined output file
    """
    base_path = Path(input_dir)
    
    if not base_path.exists():
        print(f"❌ Error: Directory '{input_dir}' not found")
        sys.exit(1)
    
    # Get all company subdirectories
    company_dirs = [d for d in base_path.iterdir() if d.is_dir()]
    
    if not company_dirs:
        print(f"❌ Error: No company directories found in '{input_dir}'")
        sys.exit(1)
    
    print(f"🔍 Found {len(company_dirs)} company directories")
    print(f"📦 Combining job data...\n")
    
    all_jobs = []
    companies_processed = 0
    companies_with_jobs = 0
    total_jobs = 0
    
    for company_dir in sorted(company_dirs):
        jobs_file = company_dir / "jobs.json"
        metadata_file = company_dir / "metadata.json"
        
        if not jobs_file.exists():
            continue
        
        try:
            # Load jobs data
            with open(jobs_file, 'r', encoding='utf-8') as f:
                jobs_data = json.load(f)
            
            # Load metadata for company info
            metadata = {}
            if metadata_file.exists():
                with open(metadata_file, 'r', encoding='utf-8') as f:
                    metadata = json.load(f)
            
            jobs = jobs_data.get('jobs', [])
            
            # Add company context to each job
            company_name = metadata.get('original_name', company_dir.name)
            company_url = metadata.get('url', '')
            
            for job in jobs:
                job['_company_name'] = company_name
                job['_company_lever_url'] = company_url
                job['_company_slug'] = company_dir.name
                all_jobs.append(job)
            
            companies_processed += 1
            if len(jobs) > 0:
                companies_with_jobs += 1
                total_jobs += len(jobs)
                print(f"  ✓ {company_name}: {len(jobs)} jobs")
        
        except Exception as e:
            print(f"  ⚠️  Error processing {company_dir.name}: {e}")
            continue
    
    # Create output filename with today's date
    today = datetime.now().strftime('%Y-%m-%d')
    output_file = Path(output_dir) / f"Lever_jobs_{today}.json"
    
    # Create combined output structure
    output_data = {
        "metadata": {
            "generated_at": datetime.now().isoformat(),
            "total_companies": companies_processed,
            "companies_with_jobs": companies_with_jobs,
            "total_jobs": total_jobs,
            "source_directory": input_dir
        },
        "jobs": all_jobs
    }
    
    # Write combined file
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(output_data, f, indent=2, ensure_ascii=False)
    
    # Print summary
    print("\n" + "="*60)
    print("SUMMARY")
    print("="*60)
    print(f"📊 Companies processed: {companies_processed}")
    print(f"💼 Companies with jobs: {companies_with_jobs}")
    print(f"🎯 Total jobs collected: {total_jobs:,}")
    print(f"\n✅ Combined file created: {output_file}")
    print(f"📦 File size: {output_file.stat().st_size / 1024 / 1024:.2f} MB")
    
    return str(output_file)


def main():
    parser = argparse.ArgumentParser(
        description='Combine all Lever job JSON files into a single dated file',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  %(prog)s
  %(prog)s -i lever_jobs -o combined_data
  %(prog)s --input-dir ./data/lever --output-dir ./exports
  
Output file will be named: Lever_jobs_YYYY-MM-DD.json
        """
    )
    
    parser.add_argument(
        '-i', '--input-dir',
        default='lever_jobs',
        help='Input directory containing company subdirectories (default: lever_jobs)'
    )
    
    parser.add_argument(
        '-o', '--output-dir',
        default='.',
        help='Output directory for combined file (default: current directory)'
    )
    
    args = parser.parse_args()
    
    combine_lever_jobs(args.input_dir, args.output_dir)


if __name__ == '__main__':
    main()
```


---


## File: ats-scripts/script-for-reference/greenhouse_flatten.py

```py
#!/usr/bin/env python3
"""
Flatten Greenhouse jobs JSON to CSV format.
"""

import argparse
import json
import csv
import sys
from pathlib import Path
from datetime import datetime
from typing import List, Dict, Any


def flatten_job(job: Dict[str, Any]) -> Dict[str, Any]:
    """
    Flatten a job dictionary, handling nested objects.
    """
    flattened = {}
    
    # Direct fields
    flattened['job_id'] = job.get('id', '')
    flattened['internal_job_id'] = job.get('internal_job_id', '')
    flattened['requisition_id'] = job.get('requisition_id', '')
    flattened['title'] = job.get('title', '')
    flattened['absolute_url'] = job.get('absolute_url', '')
    flattened['language'] = job.get('language', '')
    flattened['education'] = job.get('education', '')
    
    # Date fields
    flattened['first_published'] = job.get('first_published', '')
    flattened['updated_at'] = job.get('updated_at', '')
    
    # Company fields (from metadata we added)
    flattened['company_name'] = job.get('_company_name', job.get('company_name', ''))
    flattened['company_slug'] = job.get('_company_slug', '')
    flattened['company_greenhouse_url'] = job.get('_company_greenhouse_url', '')
    
    # Location (nested object)
    location = job.get('location', {})
    if isinstance(location, dict):
        flattened['location'] = location.get('name', '')
    else:
        flattened['location'] = str(location) if location else ''
    
    # Metadata (nested, could be None)
    metadata = job.get('metadata')
    flattened['metadata'] = json.dumps(metadata) if metadata else ''
    
    # Data compliance (array - just flag if exists)
    data_compliance = job.get('data_compliance', [])
    flattened['has_gdpr_compliance'] = any(
        dc.get('type') == 'gdpr' for dc in data_compliance if isinstance(dc, dict)
    )
    
    return flattened


def json_to_csv(json_file: str, output_file: str = None) -> str:
    """
    Convert Greenhouse jobs JSON to CSV.
    
    Args:
        json_file: Path to input JSON file
        output_file: Path to output CSV file (optional, auto-generated if not provided)
    
    Returns:
        Path to the output CSV file
    """
    # Load JSON data
    json_path = Path(json_file)
    
    if not json_path.exists():
        print(f"❌ Error: File '{json_file}' not found")
        sys.exit(1)
    
    print(f"📖 Reading {json_file}...")
    
    try:
        with open(json_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
    except json.JSONDecodeError as e:
        print(f"❌ Error: Invalid JSON file - {e}")
        sys.exit(1)
    
    # Extract jobs array
    jobs = data.get('jobs', [])
    
    if not jobs:
        print("⚠️  Warning: No jobs found in JSON file")
        sys.exit(1)
    
    print(f"📊 Found {len(jobs):,} jobs")
    print(f"🔄 Flattening data...\n")
    
    # Flatten all jobs
    flattened_jobs = []
    for i, job in enumerate(jobs, 1):
        try:
            flattened_jobs.append(flatten_job(job))
        except Exception as e:
            print(f"  ⚠️  Error flattening job {i}: {e}")
            continue
        
        if i % 1000 == 0:
            print(f"  Processed {i:,} jobs...")
    
    if not flattened_jobs:
        print("❌ Error: No jobs could be flattened")
        sys.exit(1)
    
    # Generate output filename if not provided
    if output_file is None:
        # Remove .json extension and add .csv
        base_name = json_path.stem
        output_file = json_path.parent / f"{base_name}.csv"
    else:
        output_file = Path(output_file)
    
    # Write to CSV
    print(f"\n💾 Writing to {output_file}...")
    
    # Get all fieldnames (in case some jobs have different fields)
    fieldnames = list(flattened_jobs[0].keys())
    
    with open(output_file, 'w', newline='', encoding='utf-8') as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(flattened_jobs)
    
    # Print summary
    print("\n" + "="*60)
    print("SUMMARY")
    print("="*60)
    print(f"📝 Jobs written: {len(flattened_jobs):,}")
    print(f"📋 Columns: {len(fieldnames)}")
    print(f"✅ Output file: {output_file}")
    print(f"📦 File size: {output_file.stat().st_size / 1024 / 1024:.2f} MB")
    
    # Show column names
    print(f"\n📊 Columns included:")
    for field in fieldnames:
        print(f"   • {field}")
    
    return str(output_file)


def main():
    parser = argparse.ArgumentParser(
        description='Flatten Greenhouse jobs JSON to CSV format',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  %(prog)s Greenhouse_jobs_2026-02-14.json
  %(prog)s input.json -o output.csv
  %(prog)s data/jobs.json --output results/flattened.csv
  
If no output file is specified, will create CSV with same name as input file.
        """
    )
    
    parser.add_argument(
        'json_file',
        help='Path to input JSON file (combined Greenhouse jobs)'
    )
    
    parser.add_argument(
        '-o', '--output',
        help='Path to output CSV file (optional, auto-generated if not provided)'
    )
    
    args = parser.parse_args()
    
    json_to_csv(args.json_file, args.output)


if __name__ == '__main__':
    main()
```


---


## File: ats-scripts/script-for-reference/greenhouse_flatten_simple.py

```py
#!/usr/bin/env python3
"""
Flatten Greenhouse jobs JSON to simple CSV with title, company_name, location.
"""

import argparse
import json
import csv
import sys
from pathlib import Path
from typing import List, Dict, Any


def flatten_job_simple(job: Dict[str, Any]) -> Dict[str, str]:
    """
    Flatten a job to just title, company_name, and location.
    """
    # Company name (prefer our metadata, fallback to job field)
    company_name = job.get('_company_name', job.get('company_name', ''))
    
    # Location (handle nested object)
    location = job.get('location', {})
    if isinstance(location, dict):
        location_str = location.get('name', '')
    else:
        location_str = str(location) if location else ''
    
    return {
        'title': job.get('title', ''),
        'company_name': company_name,
        'location': location_str
    }


def json_to_simple_csv(json_file: str, output_file: str = None) -> str:
    """
    Convert Greenhouse jobs JSON to simple CSV with title, company_name, location.
    
    Args:
        json_file: Path to input JSON file
        output_file: Path to output CSV file (optional, auto-generated if not provided)
    
    Returns:
        Path to the output CSV file
    """
    # Load JSON data
    json_path = Path(json_file)
    
    if not json_path.exists():
        print(f"❌ Error: File '{json_file}' not found")
        sys.exit(1)
    
    print(f"📖 Reading {json_file}...")
    
    try:
        with open(json_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
    except json.JSONDecodeError as e:
        print(f"❌ Error: Invalid JSON file - {e}")
        sys.exit(1)
    
    # Extract jobs array
    jobs = data.get('jobs', [])
    
    if not jobs:
        print("⚠️  Warning: No jobs found in JSON file")
        sys.exit(1)
    
    print(f"📊 Found {len(jobs):,} jobs")
    print(f"🔄 Extracting title, company, and location...\n")
    
    # Flatten all jobs
    flattened_jobs = []
    for i, job in enumerate(jobs, 1):
        try:
            flattened_jobs.append(flatten_job_simple(job))
        except Exception as e:
            print(f"  ⚠️  Error processing job {i}: {e}")
            continue
        
        if i % 1000 == 0:
            print(f"  Processed {i:,} jobs...")
    
    if not flattened_jobs:
        print("❌ Error: No jobs could be processed")
        sys.exit(1)
    
    # Generate output filename if not provided
    if output_file is None:
        # Remove .json extension and add _simple.csv
        base_name = json_path.stem
        output_file = json_path.parent / f"{base_name}_simple.csv"
    else:
        output_file = Path(output_file)
    
    # Write to CSV
    print(f"\n💾 Writing to {output_file}...")
    
    fieldnames = ['title', 'company_name', 'location']
    
    with open(output_file, 'w', newline='', encoding='utf-8') as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(flattened_jobs)
    
    # Print summary
    print("\n" + "="*60)
    print("SUMMARY")
    print("="*60)
    print(f"📝 Jobs written: {len(flattened_jobs):,}")
    print(f"📋 Columns: 3 (title, company_name, location)")
    print(f"✅ Output file: {output_file}")
    print(f"📦 File size: {output_file.stat().st_size / 1024:.2f} KB")
    
    # Show first few rows as preview
    print(f"\n👀 Preview (first 5 rows):")
    print(f"{'Title':<50} {'Company':<40} {'Location':<30}")
    print("-" * 120)
    for job in flattened_jobs[:5]:
        title = job['title'][:47] + '...' if len(job['title']) > 50 else job['title']
        company = job['company_name'][:37] + '...' if len(job['company_name']) > 40 else job['company_name']
        location = job['location'][:27] + '...' if len(job['location']) > 30 else job['location']
        print(f"{title:<50} {company:<40} {location:<30}")
    
    return str(output_file)


def main():
    parser = argparse.ArgumentParser(
        description='Flatten Greenhouse jobs JSON to simple CSV (title, company_name, location)',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  %(prog)s Greenhouse_jobs_2026-02-14.json
  %(prog)s input.json -o simple_jobs.csv
  %(prog)s data/jobs.json --output results/simple.csv
  
If no output file is specified, will create CSV with '_simple.csv' suffix.
Output format:
  title, company_name, location
        """
    )
    
    parser.add_argument(
        'json_file',
        help='Path to input JSON file (combined Greenhouse jobs)'
    )
    
    parser.add_argument(
        '-o', '--output',
        help='Path to output CSV file (optional, auto-generated if not provided)'
    )
    
    args = parser.parse_args()
    
    json_to_simple_csv(args.json_file, args.output)


if __name__ == '__main__':
    main()
```


---


## File: ats-scripts/script-for-reference/greenhouse_scraper.py

```py
#!/usr/bin/env python3
"""
Greenhouse ATS Job Scraper
Checks if companies use Greenhouse and saves their job listings.
"""

import argparse
import json
import os
import sys
import time
import re
from pathlib import Path
from typing import List, Tuple
import requests


def normalize_company_name(name: str) -> str:
    """Convert company name to Greenhouse URL format."""
    # Common company suffixes to remove
    suffixes = [
        r',?\s+Inc\.?',
        r',?\s+LLC\.?',
        r',?\s+L\.L\.C\.?',
        r',?\s+Corp\.?',
        r',?\s+Corporation',
        r',?\s+L\.P\.?',
        r',?\s+LP\.?',
        r',?\s+Ltd\.?',
        r',?\s+Limited',
        r',?\s+Co\.?',
        r',?\s+Company',
        r',?\s+PLC\.?',
        r',?\s+LTD\.?',
        r',?\s+Liability\s+Co\.?',
        r',?\s+Ltd\s+Liability\s+Co\.?',
    ]
    
    # Remove suffixes (case insensitive)
    cleaned = name
    for suffix in suffixes:
        cleaned = re.sub(suffix, '', cleaned, flags=re.IGNORECASE)
    
    # Remove any remaining commas, periods, spaces, and special chars
    cleaned = cleaned.strip()
    cleaned = re.sub(r'[,.\s\-&\']', '', cleaned)
    
    return cleaned.lower()


def read_companies_from_file(filepath: str) -> List[str]:
    """Read company names from file, trying multiple encodings."""
    encodings = ['utf-8', 'utf-8-sig', 'utf-16', 'utf-16-le', 'utf-16-be', 'latin-1']
    
    for encoding in encodings:
        try:
            with open(filepath, 'r', encoding=encoding) as f:
                companies = [line.strip() for line in f if line.strip()]
                if companies:
                    return companies
        except (UnicodeDecodeError, UnicodeError):
            continue
        except FileNotFoundError:
            print(f"Error: File '{filepath}' not found")
            sys.exit(1)
    
    # If all encodings fail
    print(f"Error: Could not decode file '{filepath}' with any supported encoding")
    sys.exit(1)


def check_greenhouse(company_name: str, timeout: int = 10) -> Tuple[bool, dict]:
    """
    Check if a company uses Greenhouse and return their jobs.
    
    Returns:
        (uses_greenhouse: bool, jobs_data: dict)
    """
    normalized = normalize_company_name(company_name)
    url = f"https://boards-api.greenhouse.io/v1/boards/{normalized}/jobs"
    
    try:
        response = requests.get(url, timeout=timeout)
        
        if response.status_code == 404:
            return False, {}
        
        if response.status_code == 200:
            return True, response.json()
        
        print(f"  ⚠️  Unexpected status {response.status_code} for {company_name}")
        return False, {}
        
    except requests.exceptions.Timeout:
        print(f"  ⏱️  Timeout fetching {company_name}")
        return False, {}
    except requests.exceptions.RequestException as e:
        print(f"  ❌ Error fetching {company_name}: {e}")
        return False, {}


def save_jobs(company_name: str, jobs_data: dict, base_dir: str = "greenhouse_jobs") -> bool:
    """Save jobs JSON to company subdirectory."""
    try:
        # Create base directory if it doesn't exist
        base_path = Path(base_dir)
        base_path.mkdir(exist_ok=True)
        
        # Create company subdirectory
        normalized = normalize_company_name(company_name)
        company_dir = base_path / normalized
        company_dir.mkdir(exist_ok=True)
        
        # Save jobs data
        jobs_file = company_dir / "jobs.json"
        with open(jobs_file, 'w', encoding='utf-8') as f:
            json.dump(jobs_data, f, indent=2, ensure_ascii=False)
        
        # Also save a metadata file with original company name
        metadata = {
            "original_name": company_name,
            "normalized_name": normalized,
            "job_count": len(jobs_data.get('jobs', [])),
            "url": f"https://boards.greenhouse.io/{normalized}"
        }
        
        meta_file = company_dir / "metadata.json"
        with open(meta_file, 'w', encoding='utf-8') as f:
            json.dump(metadata, f, indent=2)
        
        return True
        
    except Exception as e:
        print(f"  ❌ Error saving {company_name}: {e}")
        return False


def process_companies(companies: List[str], output_dir: str = "greenhouse_jobs", delay: float = 0.5):
    """Process list of companies and save Greenhouse data."""
    results = {
        'found': [],
        'not_found': [],
        'errors': []
    }
    
    print(f"\n🔍 Checking {len(companies)} companies for Greenhouse ATS...\n")
    
    for i, company in enumerate(companies, 1):
        normalized = normalize_company_name(company)
        display_name = f"{company} → {normalized}" if company != normalized else company
        
        print(f"[{i}/{len(companies)}] {display_name}...", end=' ')
        
        uses_greenhouse, jobs_data = check_greenhouse(company)
        
        if uses_greenhouse:
            job_count = len(jobs_data.get('jobs', []))
            print(f"✅ Found! ({job_count} jobs)")
            
            if save_jobs(company, jobs_data, output_dir):
                results['found'].append((company, normalized, job_count))
            else:
                results['errors'].append(company)
        else:
            print("❌ Not using Greenhouse (or no jobs)")
            results['not_found'].append(company)
        
        # Be respectful with rate limiting
        if i < len(companies):
            time.sleep(delay)
    
    # Print summary
    print("\n" + "="*60)
    print("SUMMARY")
    print("="*60)
    print(f"✅ Using Greenhouse: {len(results['found'])}")
    for company, normalized, count in results['found']:
        if company != normalized:
            print(f"   • {company} [{normalized}] ({count} jobs)")
        else:
            print(f"   • {company} ({count} jobs)")
    print(f"\n❌ Not using Greenhouse: {len(results['not_found'])}")
    print(f"⚠️  Errors: {len(results['errors'])}")
    
    if results['found']:
        print(f"\n📁 Data saved to: {output_dir}/")


def main():
    parser = argparse.ArgumentParser(
        description='Check companies for Greenhouse ATS and save job listings',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  %(prog)s "Databricks, Inc." HubSpot "Duolingo, Inc."
  %(prog)s -f companies.txt -o data/greenhouse
  %(prog)s "Coca Cola Company" Microsoft Apple --delay 1.0
  
The script automatically strips common suffixes like Inc., LLC, Corp., L.P., etc.
        """
    )
    
    parser.add_argument(
        'companies',
        nargs='*',
        help='Company names to check'
    )
    
    parser.add_argument(
        '-f', '--file',
        help='Read company names from file (one per line)'
    )
    
    parser.add_argument(
        '-o', '--output',
        default='greenhouse_jobs',
        help='Output directory (default: greenhouse_jobs)'
    )
    
    parser.add_argument(
        '-d', '--delay',
        type=float,
        default=0.5,
        help='Delay between requests in seconds (default: 0.5)'
    )
    
    args = parser.parse_args()
    
    # Get company list from either command line or file
    companies = []
    
    if args.file:
        companies = read_companies_from_file(args.file)
    
    if args.companies:
        companies.extend(args.companies)
    
    if not companies:
        parser.print_help()
        sys.exit(1)
    
    process_companies(companies, args.output, args.delay)


if __name__ == '__main__':
    main()
```


---


## File: ats-scripts/script-for-reference/lever_flatten.py

```py
#!/usr/bin/env python3
"""
Flatten Lever jobs JSON to CSV format.
Supports both full and simple output modes.
"""

import argparse
import json
import csv
import sys
from pathlib import Path
from typing import Dict, Any


def flatten_job_full(job: Dict[str, Any]) -> Dict[str, Any]:
    """
    Flatten a Lever job dictionary with all fields.
    """
    flattened = {}
    
    # Direct fields
    flattened['job_id'] = job.get('id', '')
    flattened['title'] = job.get('text', '')
    flattened['hosted_url'] = job.get('hostedUrl', '')
    flattened['apply_url'] = job.get('applyUrl', '')
    flattened['country'] = job.get('country', '')
    flattened['workplace_type'] = job.get('workplaceType', '')
    
    # Date fields
    flattened['created_at'] = job.get('createdAt', '')
    
    # Company fields (from metadata we added)
    flattened['company_name'] = job.get('_company_name', '')
    flattened['company_slug'] = job.get('_company_slug', '')
    flattened['company_lever_url'] = job.get('_company_lever_url', '')
    
    # Categories (nested object)
    categories = job.get('categories', {})
    if isinstance(categories, dict):
        flattened['department'] = categories.get('department', '')
        flattened['team'] = categories.get('team', '')
        flattened['commitment'] = categories.get('commitment', '')
        flattened['location'] = categories.get('location', '')
    else:
        flattened['department'] = ''
        flattened['team'] = ''
        flattened['commitment'] = ''
        flattened['location'] = ''
    
    # Description fields
    flattened['description_plain'] = job.get('descriptionPlain', '')
    flattened['additional_plain'] = job.get('additionalPlain', '')
    
    return flattened


def flatten_job_simple(job: Dict[str, Any]) -> Dict[str, str]:
    """
    Flatten a Lever job to just title, company_name, and location.
    """
    # Company name (prefer our metadata)
    company_name = job.get('_company_name', '')
    
    # Location from categories
    categories = job.get('categories', {})
    if isinstance(categories, dict):
        location = categories.get('location', '')
    else:
        location = ''
    
    return {
        'title': job.get('text', ''),
        'company_name': company_name,
        'location': location
    }


def json_to_csv(json_file: str, output_file: str = None, simple: bool = False) -> str:
    """
    Convert Lever jobs JSON to CSV.
    
    Args:
        json_file: Path to input JSON file
        output_file: Path to output CSV file (optional, auto-generated if not provided)
        simple: If True, output only title, company_name, location
    
    Returns:
        Path to the output CSV file
    """
    # Load JSON data
    json_path = Path(json_file)
    
    if not json_path.exists():
        print(f"❌ Error: File '{json_file}' not found")
        sys.exit(1)
    
    print(f"📖 Reading {json_file}...")
    
    try:
        with open(json_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
    except json.JSONDecodeError as e:
        print(f"❌ Error: Invalid JSON file - {e}")
        sys.exit(1)
    
    # Extract jobs array
    jobs = data.get('jobs', [])
    
    if not jobs:
        print("⚠️  Warning: No jobs found in JSON file")
        sys.exit(1)
    
    print(f"📊 Found {len(jobs):,} jobs")
    
    if simple:
        print(f"🔄 Extracting title, company, and location...\n")
        flatten_func = flatten_job_simple
        suffix = "_simple"
    else:
        print(f"🔄 Flattening all data...\n")
        flatten_func = flatten_job_full
        suffix = ""
    
    # Flatten all jobs
    flattened_jobs = []
    for i, job in enumerate(jobs, 1):
        try:
            flattened_jobs.append(flatten_func(job))
        except Exception as e:
            print(f"  ⚠️  Error processing job {i}: {e}")
            continue
        
        if i % 1000 == 0:
            print(f"  Processed {i:,} jobs...")
    
    if not flattened_jobs:
        print("❌ Error: No jobs could be processed")
        sys.exit(1)
    
    # Generate output filename if not provided
    if output_file is None:
        base_name = json_path.stem
        output_file = json_path.parent / f"{base_name}{suffix}.csv"
    else:
        output_file = Path(output_file)
    
    # Write to CSV
    print(f"\n💾 Writing to {output_file}...")
    
    fieldnames = list(flattened_jobs[0].keys())
    
    with open(output_file, 'w', newline='', encoding='utf-8') as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(flattened_jobs)
    
    # Print summary
    print("\n" + "="*60)
    print("SUMMARY")
    print("="*60)
    print(f"📝 Jobs written: {len(flattened_jobs):,}")
    print(f"📋 Columns: {len(fieldnames)}")
    print(f"✅ Output file: {output_file}")
    
    file_size_kb = output_file.stat().st_size / 1024
    if file_size_kb > 1024:
        print(f"📦 File size: {file_size_kb / 1024:.2f} MB")
    else:
        print(f"📦 File size: {file_size_kb:.2f} KB")
    
    if simple:
        # Show column names
        print(f"\n📊 Columns: {', '.join(fieldnames)}")
        
        # Show preview
        print(f"\n👀 Preview (first 5 rows):")
        print(f"{'Title':<50} {'Company':<40} {'Location':<30}")
        print("-" * 120)
        for job in flattened_jobs[:5]:
            title = job['title'][:47] + '...' if len(job['title']) > 50 else job['title']
            company = job['company_name'][:37] + '...' if len(job['company_name']) > 40 else job['company_name']
            location = job['location'][:27] + '...' if len(job['location']) > 30 else job['location']
            print(f"{title:<50} {company:<40} {location:<30}")
    else:
        # Show column names
        print(f"\n📊 Columns included:")
        for field in fieldnames:
            print(f"   • {field}")
    
    return str(output_file)


def main():
    parser = argparse.ArgumentParser(
        description='Flatten Lever jobs JSON to CSV format',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  # Full output (all fields)
  %(prog)s Lever_jobs_2026-02-14.json
  %(prog)s input.json -o output.csv
  
  # Simple output (title, company_name, location only)
  %(prog)s Lever_jobs_2026-02-14.json --simple
  %(prog)s input.json -o simple.csv --simple
  
If no output file is specified:
  - Full mode: creates CSV with same name as input
  - Simple mode: creates CSV with '_simple.csv' suffix
        """
    )
    
    parser.add_argument(
        'json_file',
        help='Path to input JSON file (combined Lever jobs)'
    )
    
    parser.add_argument(
        '-o', '--output',
        help='Path to output CSV file (optional, auto-generated if not provided)'
    )
    
    parser.add_argument(
        '-s', '--simple',
        action='store_true',
        help='Output only title, company_name, and location (simple mode)'
    )
    
    args = parser.parse_args()
    
    json_to_csv(args.json_file, args.output, args.simple)


if __name__ == '__main__':
    main()
```


---


## File: ats-scripts/script-for-reference/lever_scraper.py

```py
#!/usr/bin/env python3
"""
Lever ATS Job Scraper
Checks if companies use Lever and saves their job listings.
"""

import argparse
import json
import os
import sys
import time
import re
from pathlib import Path
from typing import List, Tuple
import requests


def normalize_company_name(name: str) -> str:
    """Convert company name to Lever URL format."""
    # Common company suffixes to remove
    suffixes = [
        r',?\s+Inc\.?',
        r',?\s+LLC\.?',
        r',?\s+L\.L\.C\.?',
        r',?\s+Corp\.?',
        r',?\s+Corporation',
        r',?\s+L\.P\.?',
        r',?\s+LP\.?',
        r',?\s+Ltd\.?',
        r',?\s+Limited',
        r',?\s+Co\.?',
        r',?\s+Company',
        r',?\s+PLC\.?',
        r',?\s+LTD\.?',
        r',?\s+Liability\s+Co\.?',
        r',?\s+Ltd\s+Liability\s+Co\.?',
    ]
    
    # Remove suffixes (case insensitive)
    cleaned = name
    for suffix in suffixes:
        cleaned = re.sub(suffix, '', cleaned, flags=re.IGNORECASE)
    
    # Remove any remaining commas, periods, spaces, and special chars
    cleaned = cleaned.strip()
    cleaned = re.sub(r'[,.\s\-&\']', '', cleaned)
    
    return cleaned.lower()


def read_companies_from_file(filepath: str) -> List[str]:
    """Read company names from file, trying multiple encodings."""
    encodings = ['utf-8', 'utf-8-sig', 'utf-16', 'utf-16-le', 'utf-16-be', 'latin-1']
    
    for encoding in encodings:
        try:
            with open(filepath, 'r', encoding=encoding) as f:
                companies = [line.strip() for line in f if line.strip()]
                if companies:
                    return companies
        except (UnicodeDecodeError, UnicodeError):
            continue
        except FileNotFoundError:
            print(f"Error: File '{filepath}' not found")
            sys.exit(1)
    
    # If all encodings fail
    print(f"Error: Could not decode file '{filepath}' with any supported encoding")
    sys.exit(1)


def check_lever(company_name: str, timeout: int = 10) -> Tuple[bool, dict]:
    """
    Check if a company uses Lever and return their jobs.
    
    Returns:
        (uses_lever: bool, jobs_data: dict)
    """
    normalized = normalize_company_name(company_name)
    url = f"https://api.lever.co/v0/postings/{normalized}"
    
    try:
        response = requests.get(url, timeout=timeout)
        
        if response.status_code == 404:
            return False, {}
        
        if response.status_code == 200:
            # Lever returns an array directly, not wrapped in an object
            jobs_array = response.json()
            # Wrap it in a dict for consistency with Greenhouse format
            return True, {"jobs": jobs_array}
        
        print(f"  ⚠️  Unexpected status {response.status_code} for {company_name}")
        return False, {}
        
    except requests.exceptions.Timeout:
        print(f"  ⏱️  Timeout fetching {company_name}")
        return False, {}
    except requests.exceptions.RequestException as e:
        print(f"  ❌ Error fetching {company_name}: {e}")
        return False, {}


def save_jobs(company_name: str, jobs_data: dict, base_dir: str = "lever_jobs") -> bool:
    """Save jobs JSON to company subdirectory."""
    try:
        # Create base directory if it doesn't exist
        base_path = Path(base_dir)
        base_path.mkdir(exist_ok=True)
        
        # Create company subdirectory
        normalized = normalize_company_name(company_name)
        company_dir = base_path / normalized
        company_dir.mkdir(exist_ok=True)
        
        # Save jobs data
        jobs_file = company_dir / "jobs.json"
        with open(jobs_file, 'w', encoding='utf-8') as f:
            json.dump(jobs_data, f, indent=2, ensure_ascii=False)
        
        # Also save a metadata file with original company name
        metadata = {
            "original_name": company_name,
            "normalized_name": normalized,
            "job_count": len(jobs_data.get('jobs', [])),
            "url": f"https://jobs.lever.co/{normalized}"
        }
        
        meta_file = company_dir / "metadata.json"
        with open(meta_file, 'w', encoding='utf-8') as f:
            json.dump(metadata, f, indent=2)
        
        return True
        
    except Exception as e:
        print(f"  ❌ Error saving {company_name}: {e}")
        return False


def process_companies(companies: List[str], output_dir: str = "lever_jobs", delay: float = 0.5):
    """Process list of companies and save Lever data."""
    results = {
        'found': [],
        'not_found': [],
        'errors': []
    }
    
    print(f"\n🔍 Checking {len(companies)} companies for Lever ATS...\n")
    
    for i, company in enumerate(companies, 1):
        normalized = normalize_company_name(company)
        display_name = f"{company} → {normalized}" if company != normalized else company
        
        print(f"[{i}/{len(companies)}] {display_name}...", end=' ')
        
        uses_lever, jobs_data = check_lever(company)
        
        if uses_lever:
            job_count = len(jobs_data.get('jobs', []))
            print(f"✅ Found! ({job_count} jobs)")
            
            if save_jobs(company, jobs_data, output_dir):
                results['found'].append((company, normalized, job_count))
            else:
                results['errors'].append(company)
        else:
            print("❌ Not using Lever (or no jobs)")
            results['not_found'].append(company)
        
        # Be respectful with rate limiting
        if i < len(companies):
            time.sleep(delay)
    
    # Print summary
    print("\n" + "="*60)
    print("SUMMARY")
    print("="*60)
    print(f"✅ Using Lever: {len(results['found'])}")
    for company, normalized, count in results['found']:
        if company != normalized:
            print(f"   • {company} [{normalized}] ({count} jobs)")
        else:
            print(f"   • {company} ({count} jobs)")
    print(f"\n❌ Not using Lever: {len(results['not_found'])}")
    print(f"⚠️  Errors: {len(results['errors'])}")
    
    if results['found']:
        print(f"\n📁 Data saved to: {output_dir}/")


def main():
    parser = argparse.ArgumentParser(
        description='Check companies for Lever ATS and save job listings',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  %(prog)s "Databricks, Inc." Anthropic "Notion, Inc."
  %(prog)s -f companies.txt -o data/lever
  %(prog)s "Stripe, Inc." Figma Ramp --delay 1.0
  
The script automatically strips common suffixes like Inc., LLC, Corp., L.P., etc.
        """
    )
    
    parser.add_argument(
        'companies',
        nargs='*',
        help='Company names to check'
    )
    
    parser.add_argument(
        '-f', '--file',
        help='Read company names from file (one per line)'
    )
    
    parser.add_argument(
        '-o', '--output',
        default='lever_jobs',
        help='Output directory (default: lever_jobs)'
    )
    
    parser.add_argument(
        '-d', '--delay',
        type=float,
        default=0.5,
        help='Delay between requests in seconds (default: 0.5)'
    )
    
    args = parser.parse_args()
    
    # Get company list from either command line or file
    companies = []
    
    if args.file:
        companies = read_companies_from_file(args.file)
    
    if args.companies:
        companies.extend(args.companies)
    
    if not companies:
        parser.print_help()
        sys.exit(1)
    
    process_companies(companies, args.output, args.delay)


if __name__ == '__main__':
    main()
```


---


## File: ats-scripts/tests/__init__.py

```py
# ATS Scraper Test Suite

```


---


## File: ats-scripts/tests/conftest.py

```py
"""
Shared pytest fixtures for ATS scraper tests.

Note: Python path is configured via pyproject.toml [tool.pytest.ini_options]
      pythonpath setting, so no sys.path manipulation is needed here.

Add shared fixtures here as scraper-specific tests are added.
"""

```


---


## File: ats-scripts/tests/test_normalize.py

```py
"""
Tests for company name normalization utilities.
Run: pytest tests/test_normalize.py -v
"""

import pytest
from scrapers.common.normalize import (
    normalize_company_name,
    epoch_ms_to_iso8601,
    read_companies_from_file,
)


class TestNormalizeCompanyName:
    """Tests for normalize_company_name()."""

    def test_basic_name(self):
        assert normalize_company_name("Databricks") == "databricks"

    def test_strip_inc(self):
        assert normalize_company_name("Databricks, Inc.") == "databricks"
        assert normalize_company_name("Databricks Inc") == "databricks"
        assert normalize_company_name("Databricks, Inc") == "databricks"

    def test_strip_llc(self):
        assert normalize_company_name("Acme LLC") == "acme"
        assert normalize_company_name("Acme, LLC.") == "acme"

    def test_strip_corp(self):
        assert normalize_company_name("Mega Corp.") == "mega"
        assert normalize_company_name("Mega Corporation") == "mega"

    def test_strip_ltd(self):
        assert normalize_company_name("British Ltd.") == "british"
        assert normalize_company_name("British Limited") == "british"

    def test_strip_lp(self):
        assert normalize_company_name("Fund L.P.") == "fund"
        assert normalize_company_name("Fund LP") == "fund"

    def test_remove_spaces_and_special_chars(self):
        assert normalize_company_name("Coca Cola Company") == "cocacola"
        assert normalize_company_name("Ben & Jerry's") == "benjerrys"

    def test_remove_hyphens(self):
        assert normalize_company_name("Proof-Point") == "proofpoint"

    def test_lowercase(self):
        assert normalize_company_name("DISCORD") == "discord"
        assert normalize_company_name("Discord") == "discord"

    def test_already_normalized(self):
        assert normalize_company_name("roblox") == "roblox"

    def test_empty_string(self):
        assert normalize_company_name("") == ""

    def test_whitespace(self):
        assert normalize_company_name("  Databricks  ") == "databricks"

    def test_multiple_suffixes(self):
        # Only the matching suffix should be removed
        assert normalize_company_name("Company Co.") == "company"

    def test_chained_suffixes(self):
        # Multiple suffixes stripped in successive passes
        assert normalize_company_name("Mega Corporation Inc.") == "mega"
        assert normalize_company_name("Global Corp. LLC") == "global"


class TestEpochMsToIso8601:
    """Tests for epoch_ms_to_iso8601()."""

    def test_known_timestamp(self):
        # 2025-02-15T00:00:00Z in epoch ms
        result = epoch_ms_to_iso8601(1739577600000)
        assert "2025-02-15" in result

    def test_zero_epoch(self):
        result = epoch_ms_to_iso8601(0)
        assert "1970-01-01" in result

    def test_returns_iso_format(self):
        result = epoch_ms_to_iso8601(1707850000000)
        # Should be parseable as ISO 8601
        from datetime import datetime
        datetime.fromisoformat(result)  # should not raise


class TestReadCompaniesFromFile:
    """Tests for read_companies_from_file() error handling."""

    def test_file_not_found_raises(self, tmp_path):
        with pytest.raises(FileNotFoundError):
            read_companies_from_file(str(tmp_path / "nonexistent.txt"))

    def test_reads_valid_file(self, tmp_path):
        companies_file = tmp_path / "companies.txt"
        companies_file.write_text("Acme\nWidgets Inc\nFooCorp\n", encoding="utf-8")
        result = read_companies_from_file(str(companies_file))
        assert result == ["Acme", "Widgets Inc", "FooCorp"]

    def test_skips_blank_lines(self, tmp_path):
        companies_file = tmp_path / "companies.txt"
        companies_file.write_text("Acme\n\n  \nWidgets\n", encoding="utf-8")
        result = read_companies_from_file(str(companies_file))
        assert result == ["Acme", "Widgets"]

    def test_empty_file_returns_empty_list(self, tmp_path):
        companies_file = tmp_path / "companies.txt"
        companies_file.write_text("", encoding="utf-8")
        result = read_companies_from_file(str(companies_file))
        assert result == []

    def test_blank_lines_only_returns_empty_list(self, tmp_path):
        companies_file = tmp_path / "companies.txt"
        companies_file.write_text("\n  \n\n", encoding="utf-8")
        result = read_companies_from_file(str(companies_file))
        assert result == []

```


---


## File: ats-scripts/tests/test_rate_limiter.py

```py
"""
Tests for the rate limiter.
Run: pytest tests/test_rate_limiter.py -v
"""

import pytest
from unittest.mock import patch
from scrapers.common.rate_limiter import RateLimiter


def _make_fake_time():
    """Create a fake time source and sleep function for deterministic tests.

    Starts at 1000.0 (not 0.0) because RateLimiter._last_request_time
    initializes to 0.0, so the first call needs a large elapsed time
    to behave as "immediate" (same as real time.monotonic()).
    """
    current_time = {"value": 1000.0}

    def fake_monotonic():
        return current_time["value"]

    def fake_sleep(seconds):
        current_time["value"] += seconds

    return current_time, fake_monotonic, fake_sleep


class TestRateLimiter:
    """Tests for RateLimiter."""

    def test_enforces_minimum_delay(self):
        current_time, fake_monotonic, fake_sleep = _make_fake_time()
        with patch(
            "scrapers.common.rate_limiter.time.monotonic",
            side_effect=fake_monotonic,
        ), patch(
            "scrapers.common.rate_limiter.time.sleep",
            side_effect=fake_sleep,
        ):
            limiter = RateLimiter(min_delay=0.3)
            start = current_time["value"]
            limiter.wait()
            limiter.wait()
            elapsed = current_time["value"] - start
        assert elapsed == pytest.approx(0.3, abs=1e-6), "Should enforce 0.3s between calls"

    def test_first_call_is_immediate(self):
        current_time, fake_monotonic, fake_sleep = _make_fake_time()
        with patch(
            "scrapers.common.rate_limiter.time.monotonic",
            side_effect=fake_monotonic,
        ), patch(
            "scrapers.common.rate_limiter.time.sleep",
            side_effect=fake_sleep,
        ):
            limiter = RateLimiter(min_delay=0.5)
            start = current_time["value"]
            limiter.wait()
            elapsed = current_time["value"] - start
        assert elapsed == 0.0, "First call should be immediate with no enforced delay"

    def test_minimum_0_3_enforced(self):
        limiter = RateLimiter(min_delay=0.1)  # below minimum
        assert limiter.min_delay == 0.3, "Should override to 0.3s minimum"

    def test_reset(self):
        current_time, fake_monotonic, fake_sleep = _make_fake_time()
        with patch(
            "scrapers.common.rate_limiter.time.monotonic",
            side_effect=fake_monotonic,
        ), patch(
            "scrapers.common.rate_limiter.time.sleep",
            side_effect=fake_sleep,
        ):
            limiter = RateLimiter(min_delay=1.0)
            limiter.wait()  # first call
            limiter.reset()
            start = current_time["value"]
            limiter.wait()  # should be immediate after reset
            elapsed = current_time["value"] - start
        assert elapsed == 0.0, "Call after reset should be immediate"

```


---


## File: ats-scripts/tests/test_schema_validator.py

```py
"""
Tests for the unified schema validator.
Run: pytest tests/test_schema_validator.py -v
"""

from scrapers.common.schema_validator import validate_job_record, validate_batch


def _make_valid_job(**overrides):
    """Helper to create a valid job record with optional overrides."""
    job = {
        "job_id": "12345",
        "title": "Software Engineer",
        "company_name": "Acme Corp",
        "company_slug": "acmecorp",
        "ats_source": "greenhouse",
        "source_url": "https://boards.greenhouse.io/acmecorp/jobs/12345",
        "apply_url": "https://boards.greenhouse.io/acmecorp/jobs/12345",
        "location": "San Francisco, CA",
        "department": "Engineering",
        "employment_type": "Full-time",
        "date_posted": "2025-02-15T00:00:00+00:00",
        "description_text": "We are looking for a software engineer...",
        "description_html": "<p>We are looking for a software engineer...</p>",
        "salary_range": "$120,000 - $160,000",
        "metadata": {
            "scraped_at": "2025-02-16T12:00:00+00:00",
            "scraper_version": "1.0.0",
            "extraction_status": "success",
            "raw_response_hash": "abc123def456",
        },
    }
    job.update(overrides)
    return job


class TestValidateJobRecord:
    """Tests for validate_job_record()."""

    def test_valid_record_passes(self):
        job = _make_valid_job()
        is_valid, errors = validate_job_record(job)
        assert is_valid is True
        assert errors == []

    def test_missing_required_field_fails(self):
        job = _make_valid_job()
        del job["title"]
        is_valid, errors = validate_job_record(job)
        assert is_valid is False
        assert any("title" in e for e in errors)

    def test_empty_required_field_fails(self):
        job = _make_valid_job(title="")
        is_valid, errors = validate_job_record(job)
        assert is_valid is False
        assert any("title" in e and "empty" in e for e in errors)

    def test_invalid_ats_source_fails(self):
        job = _make_valid_job(ats_source="invalid_ats")
        is_valid, errors = validate_job_record(job)
        assert is_valid is False
        assert any("ats_source" in e for e in errors)

    def test_valid_ats_sources(self):
        for source in ["greenhouse", "lever", "workday", "icims", "taleo"]:
            job = _make_valid_job(ats_source=source)
            is_valid, _ = validate_job_record(job)
            assert is_valid is True, f"ats_source '{source}' should be valid"

    def test_invalid_employment_type_fails(self):
        job = _make_valid_job(employment_type="Freelance")
        is_valid, errors = validate_job_record(job)
        assert is_valid is False
        assert any("employment_type" in e for e in errors)

    def test_valid_employment_types(self):
        for emp_type in ["Full-time", "Part-time", "Contract", "Intern", ""]:
            job = _make_valid_job(employment_type=emp_type)
            is_valid, _ = validate_job_record(job)
            assert is_valid is True, f"employment_type '{emp_type}' should be valid"

    def test_invalid_date_format_fails(self):
        job = _make_valid_job(date_posted="Feb 15, 2025")
        is_valid, errors = validate_job_record(job)
        assert is_valid is False
        assert any("date_posted" in e for e in errors)

    def test_empty_date_is_acceptable(self):
        job = _make_valid_job(date_posted="")
        is_valid, _ = validate_job_record(job)
        assert is_valid is True

    def test_missing_metadata_fails(self):
        job = _make_valid_job()
        del job["metadata"]
        is_valid, errors = validate_job_record(job)
        assert is_valid is False
        assert any("metadata" in e for e in errors)

    def test_missing_metadata_field_fails(self):
        job = _make_valid_job()
        del job["metadata"]["scraper_version"]
        is_valid, errors = validate_job_record(job)
        assert is_valid is False
        assert any("scraper_version" in e for e in errors)

    def test_invalid_extraction_status_fails(self):
        job = _make_valid_job()
        job["metadata"]["extraction_status"] = "unknown"
        is_valid, errors = validate_job_record(job)
        assert is_valid is False
        assert any("extraction_status" in e for e in errors)

    def test_wrong_type_for_field_fails(self):
        job = _make_valid_job(job_id=12345)  # should be str, not int
        is_valid, errors = validate_job_record(job)
        assert is_valid is False
        assert any("job_id" in e for e in errors)

    def test_optional_field_wrong_type_fails(self):
        job = _make_valid_job(location=123)  # should be str, not int
        is_valid, errors = validate_job_record(job)
        assert is_valid is False
        assert any("location" in e for e in errors)

    def test_optional_field_missing_is_ok(self):
        job = _make_valid_job()
        del job["location"]  # optional field can be absent
        is_valid, _ = validate_job_record(job)
        assert is_valid is True


class TestValidateBatch:
    """Tests for validate_batch()."""

    def test_all_valid_batch(self):
        jobs = [_make_valid_job(job_id=str(i)) for i in range(5)]
        report = validate_batch(jobs)
        assert report["total"] == 5
        assert report["valid"] == 5
        assert report["invalid"] == 0
        assert report["batch_passed"] is True
        assert report["has_valid_records"] is True
        assert report["partial_success"] is False

    def test_mixed_batch_non_strict(self):
        jobs = [
            _make_valid_job(job_id="1"),
            _make_valid_job(job_id=""),  # empty required field
            _make_valid_job(job_id="3"),
        ]
        report = validate_batch(jobs)  # strict=False by default
        assert report["total"] == 3
        assert report["valid"] == 2
        assert report["invalid"] == 1
        assert report["batch_passed"] is True  # non-strict: passes if any valid
        assert report["has_valid_records"] is True
        assert report["partial_success"] is True

    def test_mixed_batch_strict(self):
        jobs = [
            _make_valid_job(job_id="1"),
            _make_valid_job(job_id=""),  # empty required field
            _make_valid_job(job_id="3"),
        ]
        report = validate_batch(jobs, strict=True)
        assert report["batch_passed"] is False  # strict: fails if any invalid
        assert report["strict"] is True
        assert report["has_valid_records"] is True
        assert report["partial_success"] is True

    def test_empty_batch(self):
        report = validate_batch([])
        assert report["total"] == 0
        assert report["pass_rate"] == "N/A"
        assert report["batch_passed"] is True
        assert report["has_valid_records"] is False

```


---


## File: ats-scripts/workable_research.md

```md
# Workable — Week 1 Research (Bharath)

## Example Company Pages Tested
- https://apply.workable.com/futureplc/
- https://apply.workable.com/tetrascience/

---

## How Job Listings Load

Job listings load dynamically via a POST request (Fetch/XHR).

When the page loads or filters are applied, the frontend sends a POST request to a public API endpoint that returns job data in JSON format.

This confirms that Workable uses a REST-style API rather than embedded static HTML.

---

## Job Listing Endpoint
 
Endpoint Pattern:
https://apply.workable.com/api/v3/accounts/{company_slug}/jobs

Example:
https://apply.workable.com/api/v3/accounts/futureplc/jobs

Request Method: POST  
Status Code: 200 OK  
Returns: JSON array of job objects  
Authentication Required: No (public endpoint accessible from browser context)

---

## Request Payload Structure

{
  "query": "",
  "department": [],
  "location": [],
  "workplace": [],
  "worktype": []
}

Payload Meaning:
- query → keyword search
- department → department filter
- location → location filter
- workplace → remote/on-site filter
- worktype → employment type filter

When empty, the API returns all jobs.

---

## Response Structure (Observed Fields)

Each job object includes:
- id (numeric internal ID)
- shortcode (string public identifier)
- title
- remote (boolean)
- workplace
- location:
  - country
  - countryCode
  - city
  - region

This confirms structured JSON job metadata.

---

## Pagination

No explicit page, limit, or offset parameters were observed in the POST payload.

For the tested companies, all jobs appear to be returned in a single request.

Pagination behavior may differ for companies with a very large number of listings.

---

## Job ID Format

Two identifiers exist:
- Numeric ID (example: 5567662)
- Shortcode (example: E89BF8A47E)

The shortcode likely maps to the job detail URL.

---

## API Pattern Consistency Verification

Tested across:
- futureplc
- tetrascience

Both follow the identical structure:

/api/v3/accounts/{company_slug}/jobs

Only the company slug changes.

This confirms a standardized API structure across Workable accounts.

---

## Complexity Rating

LOW

Reasons:
- Clean REST API
- Public endpoint
- No authentication required
- Structured JSON response
- Predictable URL pattern

---

## Summary

Workable exposes a standardized REST API for job listings via:

/api/v3/accounts/{company_slug}/jobs

It uses POST requests with a JSON payload to control filtering.

The structure is consistent across companies and is straightforward to integrate into a scraping or ingestion pipeline.
```


---


## File: Biojobs/README.md

```md

# Biojobs

Students and graduates in the Boston/Cambridge area face a time-consuming challenge: identifying biomedical research labs that align with their skills and interests for potential "cold-call" employment or academic inquiries. This project proposes the **Boston Biomed Lab Matcher**, an intelligent bot designed to solve this problem. The bot will maintain a comprehensive database of biomedical labs, institutes, and departments by systematically scraping and consolidating data from major Boston/Cambridge institutions (including Harvard, MIT, BU, Tufts, and their affiliated research institutes). A user will upload their resume (CV), which the bot will analyze to extract key skills, research interests, and methodologies. The system will then match the user's profile against the lab database to generate a ranked list of "best-fit" labs. As a final, critical step, the bot will provide an AI-powered assistant to help the user **tailor their resume and draft a compelling, lab-specific "cold-call" email** for each suggested opportunity.

Based on recent 2024 industry reports, here is the estimated number of bio-related jobs in the Boston/Cambridge area.

While most official reports list data for the entire state, a reliable estimate for just the cities of **Boston and Cambridge is approximately 80,000 bio-related jobs.**

This estimate is based on the most recent statewide employment data from 2024 and key industry investment figures.

### 📈 How This Estimate Is Calculated

1.  **Statewide Total:** The Massachusetts Biotechnology Education Foundation (MassBioEd) and other sources report a total of **143,142 life sciences jobs** in Massachusetts in 2024.

2.  **Local Concentration:** A precise job count for just Boston and Cambridge isn't published. However, we can use 2024 venture capital (VC) funding as a strong proxy for job concentration.
    * In the first half of 2024, **56% of all life sciences VC funding** in Massachusetts went to companies located in Boston (21%) and Cambridge (35%).

3.  **Calculation:** 56% of the 143,142 statewide jobs is approximately **80,160 jobs**.

### 🔬 Key Context

* **The Hub of the Hub:** Boston and Cambridge are the undisputed epicenter of the state's life sciences industry. Key data points from 2023-2024 confirm this:
    * **R&D Growth:** In 2023, Boston's Seaport district (within Suffolk County) added more R&D jobs than any other area in the Commonwealth.
    * **Lab Space:** The vast majority of Massachusetts's lab space is concentrated in these two cities. In 2024, lab vacancy rates were 22.9% in Cambridge and 38.3% in Boston, reflecting the massive physical footprint of the industry.
* **Biopharma Subset:** A large portion of these roles are in "biopharma" (research, development, and manufacturing of drugs). In 2024, Massachusetts had **117,108 biopharma jobs** statewide, and the majority of these are concentrated in the Boston/Cambridge area.
* **Current Market:** The job market has slowed significantly from its peak in 2021-2022. Reports from 2024 and 2025 show that job growth has flattened, and the industry has seen a wave of layoffs, primarily centered in Cambridge and Boston.
-----

### **Requirements Document: Boston Biomed Lab Matcher**

**1.0 Introduction**

This document outlines the requirements for the **Boston Biomed Lab Matcher**, an automated tool designed to connect students and graduates with relevant biomedical research opportunities in the Boston/Cambridge area.

The bot's primary functions are:

1.  To build and maintain a "live" database of biomedical labs and their specific research focus.
2.  To analyze a user's resume/CV to create a "skill and interest profile."
3.  To match the user's profile against the lab database and suggest high-potential contacts.
4.  To provide AI-powered assistance to tailor application materials (resume and email) for a specific lab.

**2.0 Core Features & User Stories**

  * **As a student,** I want to upload my resume and quickly get a list of 10-15 local labs that are a perfect match for my skills in CRISPR and oncology.
  * **As a graduate,** I want to find the *specific* labs working on neurodegenerative diseases so I don't waste time emailing labs that only study immunology.
  * **As a user,** when I see a good match, I want to know *why* it's a match (e.g., "Your resume mentions 'confocal microscopy,' and this lab lists it as a key technique").
  * **As a user,** once I pick a lab, I want the bot to help me write a non-generic email that mentions the lab's *actual research* and *recent publications* so I sound informed and serious.

**3.0 Functional Requirements (FR)**

**FR-01: Lab Database**
The system shall maintain a database of research labs. Each entry must include:

  * `Lab_Name` / `Principal_Investigator (PI)`
  * `Institution` (e.g., "Harvard Medical School," "MIT," "Broad Institute")
  * `Department` (e.g., "Genetics," "Biological Engineering")
  * `Research_Focus_Summary` (A concise, AI-generated summary)
  * `Lab_Keywords` (e.g., "CRISPR," "neuroscience," "single-cell RNA-seq")
  * `Lab_Website_URL` (The source URL)
  * `Recent_Publications_URL` (If available)

**FR-02: Web Scraping Engine**

  * The system shall deploy a set of targeted scrapers for each major institutional hub (see Section 4.0).
  * The scrapers must be able to follow links from department pages (e.g., "Faculty") to individual lab or profile pages.
  * Scrapers will run on a schedule (e.g., weekly) to find new labs and update existing ones.

**FR-03: Resume Analysis Engine**

  * The system shall allow users to upload a resume (`.pdf`, `.docx`).
  * The system shall parse the text to extract:
      * **Skills & Techniques:** (e.g., "Python," "PCR," "Western Blot," "machine learning")
      * **Research Interests:** (e.g., "oncology," "gene therapy," "drug discovery")
      * **Experience Level:** (e.g., "undergraduate," "post-doc")

**FR-04: Matching & Suggestion Engine**

  * The system shall compare the user's resume profile (FR-03) against the `Lab_Keywords` and `Research_Focus_Summary` in the database (FR-01).
  * The system shall present a ranked list of suggested labs, ordered by "match score."
  * Each match *must* be presented with a justification (e.g., "Match found for: 'machine learning' and 'genomics'").

**FR-05: AI Tailoring Assistant**

  * When a user selects a lab, the system shall provide an AI-powered chat interface.
  * The system will "prime" the AI with:
    1.  The user's resume.
    2.  The target lab's `Research_Focus_Summary`.
    3.  (Optional) The text from one or two of the lab's recent publications.
  * The assistant will then help the user draft an email and revise resume bullet points to highlight the most relevant skills for *that specific lab*.

**4.0 Data Sources (Scraper Targets)**

This section details the websites the bot will scrape to build its database (FR-01). This is based on the known institutional structures in the Boston/Cambridge area.

| Institution | Primary Data Hub (Scraping Target) | Strategy |
| :--- | :--- | :--- |
| **Harvard & Affiliates** | `hms.harvard.edu` (Departments & Centers page) | **Top-Down:** 1. Scrape the list of all basic science departments (Genetics, Cell Biology, etc.). 2. Visit each department's "Faculty" or "Labs" page. 3. Follow links to each individual PI/Lab page to get their research summary. |
| **Affiliated Institutes** | `massgeneral.org/research` (MGH)<br>`brighamandwomens.org/research` (BWH)<br>`ragoninstitute.org`<br>`broadinstitute.org`<br>`wyss.harvard.edu` | **Hub-Based:** 1. Go to the main research institute page. 2. Find the "Faculty," "Research Labs," or "Core Faculty" directory. 3. Scrape the list of PIs and their lab descriptions. These are often more centralized than university pages. |
| **MIT** | `mit.edu/research/centers-labs-programs` | **Hub-Based:** 1. Get the master list of all labs and centers. 2. Filter for biomedical-related entities (e.g., Koch Institute, Picower Institute, IMES, Dept. of Biological Engineering). 3. Visit each entity's "Faculty" or "Labs" page and scrape the details. |
| **Boston University (BU)**| `bumc.bu.edu/medicine/research/research-centers`<br>`bu.edu/academics/eng/departments/biomedical-engineering/` | **Department-Based:** 1. Go to the School of Medicine's centers list and the BME labs list. 2. Scrape the "Faculty Research Areas" page from the Program in Biomedical Sciences (PiBS) to find faculty by topic. 3. Follow links to faculty profiles. |
| **Tufts University** | `medicine.tufts.edu/research/research-labs-centers` | **Center-Based:** 1. Scrape the main list of research centers (e.g., Molecular Cardiology Research Institute). 2. Visit the Graduate School of Biomedical Sciences (GSBS) page to find its faculty list and lab descriptions. |

**5.0 Non-Functional Requirements**

  * **NFR-01: Privacy & Security (CRITICAL):** A user's resume is highly sensitive. The system *must not* store resumes after the user's session is complete. All analysis must be done in-memory, and the data must be deleted immediately.
  * **NFR-02: Data Freshness:** Lab websites change. The scrapers must run at least weekly to keep the database current.
  * **NFR-03: Scalability:** The scrapers must be designed to be polite, respecting `robots.txt` files and using rate-limiting to avoid being blocked by university servers.

-----

### 🚀 Step-by-Step Project Plan (10-Step)

**Phase 1: Foundation & Data Ingestion (Weeks 1-4)**

1.  **Define Database Schema:** Architect the "Master Lab" database (as specified in FR-01).
2.  **Build Scraper Framework:** Build a robust, scalable scraping framework (e.g., using Python with Scrapy or Playwright) that can handle the different website structures.
3.  **Deploy "Seed" Scrapers:** Develop and launch the first scrapers for the major hubs (e.g., Harvard Medical School Departments, MIT Centers list).
4.  **Create AI Summarizer:** Write a script that takes the raw "research description" text from a scraped lab page and uses an LLM (like the Gemini API) to generate the clean `Research_Focus_Summary` and extract the `Lab_Keywords`. This standardizes the data.

**Phase 2: Backend & User Logic (Weeks 5-7)**
5\.  **Develop Resume Analysis API:** Create a secure endpoint that accepts a resume, parses it (using a library like `pdfminer` or `python-docx`), and uses an LLM to extract the skills/interests profile (FR-03).
6\.  **Build the Matching Engine:** Create the core logic that takes the JSON output from the resume parser and runs a vector search or keyword query against the Master Lab Database to find the best matches.

**Phase 3: Frontend & User Interface (Weeks 8-10)**
7\.  **Design the User Interface (UI):** Design a simple, 3-step web flow:
\* Step 1: Upload Resume (with a clear privacy disclaimer).
\* Step 2: View Results (A card-based list of matched labs with justification).
\* Step 3: "Get Help" (Launches the AI Tailoring Assistant for a selected lab).
8\.  **Develop the Frontend:** Build the UI and connect it to the backend APIs.

**Phase 4: AI Integration & Deployment (Weeks 11-12)**
9\.  **Integrate AI Tailoring Assistant:** Build the chat interface (FR-05). This involves careful prompt engineering to feed the user's resume + the lab's data to the LLM to get high-quality, personalized drafts.
10\. **Beta Testing & Deployment:** Deploy to a test server. Ask students to upload their real-world resumes to check the quality of the matches and the usefulness of the AI-drafted emails. Refine and launch.

-----

### 📊 Step-by-Step: How to Find Labs & Meta-Info (The Scraper Plan)

This is the detailed technical plan for **Phase 1 (Steps 2 & 3)**.

**1. The "Top-Down" University Scraper (e.g., Harvard)**
This model works for large, decentralized universities.

  * **Step 1:** Go to the "seed" page (e.g., `https://hms.harvard.edu/research/research-departments-centers-initiatives-more`).
  * **Step 2:** Scrape the list of all `Department` links (e.g., "Cell Biology," "Genetics").
  * **Step 3:** For each `Department` link, navigate to that page and find the link for "Faculty" or "Labs."
  * **Step 4:** On the "Faculty" page, scrape the list of all `PI_Names` and their `Profile_Page_URL`.
  * **Step 5:** Visit each `Profile_Page_URL`. On this final page, scrape the "Research Description" or "Lab Focus" text.
  * **Step 6:** Save this raw text, the PI's name, and the URL to your database for the AI Summarizer (Step 4 in the project plan) to process.

**2. The "Hub-Based" Institute Scraper (e.g., Broad, Ragon, Koch)**
This model works for self-contained research institutes. It's usually easier.

  * **Step 1:** Go to the "seed" page (e.g., `https://www.broadinstitute.org/scientific-community/core-faculty` or `https://imes.mit.edu/people/faculty`).
  * **Step 2:** This page is often the *actual directory*. Scrape the list of all faculty members directly from this page.
  * **Step 3:** The page will often have a short "research snippet" next to the name. Scrape this snippet *and* the link to their full profile/lab page.
  * **Step 4:** Visit the full lab page to get the more detailed "Research Description" text.
  * **Step 5:** Save this data to your database for processing.

**3. The "Topic-Based" Scraper (e.g., BU PiBS)**
This is a clever alternative for finding labs by subject.

  * **Step 1:** Go to the "seed" page (e.g., `https://www.bumc.bu.edu/gms/pibs/faculty-research-areas/`).
  * **Step 2:** Scrape the list of all *topics* (e.g., "Neurodegenerative disorders," "Cancer biology").
  * **Step 3:** For each *topic*, get the list of `PI_Names` associated with it. This automatically pre-tags the lab with a keyword.
  * **Step 4:** Find the main faculty directory to get the `Profile_Page_URL` for each PI.
  * **Step 5:** Visit the profile page, get the detailed description, and save it all to your database.


```


---


## File: Data/README.md

```md
# SEC,DOL & USCIS Data

## Overview

This script processes and flattens data from SEC (Securities and Exchange Commission) filings and DOL (Department of Labor) records to create a unified dataset for identifying potential H-1B sponsoring employers among funded startups.

## Project Structure

```
├── Data/
│   ├── SEC_data_flattend.csv          # Initial flattened CSV from master SEC JSON
│   └── SEC_DOL_H1b_data_mapped.csv    # Final merged file with H-1B mapping
│
└── Scripts/
    └── [Python scripts for data processing]
```

## Data Files

### `SEC_data_flattend.csv`
The initial flattened CSV extracted from the master SEC JSON file. Contains raw firmographic and funding data from SEC filings.

### `SEC_DOL_H1b_data_mapped.csv`
The final output file with H-1B mapping complete. This file merges values from all sources (SEC, DOL, USCIS) and contains `null` values where data is not available.

## Key Columns

### Firmographic Details
| Column | Description |
|--------|-------------|
| `company_name` | Legal name of the employer |
| `industry` | Primary industry classification |
| `website` | Company website URL |
| `city` / `state` | Headquarters location |

### Funding Indicators
| Column | Description |
|--------|-------------|
| `total_funding` | Total capital raised by the company over time |
| `latest_funding_amount` | Most recent funding round size |
| `latest_funding_date` | Date of most recent funding round |
| `latest_funding_stage` | Stage of latest round (Seed, Series A, etc.) |

These funding metrics help indicate a company's financial capacity and potential near-term hiring appetite.

### H-1B Sponsorship History
| Column | Description |
|--------|-------------|
| `Approval_Rate` | Historical H-1B petition approval percentage |
| `Total Approvals` | Count of approved H-1B petitions |
| `Total Denials` | Count of denied H-1B petitions |
| `median_salary_offered` | Typical salary levels for sponsored roles |
| `top_job_titles_sponsored` | Common roles previously sponsored |

> **Note:** `Null` values in sponsorship fields do not necessarily mean the company does not sponsor H-1B visas—it indicates that our available data does not contain a trace of sponsorship activity for that company.

### Additional Columns

The remaining columns (executive officers, board members, year incorporated, company age, contact details, etc.) provide supplementary information for employer research and outreach efforts.

## Usage

This dataset enables users to:
- Filter companies by funding stage and amount
- Identify employers with proven H-1B sponsorship track records
- Prioritize outreach based on approval rates and sponsored job titles
- Research company backgrounds for targeted applications

```


---


## File: README.md

```md
# 80 Days to Stay

> *"A wager against time, a race against bureaucracy, and an adventure in data for good."*

## Progress Day 08:

**Mapping the Visa Data Goldmine**

Objective: Intersect financial capacity (SEC data) with historical sponsorship willingness (DOL data) and deploy LLM agents to act as "Recruiting Experts" for international talent.

**What We've Accomplished**

We have created a csv master file after identifying companies that are likely to hire to those that are historically proven to hire international talent. We mapped our SEC startup list against official U.S. Government datasets, specifically the DOL LCA Disclosure Data (containing every H-1B, H-1B1, and E-3 application) and the USCIS H-1B Employer Data Hub (providing approval/denial rates for initial vs. continuing employment).

## The Challenge

Like Phileas Fogg's famous 80-day race around the world, we're on a mission against the clock. But instead of circumnavigating the globe, we're building a lifeline for international students and skilled workers facing visa deadlines.

**The stakes?** H1B and OPT visa holders have limited time to find sponsorship before they must leave the country they've come to call home. Traditional job platforms don't show which companies can actually sponsor visas. Time is running out.

**The solution?** A database connecting visa holders with funded startups capable of sponsorship—companies that have the resources but remain invisible to those who need them most.

## The Problem (By The Numbers)

The employment gap for international students isn't about talent—it's about structural barriers:

**The Lottery System:**
- Only **25% chance** of H-1B lottery selection (2024)
- International students must navigate F-1 → OPT → STEM OPT → H-1B pipeline
- Policy threats: $100K H-1B fees proposed, OPT restrictions looming

**The Employment Gap:**
- **44.6%** of international students employed after graduation
- **62.1%** of domestic students employed (same degrees, same schools)
- International students apply to **2x as many jobs** (45 vs 22 applications)
- But receive **30% fewer offers**
- Only **38.1%** land full-time roles vs **53.1%** of domestic peers

**The Real Problem:**
This isn't a skills gap—it's an information gap. International students are MORE engaged with career services and recruiting. The difference? **Employer ignorance and automated filtering.**

## Why Startups Don't Sponsor (Even Though They Should)

Funded startups desperately need talent. They have the money. But they don't hire international students because:

**1. Misconceptions About Cost & Complexity**
- Reality: OPT/STEM OPT requires NO employer sponsorship
- Reality: Students on F-1/OPT are FICA-exempt (saves employers ~7.65% in payroll taxes)
- Perception: "Immigration sponsorship is expensive and legally risky"
- Result: ATS systems auto-reject anyone who checks "requires sponsorship"

**2. No In-House Immigration Knowledge**
- Big tech has dedicated immigration counsel and standardized policies
- Startups have no HR/legal capacity to understand visa regulations
- Unfamiliarity breeds fear: "What if we make a mistake?"

**3. Perceived Risk of Training & Loss**
- Worry: "We'll train them for a year, then lose them in the H-1B lottery"
- Reality: 1-3 years of OPT/STEM OPT work authorization before lottery
- But startups with 12-18 month runways see visa uncertainty as existential risk

**4. Path Dependence**
- Employers who have hired international students before do it again
- Employers who never have stay that way
- Only ~25-33% of US employers even consider international candidates

**The Result:** All international talent funnels to the same 100 companies with established immigration pipelines, while thousands of funded startups that NEED talent sit on the sidelines due to misconceptions.

## The Mission

Build a searchable platform that reveals:
- **Funded startups** ($5M+) with resources to sponsor
- **Real-time job openings** at these companies  
- **Direct founder contacts** to bypass HR gatekeepers
- **Sponsorship likelihood scores** based on funding, growth, and hiring patterns

All using **free, public SEC data** and open-source tools.

## The Timeline

- **Week 1:** MVP with 300+ companies (Boston, SF, NYC biotech)
- **Week 4:** 500+ companies, 10+ active users, validation metrics
- **Week 11:** Proof of concept—at least one H1B transfer secured
- **Day 80:** Success stories, growth metrics, sustainable model

## Why This Matters

**The Structural Mismatch:**

There are thousands of funded startups with:
- ✅ Fresh capital ($5M-$50M+ recently raised)
- ✅ Urgent hiring needs (they're scaling)
- ✅ Resources to sponsor (they can afford $5K-$10K in fees)
- ❌ Zero visibility to international candidates

Meanwhile, there are talented international students who:
- ✅ Have advanced degrees from top US universities
- ✅ Are STEM-trained and work-authorized (OPT/STEM OPT)
- ✅ Cost LESS to hire than domestic workers (FICA exemption)
- ❌ Get auto-rejected before their skills are even evaluated

**The Hidden Opportunity:**

When employers learn the truth about OPT:
- "Wait, I don't need to sponsor them NOW?"
- "They save me payroll taxes?"
- "I have 1-3 years before sponsorship is even needed?"
- "Why isn't HR telling me this?"

**What We're Building:**

We're not just a database—we're fixing information asymmetry:
- Show international candidates which startups have money to hire
- Show startups which candidates don't need immediate sponsorship
- Turn "only big tech sponsors" into "funded startups are my best bet"

Every year, talented professionals—researchers, engineers, healthcare workers—face deportation not because they lack skills, but because they lack information. We're turning SEC filings into second chances.

## The Technology

**Data Pipeline:** Python + SEC EDGAR API (free)  
**Database:** PostgreSQL on Supabase (free tier)  
**Backend:** FastAPI on Railway (free tier)  
**Frontend:** React + Tailwind on Vercel (free tier)  
**Budget:** ~$0/month (vs $99/month for commercial data)

## Who This Helps

**International Students & Workers:**
- PhD researchers who can't find biotech sponsors
- STEM grads applying to 50+ jobs with no responses
- OPT holders with 60-day "unemployment clocks" ticking
- H-1B lottery losers who need backup options fast

**Funded Startups:**
- Series A biotech companies desperate for PhD-level scientists
- AI startups that need ML engineers but "don't sponsor"
- Medical device companies that don't know OPT exists
- Any founder who's rejected great candidates due to visa myths

**The Broader Impact:**
- Keep talent in the US innovation ecosystem
- Help startups access overlooked talent pools
- Reduce brain drain of US-trained professionals
- Make the "American Dream" accessible beyond just FAANG

## The Opportunity (By The Numbers)

**What we're revealing:**
```
SEC Form D Filings (Last 12 months):
├── ~15,000 total private offerings in US
├── ~1,500 biotech/pharma companies
├── ~500 raised $5M+ (our target)
└── ~200-300 in Boston/SF/NYC biotech hubs

Hidden from traditional job searches:
├── 90% don't advertise "visa sponsorship"
├── 75% have no immigration keywords on job posts
├── Most auto-reject "requires sponsorship" candidates
└── Zero visibility on platforms like LinkedIn/Indeed

The match:
├── These companies JUST raised capital
├── They're actively hiring (that's what the money is for)
├── They CAN afford sponsorship ($5K-10K << $5M-50M raised)
└── They just don't know OPT doesn't require it
```

**Our thesis:** Every Form D filing represents a company that's invisible to international job seekers but desperately needs talent. We're making them visible.

## Join the Adventure

**Why volunteer with us?**

**For the mission:**
- Help people stay with families instead of forced deportation
- Fix a broken system that wastes US-trained talent
- Turn data into human impact in real-time
- See your code save someone's visa status

**For the skills:**
- Real-world data engineering (SEC APIs, ETL pipelines, PostgreSQL)
- Full-stack development (FastAPI, React, modern deployment)
- Work with production data serving actual users
- Build portfolio projects that demonstrate social impact

**We need:**
- **Data engineers** - Python, web scraping, API integration, ETL pipelines
- **Backend developers** - FastAPI, PostgreSQL, RESTful APIs
- **Frontend developers** - React, Tailwind CSS, responsive design
- **Researchers** - Company validation, contact enrichment, data quality
- **Community builders** - Testing, documentation, user feedback

**No experience required—just commitment.** If you can code "Hello World" or write a clear README, you can contribute. We'll teach the rest.

**Time commitment:** 5-10 hours/week for 80 days. More if you want, less if you need. This is agile, async, and built around real lives.

## Why We Know This Will Work

**The data doesn't lie:**

Our thesis is backed by research from NAFSA, Interstride, IZA, and multiple employer surveys showing:

1. **Employers who hire international students once, do it again** - The barrier is ignorance, not capability
2. **75% of employers don't understand OPT/CPT rules** - Education works
3. **Startups with recent funding ARE hiring** - That's what Series A/B money is for
4. **International students are MORE qualified, not less** - Same degrees, higher engagement, lower offers
5. **The cost myth is false** - F-1/OPT students save employers payroll taxes

**The market failure is information asymmetry.** We're fixing it with public data.

**Sources:** NAFSA International Student Employment Survey, Interstride 2025 Career Outcomes Report, IZA Institute Employment Research, SciTech Minnesota Employer Guides, multiple industry surveys on visa sponsorship attitudes.

## The Wager

**Can we build a platform that saves at least one person's visa status in 80 days?**

The odds are in our favor:
- 200-300 funded biotech companies in our Week 1 database
- Each company averages 5-10 open roles
- That's 1,000-3,000 jobs invisible to international candidates
- We only need to facilitate ONE successful match

Unlike Phileas Fogg's £20,000 wager, ours costs $0 in data fees. But the stakes? Someone gets to stay with their family, continue their research, build their career in America.

**That's a bet worth taking.**

---

**Project Lead:** Nik Bear Brown  
**Organization:** Humanitarians AI (501c3)  
**Timeline:** 80 days  
**Budget:** ~$0/month  
**Impact:** Priceless

## Get Involved

🚀 **Ready to join?** Check our [https://www.humanitarians.ai/fellows](https://www.humanitarians.ai/fellows)  
📊 **Follow progress:** [https://github.com/nikbearbrown/80-Days-to-Stay](https://github.com/nikbearbrown/80-Days-to-Stay)

*"In this adventure, the real treasure isn't reaching the destination—it's the lives we change along the way."*

**The facts:**
- International students: 44.6% employment rate, 2x applications, 30% fewer offers
- Funded startups: Thousands with capital, desperate for talent, don't sponsor due to myths
- The gap: Information asymmetry we can fix with public data and code

**80 days. Zero budget. One mission: Turn SEC filings into second chances.**

---

### Project Status

```
Week 1: [████░░░░░░] 40% - Data pipeline built, 300+ companies loaded
Week 2: [░░░░░░░░░░]  0% - Expand coverage, build API
Week 3: [░░░░░░░░░░]  0% - Launch frontend, onboard users
Week 4: [░░░░░░░░░░]  0% - Validate with real applications
```

**Next Milestone:** Week 1 MVP - Launch by Day 7

---

*This project is part of Humanitarians AI's commitment to using technology and data for social good.*

```


---


## File: Scripts/flatten_sec_data_script.py

```py
import json
import csv
from datetime import datetime

def load_json(filename):
    """Load JSON file"""
    with open(filename, 'r', encoding='utf-8') as f:
        return json.load(f)

def flatten_company_data(company_data, url_data_dict):
    """Flatten company data into employment-focused fields"""
    
    accession = company_data.get('accession_number', '')
    company = company_data.get('company', {})
    funding = company_data.get('funding', {})
    company_age = company_data.get('company_age', {})
    related_persons = company_data.get('related_persons', [])
    
    # Get URL data if available
    url_info = url_data_dict.get(accession, {})
    domains = url_info.get('domains', {})
    
    # Build executive/director lists
    executives = []
    directors = []
    
    for person in related_persons:
        name = person.get('name', '')
        relationships = person.get('relationships', [])
        
        # Skip if name is None or empty
        if not name:
            continue
        
        if 'Executive Officer' in relationships:
            executives.append(name)
        if 'Director' in relationships and 'Executive Officer' not in relationships:
            directors.append(name)
    
    # Create flattened row
    row = {
        # Company basics
        'company_name': company.get('name', ''),
        'industry': company.get('industry', ''),
        'website': domains.get('primary', ''),
        
        # Location
        'city': company.get('address', {}).get('city', ''),
        'state': company.get('address', {}).get('state', ''),
        'zip_code': company.get('address', {}).get('zip', ''),
        'phone': company.get('address', {}).get('phone', ''),
        
        # Company maturity
        'year_incorporated': company.get('year_incorporated', ''),
        'company_age_years': company_age.get('years_since_incorporation', ''),
        
        # Funding info (shows growth/stability)
        'funding_stage': funding.get('stage_estimate', ''),
        'recent_funding_amount': funding.get('total_amount_sold', ''),
        'total_offering_amount': funding.get('total_offering_amount', ''),
        'number_of_investors': funding.get('number_of_investors', ''),
        'date_of_first_sale': funding.get('date_of_first_sale', ''),
        'funding_recency': company_age.get('funding_recency', ''),
        'months_since_funding': company_age.get('months_since_funding', ''),
        
        # Leadership (for research/networking)
        'executive_officers': '; '.join(executives[:5]),  # Limit to 5 to keep readable
        'board_directors': '; '.join(directors[:5]),
        
        # Reference info
        'accession_number': accession,
    }
    
    return row

def main():
    # Load data
    print("Loading SEC company data...")
    companies_data = load_json('sec_companies_targets.json')
    
    print("Loading verified URLs...")
    urls_data = load_json('sec_companies_targets_unique_verified_good.json')
    
    # Handle different JSON structures for URLs
    if isinstance(urls_data, dict):
        # Check for common data wrapper keys
        if 'data' in urls_data:
            urls = urls_data['data']
        elif 'companies' in urls_data:
            urls = urls_data['companies']
        elif 'results' in urls_data:
            urls = urls_data['results']
        else:
            # Assume dict values are the records
            urls = list(urls_data.values())
    elif isinstance(urls_data, list):
        urls = urls_data
    else:
        print(f"Unexpected URL data format: {type(urls_data)}")
        urls = []
    
    print(f"Found {len(urls)} verified URL records")
    
    # Handle companies data similarly
    if isinstance(companies_data, dict):
        # Check for common data wrapper keys
        if 'data' in companies_data:
            companies = companies_data['data']
        elif 'companies' in companies_data:
            companies = companies_data['companies']
        elif 'results' in companies_data:
            companies = companies_data['results']
        else:
            # Assume dict values are the records
            print("Dict structure detected - extracting values...")
            companies = list(companies_data.values())
    elif isinstance(companies_data, list):
        companies = companies_data
    else:
        print(f"Unexpected companies data format: {type(companies_data)}")
        companies = []
    
    # Flatten if nested lists
    if companies and isinstance(companies[0], list):
        print("Detected nested list structure, flattening...")
        flattened = []
        for item in companies:
            if isinstance(item, list):
                flattened.extend(item)
            else:
                flattened.append(item)
        companies = flattened
    
    print(f"Found {len(companies)} company records")
    
    # Debug: check first company structure
    if companies:
        print(f"First company type: {type(companies[0])}")
        if isinstance(companies[0], dict):
            print(f"Sample company keys: {list(companies[0].keys())[:8]}")
    
    # Create lookup dictionary for URLs by accession number
    url_dict = {}
    for item in urls:
        if isinstance(item, dict) and 'accession_number' in item:
            url_dict[item['accession_number']] = item
    
    print(f"Created URL lookup with {len(url_dict)} entries")
    
    print(f"Processing {len(companies)} companies...")
    
    # Flatten data
    flattened_data = []
    companies_with_urls = 0
    
    for company in companies:
        row = flatten_company_data(company, url_dict)
        flattened_data.append(row)
        
        if row['website']:
            companies_with_urls += 1
    
    # Write to CSV
    output_filename = 'student_employment_targets.csv'
    
    if flattened_data:
        fieldnames = flattened_data[0].keys()
        
        with open(output_filename, 'w', newline='', encoding='utf-8') as csvfile:
            writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
            writer.writeheader()
            writer.writerows(flattened_data)
        
        print(f"\n✓ Successfully created {output_filename}")
        print(f"  Total companies: {len(flattened_data)}")
        print(f"  Companies with verified websites: {companies_with_urls}")
        print(f"  Companies without websites: {len(flattened_data) - companies_with_urls}")
    else:
        print("No data to write!")

if __name__ == "__main__":
    main()

```


---


## File: Scripts/sec_all_quarters.py

```py
import pandas as pd
import json
import os
import sys
from datetime import datetime
from pathlib import Path
from collections import defaultdict

def process_single_quarter(quarter_dir, output_dir='processed'):
    """
    Process a single quarterly folder and save as JSON
    
    Args:
        quarter_dir: Path to quarterly folder (e.g., '2023Q2_d')
        output_dir: Directory to save processed JSON files
    """
    
    quarter_name = os.path.basename(quarter_dir)
    
    # Check for required files
    required_files = ['FORMDSUBMISSION.tsv', 'ISSUERS.tsv', 'OFFERING.tsv', 'RELATEDPERSONS.tsv']
    missing = [f for f in required_files if not os.path.exists(os.path.join(quarter_dir, f))]
    
    if missing:
        print(f"⏭️  {quarter_name:15s} - Missing files: {', '.join(missing)}")
        return None
    
    try:
        # Load data
        submissions = pd.read_csv(os.path.join(quarter_dir, 'FORMDSUBMISSION.tsv'), sep='\t', low_memory=False)
        issuers = pd.read_csv(os.path.join(quarter_dir, 'ISSUERS.tsv'), sep='\t', low_memory=False)
        offerings = pd.read_csv(os.path.join(quarter_dir, 'OFFERING.tsv'), sep='\t', low_memory=False)
        people = pd.read_csv(os.path.join(quarter_dir, 'RELATEDPERSONS.tsv'), sep='\t', low_memory=False)
        
        # Join everything - NO FILTERING
        all_companies = offerings.merge(issuers, on='ACCESSIONNUMBER', how='inner')
        all_companies = all_companies.merge(
            submissions[['ACCESSIONNUMBER', 'FILING_DATE', 'SUBMISSIONTYPE']], 
            on='ACCESSIONNUMBER',
            how='left'
        )
        
        # Convert amount to numeric
        all_companies['TOTALAMOUNTSOLD'] = pd.to_numeric(all_companies['TOTALAMOUNTSOLD'], errors='coerce')
        
        # Process each company
        startups = []
        for _, row in all_companies.iterrows():
            accession = row['ACCESSIONNUMBER']
            company_people = people[people['ACCESSIONNUMBER'] == accession]
            
            # Build related persons
            related_persons = []
            for _, person in company_people.iterrows():
                name_parts = [
                    clean_value(person.get('FIRSTNAME')),
                    clean_value(person.get('MIDDLENAME')),
                    clean_value(person.get('LASTNAME'))
                ]
                full_name = ' '.join([p for p in name_parts if p])
                
                relationships = []
                for rel_col in ['RELATIONSHIP_1', 'RELATIONSHIP_2', 'RELATIONSHIP_3']:
                    rel = clean_value(person.get(rel_col))
                    if rel:
                        relationships.append(rel)
                
                related_persons.append({
                    'name': full_name if full_name else None,
                    'first_name': clean_value(person.get('FIRSTNAME')),
                    'middle_name': clean_value(person.get('MIDDLENAME')),
                    'last_name': clean_value(person.get('LASTNAME')),
                    'relationships': relationships,
                    'city': clean_value(person.get('CITY')),
                    'state': clean_value(person.get('STATEORCOUNTRY'))
                })
            
            # Calculate company age and funding recency
            year_inc = clean_int(row.get('YEAROFINC_VALUE_ENTERED'))
            current_year = datetime.now().year
            years_since_inc = (current_year - year_inc) if year_inc else None
            
            # Parse filing date and calculate recency
            filing_date = clean_value(row.get('FILING_DATE'))
            months_since_funding = None
            funding_recency = None
            
            if filing_date:
                try:
                    for fmt in ['%d-%b-%Y', '%Y-%m-%d', '%m/%d/%Y']:
                        try:
                            file_dt = datetime.strptime(filing_date, fmt)
                            months_since_funding = (datetime.now() - file_dt).days // 30
                            
                            if months_since_funding < 6:
                                funding_recency = "very_recent"
                            elif months_since_funding < 12:
                                funding_recency = "recent"
                            elif months_since_funding < 24:
                                funding_recency = "moderate"
                            else:
                                funding_recency = "older"
                            break
                        except:
                            continue
                except:
                    pass
            
            # Estimate stage based on amount
            amount_sold = clean_float(row.get('TOTALAMOUNTSOLD'))
            stage_estimate = None
            if amount_sold:
                if amount_sold < 2_000_000:
                    stage_estimate = "Pre-Seed"
                elif amount_sold < 5_000_000:
                    stage_estimate = "Seed"
                elif amount_sold < 15_000_000:
                    stage_estimate = "Series A"
                elif amount_sold < 40_000_000:
                    stage_estimate = "Series B"
                elif amount_sold < 100_000_000:
                    stage_estimate = "Series C"
                else:
                    stage_estimate = "Series D+"
            
            state = clean_value(row.get('STATEORCOUNTRY'))
            industry = clean_value(row.get('INDUSTRYGROUPTYPE'))
            
            startup = {
                'accession_number': accession,
                'company': {
                    'name': clean_value(row.get('ENTITYNAME')),
                    'address': {
                        'street1': clean_value(row.get('STREET1')),
                        'street2': clean_value(row.get('STREET2')),
                        'city': clean_value(row.get('CITY')),
                        'state': state,
                        'zip': clean_value(row.get('ZIPCODE')),
                        'phone': clean_value(row.get('ISSUERPHONENUMBER'))
                    },
                    'entity_type': clean_value(row.get('ENTITYTYPE')),
                    'year_incorporated': year_inc,
                    'industry': industry
                },
                'funding': {
                    'total_offering_amount': clean_float(row.get('TOTALOFFERINGAMOUNT')),
                    'total_amount_sold': amount_sold,
                    'total_remaining': clean_float(row.get('TOTALREMAINING')),
                    'number_of_investors': clean_int(row.get('TOTALNUMBERALREADYINVESTED')),
                    'date_of_first_sale': clean_value(row.get('SALE_DATE')),
                    'stage_estimate': stage_estimate
                },
                'filing': {
                    'date_filed': filing_date,
                    'submission_type': clean_value(row.get('SUBMISSIONTYPE')),
                    'quarter': quarter_name
                },
                'company_age': {
                    'years_since_incorporation': years_since_inc,
                    'months_since_funding': months_since_funding,
                    'funding_recency': funding_recency
                },
                'related_persons': related_persons,
                'metadata': {
                    'source_quarter': quarter_name,
                    'processed_date': datetime.now().isoformat(),
                    'prediction_scores': {
                        'international_hiring': None,
                        'recent_grad_hiring': None
                    }
                }
            }
            
            startups.append(startup)
        
        # Create output
        output = {
            'metadata': {
                'quarter': quarter_name,
                'generated_at': datetime.now().isoformat(),
                'total_companies': len(startups),
                'total_executives': sum(len(s['related_persons']) for s in startups)
            },
            'companies': startups
        }
        
        # Save to file
        Path(output_dir).mkdir(exist_ok=True)
        output_file = os.path.join(output_dir, f'companies-sec-{quarter_name}.json')
        
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(output, f, indent=2, ensure_ascii=False)
        
        print(f"✅ {quarter_name:15s} - {len(startups):4d} companies → {os.path.basename(output_file)}")
        
        return output
        
    except Exception as e:
        print(f"❌ {quarter_name:15s} - Error: {e}")
        return None

def process_all_quarters_individually(data_dir='.', output_dir='processed'):
    """Process all quarters and save each as separate JSON"""
    
    print("=" * 70)
    print("SEC Form D Quarter-by-Quarter Processor")
    print("=" * 70)
    
    # Find all quarterly directories
    quarter_dirs = []
    for item in sorted(os.listdir(data_dir)):
        item_path = os.path.join(data_dir, item)
        if os.path.isdir(item_path) and ('Q' in item or 'q' in item):
            quarter_dirs.append(item_path)
    
    if not quarter_dirs:
        print(f"❌ No quarterly directories found in {os.path.abspath(data_dir)}")
        return
    
    print(f"\n📂 Found {len(quarter_dirs)} quarterly directories")
    print(f"📁 Output directory: {os.path.abspath(output_dir)}\n")
    
    processed = []
    failed = []
    
    for quarter_dir in quarter_dirs:
        result = process_single_quarter(quarter_dir, output_dir)
        if result:
            processed.append(os.path.basename(quarter_dir))
        else:
            failed.append(os.path.basename(quarter_dir))
    
    # Summary
    print(f"\n{'=' * 70}")
    print("Summary")
    print("=" * 70)
    print(f"✅ Processed: {len(processed)} quarters")
    print(f"❌ Failed: {len(failed)} quarters")
    print(f"📁 JSON files saved to: {os.path.abspath(output_dir)}/")
    
    if failed:
        print(f"\n⚠️  Failed quarters: {', '.join(failed)}")

def clean_value(val):
    """Clean pandas values - convert NaN to None"""
    if pd.isna(val):
        return None
    return str(val).strip() if val else None

def clean_float(val):
    """Convert to float, handle NaN"""
    if pd.isna(val):
        return None
    try:
        return float(val)
    except:
        return None

def clean_int(val):
    """Convert to int, handle NaN"""
    if pd.isna(val):
        return None
    try:
        return int(float(val))
    except:
        return None

if __name__ == '__main__':
    import argparse
    
    parser = argparse.ArgumentParser(description='Process SEC Form D quarters individually')
    parser.add_argument('--output-dir', default='processed', help='Output directory for JSON files')
    
    args = parser.parse_args()
    
    process_all_quarters_individually('.', args.output_dir)
```


---


## File: Scripts/sec_combine_quarters.py

```py
import json
import os
from datetime import datetime
from collections import defaultdict
import pandas as pd

def combine_and_deduplicate(input_dir='processed', output_file='startups_master.json', stats_file='startups_stats.csv'):
    """
    Combine all quarterly JSON files and deduplicate
    Generate statistics CSV
    """
    
    print("=" * 70)
    print("SEC Form D Combiner & Deduplicator")
    print("=" * 70)
    
    # Find all JSON files
    json_files = sorted([f for f in os.listdir(input_dir) if f.startswith('companies-sec-') and f.endswith('.json')])
    
    if not json_files:
        print(f"❌ No JSON files found in {input_dir}")
        return
    
    print(f"\n📂 Found {len(json_files)} quarterly JSON files")
    print(f"   From: {json_files[0]}")
    print(f"   To:   {json_files[-1]}\n")
    
    all_companies = []
    quarters_processed = []
    
    # Load all files
    for json_file in json_files:
        filepath = os.path.join(input_dir, json_file)
        with open(filepath, 'r') as f:
            data = json.load(f)
            companies = data.get('companies', [])
            quarter = data['metadata']['quarter']
            
            all_companies.extend(companies)
            quarters_processed.append(quarter)
            
            print(f"✅ Loaded {json_file}: {len(companies):,} companies")
    
    print(f"\n   Total before dedup: {len(all_companies):,} companies")
    
    # Deduplicate by accession_number (keep most recent)
    print(f"\n🔄 Deduplicating...")
    unique_companies = {}
    
    for company in all_companies:
        acc_num = company['accession_number']
        if acc_num not in unique_companies:
            unique_companies[acc_num] = company
        else:
            # Keep the one with more recent filing (lower months_since_funding)
            existing = unique_companies[acc_num]
            existing_months = existing['company_age'].get('months_since_funding')
            company_months = company['company_age'].get('months_since_funding')
            
            # Handle None values - treat None as very old (999)
            if existing_months is None:
                existing_months = 999
            if company_months is None:
                company_months = 999
            
            if company_months < existing_months:
                unique_companies[acc_num] = company
    
    final_companies = list(unique_companies.values())
    
    # Sort by funding recency (handle None values)
    final_companies.sort(key=lambda x: x['company_age'].get('months_since_funding') if x['company_age'].get('months_since_funding') is not None else 999)
    
    print(f"   After dedup: {len(final_companies):,} unique companies")
    
    # Create master JSON
    output = {
        'metadata': {
            'generated_at': datetime.now().isoformat(),
            'quarters_processed': quarters_processed,
            'total_companies': len(final_companies),
            'total_executives': sum(len(c['related_persons']) for c in final_companies),
            'date_range': {
                'earliest_quarter': quarters_processed[0] if quarters_processed else None,
                'latest_quarter': quarters_processed[-1] if quarters_processed else None
            }
        },
        'companies': final_companies
    }
    
    # Write master JSON
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(output, f, indent=2, ensure_ascii=False)
    
    print(f"\n✅ Created master JSON: {output_file}")
    print(f"   File size: {os.path.getsize(output_file) / (1024*1024):.1f} MB")
    
    # Generate statistics
    print(f"\n📊 Generating statistics CSV...")
    generate_statistics_csv(final_companies, stats_file)
    print(f"✅ Created statistics: {stats_file}")
    
    # Summary
    print(f"\n{'=' * 70}")
    print("Summary")
    print("=" * 70)
    print(f"📊 Total unique companies: {len(final_companies):,}")
    print(f"👥 Total executives: {sum(len(c['related_persons']) for c in final_companies):,}")
    print(f"📅 Quarters: {len(quarters_processed)}")

def generate_statistics_csv(companies, stats_file):
    """Generate comprehensive statistics CSV"""
    
    stats_rows = []
    
    # Overall statistics
    total = len(companies)
    over_5m = sum(1 for c in companies if c['funding']['total_amount_sold'] and c['funding']['total_amount_sold'] >= 5_000_000)
    
    stats_rows.append({
        'category': 'OVERALL',
        'subcategory': 'All Companies',
        'total_companies': total,
        'companies_over_5m': over_5m,
        'percent_over_5m': f"{(over_5m/total*100):.1f}%" if total > 0 else "0%"
    })
    
    # By State
    state_counts = defaultdict(lambda: {'total': 0, 'over_5m': 0})
    for c in companies:
        state = c['company']['address']['state']
        if state:
            state_counts[state]['total'] += 1
            amount = c['funding']['total_amount_sold']
            if amount and amount >= 5_000_000:
                state_counts[state]['over_5m'] += 1
    
    for state, counts in sorted(state_counts.items(), key=lambda x: x[1]['total'], reverse=True):
        stats_rows.append({
            'category': 'BY STATE',
            'subcategory': state,
            'total_companies': counts['total'],
            'companies_over_5m': counts['over_5m'],
            'percent_over_5m': f"{(counts['over_5m']/counts['total']*100):.1f}%" if counts['total'] > 0 else "0%"
        })
    
    # By Industry
    industry_counts = defaultdict(lambda: {'total': 0, 'over_5m': 0})
    for c in companies:
        industry = c['company']['industry']
        if industry:
            industry_counts[industry]['total'] += 1
            amount = c['funding']['total_amount_sold']
            if amount and amount >= 5_000_000:
                industry_counts[industry]['over_5m'] += 1
    
    for industry, counts in sorted(industry_counts.items(), key=lambda x: x[1]['total'], reverse=True):
        stats_rows.append({
            'category': 'BY INDUSTRY',
            'subcategory': industry,
            'total_companies': counts['total'],
            'companies_over_5m': counts['over_5m'],
            'percent_over_5m': f"{(counts['over_5m']/counts['total']*100):.1f}%" if counts['total'] > 0 else "0%"
        })
    
    # Write CSV
    df = pd.DataFrame(stats_rows)
    df.to_csv(stats_file, index=False)

if __name__ == '__main__':
    import argparse
    
    parser = argparse.ArgumentParser(description='Combine quarterly JSON files and generate statistics')
    parser.add_argument('--input-dir', default='processed', help='Directory with quarterly JSON files')
    parser.add_argument('--output', default='startups_master.json', help='Output master JSON file')
    parser.add_argument('--stats', default='startups_stats.csv', help='Output statistics CSV file')
    
    args = parser.parse_args()
    
    combine_and_deduplicate(args.input_dir, args.output, args.stats)
```


---


## File: Scripts/sec_domain_inference.py

```py
#!/usr/bin/env python3
"""
sec_domain_inference.py - Infer domain names from company names in SEC data
Usage: python sec_domain_inference.py [input_json_file]
Default: python sec_domain_inference.py (uses sec_companies_targets_unique.json)

This script runs fully automated and can be safely interrupted and resumed.
"""

import json
import sys
import re
import time
from pathlib import Path
from typing import Dict, List, Optional, Tuple
from datetime import datetime


# Domain patterns to try, in order of likelihood
DOMAIN_PATTERNS = [
    '.com',
    '.io',
    '.co',
    '.ai',
    '.tech',
    '.bio',
    '-bio.com',
    'bio.com',
    '.health',
    '.app',
    '.dev',
    '.net',
    '.org'
]

# Common company suffixes to remove
COMPANY_SUFFIXES = [
    r'\s+inc\.?$',
    r'\s+incorporated$',
    r'\s+llc\.?$',
    r'\s+ltd\.?$',
    r'\s+limited$',
    r'\s+corp\.?$',
    r'\s+corporation$',
    r'\s+co\.?$',
    r'\s+company$',
    r'\s+l\.?p\.?$',  # Limited Partnership
    r'\s+lp$',
    r'\s+plc\.?$',  # Public Limited Company
    r'\s+group$',
    r'\s+holdings?$',
    r'\s+ventures?$',
    r'\s+partners?$',
    r'\s+investments?$',
    r'\s+capital$',
    r'\s+fund$',
    r'\s+technologies$',
    r'\s+technology$',
    r'\s+tech$',
    r'\s+solutions?$',
    r'\s+services?$',
    r'\s+enterprises?$',
    r',?\s+llc\.?$',  # Handle ", LLC"
    r',?\s+inc\.?$',  # Handle ", Inc"
]


def clean_company_name(name: str) -> str:
    """
    Clean company name for domain inference.
    Remove suffixes, special characters, and normalize.
    """
    if not name:
        return ""
    
    # Convert to lowercase
    cleaned = name.lower().strip()
    
    # Remove common suffixes (case insensitive)
    for suffix_pattern in COMPANY_SUFFIXES:
        cleaned = re.sub(suffix_pattern, '', cleaned, flags=re.IGNORECASE)
    
    # Remove special characters but keep hyphens and spaces temporarily
    cleaned = re.sub(r'[^\w\s-]', '', cleaned)
    
    # Replace spaces and underscores with hyphens
    cleaned = re.sub(r'[\s_]+', '-', cleaned)
    
    # Remove multiple consecutive hyphens
    cleaned = re.sub(r'-+', '-', cleaned)
    
    # Remove leading/trailing hyphens
    cleaned = cleaned.strip('-')
    
    return cleaned


def infer_domain(company_name: str, max_patterns: int = 5) -> List[str]:
    """
    Infer possible domain names from company name.
    Returns list of domain patterns to try.
    """
    if not company_name:
        return []
    
    cleaned = clean_company_name(company_name)
    
    if not cleaned:
        return []
    
    # Generate domain candidates
    domains = []
    
    # Try first N patterns
    for pattern in DOMAIN_PATTERNS[:max_patterns]:
        if pattern.startswith('-'):
            # Pattern like '-bio.com' 
            domain = cleaned + pattern
        elif pattern.startswith('.'):
            # Pattern like '.com'
            domain = cleaned + pattern
        else:
            # Pattern like 'bio.com' (replace last part)
            domain = cleaned + '.' + pattern
        
        domains.append(domain)
    
    # Also try without hyphens for .com (common case)
    if '-' in cleaned and '.com' in DOMAIN_PATTERNS[:max_patterns]:
        no_hyphen = cleaned.replace('-', '')
        domains.insert(1, no_hyphen + '.com')  # High priority
    
    # Remove duplicates while preserving order
    seen = set()
    unique_domains = []
    for d in domains:
        if d not in seen:
            seen.add(d)
            unique_domains.append(d)
    
    return unique_domains


def save_checkpoint(output_file: Path, data: Dict, stats: Dict):
    """Save progress checkpoint."""
    # Update metadata
    if 'metadata' in data:
        data['metadata']['domain_inference'] = {
            'processed': stats['processed'],
            'total': stats['total'],
            'with_domains': stats['with_domains'],
            'last_checkpoint': datetime.now().isoformat()
        }
    
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    
    elapsed = time.time() - stats['start_time']
    rate = stats['processed'] / elapsed if elapsed > 0 else 0
    print(f"💾 Checkpoint saved | Progress: {stats['processed']:,}/{stats['total']:,} | Rate: {rate:.1f}/sec")


def find_last_processed_index(companies: List[Dict]) -> int:
    """Find the index of the last processed company."""
    for i in range(len(companies) - 1, -1, -1):
        if 'inferred_domains' in companies[i]:
            return i + 1
    return 0


def main():
    # Default input file
    default_input = "sec_companies_targets_unique.json"
    
    if len(sys.argv) > 1:
        input_file = Path(sys.argv[1])
    else:
        input_file = Path(default_input)
    
    if not input_file.exists():
        print(f"❌ Error: File '{input_file}' not found")
        if len(sys.argv) == 1:
            print(f"Usage: python {sys.argv[0]} [input_json_file]")
            print(f"Default: python {sys.argv[0]} (uses {default_input})")
        sys.exit(1)
    
    # Generate output filename
    output_file = input_file.with_name(
        f"{input_file.stem}_urls{input_file.suffix}"
    )
    
    print(f"{'='*70}")
    print(f"SEC Domain Inference Tool - Automated Run")
    print(f"{'='*70}")
    print(f"Input:  {input_file}")
    print(f"Output: {output_file}")
    print(f"Started: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print(f"\nLoading data...")
    
    # Load the data
    try:
        with open(input_file, 'r', encoding='utf-8') as f:
            data = json.load(f)
    except json.JSONDecodeError as e:
        print(f"❌ Error: Invalid JSON in {input_file}: {e}")
        sys.exit(1)
    
    # Extract companies list
    if isinstance(data, dict) and 'companies' in data:
        companies = data['companies']
        metadata = data.get('metadata', {})
    else:
        print("❌ Error: Expected JSON with 'companies' key")
        sys.exit(1)
    
    total_companies = len(companies)
    print(f"Loaded {total_companies:,} companies")
    
    # Check if we're resuming from a previous run
    start_index = 0
    if output_file.exists():
        print(f"\n📂 Found existing output file: {output_file}")
        try:
            with open(output_file, 'r', encoding='utf-8') as f:
                existing_data = json.load(f)
            existing_companies = existing_data.get('companies', [])
            start_index = find_last_processed_index(existing_companies)
            
            if start_index > 0:
                print(f"🔄 Resuming from index {start_index:,} ({start_index/total_companies*100:.1f}% complete)")
                data = existing_data  # Use existing data
                companies = existing_companies
            else:
                print(f"⚠️  No processed data found in output file, starting fresh")
        except Exception as e:
            print(f"⚠️  Could not resume: {e}")
            print(f"Starting fresh...")
            start_index = 0
    
    if start_index == 0:
        print(f"\n🚀 Starting fresh domain inference...")
    
    print(f"Domain patterns per company: {len(DOMAIN_PATTERNS[:5])}")
    print(f"Checkpoint interval: Every 1000 companies")
    print(f"{'='*70}\n")
    
    # Process companies
    start_time = time.time()
    checkpoint_interval = 1000
    with_domains_count = 0
    
    for i in range(start_index, total_companies):
        company_entry = companies[i]
        company = company_entry.get('company', {})
        company_name = company.get('name', '')
        
        # Infer domain patterns
        inferred_domains = infer_domain(company_name)
        
        # Add inferred domains to the company entry
        company_entry['inferred_domains'] = {
            'domains': inferred_domains,
            'verified': None,
            'checked': False,
            'inferred_at': datetime.now().isoformat()
        }
        
        if inferred_domains:
            with_domains_count += 1
        
        # Periodic progress update (every 1000)
        if (i + 1) % 1000 == 0 or i == start_index:
            elapsed = time.time() - start_time
            rate = (i + 1 - start_index) / elapsed if elapsed > 0 else 0
            pct_done = ((i + 1) / total_companies) * 100
            pct_with_domains = (with_domains_count / (i + 1 - start_index)) * 100 if (i + 1 - start_index) > 0 else 0
            
            print(f"{'='*70}")
            print(f"Progress: {i+1:,} / {total_companies:,} ({pct_done:.1f}%)")
            print(f"Rate: {rate:.1f} companies/sec | Elapsed: {elapsed:.0f}s")
            print(f"With domains: {with_domains_count:,} ({pct_with_domains:.1f}%)")
            print(f"Current: {company_name[:60]}")
            if inferred_domains:
                print(f"Domains: {', '.join(inferred_domains[:3])}")
            print('='*70)
        
        # Checkpoint save every 1000
        if (i + 1) % checkpoint_interval == 0:
            data['companies'] = companies
            save_checkpoint(output_file, data, {
                'processed': i + 1,
                'total': total_companies,
                'with_domains': with_domains_count,
                'start_time': start_time
            })
    
    # Calculate final statistics
    total_with_domains = sum(1 for c in companies if c.get('inferred_domains', {}).get('domains'))
    total_without_domains = total_companies - total_with_domains
    total_elapsed = time.time() - start_time
    
    print(f"\n{'='*70}")
    print(f"✅ COMPLETED!")
    print(f"{'='*70}")
    print(f"Finished: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print(f"Total time: {total_elapsed:.1f}s ({total_elapsed/60:.1f} minutes)")
    print(f"\nRESULTS:")
    print(f"  Total companies: {total_companies:,}")
    print(f"  With inferred domains: {total_with_domains:,} ({total_with_domains/total_companies*100:.1f}%)")
    print(f"  Without domains: {total_without_domains:,} ({total_without_domains/total_companies*100:.1f}%)")
    print(f"  Average rate: {total_companies/total_elapsed:.1f} companies/sec")
    
    # Update metadata
    if 'metadata' in data:
        data['metadata']['domain_inference'] = {
            'completed_at': datetime.now().isoformat(),
            'total_processed': total_companies,
            'with_domains': total_with_domains,
            'without_domains': total_without_domains,
            'patterns_tried': len(DOMAIN_PATTERNS[:5]),
            'success_rate': total_with_domains / total_companies if total_companies > 0 else 0,
            'processing_time_seconds': total_elapsed
        }
    
    # Save final output
    data['companies'] = companies
    print(f"\n💾 Saving final output to: {output_file}")
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    
    input_size = input_file.stat().st_size
    output_size = output_file.stat().st_size
    
    print(f"✅ Complete!")
    print(f"   Output: {output_file}")
    print(f"   File size: {input_size:,} → {output_size:,} bytes ({(1-output_size/input_size)*100:.1f}% reduction)")
    
    # Show some examples
    print(f"\n{'='*70}")
    print("Sample domain inferences (first 10 companies):")
    print('='*70)
    for i, company_entry in enumerate(companies[:10]):
        company = company_entry.get('company', {})
        name = company.get('name', '')
        domains = company_entry.get('inferred_domains', {}).get('domains', [])
        if domains:
            print(f"{i+1}. {name}")
            print(f"   → {', '.join(domains[:3])}")
    
    print(f"\n{'='*70}")
    print("🎉 Domain inference complete! You can now proceed to domain verification.")
    print('='*70)


if __name__ == "__main__":
    main()
```


---


## File: Scripts/sec_filter.py

```py
import json
import re
import sys
from typing import Dict, List, Any
from collections import defaultdict

def normalize_state(state: str) -> str:
    """Normalize state codes to uppercase, handle variations."""
    if not state:
        return ""
    return state.strip().upper()

def is_excluded_industry(industry_name: str) -> bool:
    """Check if company is in an excluded industry category."""
    if not industry_name:
        return False
    
    industry_lower = industry_name.lower()
    
    excluded_keywords = [
        'real estate', 'realty', 'property', 'reit', 'residential',
        'pooled investment', 'hedge fund', 'private equity', 'investment fund',
        'oil', 'gas', 'petroleum', 'energy exploration',
        'agriculture', 'farming', 'agribusiness',
        'retail', 'store', 'shopping',
        'construction', 'contractor', 'building',
        'commercial',
        'restaurant', 'food service', 'hospitality'
    ]
    
    return any(keyword in industry_lower for keyword in excluded_keywords)

def extract_funding_amount(company_data: Dict[str, Any]) -> float:
    """Extract total offering amount from funding object."""
    try:
        funding = company_data.get('funding', {})
        
        # Try total_offering_amount
        if 'total_offering_amount' in funding:
            amount = funding['total_offering_amount']
            if amount is None:
                return 0.0
            if isinstance(amount, (int, float)):
                return float(amount)
            if isinstance(amount, str):
                cleaned = re.sub(r'[,$]', '', amount)
                return float(cleaned)
        
        # Fallback to total_amount_sold if offering amount is null
        if 'total_amount_sold' in funding:
            amount = funding['total_amount_sold']
            if amount and isinstance(amount, (int, float)):
                return float(amount)
        
        return 0.0
    except (ValueError, TypeError):
        return 0.0

def is_us_company(company_data: Dict[str, Any]) -> bool:
    """Check if company is US-based (not Europe or other international)."""
    company = company_data.get('company', {})
    address = company.get('address', {})
    
    state = address.get('state', '').strip().upper()
    
    # US states are 2-letter codes
    if state and len(state) == 2 and state.isalpha():
        # Exclude international codes
        non_us_codes = ['X0', 'X1', 'X2', 'X3']  # Common international placeholders
        if state not in non_us_codes:
            return True
    
    return False

def filter_companies(input_file: str, output_file: str, 
                    target_states: List[str] = None,
                    min_funding: float = 1_000_000) -> Dict[str, Any]:
    """
    Filter SEC companies based on criteria.
    
    Args:
        input_file: Path to sec_companies_master.json
        output_file: Path to output sec_companies_targets.json
        target_states: List of state codes to keep (default: MA, CA, NY, WA, TX, IL)
        min_funding: Minimum funding amount (default: $1M)
    
    Returns:
        Dictionary with filtering statistics
    """
    
    if target_states is None:
        target_states = ['MA', 'CA', 'NY', 'WA', 'TX', 'IL']
    
    target_states = [s.upper() for s in target_states]
    
    print(f"Loading companies from {input_file}...")
    with open(input_file, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    # Handle both formats: direct array or object with metadata
    if isinstance(data, dict) and 'companies' in data:
        companies = data['companies']
        metadata = data.get('metadata', {})
        print(f"Data source: {metadata.get('date_range', {})}")
    else:
        companies = data
        metadata = {}
    
    initial_count = len(companies)
    print(f"Initial company count: {initial_count:,}")
    
    # Statistics tracking
    stats = {
        'initial_count': initial_count,
        'removed_by_funding': 0,
        'removed_by_location': 0,
        'removed_by_industry': 0,
        'removed_by_country': 0,
        'final_count': 0,
        'by_state': defaultdict(int),
        'by_funding_range': defaultdict(int),
        'by_industry': defaultdict(int)
    }
    
    filtered_companies = []
    
    print("\nApplying filters...")
    print(f"  → Minimum funding: ${min_funding:,}")
    print(f"  → Target states: {', '.join(target_states)}")
    print(f"  → Excluded industries: Real Estate, Pooled Investment, Oil/Gas, etc.\n")
    
    for company_data in companies:
        company = company_data.get('company', {})
        address = company.get('address', {})
        
        # Filter 1: Check if US-based
        if not is_us_company(company_data):
            stats['removed_by_country'] += 1
            continue
        
        # Filter 2: Check funding threshold
        funding = extract_funding_amount(company_data)
        if funding < min_funding:
            stats['removed_by_funding'] += 1
            continue
        
        # Filter 3: Check state
        state = normalize_state(address.get('state', ''))
        
        if state not in target_states:
            stats['removed_by_location'] += 1
            continue
        
        # Filter 4: Check industry exclusions
        industry = company.get('industry', '')
        if is_excluded_industry(industry):
            stats['removed_by_industry'] += 1
            continue
        
        # Passed all filters - add to results
        filtered_companies.append(company_data)
        
        # Track statistics
        stats['by_state'][state] += 1
        
        # Funding range
        if funding < 5_000_000:
            stats['by_funding_range']['$1M-$5M'] += 1
        elif funding < 10_000_000:
            stats['by_funding_range']['$5M-$10M'] += 1
        elif funding < 25_000_000:
            stats['by_funding_range']['$10M-$25M'] += 1
        elif funding < 50_000_000:
            stats['by_funding_range']['$25M-$50M'] += 1
        else:
            stats['by_funding_range']['$50M+'] += 1
        
        # Industry
        if industry:
            stats['by_industry'][industry] += 1
    
    stats['final_count'] = len(filtered_companies)
    
    # Create output structure matching input format
    output_data = {
        'metadata': {
            'filtered_from': input_file,
            'generated_at': metadata.get('generated_at', ''),
            'original_total': initial_count,
            'filtered_total': stats['final_count'],
            'filters_applied': {
                'min_funding': min_funding,
                'target_states': target_states,
                'excluded_industries': [
                    'Real Estate', 'Pooled Investment', 'Oil/Gas',
                    'Agriculture', 'Retail', 'Construction'
                ]
            }
        },
        'companies': filtered_companies
    }
    
    # Save filtered companies
    print(f"\nSaving {stats['final_count']:,} companies to {output_file}...")
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(output_data, f, indent=2, ensure_ascii=False)
    
    # Print statistics
    print("\n" + "="*60)
    print("FILTERING RESULTS")
    print("="*60)
    print(f"Initial companies:        {stats['initial_count']:>10,}")
    print(f"Removed (non-US):         {stats['removed_by_country']:>10,}")
    print(f"Removed (funding < $1M):  {stats['removed_by_funding']:>10,}")
    print(f"Removed (wrong state):    {stats['removed_by_location']:>10,}")
    print(f"Removed (excluded ind):   {stats['removed_by_industry']:>10,}")
    print(f"Final target companies:   {stats['final_count']:>10,}")
    print(f"Retention rate:           {stats['final_count']/stats['initial_count']*100:>9.1f}%")
    
    print("\n" + "="*60)
    print("COMPANIES BY STATE")
    print("="*60)
    for state in sorted(stats['by_state'].keys()):
        count = stats['by_state'][state]
        pct = count / stats['final_count'] * 100
        print(f"{state:>4}: {count:>6,} ({pct:>5.1f}%)")
    
    print("\n" + "="*60)
    print("COMPANIES BY FUNDING RANGE")
    print("="*60)
    funding_order = ['$1M-$5M', '$5M-$10M', '$10M-$25M', '$25M-$50M', '$50M+']
    for range_name in funding_order:
        count = stats['by_funding_range'][range_name]
        if count > 0:
            pct = count / stats['final_count'] * 100
            print(f"{range_name:>12}: {count:>6,} ({pct:>5.1f}%)")
    
    print("\n" + "="*60)
    print("TOP 10 INDUSTRIES")
    print("="*60)
    sorted_industries = sorted(
        stats['by_industry'].items(), 
        key=lambda x: x[1], 
        reverse=True
    )[:10]
    for industry, count in sorted_industries:
        pct = count / stats['final_count'] * 100
        industry_name = industry[:40] + '...' if len(industry) > 40 else industry
        print(f"{industry_name:>43}: {count:>5,} ({pct:>4.1f}%)")
    
    # Sample companies
    print("\n" + "="*60)
    print("SAMPLE FILTERED COMPANIES (First 5)")
    print("="*60)
    for i, company_data in enumerate(filtered_companies[:5], 1):
        company = company_data.get('company', {})
        address = company.get('address', {})
        funding_obj = company_data.get('funding', {})
        
        name = company.get('name', 'Unknown')
        state = address.get('state', '??')
        funding = extract_funding_amount(company_data)
        industry = company.get('industry', 'Not specified')
        
        print(f"\n{i}. {name}")
        print(f"   State: {state}")
        print(f"   Funding: ${funding:,.0f}")
        print(f"   Industry: {industry[:50]}")
    
    print("\n" + "="*60)
    
    return stats

def main():
    """Main function with command-line argument support."""
    # Default values
    input_file = 'sec_companies_master.json'
    output_file = 'sec_companies_targets.json'
    
    # Check for command-line arguments
    if len(sys.argv) >= 2:
        input_file = sys.argv[1]
    if len(sys.argv) >= 3:
        output_file = sys.argv[2]
    
    # Show usage
    if '--help' in sys.argv or '-h' in sys.argv:
        print("Usage: python filter_sec_companies.py [input_file] [output_file]")
        print("\nDefaults:")
        print("  input_file:  sec_companies_master.json")
        print("  output_file: sec_companies_targets.json")
        print("\nExample:")
        print("  python filter_sec_companies.py my_companies.json filtered_output.json")
        sys.exit(0)
    
    # Run the filter
    try:
        stats = filter_companies(
            input_file=input_file,
            output_file=output_file,
            target_states=['MA', 'CA', 'NY', 'WA', 'TX', 'IL'],
            min_funding=1_000_000
        )
        
        print("\n✓ Filtering complete!")
        print(f"✓ Output saved to: {output_file}")
        print(f"✓ Ready for domain inference (next step)")
        
    except FileNotFoundError:
        print(f"\n❌ Error: Could not find input file '{input_file}'")
        print("Make sure the file exists in the current directory.")
        sys.exit(1)
    except json.JSONDecodeError:
        print(f"\n❌ Error: File '{input_file}' is not valid JSON")
        sys.exit(1)
    except Exception as e:
        print(f"\n❌ Error: {str(e)}")
        sys.exit(1)

if __name__ == "__main__":
    main()
```


---


## File: Scripts/sec_flatten.py

```py
import json
import csv
import sys
from typing import List, Dict, Any

def extract_funding_amount(company_data: Dict[str, Any]) -> float:
    """Extract total offering amount from funding object."""
    try:
        funding = company_data.get('funding', {})
        if 'total_offering_amount' in funding:
            amount = funding['total_offering_amount']
            if amount and isinstance(amount, (int, float)):
                return float(amount)
        if 'total_amount_sold' in funding:
            amount = funding['total_amount_sold']
            if amount and isinstance(amount, (int, float)):
                return float(amount)
        return 0.0
    except (ValueError, TypeError):
        return 0.0

def flatten_company(company_data: Dict[str, Any]) -> Dict[str, Any]:
    """Extract essential fields from nested company data."""
    company = company_data.get('company', {})
    address = company.get('address', {})
    funding = company_data.get('funding', {})
    filing = company_data.get('filing', {})
    
    # Get primary executive/contact
    related_persons = company_data.get('related_persons', [])
    primary_contact = ""
    if related_persons:
        first_person = related_persons[0]
        primary_contact = first_person.get('name', '')
    
    funding_amount = extract_funding_amount(company_data)
    
    return {
        'Company_Name': company.get('name', ''),
        'Street_Address': address.get('street1', ''),
        'City': address.get('city', ''),
        'State': address.get('state', ''),
        'Zip': address.get('zip', ''),
        'Phone': address.get('phone', ''),
        'Industry': company.get('industry', ''),
        'Entity_Type': company.get('entity_type', ''),
        'Year_Incorporated': company.get('year_incorporated', ''),
        'Funding_Amount': funding_amount,
        'Funding_Formatted': f"${funding_amount:,.0f}" if funding_amount > 0 else "$0",
        'Amount_Sold': funding.get('total_amount_sold', 0),
        'Investors': funding.get('number_of_investors', 0),
        'Filing_Date': filing.get('date_filed', ''),
        'Primary_Contact': primary_contact,
        'Accession_Number': company_data.get('accession_number', '')
    }

def convert_to_csv(input_file: str, output_file: str, top_n: int = 100):
    """Convert JSON to CSV with top N companies by funding."""
    
    print(f"Loading companies from {input_file}...")
    with open(input_file, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    # Handle both formats
    if isinstance(data, dict) and 'companies' in data:
        companies = data['companies']
    else:
        companies = data
    
    print(f"Found {len(companies):,} companies")
    
    # Flatten all companies
    flattened = [flatten_company(c) for c in companies]
    
    # Sort by funding amount (descending)
    flattened.sort(key=lambda x: x['Funding_Amount'], reverse=True)
    
    # Take top N
    top_companies = flattened[:top_n] if top_n else flattened
    
    print(f"Exporting top {len(top_companies):,} companies to {output_file}...")
    
    # Write to CSV
    fieldnames = [
        'Company_Name',
        'Industry',
        'Funding_Formatted',
        'Funding_Amount',
        'City',
        'State',
        'Phone',
        'Street_Address',
        'Zip',
        'Entity_Type',
        'Year_Incorporated',
        'Amount_Sold',
        'Investors',
        'Filing_Date',
        'Primary_Contact',
        'Accession_Number'
    ]
    
    with open(output_file, 'w', newline='', encoding='utf-8') as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(top_companies)
    
    # Print summary
    print("\n" + "="*60)
    print("CSV EXPORT SUMMARY")
    print("="*60)
    print(f"Total companies exported: {len(top_companies):,}")
    print(f"Output file: {output_file}")
    
    print("\n" + "="*60)
    print("TOP 5 BY FUNDING")
    print("="*60)
    for i, company in enumerate(top_companies[:5], 1):
        print(f"{i}. {company['Company_Name']}")
        print(f"   {company['City']}, {company['State']} - {company['Funding_Formatted']}")
        print(f"   Industry: {company['Industry']}")
    
    print("\n" + "="*60)
    print("FUNDING DISTRIBUTION")
    print("="*60)
    
    # Calculate distribution
    ranges = {
        '$1M-$5M': 0,
        '$5M-$10M': 0,
        '$10M-$25M': 0,
        '$25M-$50M': 0,
        '$50M+': 0
    }
    
    for company in top_companies:
        amount = company['Funding_Amount']
        if amount < 5_000_000:
            ranges['$1M-$5M'] += 1
        elif amount < 10_000_000:
            ranges['$5M-$10M'] += 1
        elif amount < 25_000_000:
            ranges['$10M-$25M'] += 1
        elif amount < 50_000_000:
            ranges['$25M-$50M'] += 1
        else:
            ranges['$50M+'] += 1
    
    for range_name, count in ranges.items():
        if count > 0:
            pct = count / len(top_companies) * 100
            print(f"{range_name:>12}: {count:>4} ({pct:>4.1f}%)")
    
    print("\n✓ CSV export complete!")

def main():
    """Main function with command-line support."""
    input_file = 'sec_companies_targets.json'
    output_file = 'sec_companies_top100.csv'
    top_n = 100
    
    # Parse arguments
    if len(sys.argv) >= 2:
        input_file = sys.argv[1]
    if len(sys.argv) >= 3:
        output_file = sys.argv[2]
    if len(sys.argv) >= 4:
        try:
            top_n = int(sys.argv[3])
        except ValueError:
            print("Warning: Invalid number, using default top 100")
            top_n = 100
    
    if '--help' in sys.argv or '-h' in sys.argv:
        print("Usage: python flatten_to_csv.py [input_file] [output_file] [top_n]")
        print("\nDefaults:")
        print("  input_file:  sec_companies_targets.json")
        print("  output_file: sec_companies_top100.csv")
        print("  top_n:       100 (use 0 for all companies)")
        print("\nExamples:")
        print("  python flatten_to_csv.py                          # Top 100")
        print("  python flatten_to_csv.py targets.json out.csv 50  # Top 50")
        print("  python flatten_to_csv.py targets.json all.csv 0   # All companies")
        sys.exit(0)
    
    try:
        convert_to_csv(input_file, output_file, top_n)
    except FileNotFoundError:
        print(f"\n❌ Error: Could not find '{input_file}'")
        sys.exit(1)
    except Exception as e:
        print(f"\n❌ Error: {str(e)}")
        sys.exit(1)

if __name__ == "__main__":
    main()
```


---


## File: Scripts/sec_form_d.py

```py
import pandas as pd
import json
import os
import sys
import argparse
from datetime import datetime

# Required TSV files
REQUIRED_FILES = [
    'FORMDSUBMISSION.tsv',
    'ISSUERS.tsv',
    'OFFERING.tsv',
    'RELATEDPERSONS.tsv'
]

def check_required_files(directory):
    """Check if all required TSV files exist in the directory"""
    missing_files = []
    found_files = []
    
    for filename in REQUIRED_FILES:
        filepath = os.path.join(directory, filename)
        if os.path.exists(filepath):
            found_files.append(filename)
        else:
            missing_files.append(filename)
    
    if missing_files:
        print(f"❌ Missing required files in '{directory}':")
        for f in missing_files:
            print(f"   - {f}")
        print(f"\n✅ Found files:")
        for f in found_files:
            print(f"   - {f}")
        print(f"\nExpected SEC Form D TSV files. Did you extract the ZIP file?")
        return False
    
    print(f"✅ All required files found in '{directory}'")
    return True

def create_startups_json(directory='.'):
    """Parse SEC Form D data and create MongoDB-ready JSON"""
    
    # Convert to absolute path
    directory = os.path.abspath(directory)
    
    print(f"\n🔍 Looking for TSV files in: {directory}\n")
    
    # Check if directory exists
    if not os.path.exists(directory):
        print(f"❌ Directory does not exist: {directory}")
        return None
    
    # Check for required files
    if not check_required_files(directory):
        return None
    
    print(f"\n📂 Loading TSV files...")
    
    try:
        # Load the core files with correct column names
        submissions = pd.read_csv(
            os.path.join(directory, 'FORMDSUBMISSION.tsv'), 
            sep='\t', 
            low_memory=False
        )
        issuers = pd.read_csv(
            os.path.join(directory, 'ISSUERS.tsv'), 
            sep='\t', 
            low_memory=False
        )
        offerings = pd.read_csv(
            os.path.join(directory, 'OFFERING.tsv'), 
            sep='\t', 
            low_memory=False
        )
        people = pd.read_csv(
            os.path.join(directory, 'RELATEDPERSONS.tsv'), 
            sep='\t', 
            low_memory=False
        )
        
        print(f"   Loaded {len(submissions):,} submissions")
        print(f"   Loaded {len(issuers):,} issuers")
        print(f"   Loaded {len(offerings):,} offerings")
        print(f"   Loaded {len(people):,} related persons")
        
    except Exception as e:
        print(f"\n❌ Error loading TSV files: {e}")
        return None
    
    # Filter criteria
    TARGET_STATES = ['MA', 'CA', 'NY']
    MIN_FUNDING = 5_000_000
    TARGET_INDUSTRIES = [
        'Biotechnology',
        'Pharmaceuticals',
        'Pharmaceutical',
        'Medical Devices and Equipment',
        'Other Health Care',
        'Computers and Computer Equipment',
        'Computer Software and Services',
        'Internet and Information Services'
    ]
    
    print(f"\n🔎 Filtering startups...")
    print(f"   States: {', '.join(TARGET_STATES)}")
    print(f"   Min funding: ${MIN_FUNDING:,}")
    print(f"   Industries: {len(TARGET_INDUSTRIES)} target industries")
    
    # Step 1: Filter offerings for funded companies
    try:
        # Convert amount to numeric, handling any non-numeric values
        offerings['TOTALAMOUNTSOLD'] = pd.to_numeric(offerings['TOTALAMOUNTSOLD'], errors='coerce')
        
        funded = offerings[offerings['TOTALAMOUNTSOLD'] >= MIN_FUNDING].copy()
        
        # Filter by industry
        funded = funded[funded['INDUSTRYGROUPTYPE'].isin(TARGET_INDUSTRIES)].copy()
        
        print(f"\n   ✓ Found {len(funded):,} companies with ${MIN_FUNDING:,}+ funding in target industries")
        
    except Exception as e:
        print(f"\n❌ Error filtering offerings: {e}")
        return None
    
    # Step 2: Join with issuers and filter for target states
    try:
        funded_issuers = funded.merge(issuers, on='ACCESSIONNUMBER', how='inner')
        target_companies = funded_issuers[
            funded_issuers['STATEORCOUNTRY'].isin(TARGET_STATES)
        ].copy()
        
        print(f"   ✓ Found {len(target_companies):,} companies in target states")
        
    except Exception as e:
        print(f"\n❌ Error joining with issuers: {e}")
        return None
    
    # Step 3: Join with submission info
    try:
        target_companies = target_companies.merge(
            submissions[['ACCESSIONNUMBER', 'FILING_DATE', 'SUBMISSIONTYPE']], 
            on='ACCESSIONNUMBER',
            how='left'
        )
    except Exception as e:
        print(f"⚠️  Warning: Could not join submission info: {e}")
    
    # Step 4: Build the JSON structure
    print(f"\n📝 Building JSON documents...")
    startups = []
    
    for idx, (_, row) in enumerate(target_companies.iterrows(), 1):
        accession = row['ACCESSIONNUMBER']
        
        if idx % 10 == 0:
            print(f"   Processing {idx}/{len(target_companies)}...", end='\r')
        
        # Get all related persons for this company
        company_people = people[people['ACCESSIONNUMBER'] == accession]
        
        # Build related persons array
        related_persons = []
        for _, person in company_people.iterrows():
            # Combine first, middle, last name
            name_parts = [
                clean_value(person.get('FIRSTNAME')),
                clean_value(person.get('MIDDLENAME')),
                clean_value(person.get('LASTNAME'))
            ]
            full_name = ' '.join([p for p in name_parts if p])
            
            # Combine relationships
            relationships = []
            for rel_col in ['RELATIONSHIP_1', 'RELATIONSHIP_2', 'RELATIONSHIP_3']:
                rel = clean_value(person.get(rel_col))
                if rel:
                    relationships.append(rel)
            
            person_data = {
                'name': full_name if full_name else None,
                'first_name': clean_value(person.get('FIRSTNAME')),
                'middle_name': clean_value(person.get('MIDDLENAME')),
                'last_name': clean_value(person.get('LASTNAME')),
                'relationships': relationships,
                'city': clean_value(person.get('CITY')),
                'state': clean_value(person.get('STATEORCOUNTRY'))
            }
            
            related_persons.append(person_data)
        
        # Build the startup document
        startup = {
            'accession_number': accession,
            'company': {
                'name': clean_value(row.get('ENTITYNAME')),
                'address': {
                    'street1': clean_value(row.get('STREET1')),
                    'street2': clean_value(row.get('STREET2')),
                    'city': clean_value(row.get('CITY')),
                    'state': clean_value(row.get('STATEORCOUNTRY')),
                    'zip': clean_value(row.get('ZIPCODE')),
                    'phone': clean_value(row.get('ISSUERPHONENUMBER'))
                },
                'entity_type': clean_value(row.get('ENTITYTYPE')),
                'year_incorporated': clean_int(row.get('YEAROFINC_VALUE_ENTERED')),
                'industry': clean_value(row.get('INDUSTRYGROUPTYPE'))
            },
            'funding': {
                'total_offering_amount': clean_float(row.get('TOTALOFFERINGAMOUNT')),
                'total_amount_sold': clean_float(row.get('TOTALAMOUNTSOLD')),
                'total_remaining': clean_float(row.get('TOTALREMAINING')),
                'number_of_investors': clean_int(row.get('TOTALNUMBERALREADYINVESTED')),
                'date_of_first_sale': clean_value(row.get('SALE_DATE'))
            },
            'filing': {
                'date_filed': clean_value(row.get('FILING_DATE')),
                'submission_type': clean_value(row.get('SUBMISSIONTYPE')),
                'is_amendment': clean_value(row.get('ISAMENDMENT')) == 'Y'
            },
            'related_persons': related_persons,
            'metadata': {
                'added_to_database': datetime.now().isoformat(),
                'source_directory': directory,
                'prediction_scores': {
                    'international_hiring': None,
                    'recent_grad_hiring': None
                }
            }
        }
        
        startups.append(startup)
    
    print(f"   Processing {len(target_companies)}/{len(target_companies)}... Done!")
    
    # Create final JSON structure
    output = {
        'metadata': {
            'generated_at': datetime.now().isoformat(),
            'source_directory': directory,
            'filters': {
                'states': TARGET_STATES,
                'min_funding': MIN_FUNDING,
                'industries': TARGET_INDUSTRIES
            },
            'total_startups': len(startups),
            'total_executives': sum(len(s['related_persons']) for s in startups)
        },
        'startups': startups
    }
    
    # Write to file
    output_file = 'startups.json'
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(output, f, indent=2, ensure_ascii=False)
    
    print(f"\n✅ SUCCESS!")
    print(f"   Created: {output_file}")
    print(f"   Startups: {len(startups):,}")
    print(f"   Executives/Directors: {sum(len(s['related_persons']) for s in startups):,}")
    
    # Print sample
    if startups:
        print(f"\n📄 Sample startup:")
        sample = startups[0]
        print(f"   Company: {sample['company']['name']}")
        print(f"   Location: {sample['company']['address']['city']}, {sample['company']['address']['state']}")
        print(f"   Funding: ${sample['funding']['total_amount_sold']:,.0f}")
        print(f"   Industry: {sample['company']['industry']}")
        print(f"   Executives: {len(sample['related_persons'])}")
    
    return output

def clean_value(val):
    """Clean pandas values - convert NaN to None"""
    if pd.isna(val):
        return None
    return str(val).strip() if val else None

def clean_float(val):
    """Convert to float, handle NaN"""
    if pd.isna(val):
        return None
    try:
        return float(val)
    except:
        return None

def clean_int(val):
    """Convert to int, handle NaN"""
    if pd.isna(val):
        return None
    try:
        return int(float(val))
    except:
        return None

def main():
    parser = argparse.ArgumentParser(
        description='Parse SEC Form D data into MongoDB-ready JSON',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  # Use current directory
  python3 sec_form_d.py
  
  # Specify a directory
  python3 sec_form_d.py /path/to/2025q1-d
  python3 sec_form_d.py ./2025q1-d
        """
    )
    
    parser.add_argument(
        'directory',
        nargs='?',
        default='.',
        help='Directory containing TSV files (default: current directory)'
    )
    
    args = parser.parse_args()
    
    print("=" * 60)
    print("SEC Form D → MongoDB JSON Converter")
    print("=" * 60)
    
    result = create_startups_json(args.directory)
    
    if result:
        print("\n" + "=" * 60)
        print("Next steps:")
        print("  1. Review startups.json")
        print("  2. Import to MongoDB:")
        print("     mongoimport --db startups --collection companies \\")
        print("                 --file startups.json --jsonArray")
        print("=" * 60)
        sys.exit(0)
    else:
        sys.exit(1)

if __name__ == '__main__':
    main()
```


---


## File: Scripts/sec_unique.py

```py
#!/usr/bin/env python3
"""
sec_unique.py - Remove duplicate companies from SEC data based on exact name, phone, and address matches
Usage: python sec_unique.py sec_companies_targets.json
"""

import json
import sys
from pathlib import Path
from typing import Dict, List, Tuple


def normalize_field(value) -> str:
    """Normalize a field value for comparison."""
    if value is None:
        return ""
    return str(value).strip().lower()


def create_dedup_key(company_entry: Dict) -> Tuple[str, str, str]:
    """
    Create a deduplication key from company name, phone, and address.
    Returns a tuple of normalized (name, phone, address).
    """
    company = company_entry.get('company', {})
    
    # Get company name
    name = normalize_field(company.get('name'))
    
    # Get address info
    address = company.get('address', {})
    phone = normalize_field(address.get('phone'))
    
    # Build full address from components
    address_parts = [
        normalize_field(address.get('street1')),
        normalize_field(address.get('street2')),
        normalize_field(address.get('city')),
        normalize_field(address.get('state')),
        normalize_field(address.get('zip'))
    ]
    
    full_address = ' '.join(filter(None, address_parts))
    
    return (name, phone, full_address)


def deduplicate_companies(companies: List[Dict]) -> Tuple[List[Dict], int, Dict]:
    """
    Remove duplicate companies based on exact name, phone, and address matches.
    Returns (unique_companies, duplicate_count, duplicate_stats).
    """
    seen_keys = {}  # Maps key to first occurrence
    unique_companies = []
    duplicate_count = 0
    duplicate_examples = []
    
    for idx, company in enumerate(companies):
        key = create_dedup_key(company)
        
        # Skip if we've seen this exact combination before
        if key in seen_keys:
            duplicate_count += 1
            # Keep first 5 examples for reporting
            if len(duplicate_examples) < 5:
                original_idx = seen_keys[key]
                duplicate_examples.append({
                    'name': company.get('company', {}).get('name'),
                    'original_index': original_idx,
                    'duplicate_index': idx
                })
            continue
        
        seen_keys[key] = idx
        unique_companies.append(company)
    
    stats = {
        'duplicate_examples': duplicate_examples,
        'unique_keys': len(seen_keys)
    }
    
    return unique_companies, duplicate_count, stats


def main():
    if len(sys.argv) < 2:
        print("Usage: python sec_unique.py <input_json_file>")
        print("Example: python sec_unique.py sec_companies_targets.json")
        sys.exit(1)
    
    input_file = Path(sys.argv[1])
    
    if not input_file.exists():
        print(f"Error: File '{input_file}' not found")
        sys.exit(1)
    
    # Create output filename by inserting '_unique' before extension
    output_file = input_file.with_name(
        f"{input_file.stem}_unique{input_file.suffix}"
    )
    
    print(f"Reading from: {input_file}")
    print(f"Will write to: {output_file}")
    
    # Load the data
    print("\nLoading JSON data...")
    try:
        with open(input_file, 'r', encoding='utf-8') as f:
            data = json.load(f)
    except json.JSONDecodeError as e:
        print(f"Error: Invalid JSON in {input_file}: {e}")
        sys.exit(1)
    
    # Extract companies list
    if isinstance(data, dict) and 'companies' in data:
        companies = data['companies']
        metadata = data.get('metadata', {})
    else:
        print("Error: Expected JSON with 'companies' key")
        sys.exit(1)
    
    original_count = len(companies)
    print(f"\nOriginal count: {original_count:,} companies")
    if metadata:
        print(f"Date range: {metadata.get('date_range', {}).get('earliest_quarter')} to {metadata.get('date_range', {}).get('latest_quarter')}")
    
    # Deduplicate
    print("\nDeduplicating...")
    unique_companies, duplicate_count, stats = deduplicate_companies(companies)
    
    print(f"\n{'='*60}")
    print(f"RESULTS:")
    print(f"{'='*60}")
    print(f"Unique companies: {len(unique_companies):,}")
    print(f"Duplicates removed: {duplicate_count:,} ({duplicate_count/original_count*100:.1f}%)")
    print(f"Reduction: {original_count:,} → {len(unique_companies):,}")
    
    # Show examples of duplicates found
    if stats['duplicate_examples']:
        print(f"\nFirst {len(stats['duplicate_examples'])} duplicate examples:")
        for ex in stats['duplicate_examples']:
            print(f"  • {ex['name']} (indices: {ex['original_index']}, {ex['duplicate_index']})")
    
    # Update metadata
    output_data = data.copy()
    output_data['companies'] = unique_companies
    
    if 'metadata' in output_data:
        output_data['metadata']['total_companies'] = len(unique_companies)
        output_data['metadata']['duplicates_removed'] = duplicate_count
        output_data['metadata']['deduplication_date'] = str(Path(__file__).stat().st_mtime)
    
    # Write output
    print(f"\nWriting unique companies to: {output_file}")
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(output_data, f, indent=2, ensure_ascii=False)
    
    input_size = input_file.stat().st_size
    output_size = output_file.stat().st_size
    
    print(f"✓ Complete!")
    print(f"  File size: {input_size:,} → {output_size:,} bytes ({(1-output_size/input_size)*100:.1f}% reduction)")


if __name__ == "__main__":
    main()
```


---


## File: Scripts/webpage_processor_README.MD

```MD
# Webpage Content Extractor

Extract text content from scraped HTML files. Two versions: **clean** (preserves contact info, removes media noise) and **raw** (minimal processing).

## Folder structure
- Create a folder named `websites` and copy all scrapped website folders in that folder before running any scripts

## Scripts

### `webpage_processor_clean.py` - Smart Cleaning (Recommended)
- **Preserves**: Emails, phones, URLs, addresses, names, dates
- **Removes**: Image/video URLs, technical timestamps, file sizes
- **Use for**: Job leads, networking, business intelligence

### `webpage_processor_raw.py` - Minimal Processing
- **Preserves**: Everything
- **Removes**: Only HTML tags (`<script>`, `<style>`)
- **Use for**: Complete data archiving

## Quick Start

```bash
# Setup
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt

# Run clean version 
cd Scripts
python webpage_processor_clean.py

# Run raw version (complete data)
python webpage_processor_raw.py
```

## Project Structure

```
project-root/
├── Scripts/
│   ├── webpage_processor_clean.py
│   └── webpage_processor_raw.py
├── websites/              # Input: scraped HTML files
│   ├── company1.com/
│   │   ├── page1.html
│   │   └── page2.html
│   └── company2.com/
│       └── about.html
```

## Output

Both scripts generate:
- **`.md` files** - Same name as HTML, extracted text only
- **`{folder_name}_all_content.txt`** - Aggregated content per website folder

**Example output:**
```
websites/
└── company1.com/
    ├── page1.html          (original)
    ├── page1.md            (extracted text)
    ├── page2.html
    ├── page2.md
    └── company1.com_all_content.txt  (all pages combined)
```

## What Gets Extracted

| Data Type | Clean Version | Raw Version |
|-----------|--------------|-------------|
| Text content | ✅ | ✅ |
| Emails | ✅ | ✅ |
| Phone numbers | ✅ | ✅ |
| URLs (LinkedIn, company sites) | ✅ | ✅ |
| Addresses | ✅ | ✅ |
| Names & titles | ✅ | ✅ |
| Dates (human-readable) | ✅ | ✅ |
| Image URLs | ❌ | ✅ |
| Video URLs | ❌ | ✅ |
| Technical timestamps | ❌ | ✅ |
| File sizes | ❌ | ✅ |

## Configuration

**Change thread count** (default: 4):
```python
# In either script, modify:
processor = WebpageProcessor(
    base_path=str(websites_path),
    max_workers=8  # Change here
)
```

**Process different folder**:
```python
# Modify main() function:
websites_path = base_dir / "custom_folder"
```

## Performance

- **Clean**: ~280-350 files/min (4 threads)
- **Raw**: ~300-400 files/min (4 threads)
- **Output size**: Clean is ~25% smaller than raw

## Requirements

- Python 3.7+
- BeautifulSoup4 (see `requirements.txt`)

```


---


## File: Scripts/webpage_processor_clean.py

```py
#!/usr/bin/env python3
"""
Webpage Content Extractor - CLEAN VERSION
Processes scraped HTML files, extracts text content with smart cleaning.
Removes HTML tags, media URLs, and noise while PRESERVING contact information.
PRESERVES: Emails, phone numbers, addresses, company names, professional info
"""

import os
import re
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor, as_completed
from bs4 import BeautifulSoup
from typing import List, Tuple
import logging

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

class WebpageProcessor:
    def __init__(self, base_path: str, max_workers: int = 4):
        """
        Initialize the webpage processor.
        
        Args:
            base_path: Root path to the websites folder
            max_workers: Number of threads for parallel processing
        """
        self.base_path = Path(base_path)
        self.max_workers = max_workers
        self.processed_files = 0
        self.failed_files = 0
        
    def extract_text_from_html(self, html_content: str) -> str:
        """
        Extract text content from HTML with smart cleaning.
        PRESERVES: Emails, phone numbers, addresses, names, professional info
        REMOVES: Media URLs, excessive timestamps, noise
        
        Args:
            html_content: Raw HTML content
            
        Returns:
            Cleaned text content with contact information preserved
        """
        try:
            soup = BeautifulSoup(html_content, 'html.parser')
            
            # Remove unwanted elements (media and scripts only)
            for element in soup(['script', 'style', 'noscript', 
                                'iframe', 'img', 'video', 'audio', 'source', 
                                'picture', 'svg', 'canvas']):
                element.decompose()
            
            # Get text and clean it
            text = soup.get_text(separator='\n', strip=True)
            
            # Clean up excessive whitespace
            lines = [line.strip() for line in text.splitlines() if line.strip()]
            text = '\n'.join(lines)
            
            # Remove ONLY image/video URLs (not all URLs - we want linkedin, company sites, etc.)
            text = re.sub(r'https?://[^\s]+\.(jpg|jpeg|png|gif|bmp|svg|webp|mp4|avi|mov|wmv|flv|mkv|webm|m4v)\b', '', text, flags=re.IGNORECASE)
            
            # Remove data URIs (base64 encoded images)
            text = re.sub(r'data:image/[^;]+;base64,[A-Za-z0-9+/=]+', '', text)
            
            # Remove CDN/asset URLs but keep regular website URLs
            text = re.sub(r'https?://[^\s]*/(images?|media|assets|static|uploads?|cdn|content|thumb)/[^\s]+', '', text, flags=re.IGNORECASE)
            
            # Remove ISO 8601 timestamps (technical timestamps, not useful dates)
            text = re.sub(r'\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}([+-]\d{2}:\d{2}|Z)', '', text)
            
            # Remove Unix timestamps (10 or 13 digits) - technical data
            text = re.sub(r'\b\d{10,13}\b', '', text)
            
            # Remove standalone time stamps that aren't part of dates
            # But keep dates like "January 15, 2024" or "2024-01-15"
            text = re.sub(r'\b\d{1,2}:\d{2}(:\d{2})?\s*(AM|PM|am|pm)?\s*(?![,\d])', ' ', text)
            
            # Remove file size indicators (not useful for networking)
            text = re.sub(r'\b\d+(\.\d+)?\s*(KB|MB|GB|bytes?)\b', '', text, flags=re.IGNORECASE)
            
            # Remove "Posted on:", "Last updated:" but keep the actual date
            text = re.sub(r'\b(Posted on|Last updated|Published|Modified):?\s*', '', text, flags=re.IGNORECASE)
            
            # PRESERVE email addresses - critical for networking!
            # PRESERVE phone numbers - critical for contact!
            # PRESERVE addresses - critical for location!
            # PRESERVE LinkedIn/social URLs - critical for networking!
            # PRESERVE company websites
            
            # Remove excessive blank lines
            text = re.sub(r'\n{3,}', '\n\n', text)
            
            # Remove lines that are ONLY numbers/punctuation but keep:
            # - Lines with emails (contains @)
            # - Lines with phone numbers (contains digits with dashes/parens)
            # - Lines with URLs (contains http or www)
            # - Lines with meaningful content
            lines = text.split('\n')
            cleaned_lines = []
            for line in lines:
                line_stripped = line.strip()
                # Keep if: has @ (email), has reasonable length with letters, has URL patterns
                if (len(line_stripped) > 3 and 
                    (not re.match(r'^[\d\s\-_.,;:!?]+$', line_stripped) or
                     '@' in line_stripped or
                     'http' in line_stripped.lower() or
                     'www.' in line_stripped.lower() or
                     re.search(r'\d{3}[-.]?\d{3}[-.]?\d{4}', line_stripped))):  # phone pattern
                    cleaned_lines.append(line)
            
            text = '\n'.join(cleaned_lines)
            
            # Final whitespace cleanup
            text = re.sub(r'\n{3,}', '\n\n', text)
            text = text.strip()
            
            return text
        except Exception as e:
            logger.error(f"Error extracting text from HTML: {e}")
            return ""
    
    def process_html_file(self, file_path: Path) -> Tuple[bool, str, str]:
        """
        Process a single HTML file and create corresponding MD file.
        
        Args:
            file_path: Path to the HTML file
            
        Returns:
            Tuple of (success, markdown_path, extracted_content)
        """
        try:
            # Read HTML file
            with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                html_content = f.read()
            
            # Extract text content
            text_content = self.extract_text_from_html(html_content)
            
            if not text_content:
                logger.warning(f"No content extracted from {file_path}")
                return False, "", ""
            
            # Create MD file path (same name, different extension)
            md_path = file_path.with_suffix('.md')
            
            # Write to MD file - only the extracted text content
            with open(md_path, 'w', encoding='utf-8') as f:
                f.write(text_content)
            
            logger.info(f"Processed: {file_path.name} -> {md_path.name}")
            return True, str(md_path), text_content
            
        except Exception as e:
            logger.error(f"Error processing {file_path}: {e}")
            return False, "", ""
    
    def create_master_file(self, folder_path: Path, md_contents: List[Tuple[str, str]]):
        """
        Create a master file containing all content from MD files in a folder.
        
        Args:
            folder_path: Path to the folder
            md_contents: List of tuples (file_name, content)
        """
        try:
            folder_name = folder_path.name
            master_file_path = folder_path / f"{folder_name}_all_content.txt"
            
            # Write only the extracted text content, no extra formatting
            with open(master_file_path, 'w', encoding='utf-8') as f:
                for file_name, content in sorted(md_contents):
                    f.write(content)
                    f.write("\n\n")
            
            logger.info(f"Created master file: {master_file_path} ({len(md_contents)} files)")
            
        except Exception as e:
            logger.error(f"Error creating master file for {folder_path}: {e}")
    
    def process_folder(self, folder_path: Path):
        """
        Process all HTML files in a folder using multithreading.
        
        Args:
            folder_path: Path to the folder to process
        """
        # Find all HTML files in the folder (non-recursive for this level)
        html_files = list(folder_path.glob('*.html')) + list(folder_path.glob('*.htm'))
        
        if not html_files:
            logger.info(f"No HTML files found in {folder_path}")
            return
        
        logger.info(f"Processing {len(html_files)} files in {folder_path.name}")
        
        md_contents = []
        
        # Process files using thread pool
        with ThreadPoolExecutor(max_workers=self.max_workers) as executor:
            future_to_file = {
                executor.submit(self.process_html_file, file_path): file_path 
                for file_path in html_files
            }
            
            for future in as_completed(future_to_file):
                file_path = future_to_file[future]
                try:
                    success, md_path, content = future.result()
                    if success:
                        self.processed_files += 1
                        md_contents.append((file_path.name, content))
                    else:
                        self.failed_files += 1
                except Exception as e:
                    logger.error(f"Exception processing {file_path}: {e}")
                    self.failed_files += 1
        
        # Create master file for this folder
        if md_contents:
            self.create_master_file(folder_path, md_contents)
    
    def process_all(self):
        """
        Process all folders in the base path recursively.
        """
        if not self.base_path.exists():
            logger.error(f"Base path does not exist: {self.base_path}")
            return
        
        logger.info(f"Starting processing of {self.base_path}")
        logger.info(f"Using {self.max_workers} worker threads")
        
        # Get all subdirectories in the websites folder
        subdirs = [d for d in self.base_path.iterdir() if d.is_dir()]
        
        if not subdirs:
            logger.warning(f"No subdirectories found in {self.base_path}")
            return
        
        logger.info(f"Found {len(subdirs)} folders to process")
        
        # Process each subdirectory
        for subdir in subdirs:
            logger.info(f"\n{'*' * 80}")
            logger.info(f"Processing folder: {subdir.name}")
            logger.info(f"{'*' * 80}")
            self.process_folder(subdir)
        
        # Summary
        logger.info(f"\n{'=' * 80}")
        logger.info("Processing Complete!")
        logger.info(f"Successfully processed: {self.processed_files} files")
        logger.info(f"Failed: {self.failed_files} files")
        logger.info(f"{'=' * 80}")


def main():
    """Main entry point for the script."""
    # Determine paths
    script_dir = Path(__file__).parent
    base_dir = script_dir.parent
    websites_path = base_dir / "websites"
    
    logger.info(f"Script directory: {script_dir}")
    logger.info(f"Websites directory: {websites_path}")
    
    # Create processor and run
    processor = WebpageProcessor(
        base_path=str(websites_path),
        max_workers=4
    )
    
    processor.process_all()


if __name__ == "__main__":
    main()

```


---


## File: Scripts/webpage_processor_raw.py

```py
#!/usr/bin/env python3
"""
Webpage Content Extractor - RAW VERSION
Processes scraped HTML files, extracts ALL text content.
Only removes HTML tags - keeps URLs, timestamps, metadata intact.
USE THIS FOR: Preserving all information, archiving, complete data extraction
"""

import os
import re
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor, as_completed
from bs4 import BeautifulSoup
from typing import List, Tuple
import logging

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

class WebpageProcessor:
    def __init__(self, base_path: str, max_workers: int = 4):
        """
        Initialize the webpage processor.
        
        Args:
            base_path: Root path to the websites folder
            max_workers: Number of threads for parallel processing
        """
        self.base_path = Path(base_path)
        self.max_workers = max_workers
        self.processed_files = 0
        self.failed_files = 0
        
    def extract_text_from_html(self, html_content: str) -> str:
        """
        Extract ALL text content from HTML, removing only HTML tags.
        Preserves URLs, timestamps, metadata, and all other text.
        
        Args:
            html_content: Raw HTML content
            
        Returns:
            Text content with HTML tags removed
        """
        try:
            soup = BeautifulSoup(html_content, 'html.parser')
            
            # Remove only script and style elements (code, not content)
            for script in soup(['script', 'style']):
                script.decompose()
            
            # Get ALL text content
            text = soup.get_text(separator='\n', strip=True)
            
            # Basic whitespace cleanup only
            lines = [line.strip() for line in text.splitlines() if line.strip()]
            text = '\n'.join(lines)
            
            # Remove excessive blank lines (more than 2 consecutive)
            text = re.sub(r'\n{3,}', '\n\n', text)
            
            return text
        except Exception as e:
            logger.error(f"Error extracting text from HTML: {e}")
            return ""
    
    def process_html_file(self, file_path: Path) -> Tuple[bool, str, str]:
        """
        Process a single HTML file and create corresponding MD file.
        
        Args:
            file_path: Path to the HTML file
            
        Returns:
            Tuple of (success, markdown_path, extracted_content)
        """
        try:
            # Read HTML file
            with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                html_content = f.read()
            
            # Extract text content
            text_content = self.extract_text_from_html(html_content)
            
            if not text_content:
                logger.warning(f"No content extracted from {file_path}")
                return False, "", ""
            
            # Create MD file path (same name, different extension)
            md_path = file_path.with_suffix('.md')
            
            # Write to MD file - only the extracted text content
            with open(md_path, 'w', encoding='utf-8') as f:
                f.write(text_content)
            
            logger.info(f"Processed: {file_path.name} -> {md_path.name}")
            return True, str(md_path), text_content
            
        except Exception as e:
            logger.error(f"Error processing {file_path}: {e}")
            return False, "", ""
    
    def create_master_file(self, folder_path: Path, md_contents: List[Tuple[str, str]]):
        """
        Create a master file containing all content from MD files in a folder.
        
        Args:
            folder_path: Path to the folder
            md_contents: List of tuples (file_name, content)
        """
        try:
            folder_name = folder_path.name
            master_file_path = folder_path / f"{folder_name}_all_content.txt"
            
            # Write only the extracted text content, no extra formatting
            with open(master_file_path, 'w', encoding='utf-8') as f:
                for file_name, content in sorted(md_contents):
                    f.write(content)
                    f.write("\n\n")
            
            logger.info(f"Created master file: {master_file_path} ({len(md_contents)} files)")
            
        except Exception as e:
            logger.error(f"Error creating master file for {folder_path}: {e}")
    
    def process_folder(self, folder_path: Path):
        """
        Process all HTML files in a folder using multithreading.
        
        Args:
            folder_path: Path to the folder to process
        """
        # Find all HTML files in the folder (non-recursive for this level)
        html_files = list(folder_path.glob('*.html')) + list(folder_path.glob('*.htm'))
        
        if not html_files:
            logger.info(f"No HTML files found in {folder_path}")
            return
        
        logger.info(f"Processing {len(html_files)} files in {folder_path.name}")
        
        md_contents = []
        
        # Process files using thread pool
        with ThreadPoolExecutor(max_workers=self.max_workers) as executor:
            future_to_file = {
                executor.submit(self.process_html_file, file_path): file_path 
                for file_path in html_files
            }
            
            for future in as_completed(future_to_file):
                file_path = future_to_file[future]
                try:
                    success, md_path, content = future.result()
                    if success:
                        self.processed_files += 1
                        md_contents.append((file_path.name, content))
                    else:
                        self.failed_files += 1
                except Exception as e:
                    logger.error(f"Exception processing {file_path}: {e}")
                    self.failed_files += 1
        
        # Create master file for this folder
        if md_contents:
            self.create_master_file(folder_path, md_contents)
    
    def process_all(self):
        """
        Process all folders in the base path recursively.
        """
        if not self.base_path.exists():
            logger.error(f"Base path does not exist: {self.base_path}")
            return
        
        logger.info(f"Starting processing of {self.base_path}")
        logger.info(f"Using {self.max_workers} worker threads")
        
        # Get all subdirectories in the websites folder
        subdirs = [d for d in self.base_path.iterdir() if d.is_dir()]
        
        if not subdirs:
            logger.warning(f"No subdirectories found in {self.base_path}")
            return
        
        logger.info(f"Found {len(subdirs)} folders to process")
        
        # Process each subdirectory
        for subdir in subdirs:
            logger.info(f"\n{'*' * 80}")
            logger.info(f"Processing folder: {subdir.name}")
            logger.info(f"{'*' * 80}")
            self.process_folder(subdir)
        
        # Summary
        logger.info(f"\n{'=' * 80}")
        logger.info("Processing Complete!")
        logger.info(f"Successfully processed: {self.processed_files} files")
        logger.info(f"Failed: {self.failed_files} files")
        logger.info(f"{'=' * 80}")


def main():
    """Main entry point for the script."""
    # Determine paths
    script_dir = Path(__file__).parent
    base_dir = script_dir.parent
    websites_path = base_dir / "websites"
    
    logger.info(f"Script directory: {script_dir}")
    logger.info(f"Websites directory: {websites_path}")
    
    # Create processor and run
    processor = WebpageProcessor(
        base_path=str(websites_path),
        max_workers=4
    )
    
    processor.process_all()


if __name__ == "__main__":
    main()

```


---
