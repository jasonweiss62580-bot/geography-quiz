# Decision Log

## 2026-09-22, Touch-screen hover highlights
**What was decided:** Hover styles on multiple choice options and Matching items only apply under `@media (hover: hover)`.
**Why:** On touch screens, `:hover` sticks to the last tapped spot, so the next question's button in that position looked selected.
**What was rejected:** Resetting selection state or blurring the button, because neither was the cause (selection state already reset correctly).

## 2026-09-22, Hover color left as is
**What was decided:** Keep the lavender hover/selected color (#ede9fe).
**Why:** It is violet-100 and matches the current "Clean Modern" violet theme; the earlier concern assumed the older Atlas Dark theme, which was replaced.
**What was rejected:** Changing the color. Moving it into a theme.css token is still an open option (no visual change).

## 2026-09-22, Africa class quiz picker
**What was decided:** When Africa is selected, show the region chips plus a "Class quizzes" row (Quiz 1 to Quiz 8) matching the class Africa Study Guide. Quiz sets are fixed country lists (`STUDY_SETS` in world-regions.ts); Quiz 6 spans Middle and Southern Africa.
**Why:** The class is tested quiz by quiz, and the quizzes do not line up with regions.
**What was rejected:** Quiz chips only (loses whole-region practice).

## 2026-09-22, Africa data matches the study guide
**What was decided:** Zambia, Malawi, Mozambique, and Zimbabwe moved to Eastern Africa; regions labeled North, Eastern, Middle, Southern, Western Africa; names "The Gambia", "Democratic Republic of the Congo", "Republic of the Congo".
**Why:** Practice should match what she is tested on.
**What was rejected:** Keeping the app's previous regions and names.

## 2026-09-22, Countries with more than one capital
**What was decided:** The official capital is the displayed answer, with others noted ("Porto-Novo (also Cotonou)"). Any listed capital counts as correct when typed. Applies to Benin, Burundi, Côte d'Ivoire, and South Africa (`altCapitals`).
**Why:** The study guide lists the de facto and additional capitals.
**What was rejected:** Official capital only; the full guide text as the answer.

## 2026-09-22, Extra Credit water features deferred
**What was decided:** Extra Credit (#55-67: oceans, seas, gulfs, lakes, rivers, Suez Canal) is a separate future project.
**Why:** It needs new map data and a new question type, since these features have no capitals and aren't in the country map.
**What was rejected:** Building it in the same change; skipping it entirely.

## 2026-09-22, Spelling ignores accents and apostrophes
**What was decided:** Typed answers are compared ignoring case, accents, and apostrophes of any style (`normalizeAnswer` in src/lib/levenshtein.ts), for both exact and "close" matching, in US and World quizzes.
**Why:** iPad keyboards type curly apostrophes and accented letters are hard to type, so correct answers like N'Djamena and Lomé were being marked wrong.
**What was rejected:** Relying on the "allow close answers" setting, which only partly covered it and is off by default.

## 2026-09-22, Class quizzes filtered by region
**What was decided:** The "Class quizzes" row shows only the quizzes for the selected region chip (All Africa shows all eight). Quiz 6 appears under both Middle and Southern Africa. The chosen quiz is stored separately from the region (`selectedStudySet`), so the region chip stays highlighted; tapping a region clears the quiz, and tapping the chosen quiz again returns to the whole region.
**Why:** Makes it quicker to find the right quiz and keeps the region context visible.
**What was rejected:** Always showing all quizzes grouped under region headings (takes more space and wasn't what was asked).

## 2026-09-29, Class quiz chips are multi-select
**What was decided:** Class quiz chips toggle on and off, so several can be chosen at once (e.g. Quiz 1 to 4) and the quiz draws from all of them. None chosen means the whole region. Stored as `selectedStudySets`; the quiz region id joins them in study guide order ('africa-quiz-1+africa-quiz-2'), so each combination keeps its own high score. The map zooms to the single region the chosen quizzes share, otherwise to all of Africa.
**Why:** Holland's class quizzes are cumulative.
**What was rejected:** A "cumulative" shortcut where tapping Quiz 4 selects Quiz 1 to 4 (not what was asked; still an option). Keeping chosen quizzes when switching region chips (quizzes outside the new region would be selected but hidden).
