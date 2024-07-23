#!/bin/bash

MAGIC_TRACKPAD_BLUETOOTH_ID=bc-d0-74-b7-a3-f7
MAGIC_KEYBOARD_BLUETOOTH_ID=88-4d-7c-eb-a9-88

echo "Unparing devices..."
blueutil --unpair $MAGIC_TRACKPAD_BLUETOOTH_ID
blueutil --unpair $MAGIC_KEYBOARD_BLUETOOTH_ID

echo "Paring devices..."
blueutil --pair $MAGIC_TRACKPAD_BLUETOOTH_ID
blueutil --pair $MAGIC_TRACKPAD_BLUETOOTH_ID

blueutil --pair $MAGIC_KEYBOARD_BLUETOOTH_ID
blueutil --pair $MAGIC_KEYBOARD_BLUETOOTH_ID

echo "Done."
