import type { Entry } from "../engine/types.ts";

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
];
