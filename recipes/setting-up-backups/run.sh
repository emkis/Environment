#!/opt/homebrew/bin/bash

target_directory="$1" # Gets the target directory from the first argument
dirname=$(cd "$(dirname "${BASH_SOURCE}")"; pwd -P) # Current directory
checksums_file="$target_directory/backup-metadata/checksums.txt" # Checksums file path

# Validate that target directory is provided
if [ -z "$target_directory" ]; then
    echo "❌ Error: Please provide the target directory path as an argument"
    echo "👉 Usage: $0 /path/to/external/drive"
    exit 1
fi

# Check if target directory exists
if [ ! -d "$target_directory" ]; then
    echo "❌ Error: Directory '$target_directory' does not exist"
    exit 1
fi

# Check if checksums file exists
if [ -f "$checksums_file" ]; then
    echo "📁 Found existing checksums file"
    "$dirname/verify-hashes.sh" "$target_directory"
else
    echo "📝 No checksums file found"
    "$dirname/create-hashes.sh" "$target_directory"
fi

