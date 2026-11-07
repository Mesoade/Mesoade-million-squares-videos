# The Million Squares: videos

Remotion edits for The Million Squares short-form videos. This repo is kept
separate from the website repo on purpose: it isn't connected to Vercel.

- `CLAUDE.md` is the house style guide: constants, defaults, the scene
  library and the workflow. Read it before starting a new video.
- `src/shared/` holds the reusable kit: theme, B-roll `Panel`, `Sfx`, layout
  and UI helpers.
- `src/videos/<video>/` holds one folder per video. The first is `day6/`.

## Run

1. Put the raw clip at `public/<video>/source.mp4`, e.g. `public/day6/source.mp4`.
   Source clips are git-ignored because of their size.
2. `npm i`
3. Preview with `npx remotion studio`. Render with `npx remotion render Day6 out/day6-edited.mp4`.

`scripts/make-sfx.sh` regenerates the sound effects. `scripts/contact-sheet.sh`
turns a clip into timestamped frame sheets, which is useful for reading
captions and measuring the framing.
