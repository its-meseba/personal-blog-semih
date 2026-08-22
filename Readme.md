# Mehmet Semih Babacan - Personal Thoughts

This is the thoughts site that powers `mehmetsemihbabacan.com`, built on
[next.js](https://nextjs.org/) and
deployed to the cloud via [Vercel](https://vercel.com).

## About Mehmet Semih Babacan

Mehmet Semih Babacan is a visionary tech entrepreneur from Turkey. As co-founder and Software Architecture & Systems Lead at Solace, he is pioneering AI-driven "smart" home solutions through the flagship initiative "Anlayan Ev" (Understanding Home).

### Highlights

- **Academic Background**: Dual degrees in Industrial Engineering and Computer Engineering from Yıldız Technical University
- **Research Experience**: Blockchain research at TÜBİTAK BİLGEM's UEKAE Blockchain Research Laboratory
- **Current Venture**: Co-founder of Solace (2023-Present), developing AI-driven smart home solutions
- **Previous Work**: Contributions to SismEQ (AI-powered disaster response system) and experience at Cezeri AI and Robotics
- **GitHub**: [its-meseba](https://github.com/its-meseba)

## How to run

First, install [Vercel CLI](https://vercel.com/download).

### Development

```
vc dev
```

### Deployment

#### Staging

```bash
vc
```

This is the equivalent of submitting a PR with the [GitHub integration](https://vercel.com/github)

#### Production

```bash
vc --prod
```

This is the equivalent of `git push` to `master` (or merging a PR to master)

## Architecture

### Pure components

Every stateless pure component is found under `./components`.

Every component that has to do with styling the post's markup
is found under `./components/post/`

These components make up the _style guide_ of the application.

### Thought posts

Every thought post is a static page hosted under `pages/$year/`.

This allows every post to load arbitrary modules, have custom layouts
and take advantage of automatic code splitting and lazy loading.

This means that the bloat of a single post doesn't "rub off on" the
rest of the site.

An index of all posts is maintained in JSON format as `./posts.json`
for practical reasons.
