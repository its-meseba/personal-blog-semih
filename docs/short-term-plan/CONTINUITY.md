# Continuity Ledger

## Goal (incl. success criteria)
Activate blogs for the personal blog web app with:
1. Populated `posts.json` with all 5 existing posts ✅
2. Blog series support with filtering and badges ✅
3. Optional YouTube video at the top of posts (with template) ✅
4. All content in English ✅
5. Firebase integration for view counting (replacing Redis/Upstash) ✅
6. `env.example.txt` for Firebase configuration ✅

## Constraints/Assumptions
- Keep existing MDX post structure with metadata export pattern
- Replace Upstash Redis with Firebase Realtime Database for view counts
- Series should be optional - posts can exist without a series
- YouTube video integration already exists as `YouTube` component

## Key decisions
- Used Firebase Realtime Database for simple view counting (key-value like Redis)
- Added `series` field to post metadata in `posts.json`
- Created series filter dropdown and badge component in posts list
- Kept Redis as potential fallback (file not deleted)

## State
- Done:
  - ✅ Populated `posts.json` with 5 posts
  - ✅ Enabled Blog link in header
  - ✅ Created `series.ts` config and `SeriesBadge.tsx` component
  - ✅ Added series filter and badges to `posts.tsx`
  - ✅ Added series badge to post header
  - ✅ Created `POST_TEMPLATE.md` for YouTube integration docs
  - ✅ Installed Firebase SDK and created `firebase.ts`
  - ✅ Created `env.example.txt`
  - ✅ Migrated `get-posts.ts` and `api/view/route.ts` to Firebase
  - ✅ Verified all features in browser
- Now:
  - Task complete
- Next:
  - User to configure Firebase credentials for production

## Open questions (UNCONFIRMED if needed)
- None

## Working set (files/ids/commands)
All files updated successfully.
