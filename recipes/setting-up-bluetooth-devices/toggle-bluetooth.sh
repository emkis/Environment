#!/opt/homebrew/bin/bash

BLUETOOTH_POWER=$(blueutil --power)

if [ "$BLUETOOTH_POWER" -eq 1 ]; then
    blueutil --power 0
else
    blueutil --power 1
fi
