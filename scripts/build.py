"""Build GitHub Pages files and index the photo folders using only Python."""
import json
import re
import shutil
from datetime import date
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
CATEGORIES = ("trips", "celebrations", "gatherings")
EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp", ".avif", ".gif"}

def readable(name):
    label = re.sub(r"[_-]+", " ", name).strip() or name
    return label[0].upper() + label[1:]

def photo_details(image, category, photos_root):
    relative = image.relative_to(photos_root)
    note_path = image.with_name(image.name + ".json")
    note = {}
    if note_path.exists():
        try:
            note = json.loads(note_path.read_text(encoding="utf-8-sig"))
            if not isinstance(note, dict):
                raise ValueError("expected a JSON object")
            for key in ("title", "caption", "alt", "date"):
                if key in note and not isinstance(note[key], str):
                    raise ValueError(f"{key} must be text")
            if "favorite" in note and not isinstance(note["favorite"], bool):
                raise ValueError("favorite must be true or false")
            if note.get("date"):
                note["date"] = date.fromisoformat(note["date"]).isoformat()
        except ValueError as error:
            raise SystemExit(f"Fix {note_path.relative_to(ROOT)}: {error}") from error

    event = " / ".join(readable(part) for part in relative.parts[1:-1])
    return {
        "path": relative.as_posix(),
        "category": category,
        "event": event or "Unsorted photos",
        "eventKey": relative.parent.as_posix(),
        "title": note.get("title", "").strip() or readable(image.stem),
        "caption": note.get("caption", "").strip(),
        "alt": note.get("alt", "").strip(),
        "date": note.get("date", ""),
        "favorite": note.get("favorite", False),
    }

def build():
    source = ROOT / "site"
    output = ROOT / "dist"
    photos_root = source / "photos"
    catalog = []

    for category in CATEGORIES:
        for image in sorted((photos_root / category).rglob("*")):
            if not image.is_file() or image.suffix.lower() not in EXTENSIONS:
                continue
            if any(part.startswith(".") for part in image.relative_to(photos_root).parts):
                continue
            catalog.append(photo_details(image, category, photos_root))

    catalog.sort(key=lambda photo: photo["path"].casefold())
    catalog.sort(key=lambda photo: photo["date"], reverse=True)
    if output.exists():
        shutil.rmtree(output)
    shutil.copytree(source, output, ignore=shutil.ignore_patterns("photos"))
    for photo in catalog:
        source_image = photos_root / photo["path"]
        target_image = output / "photos" / photo["path"]
        target_image.parent.mkdir(parents=True, exist_ok=True)
        shutil.copyfile(source_image, target_image)
    (output / "photos.json").write_text(json.dumps(catalog, ensure_ascii=False), encoding="utf-8")
    print(f"Built {len(catalog)} photos into {output}")

if __name__ == "__main__":
    build()
