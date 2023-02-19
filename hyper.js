// Future versions of Hyper may add additional config options,
// which will not automatically be merged into this file.
// See https://hyper.is#cfg for all currently supported options.

module.exports = {
  config: {
    updateChannel: 'stable',
    fontSize: 17,
    fontFamily: 'FiraCode Nerd Font',

    // cursor configs
    cursorShape: 'BEAM',      // `BEAM` for |, `UNDERLINE` for _, `BLOCK` for █
    cursorBlink: true,

    // custom padding (css format, i.e.: `top right bottom left`)
    padding: '25px 15px',

    // the shell to run when spawning a new session (i.e. /usr/local/bin/fish)
    // if left empty, your system's login shell will be used by default
    shell: '/bin/zsh',

    // for setting shell arguments (i.e. for using interactive shellArgs: ['-i'])
    // by default ['--login'] will be used
    shellArgs: ['--login'],

    // An object of environment variables to set before launching shell
    env: {},

    // if true, selected text will automatically be copied to the clipboard
    copyOnSelect: false,

    // if true, on right click selected text will be copied or pasted if no
    // selection is present (true by default on Windows)
    quickEdit: false,

    hypercwd: {
      initialWorkingDirectory: '~/code'
    }
  },

  plugins: ["hypercwd", "hyper-omni-theme"],
}