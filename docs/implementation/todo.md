# Blog Implementation Tasks

## 1. Activate Blog Posts
- [x] Analyzed existing 5 posts in `app/(post)/2025/`
- [ ] Populate `posts.json` with all 5 posts (id, date, title, series)
- [ ] Uncomment Blog link in `app/header.tsx`

## 2. Series Support
- [ ] Add `series` field to post data type in `get-posts.ts`
- [ ] Create series configuration file `app/series.ts`
- [ ] Update `posts.tsx` with series filter dropdown
- [ ] Create `SeriesBadge` component for post listings
- [ ] Display series badge in post header

## 3. YouTube Video Template
- [ ] Document existing YouTube component usage
- [ ] Create MDX template with YouTube video at top
- [ ] Add example in post template

## 4. Firebase Integration
- [ ] Install Firebase SDK (`firebase` package)
- [ ] Create `app/firebase.ts` configuration
- [ ] Create `env.example.txt` with Firebase config vars
- [ ] Migrate `get-posts.ts` to use Firebase instead of Redis
- [ ] Migrate `app/api/view/route.ts` to Firebase

## 5. Cleanup
- [ ] Remove or keep Redis as fallback
- [ ] Update product documentation

## 6. Testing & Verification
- [ ] Run dev server and verify posts appear
- [ ] Test series filtering
- [ ] Test view counting with Firebase
