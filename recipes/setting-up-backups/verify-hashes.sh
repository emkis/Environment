#!/opt/homebrew/bin/bash

echo "🔍 Verifying file integrity against stored hashes"
echo # Break line

target_directory="$1" # Gets the target directory from the first argument
sha256sum -c "$target_directory"/backup-metadata/checksums.txt # Compare file hashes with previously generated hashes

echo # Break line
echo "✅ Hash verification completed"