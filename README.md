# FerNode website

The public site for **FerNode** by **FerKunGsXD**. Plain HTML, CSS and vanilla
JavaScript — no build step and no framework.

The site has two main jobs:

1. Offer the FerNode Windows app download, with version history and a SHA-256 checksum.
2. Offer the FerNode plugin library, with search, Minecraft version filtering and direct
   JAR downloads.

> **Brand note:** the website is branded FerNode. The current 1.2.1 app downloads still
> contain `Server Tool.exe` and use the original asset filenames. Rebuild and rename the app
> before changing those download paths.

## Files

```text
website/
├─ index.html                 homepage: app + plugins + gallery
├─ style.css                  light blue theme, layout, responsive states
├─ script.js                  version picker, plugin filters, checksums
├─ privacy.html               privacy policy (AdSense disclosure)
├─ ads.txt                    AdSense publisher authorization
├─ assets/
│  ├─ hero.webp               homepage hero artwork
│  ├─ gallery/                voxel artwork for the gallery cards
│  └─ plugins/                plugin demo videos
└─ downloads/
   ├─ Server-Tool-1.2.1-win-x64.zip     portable build (157 MB)
   ├─ Server Tool Setup 1.2.1.exe       NSIS installer (117 MB)
   └─ plugins/
      ├─ autorefill-1.1.0.jar
      ├─ ferkungstacker-1.3.0.jar
      ├─ ultratreefeller-1.1.0.jar
      ├─ FerNode-Plugins-1.0.0.zip      all three plugins + install notes
      └─ README.txt
```

Open `index.html` directly in a browser, or upload the folder to any static host
(GitHub Pages, Netlify, Cloudflare Pages, nginx).

## Plugin library

Plugin cards live in `index.html`. Each card carries:

- `data-category` — one of `Gameplay`, `Utility`, `Building`.
- `data-versions` — space-separated Minecraft versions the build supports.
- `data-search` — extra words used by the search box.
- `.plugin-download` — the direct JAR link.

`script.js` filters cards by search text, category and selected Minecraft version. If
JavaScript is unavailable, every plugin card and download link is still present in the HTML.

Current build targets:

| Plugin | Version | Minecraft | Java |
| --- | --- | --- | --- |
| AutoRefill | 1.1.0 | Paper/Spigot 1.21.x | 17+ |
| FerKunGStacker | 1.3.0 | Paper/Spigot 1.20.x – 1.21.x | 17+ |
| UltraTreeFeller | 1.1.0 | Paper/Spigot 1.21.x | 17+ |

To add a plugin, copy its JAR into `downloads/plugins/`, add a card, and update the bundle
ZIP if you want it included.

## App downloads

Release data lives at the top of `script.js`:

```js
{
  version: '1.2.1',
  zip: 'downloads/Server-Tool-1.2.1-win-x64.zip',
  exe: 'downloads/Server Tool Setup 1.2.1.exe',
  size: '157 MB',
  sha256: '72CEF577C9A8B3747F57BA0C78CC67BA0CD840C1E8033045243786242625C580',
  ...
}
```

The public GitHub Pages copy uses GitHub Release URLs so the large binaries are not stored
in the site repository. The local source copy points at `downloads/` for offline testing.

Versions with `zip: null` and `exe: null` show as `(archived)` and disable the download
buttons. The selected version is stored in `localStorage` and in `?v=…`.

## Google AdSense

- Publisher ID: `pub-1821900542837424`
- Client ID: `ca-pub-1821900542837424`
- Ad slot: `9015687951`

The loader is in the `<head>` of `index.html`; one responsive horizontal unit sits below
the gallery. `ads.txt` must be served from the domain root, so a custom domain is still
needed for AdSense verification.

AdSense does not fill ads on `localhost`; a local preview may show an empty container and a
`googleads` 400 message. That is expected until the site is served from its public domain.

## Notes

- The site is responsive and keyboard accessible.
- Videos are muted, play when they enter the viewport, and pause when they leave.
- The large app files are not committed to the GitHub Pages repository; they live in GitHub
  Releases. Plugin JARs are small enough to serve directly from the site.
