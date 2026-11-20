# Navigation — small fixes

## Intent

The navigation's three forms stay. A reappearing bar for small screens was
prototyped (https://claude.ai/artifact/1aWC3pvEkKFwKo3rZYBREv) and Ferdinand
chose to keep today's behaviour: the header scrolls away with the page. What
remains are four fixes that make the navigation calmer and clearer at every
width.

## Goals

1. **Phone menu over the page:** below 768px the menu opens as a panel over the
   page instead of pushing it down by about 280px. Choosing a page, tapping
   outside or Escape (focus back to the button) closes it.
2. **Current page in the phone menu:** the same 3px orange bar as the left
   navigation from 1160px.
3. **No "Startseite" entry:** the logo is the link home. It becomes
   keyboard-reachable and is named "Walz Startseite". Five links instead of six;
   the blue house icon between 768 and 1159px goes away.
4. **"Über uns"** in navigation and footer, like the page title.

## Non-goals

- No sticky or reappearing header below 1160px (prototyped, not chosen).
- No change to the breakpoints of the three forms.

## Approaches

- Menu panel: absolutely positioned under the logo row inside the header, which
  already contains it. Rejected alternative: a full-screen sheet, which is more
  than five links need.

## Left to the builder

- Tests: closing on choice, outside tap and Escape; the logo as the
  keyboard-reachable home link; the menu not moving the page.
