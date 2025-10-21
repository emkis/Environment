#!/opt/homebrew/bin/bash

echo '#️⃣ Finding files to hash'

target_directory="$1" # Gets the target directory from the first argument
files=$(find "$target_directory" -type f) # Finds all files in the target directory recursively
file_count=$(echo "$files" | wc -l) # Counts the number of matching files

echo "#️⃣ Creating hashes for $file_count files"

# Create backup-metadata directory if it doesn't exist
# Pipe each file path into sha256sum to create its hash
# Writes the created file hash to checksums.txt file
mkdir -p "$target_directory/backup-metadata"
echo "$files" | tr '\n' '\0' | xargs -0 sha256sum > "$target_directory"/backup-metadata/checksums.txt

echo '✅ Created file hashes for all files'