# Compress images

Batch compress camera JPGs in the current directory before uploading them to the cloud. Writes `<name>_compressed.jpg` next to each original.

```bash
find . -maxdepth 1 -iname "*.jpg" | sed 's/\.jpg$//i' | xargs -I {} ffmpeg -i "{}.JPG" -qscale:v 3 "{}_compressed.jpg"
```

- `find ... -iname "*.jpg"`: JPGs in the current directory, any case.
- `sed 's/\.jpg$//i'`: strip the extension (`SONY_123.JPG` -> `SONY_123`).
- `ffmpeg -qscale:v 3`: re-encode at quality 3 (lower number means better quality, range 2 to 31).

The input is hardcoded as `.JPG` (uppercase, as Sony cameras write it).
