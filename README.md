# infernokun.github.io

Source for [infernokun.github.io](https://infernokun.github.io/): write-ups of my projects, mods and homelab experiments.

Built with [Hugo](https://gohugo.io/) and the [Blowfish](https://blowfish.page/) theme, pulled in as a Hugo module, with a custom red and black color scheme (`assets/css/schemes/inferno.css`), styles (`assets/css/custom.css`) and homepage (`layouts/partials/home/custom.html`).

## Run it locally

Needs Hugo extended 0.168.0 or newer, and Go (Hugo uses it to fetch the theme).

```
hugo server
```

Then open http://localhost:1313/.

## Write a post

Each project is a folder under `content/projects/` with an `index.md` and its images next to it. The `featureimage` field in the front matter is the card and header image.

## Publishing

Pushing to `master` runs `.github/workflows/deploy.yml`, which builds the site and pushes the result to the `gh-pages` branch. GitHub Pages serves that branch. A second workflow checks for theme updates once a week.
