# Plan Review: Alumni Page

## Summary
The plan is sound structurally — correct file paths, accurate component/import references, and sensible task ordering. Two issues need fixing: the footer instruction is redundant (adding to `navigation.main` already covers the footer via `.map()`), and the plan bakes in complete JSX without requiring the frontend-design skill for visual review and refinement.

## Codebase Accuracy
- ✅ `navigation.main` array in `shell.tsx` — correct location and structure
- ✅ `YearCard` exported from `app/routes/aktuelles/route.tsx`
- ✅ `YearSchema`, `PhotoSchema`, `PersonSchema` — all exist at referenced paths
- ✅ `loadQuery` from `@sanity/react-loader` — matches Jahrgänge import pattern
- ✅ `HeartHandshakeIcon` exists in installed lucide-react
- ✅ `Toc` component at `app/components/toc.tsx` — correct props shape
- ✅ `Divider` component at `app/components/ui/divider.tsx`
- ⚠️ `GraduationCapIcon` imported but unused in current Jahrgänge — plan correctly drops it

## Sequencing
Task order is correct. No hidden dependencies. Tasks 1–3 can proceed independently; Task 4 depends on Task 3 being done (so the alumni data is available somewhere). Task 5 depends on all prior tasks. Task 6 is a final sweep.

## Completeness
- ✅ Nav item added
- ✅ Ehrensache Walz content with all sections from docx
- ✅ Donation card with bank details
- ✅ Alumni year listings moved from Jahrgänge
- ✅ Jahrgänge simplified with link to Alumni
- ✅ E2E test
- ⚠️ Cross-link from Unterstützende page to `/alumni#ehrensache` — not in design doc, but would be natural. Optional.

## Granularity
Appropriate. Task 3 (create route) is the largest but it's a single file with hardcoded content + a loader — straightforward.

## Reuse Accuracy
- ✅ Correctly reuses `YearCard`, `Toc`, `Divider`
- ✅ Query is a clean subset of existing Jahrgänge query
- ✅ `YearSchema` redefined in new query file (matches pattern — each route has its own schema)

## Risk Areas
No significant technical risks. Static content + existing query pattern + existing components.

## Missing Concerns
None material for a static content page.

## Testability
- E2E test checks headings and IBAN visibility — sufficient for this page
- Typecheck and lint in Task 6 cover structural correctness

## Feasibility
Straightforward. ~30 minutes of execution time.

## Issues Found

### Issue 1: Redundant footer instruction (Task 1, Step 2)
The plan says to add a separate Alumni `<Link>` in the footer's secondary column. But the footer already renders `navigation.main.map(...)` — adding Alumni to the `navigation.main` array in Step 1 automatically adds it to the footer. Step 2 would create a duplicate. **Remove Step 2 from Task 1.**

### Issue 2: Frontend-design skill not referenced
The AGENTS.md rules say: "When brainstorming, planning, or implementing any frontend/UI work, read and follow the frontend-design skill." The plan contains complete JSX for a new page but doesn't instruct the implementing agent to use the frontend-design skill for visual review. The page should be visually checked after implementation — especially the donation card, which is the most important element on the page. **Add a task between Task 3 and Task 4 that uses the frontend-design skill to review the Alumni page in-browser and refine styling.**

## Recommendation
**Revise specific tasks:**
1. Remove Task 1 Step 2 (duplicate footer link)
2. Add a visual review task after Task 3 using the frontend-design skill
