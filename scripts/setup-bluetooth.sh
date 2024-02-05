#!/bin/bash

MAGIC_TRACKPAD_BLUETOOTH_ID=bc-d0-74-b7-a3-f7

echo "Pairing and Unparing devices"

blueutil --unpair $MAGIC_TRACKPAD_BLUETOOTH_ID
blueutil --pair $MAGIC_TRACKPAD_BLUETOOTH_ID
blueutil --pair $MAGIC_TRACKPAD_BLUETOOTH_ID

echo "Done ✅"
