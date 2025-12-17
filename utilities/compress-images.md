# Compress images
Many times when I'm backing up images from my camera, I don't need their full quality, so I want to batch compress them before backing them up in the cloud.

```bash
find . -maxdepth 1 -iname "*.jpg" | sed 's/\.jpg$//i' | xargs -I {} ffmpeg -i "{}.JPG" -qscale:v 3 "{}_compressed.jpg"
```

## Explanation

1. Find all JPG files in the current directory
```bash
find . -maxdepth 1 -iname "*.jpg"
```

2. Remove the ".jpg" extension from the filenames
```bash
sed 's/\.jpg$//i' # SONY_ABC123.JPG -> SONY_ABC123
```

3. Iterate on each file using xargs
```bash
xargs -I {}
```

4. Rename the compressed files to have a "_compressed" suffix
```bash
xargs -I {} ffmpeg -i "{}.JPG" -qscale:v 3 "{}_compressed.jpg"
```
