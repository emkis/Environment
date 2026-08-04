#!/opt/homebrew/bin/bash

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[0;33m'
NC='\033[0m'

log_ok() {
    printf "${GREEN}✔${NC} %s\n" "$1"
}

log_error() {
    printf "${RED}✘${NC} %s\n" "$1"
}

log_progress() {
    printf "${YELLOW}○${NC} %s\n" "$1"
}

pair_device_if_needed() {
    local DEVICE_ID="$1"
    local DEVICE_NAME="$2"
    local FORCE_UNPAIR=${3:-false} # default as false
    local IS_PAIRED=false

    # Check if device is already paired
    if blueutil --paired | grep -q "$DEVICE_ID"; then
        IS_PAIRED=true
    fi

    # Exiting when device is already paired
    if [ "$IS_PAIRED" = true ] && [ "$FORCE_UNPAIR" = false ]; then
        log_ok "$DEVICE_NAME: already paired"
        return 0
    fi

    # When asked, we unpair the device before pairing it again
    if [ "$IS_PAIRED" = true ] && [ "$FORCE_UNPAIR" = true ]; then
        log_progress "$DEVICE_NAME: unpairing..."
        blueutil --unpair "$DEVICE_ID" > /dev/null 2>&1
        # If unpairing command succeeds, we print a message and continue
        if [ $? -eq 0 ]; then
            log_ok "$DEVICE_NAME: unpaired"
        # If unpairing command fails (exit not 0), exit with error as well
        else
            log_error "$DEVICE_NAME: failed to unpair"
            return 1
        fi
    fi

    log_progress "$DEVICE_NAME: turn on device and press any key to continue..."
    read -n 1 -s

    local MAX_ATTEMPTS=2
    local ATTEMPT=1

    while [ "$ATTEMPT" -le "$MAX_ATTEMPTS" ]; do
        log_progress "$DEVICE_NAME: pairing (try $ATTEMPT/$MAX_ATTEMPTS)..."
        blueutil --pair "$DEVICE_ID" > /dev/null 2>&1

        if [ $? -eq 0 ]; then
            log_ok "$DEVICE_NAME: pairing request sent"
            return 0
        fi

        log_error "$DEVICE_NAME: pair failed (try $ATTEMPT/$MAX_ATTEMPTS)"
        ATTEMPT=$((ATTEMPT + 1))
    done

    log_error "$DEVICE_NAME: giving up after $MAX_ATTEMPTS attempts"
    return 1
}

TRACKPAD_BLUETOOTH_ID=bc-d0-74-b7-a3-f7
HEADPHONES_BLUETOOTH_ID=78-2b-64-cc-73-fa 
KEYBOARD_BLUETOOTH_ID=d2-f3-6f-54-f6-6b
MOUSE_BLUETOOTH_ID=f4-66-db-5d-ec-7f
BOSE_SPEAKER_BLUETOOTH_ID=78-2b-64-f7-30-4d

# Map of devices to pair
declare -A DEVICES=(
    ["Trackpad"]="$TRACKPAD_BLUETOOTH_ID"
    ["Headphones"]="$HEADPHONES_BLUETOOTH_ID"
    ["Keyboard"]="$KEYBOARD_BLUETOOTH_ID"
    ["Mouse"]="$MOUSE_BLUETOOTH_ID"
    ["Bose-Speaker"]="$BOSE_SPEAKER_BLUETOOTH_ID"
  )

# Pipe to fzf the keys of the DEVICES map
SELECTED_DEVICES=$(printf "%s\n" "${!DEVICES[@]}" | fzf --multi --prompt="Select devices to pair: " --border)

if [ -z "$SELECTED_DEVICES" ]; then
    echo "No devices selected, exiting"
    exit 0
fi

# Pair selected devices
for DEVICE_NAME in $SELECTED_DEVICES; do
    DEVICE_ID=${DEVICES[$DEVICE_NAME]}

    case $DEVICE_NAME in
      Trackpad)
        pair_device_if_needed "$DEVICE_ID" "$DEVICE_NAME" true
        ;;
      *)
        pair_device_if_needed "$DEVICE_ID" "$DEVICE_NAME"
        ;;
    esac
done

log_ok "All done"
