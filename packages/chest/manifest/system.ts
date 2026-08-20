import type { Entry } from "../engine/types.ts";

interface BluetoothDevice {
  name: string;
  id: string;
}

const BLUETOOTH_DEVICES: BluetoothDevice[] = [
  { name: "bluetooth-trackpad", id: "bc-d0-74-b7-a3-f7" },
  { name: "bluetooth-headphones", id: "78-2b-64-cc-73-fa" },
  { name: "bluetooth-keyboard", id: "d2-f3-6f-54-f6-6b" },
  { name: "bluetooth-mouse", id: "f4-66-db-5d-ec-7f" },
  { name: "bluetooth-bose-speaker", id: "78-2b-64-f7-30-4d" },
];

const bluetoothEntries: Entry[] = BLUETOOTH_DEVICES.map(({ name, id }) => ({
  name,
  category: "system",
  check: `blueutil --paired | grep -qi ${id}`,
  install: `blueutil --pair ${id}`,
  requires: ["blueutil"],
  manualStepsRef: "MANUAL-STEPS.md#bluetooth-devices",
}));

export const system: Entry[] = [
  {
    name: "dock-autohide",
    category: "system",
    check:
      'test "$(defaults read com.apple.dock autohide-delay)" = "0" && ' +
      'test "$(defaults read com.apple.dock autohide-time-modifier)" = "0.5"',
    install: [
      "defaults write com.apple.dock autohide-delay -float 0",
      "defaults write com.apple.dock autohide-time-modifier -float 0.5",
      "killall Dock",
    ],
  },
  {
    name: "ssh-key",
    category: "system",
    check: 'test -f "$HOME/.ssh/id_rsa.pub"',
    install: [
      'ssh-keygen -t rsa -b 4096 -C nicolasemkis@gmail.com -f "$HOME/.ssh/id_rsa"',
      'ssh-add --apple-use-keychain "$HOME/.ssh/id_rsa"',
      'pbcopy < "$HOME/.ssh/id_rsa.pub"',
    ],
    manualStepsRef: "MANUAL-STEPS.md#ssh-key",
  },
  ...bluetoothEntries,
];
