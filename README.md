# The Weekend Roll

A static photo journal for GitHub Pages. Drop images into a gallery folder and push to `main`. The included GitHub Actions workflow updates the photo index and publishes the site.

## Publish on GitHub Pages

1. Extract the ZIP. Put the **contents** of the extracted project folder at the root of your GitHub repository on the `main` branch. Include the hidden `.github` folder, which contains the publishing workflow.
2. On GitHub, open **Settings → Pages**. Under **Build and deployment**, set **Source** to **GitHub Actions**.
3. Open **Actions → Publish to GitHub Pages → Run workflow** if the first push happened before you enabled Pages. Subsequent pushes to `main` run it automatically.
4. When the deployment succeeds, copy the live URL from **Settings → Pages**. A typical project URL looks like `https://YOUR-USERNAME.github.io/YOUR-REPOSITORY/`.

[GitHub Pages publishing instructions](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)

## Add photos and captions

Drop photos into `site/photos/trips/`, `site/photos/celebrations/`, or `site/photos/gatherings/`. You can create an event folder inside a category, such as `site/photos/trips/Weekend in Chicago/`. The gallery groups photos by folder, and the Galleries table counts photos and events. Supported formats are JPG, JPEG, PNG, WebP, AVIF, and GIF.

To add a caption, go to **Add a photo note** in the site's footer. Enter the exact image filename and an image description. The title, date, caption, and Favorites checkbox are optional. Download the note and put it in the same folder as the photo. Commit both files. You can also edit the note in VS Code. Each photo has one note.

For example, `River Walk.JPG` and `River Walk.JPG.json` go side by side. The note might look like this:

```json
{
  "title": "River Walk",
  "caption": "First stop on our Saturday trip.",
  "alt": "Friends walking on a paved path beside the river.",
  "date": "2026-11-22",
  "favorite": true
}
```

The caption is visible on the photo card and in the full-size viewer. The image description is read by assistive technology. If you skip the note, the gallery still displays the photo and uses its filename as the title. Add meaningful image descriptions for photos you publish. Home shows up to three photos, ordered by date with undated photos after dated photos. Favorites links back to each photo's gallery.

The sample collage is in `site/photos/trips/Sample roll/`. Delete that folder when you're ready to replace the sample with your own pictures. The form works entirely in your browser. Each note becomes public when you commit it and Pages redeploys.

## Folder guide

| Path | What it contains |
| --- | --- |
| `site/` | Home, Galleries, Favorites, About, and photo note form HTML |
| `site/galleries/` | Trips, Celebrations, and Gatherings HTML |
| `site/css/` | The shared external stylesheet |
| `site/js/` | Gallery, photo viewer, table, and photo note behavior |
| `site/photos/` | Your images and optional notes |
| `scripts/build.py` | Photo indexing and static output generation |
| `.github/workflows/pages.yml` | GitHub Pages deployment |
| `submission/` | Accessibility audit PDF to update after deployment |

## Preview locally

From the project folder, run these two commands, then open http://localhost:8000 in your browser. Run the build command again when you change files. On Windows, you can replace `python3` with `py -3`.

```sh
python3 scripts/build.py
python3 -m http.server 8000 --directory dist
```

## Finish the accessibility submission

The included PDF documents the local build using axe-core in Chromium. Once the GitHub Pages URL is live, run Lighthouse for both `photo-note.html` and `galleries.html` on that URL. In Chrome DevTools, open **Lighthouse**, select **Navigation**, **Desktop**, and **Accessibility**, then analyze each page. Use the two live audit screenshots and replace the local URL and findings in your submitted PDF as needed. Submit the live site URL alongside the PDF.

[Chrome DevTools Lighthouse instructions](https://developer.chrome.com/docs/devtools/accessibility/contrast#lighthouse)
# Photo-Gallary
