#!/opt/homebrew/bin/bash

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
        printf ">> Device $DEVICE_NAME ($DEVICE_ID) is already paired \n\n"
        return 0
    fi

    # When asked, we unpair the device before pairing it again
    if [ "$IS_PAIRED" = true ] && [ "$FORCE_UNPAIR" = true ]; then
        echo ">> Device $DEVICE_NAME ($DEVICE_ID) is already paired. Unpairing..."
        blueutil --unpair "$DEVICE_ID"
        # If unpairing command succeeds, we print a message and continue
        if [ $? -eq 0 ]; then
            echo ">> Device $DEVICE_NAME ($DEVICE_ID) unpaired"
        # If unpairing command fails (exit not 0), exit with error as well
        else
            printf ">> Failed to unpair device $DEVICE_NAME ($DEVICE_ID) \n\n"
            return 1
        fi
    fi

    echo ">> Turn on the $DEVICE_NAME and press any key to continue..."
    read -n 1 -s

    echo ">> Device $DEVICE_NAME ($DEVICE_ID) is not paired. Attempting to pair..."
    blueutil --pair "$DEVICE_ID"

    if [ $? -eq 0 ]; then
        printf ">> Pairing request sent to $DEVICE_NAME ($DEVICE_ID) \n\n"
    else
        printf ">> Failed to pair with $DEVICE_NAME ($DEVICE_ID) \n\n"
        return 1
    fi
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

echo ">> All done"
