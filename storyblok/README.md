# Storyblok schema

This folder holds the Storyblok component schema as JSON so it lives in git and can be pushed/pulled with one command.

## One-time setup

1. Install the Storyblok CLI globally:
   ```
   npm install -g storyblok
   ```
2. Log in (you'll be prompted for your **personal access token** and region):
   ```
   storyblok login
   ```
   - Token: `https://app.storyblok.com/#/me/account?tab=token`
   - Region: `eu` or `us` — must match your space
3. Find your **space ID**: Space → Settings → General.

## Push the schema to Storyblok

Populate a fresh space with all component types:

```
SB_SPACE_ID=123456 npm run storyblok:push
```

Replace `123456` with your space ID. Running it again updates existing components in place (idempotent).

## Pull the schema back from Storyblok

If you edit components in the Storyblok UI, round-trip the changes into git:

```
SB_SPACE_ID=123456 npm run storyblok:pull
```

## What gets created

See [components.json](components.json). Six components:

- `post` — blog article (root)
- `page` — generic page with richtext body and optional blocks (root)
- `author` — author profile (root)
- `category` — category definition (root)
- `site_config` — singleton for site metadata + navigation (root)
- `nav_link` — nestable block used inside `site_config.navigation`

## Content to create in the UI after push

The CLI only creates the schema — you still create the actual stories once:

1. Create folders at root: `posts/`, `pages/`, `authors/`, `categories/`.
2. Create an `author` story in `authors/` with slug `author-1`.
3. Create `category` stories in `categories/` with slugs `cat-1`, `cat-2` (matching the existing data).
4. Create a single `site_config` story at root with slug `site-config`.
5. Create `page` stories at `pages/about` and `pages/cv` (optional — pages render hardcoded content if missing).
6. Create `post` stories at `posts/<slug>` — one per blog article.
