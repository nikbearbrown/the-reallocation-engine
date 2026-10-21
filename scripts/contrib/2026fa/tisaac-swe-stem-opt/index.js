import fs from 'fs';
import path from 'path';
import { execFileSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Usage (from repo root):
//   node scripts/contrib/2026fa/tisaac-swe-stem-opt/index.js [--fixture <jobs.json>] [--out-dir <dir>]
// Defaults: the fixture in this folder, outputs written into this folder.
const args = process.argv.slice(2);
function argValue(flag, fallback) {
    const i = args.indexOf(flag);
    return i >= 0 && args[i + 1] ? path.resolve(args[i + 1]) : fallback;
}

// Paths
const FIXTURE_PATH = argValue('--fixture', path.join(__dirname, 'fixture.json'));
const OUT_DIR = argValue('--out-dir', __dirname);
const OUTPUT_JSON_PATH = path.join(OUT_DIR, 'my-roles.json');
const REPO_ROOT = path.resolve(__dirname, '../../../../');
const CSV_PATH = path.join(REPO_ROOT, 'data/80-days-to-stay/80-days-csv/mapped_student_employment_targets_v3.csv');
const SCORER_PATH = path.join(REPO_ROOT, 'scripts/score/role-scorer.mjs');

// Supported ATS hosts (the only URLs the recipe treats as parseable).
const ATS_HOSTS = ['greenhouse.io', 'lever.co'];

// System-level failure: stop the whole run, never write a partial output.
function halt(message) {
    console.error(`❌ ${message}`);
    process.exit(1);
}

console.log("🚀 Starting SWE STEM-OPT Prototype...");

// 1. Read Fixture
if (!fs.existsSync(FIXTURE_PATH)) halt(`Fixture not found: ${FIXTURE_PATH}`);
const jobs = JSON.parse(fs.readFileSync(FIXTURE_PATH, 'utf-8'));
console.log(`Loaded ${jobs.length} test jobs from ${path.relative(REPO_ROOT, FIXTURE_PATH)}.`);

// Every job must carry the person's own inputs; a missing value is never filled in.
for (const job of jobs) {
    for (const field of ['id', 'company', 'title', 'url', 'fit', 'timeline']) {
        if (job[field] === undefined || job[field] === null || job[field] === '') {
            halt(`Job ${job.id ?? '(no id)'} is missing "${field}" in the fixture — refusing to invent a value.`);
        }
    }
}

// 2. Read Real Repo CSV Data
if (!fs.existsSync(CSV_PATH)) halt(`Sponsorship CSV not found: ${CSV_PATH}`);
const csvData = fs.readFileSync(CSV_PATH, 'utf-8');
function parseCSV(text) {
    const lines = text.trim().split('\n');
    const headers = lines[0].split(',');
    return lines.slice(1).map(line => {
        const values = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
        const obj = {};
        headers.forEach((h, i) => obj[h] = values[i] ? values[i].replace(/^"|"$/g, '') : '');
        return obj;
    });
}
const records = parseCSV(csvData);

// Create a lookup map for faster searching
const companyMap = new Map();
records.forEach(row => {
    companyMap.set(row.company_name.trim().toUpperCase(), row);
});

// 3. Process each job based on Recipe logic
const noMatched = [];
const evaluatedRoles = jobs.map(job => {
    const roleId = job.id;
    const companyUpper = job.company.trim().toUpperCase();

    // Evaluate Data Layer (H-1B / Funding)
    let sponsorship;
    if (companyMap.has(companyUpper)) {
        const data = companyMap.get(companyUpper);
        if (data['Total Approvals'] && parseInt(data['Total Approvals']) > 0) {
            // Bonus points for H1B history
            sponsorship = { "p": 0.8, "tier": "h1b-history", "source": "record" };
        } else if (data['total_funding'] && parseFloat(data['total_funding']) > 0) {
            // Bonus points for recent funding (Proxy for no freeze)
            sponsorship = { "p": 0.4, "tier": "form-d-funding", "source": "record" };
        } else {
            // Found in the CSV, and the record shows neither signal.
            sponsorship = { "p": 0.0, "tier": "none", "source": "record" };
        }
    } else {
        // Not in the CSV: 0 is this persona's rule ("not a deduction if missing"), not a record.
        sponsorship = { "p": 0.0, "tier": "no-matched", "source": "your-input" };
        noMatched.push(job.company);
    }

    // Evaluate Liveness (offline: nothing is fetched, so this is an assumption, not a record)
    let livenessFactor = 1.0;
    if (!ATS_HOSTS.some(host => job.url.includes(host))) {
        // Trigger our custom Exception condition for non-ATS domains
        livenessFactor = -1.0;
        console.warn(`[WARNING] Job ${roleId} triggered a Parsing Exception! (-1 Error: not a supported ATS URL)`);
    }

    // Format output matching scorer schema
    return {
        "role_id": roleId,
        "company": job.company,
        "title": job.title,
        "sponsorship": sponsorship,
        "fit": { "p": job.fit, "source": "your-input" },
        "liveness": { "factor": livenessFactor, "source": "your-input" },
        "timeline": { "factor": job.timeline, "source": "your-input" }
    };
});

if (noMatched.length > 0) {
    console.log(`[no-matched] Not found in the 80-days CSV (sponsorship 0, labeled your-input): ${noMatched.join(', ')}`);
}

// 4. Save output
fs.mkdirSync(OUT_DIR, { recursive: true });
fs.writeFileSync(OUTPUT_JSON_PATH, JSON.stringify(evaluatedRoles, null, 2));
console.log(`✅ Saved evidence tagged output to ${path.relative(REPO_ROOT, OUTPUT_JSON_PATH)}`);

// 5. Run the Professor's Engine
try {
    console.log("⚙️ Calling role-scorer.mjs...");
    execFileSync('node', [SCORER_PATH, OUTPUT_JSON_PATH, '--out-dir', OUT_DIR], { cwd: REPO_ROOT, stdio: 'inherit' });
    console.log("🎉 Run complete!");
} catch (error) {
    halt(`Scorer failed: ${error.message}`);
}
