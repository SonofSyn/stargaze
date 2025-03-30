#!/bin/bash

# Project Structure Mapper
# Maps directory structure and outputs in Markdown format

# Default values
OUTPUT_FILE="project_structure.md"
MAX_DEPTH=4
IGNORE_DIRS=".git node_modules dist .idea .vscode __pycache__ .DS_Store"
IGNORE_FILES=".gitignore .DS_Store"
START_PATH="."
INCLUDE_FILES=true

# Function to print usage information
usage() {
    echo "Usage: $0 [options]"
    echo "Options:"
    echo "  -h, --help                Show this help message"
    echo "  -o, --output FILE         Output to specified file (default: project_structure.md)"
    echo "  -d, --depth NUMBER        Maximum depth to traverse (default: 4)"
    echo "  -p, --path DIRECTORY      Start path (default: current directory)"
    echo "  --ignore-dirs PATTERNS    Space-separated list of directories to ignore"
    echo "  --ignore-files PATTERNS   Space-separated list of files to ignore"
    echo "  --dirs-only               Only include directories, not files"
}

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
    -h | --help)
        usage
        exit 0
        ;;
    -o | --output)
        OUTPUT_FILE="$2"
        shift 2
        ;;
    -d | --depth)
        MAX_DEPTH="$2"
        shift 2
        ;;
    -p | --path)
        START_PATH="$2"
        shift 2
        ;;
    --ignore-dirs)
        IGNORE_DIRS="$2"
        shift 2
        ;;
    --ignore-files)
        IGNORE_FILES="$2"
        shift 2
        ;;
    --dirs-only)
        INCLUDE_FILES=false
        shift
        ;;
    *)
        echo "Unknown option: $1"
        usage
        exit 1
        ;;
    esac
done

# Check if start path exists
if [ ! -d "$START_PATH" ]; then
    echo "Error: Directory '$START_PATH' does not exist"
    exit 1
fi

# Resolve full path
START_PATH=$(cd "$START_PATH" && pwd)

# Create ignore patterns for find command
FIND_IGNORE_DIRS=""
for dir in $IGNORE_DIRS; do
    FIND_IGNORE_DIRS="$FIND_IGNORE_DIRS -not -path '*/$dir/*' -not -path '*/$dir' -not -path '$dir/*' -not -path '$dir'"
done

FIND_IGNORE_FILES=""
for file in $IGNORE_FILES; do
    FIND_IGNORE_FILES="$FIND_IGNORE_FILES -not -name '$file'"
done

# Write header to output file
echo "# Project Structure: $(basename "$START_PATH")" >"$OUTPUT_FILE"
echo "" >>"$OUTPUT_FILE"
echo "Generated on $(date)" >>"$OUTPUT_FILE"
echo "" >>"$OUTPUT_FILE"
echo "## Directory Structure" >>"$OUTPUT_FILE"
echo "" >>"$OUTPUT_FILE"

# Function to generate indentation based on depth
generate_indent() {
    local depth=$1
    local indent=""
    for ((i = 0; i < depth; i++)); do
        indent="$indent  "
    done
    echo "$indent"
}

# Function to process directories recursively
process_directory() {
    local dir=$1
    local depth=$2
    local parent_depth=$3

    # Skip if we've exceeded max depth
    if [ "$depth" -gt "$MAX_DEPTH" ]; then
        return
    fi

    # Check if this directory should be ignored
    local basename=$(basename "$dir")
    for ignore_dir in $IGNORE_DIRS; do
        if [ "$basename" = "$ignore_dir" ]; then
            return
        fi
    done

    local indent=$(generate_indent "$parent_depth")
    local rel_path="${dir#$START_PATH/}"

    # If it's not the root directory, output the directory name
    if [ "$dir" != "$START_PATH" ]; then
        echo "${indent}- 📁 **$(basename "$dir")/**" >>"$OUTPUT_FILE"
    fi

    # Process subdirectories first
    while IFS= read -r subdir; do
        process_directory "$subdir" "$((depth + 1))" "$depth"
    done < <(find "$dir" -mindepth 1 -maxdepth 1 -type d $FIND_IGNORE_DIRS | sort)

    # Then process files if enabled
    if [ "$INCLUDE_FILES" = true ]; then
        while IFS= read -r file; do
            local file_indent=$(generate_indent "$depth")
            echo "${file_indent}- $(basename "$file")" >>"$OUTPUT_FILE"
        done < <(find "$dir" -mindepth 1 -maxdepth 1 -type f $FIND_IGNORE_FILES | sort)
    fi
}

# Start processing from the root directory
process_directory "$START_PATH" 0 0

echo "Project structure has been mapped to $OUTPUT_FILE"
