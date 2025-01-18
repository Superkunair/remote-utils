#!/bin/bash

file1="$1"
file2="$2"

size1=$(stat -c '%s' "$file1")
size2=$(stat -c '%s' "$file2")

if [[ "$size1" -ne "$size2" ]]; then
  echo "Files have different sizes:"
  echo "  $file1: $size1 bytes"
  echo "  $file2: $size2 bytes"
  # Execute the provided command
  if [[ -n "$1" ]]; then
    echo "Executing command: $3"
    "${@:3}"
  fi
fi