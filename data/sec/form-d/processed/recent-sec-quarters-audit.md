# Recent SEC Form D Quarter Refresh Audit

**Audit date:** 2026-05-28
**User-Agent used for SEC download:** `Bear Brown bear@bearbrown.co`
**Refresh quarters:** `2025Q2`, `2025Q3`, `2025Q4`, `2026Q1`

## Summary

The four requested SEC Form D quarters were downloaded, extracted, and
processed with the maintained pipeline in `SCRIPTS/sec/`.

| Quarter | Processed JSON | Companies | Related persons | JSON size |
|---|---|---:|---:|---:|
| 2025Q2 | `companies_sec_2025Q2_d.json` | 13,325 | 47,975 | 31 MB |
| 2025Q3 | `companies_sec_2025Q3_d.json` | 14,138 | 47,875 | 32 MB |
| 2025Q4 | `companies_sec_2025Q4_d.json` | 14,885 | 52,362 | 34 MB |
| 2026Q1 | `companies_sec_2026Q1_d.json` | 15,981 | 54,231 | 36 MB |
| **Total** |  | **58,329** | **202,443** | **133 MB** |

Raw ZIP files are in `data/sec/form-d/raw/`.
Extracted TSV folders are in `data/sec/form-d/extracted/`.
Processed JSON files are in `data/sec/form-d/processed/`.

## FEIN Finding

`sec_all_quarters.py` now captures `company.fein` if a FEIN-like column exists,
but the refreshed SEC Form D TSV files do **not** include a FEIN/EIN column.

The `ISSUERS.tsv` header for all four refreshed quarters has 23 columns:

```text
ACCESSIONNUMBER, IS_PRIMARYISSUER_FLAG, ISSUER_SEQ_KEY, CIK, ENTITYNAME,
STREET1, STREET2, CITY, STATEORCOUNTRY, STATEORCOUNTRYDESCRIPTION, ZIPCODE,
ISSUERPHONENUMBER, JURISDICTIONOFINC, ISSUER_PREVIOUSNAME_1,
ISSUER_PREVIOUSNAME_2, ISSUER_PREVIOUSNAME_3, EDGAR_PREVIOUSNAME_1,
EDGAR_PREVIOUSNAME_2, EDGAR_PREVIOUSNAME_3, ENTITYTYPE, ENTITYTYPEOTHERDESC,
YEAROFINC_TIMESPAN_CHOICE, YEAROFINC_VALUE_ENTERED
```

Result:

| Quarter | Rows with `company_name_normalized` | Rows with `fein` |
|---|---:|---:|
| 2025Q2 | 13,325 | 0 |
| 2025Q3 | 14,138 | 0 |
| 2025Q4 | 14,885 | 0 |
| 2026Q1 | 15,981 | 0 |

## Top States by Quarter

| Quarter | Top states |
|---|---|
| 2025Q2 | NY 2,171; CA 1,675; TX 981; WA 828; E9 818 |
| 2025Q3 | NY 2,276; CA 1,644; TX 1,137; WA 866; DE 841 |
| 2025Q4 | NY 2,359; CA 1,890; TX 1,140; DE 1,000; WA 970 |
| 2026Q1 | NY 2,583; CA 1,894; TX 1,199; DE 1,131; FL 919 |

## Top Industries by Quarter

| Quarter | Top industries |
|---|---|
| 2025Q2 | Pooled Investment Fund 8,388; Other 1,185; Other Technology 957; Commercial 473; Other Real Estate 462 |
| 2025Q3 | Pooled Investment Fund 8,553; Other 1,259; Other Technology 1,038; Commercial 601; Other Real Estate 581 |
| 2025Q4 | Pooled Investment Fund 9,147; Other 1,374; Other Technology 956; Other Real Estate 569; Commercial 548 |
| 2026Q1 | Pooled Investment Fund 10,281; Other 1,178; Other Technology 934; Other Real Estate 612; REITS and Finance 554 |

## Notes for the Refactor

- The refresh generated raw SEC filings, not the filtered startup master dataset.
- `company_name_normalized` is now available for downstream entity resolution.
- FEIN cannot be extracted from these SEC Form D datasets unless another SEC file
  or external source supplies it.
- The high share of `Pooled Investment Fund` rows confirms that filtering still
  needs to run before these records are used as active hiring targets.
