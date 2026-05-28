# H-1B Join Validation Audit

**Purpose:** Prepare Step 4 validation for the existing `SEC_DOL_H1b_data_mapped.csv` entity-resolution join.
**Source file:** `SEC_DOL_H1b_data_mapped.csv`
**Deterministic sample seed:** `80`
**H-1B sample size:** `200`

## Local Finding

The repository does not contain raw DOL/LCA records, USCIS source records, original H-1B employer names, match scores, or match-method metadata. Because of that, this audit cannot estimate the true false-positive rate locally. It can only prepare the review sample and flag what must be checked manually or against external/source data.

## H-1B-Mapped Row Shape

| Metric | Value |
|---|---|
| Total companies in mapped CSV | 30,369 |
| Rows with H-1B fields populated | 1,557 (5.1%) |
| Rows with H-1B fields null | 28,812 (94.9%) |
| H-1B rows with website | 1,302 (83.6%) |
| Sample rows with website | 175 (87.5%) |
| Median approvals among H-1B rows | 10.0 |
| Median approval rate among H-1B rows | 100.0% |

## Top H-1B-Mapped States

| State | Rows |
|---|---|
| CA | 860 |
| NY | 257 |
| MA | 227 |
| WA | 87 |
| TX | 77 |
| IL | 49 |

## Top H-1B-Mapped Industries

| Industry | Rows |
|---|---|
| Other Technology | 829 |
| Other | 306 |
| Biotechnology | 156 |
| Other Health Care | 97 |
| Pharmaceuticals | 33 |
| Computers | 28 |
| Other Banking and Financial Services | 22 |
| Manufacturing | 20 |
| Other Energy | 19 |
| Telecommunications | 16 |
| Business Services | 14 |
| Insurance | 6 |

## Deterministic Sample

The full validation sample contains 200 rows selected from the 1,557 H-1B-mapped rows using seed `80`. Sample positions within the H-1B subset are:

5, 9, 17, 20, 24, 31, 33, 44, 50, 51, 52, 59, 80, 84, 99, 108, 112, 130, 140, 146, 147, 150, 162, 166, 199, 202, 208, 210, 223, 227, 231, 247, 255, 259, 268, 297, 298, 308, 309, 312, 322, 324, 326, 338, 339, 348, 349, 355, 356, 382, 383, 391, 402, 404, 405, 411, 418, 424, 434, 448, 451, 474, 495, 499, 501, 530, 532, 541, 546, 548, 555, 557, 562, 569, 571, 573, 575, 597, 599, 605, 610, 612, 621, 642, 645, 653, 658, 660, 663, 666, 683, 686, 696, 700, 702, 707, 710, 718, 724, 748, 749, 754, 756, 757, 766, 768, 771, 786, 791, 792, 798, 807, 813, 822, 823, 841, 846, 848, 860, 862, 881, 895, 896, 909, 924, 925, 943, 947, 958, 959, 975, 985, 991, 1008, 1018, 1024, 1032, 1039, 1041, 1081, 1085, 1091, 1092, 1110, 1116, 1117, 1121, 1123, 1127, 1129, 1132, 1141, 1152, 1153, 1159, 1162, 1178, 1187, 1196, 1206, 1214, 1220, 1234, 1237, 1250, 1265, 1266, 1271, 1273, 1278, 1282, 1295, 1299, 1322, 1323, 1326, 1327, 1331, 1345, 1347, 1371, 1373, 1382, 1409, 1413, 1421, 1426, 1444, 1449, 1451, 1457, 1463, 1501, 1511, 1517, 1519, 1530, 1550, 1553, 1554

## Manual Review Subset

Review at least the first 20-30 rows below. For each row, compare the company website, public company identity, and sponsored job titles against the original LCA/DOL employer identity if available. Fill `Verdict` with `same`, `different`, or `uncertain`.

| # | Company | Website | City | State | Approvals | Approval rate | Sponsored title signals | Verdict | Notes |
|---|---|---|---|---|---|---|---|---|---|
| 1 | 317 LABS INC | 317labs.com | Los Angeles | CA | 2.0 | 100.0 | Senior Engineer | Unverified |  |
| 2 | A10 NETWORKS INC | a10networks.com | SAN JOSE | CA | 106.0 | 96.36363636363636 | Solutions Architect; Staff Software Engineer; Senior Software Engineer; +3 more | Unverified |  |
| 3 | ACE-UP INC | aceup.com | BOSTON | MA | 2.0 | 100.0 | Business Intelligence Analyst | Unverified |  |
| 4 | ACLARITY INC | aclarity.com | Mansfield | MA | 2.0 | 100.0 | Water Process R&D Engineer | Unverified |  |
| 5 | ACTIONIQ INC | actioniq.com | NEW YORK | NY | 16.0 | 100.0 | Software Engineer; Software Engineer  | Unverified |  |
| 6 | ADARX PHARMACEUTICALS INC | adarxpharmaceuticals.com | San Diego | CA | 4.0 | 100.0 | Senior Scientist | Unverified |  |
| 7 | ADEPT ID INC | adept-id.com | SOMERVILLE | MA | 4.0 | 100.0 | Research Data Scientist | Unverified |  |
| 8 | AFFECTIVA INC | affectiva.com | WALTHAM | MA | 10.0 | 100.0 | Marketing Analytics Manager | Unverified |  |
| 9 | AIDORA INC | aidora.io | SAN FRANCISCO | CA | 2.0 | 100.0 | Chief Technology Officer | Unverified |  |
| 10 | AIERA INC | aiera.com | NEW YORK | NY | 102.0 | 100.0 | Product Manager; AI/DS Engineer; QA Automation Engineer | Unverified |  |
| 11 | AIFI INC | aifi.com | Burlingame | CA | 16.0 | 100.0 | Director, New Technologies; Sr Deployment Engineer  | Unverified |  |
| 12 | AKERO THERAPEUTICS INC | akerotherapeutics.com | South San Francisco | CA | 8.0 | 100.0 | Scientist, In Vivo | Unverified |  |
| 13 | AM BATTERIES INC | am-batteries.com | BILLERICA | MA | 6.0 | 100.0 | Senior Battery Engineer | Unverified |  |
| 14 | AMBERFLOIO INC | (missing) | Santa Clara | CA | 4.0 | 100.0 | PRODUCT MANAGER; Product Designer | Unverified |  |
| 15 | ANACONDA INC | anaconda.com | AUSTIN | TX | 12.0 | 100.0 | Sr. Software Engineer, Security | Unverified |  |
| 16 | ANROK INC | anrok.com | SAN FRANCISCO | CA | 10.0 | 100.0 | Financial Operations Analyst | Unverified |  |
| 17 | ANYSCALE INC | anyscale.com | San Francisco | CA | 92.0 | 95.83333333333334 | Software Engineer; Solutions Architect | Unverified |  |
| 18 | APTTUS CORP | apttus.com | SAN MATEO | CA | 68.0 | 100.0 | SOFTWARE ENGINEER; Product Security Engineer; Senior Legal Counsel; +6 more | Unverified |  |
| 19 | ARRCUS INC | arrcus.com | SAN JOSE | CA | 50.0 | 100.0 | SENIOR SOFTWARE ENGINEER; SOLUTIONS TEST ENGINEER | Unverified |  |
| 20 | ASANA INC | asana.com | SAN FRANCISCO | CA | 352.0 | 96.17486338797814 | Software Engineer; Marketing Analytics Manager; Product Designer ; +2 more | Unverified |  |
| 21 | ASAPP INC | asapp.com | New York | NY | 20.0 | 100.0 | Senior Engineering Manager  | Unverified |  |
| 22 | ASCUS BIOSCIENCES INC | ascusbiosciences.com | San Diego | CA | 90.0 | 100.0 | Scientist; Senior Enterprise Systems & Data Analyst; Manager, IT Validation; +1 more | Unverified |  |
| 23 | ATTACKIQ INC | attackiq.com | Los Altos | CA | 4.0 | 100.0 | Software Engineer; Security Data Scientist | Unverified |  |
| 24 | AUGUST HOME INC | augusthome.com | SAN FRANCISCO | CA | 8.0 | 100.0 | Senior Android Engineer; Quality Assurance Manager | Unverified |  |
| 25 | BARSTOOL SPORTS INC | barstoolsports.com | NEW YORK | NY | 4.0 | 100.0 | Senior Front-end Engineer | Unverified |  |
| 26 | BELFRY SOFTWARE INC | belfrysoftware.com | NEW YORK | NY | 2.0 | 100.0 | Senior Software Engineer | Unverified |  |
| 27 | BERKELEY RESEARCH GROUP HOLDINGS LLC | (missing) | EMERYVILLE | CA | 50.0 | 100.0 | Senior Associate | Unverified |  |
| 28 | BETTERUP INC | betterup.com | SAN FRANCISCO | CA | 30.0 | 93.75 | Senior Android Engineer; Senior Product Manager; Product Marketing Manager Extern; +1 more | Unverified |  |
| 29 | BLOCKFI INC | blockfi.com | New York | NY | 4.0 | 100.0 | Engineering Manager, Site Reliability Engineering; VP of Engineering; Director of Engineering | Unverified |  |
| 30 | BLUENALU INC | bluenalu.com | SAN DIEGO | CA | 4.0 | 100.0 | Food Technologist I | Unverified |  |

## Validation Rule

- If the manually reviewed false-positive rate is above 10%, rerun entity resolution with stronger evidence.
- If false positives are below 5%, keep the existing join and move on.
- Between 5% and 10%, preserve the existing join but add a confidence tier and avoid using low-confidence rows for `Proven` sponsorship scoring.

## Required Evidence Not Present Locally

- Raw LCA employer names.
- FEIN/EIN values for the SEC side.
- Match method, match score, and candidate alternatives used during the original join.
- SOC codes or raw job classification fields.

## Recommended Next Step

Before Step 5, locate or recreate the raw DOL/LCA source table used for the merge. Without raw employer names or match metadata, manual validation can only check plausibility, not the actual correctness of the join.
