// Future versions of Hyper may add additional config options,
// which will not automatically be merged into this file.
// See https://hyper.is#cfg for all currently supported options.

module.exports = {
  config: {
    updateChannel: 'stable',
    fontSize: 15, // For MacOS fontSize is 17
    fontFamily: 'Fira Code',

    // text color
    foregroundColor: '#fff',  // currently overwritten by plugin
    backgroundColor: '#000',  // currently overwritten by plugin
    borderColor: '#333',      // currently overwritten by plugin
    cursorShape: 'BEAM',      // `BEAM` for |, `UNDERLINE` for _, `BLOCK` for █
    cursorBlink: true,

    // custom padding (css format, i.e.: `top right bottom left`)
    padding: '25px 15px',

    // the full list. if you're going to provide the full color palette,
    // including the 6 x 6 color cubes and the grayscale map, just provide
    // an array here instead of a color map object
    // Note: all these colors are currently overwritten by a theme plugin
    colors: {
      black: '#000000',
      red: '#ff0000',
      green: '#33ff00',
      yellow: '#FED766',
      blue: '#0066ff',
      magenta: '#cc00ff',
      cyan: '#00C7FF',
      white: '#d0d0d0',
      lightBlack: '#808080',
      lightRed: '#ff0000',
      lightGreen: '#33ff00',
      lightYellow: '#FED766',
      lightBlue: '#0066ff',
      lightMagenta: '#cc00ff',
      lightCyan: '#00C7FF',
      lightWhite: '#ffffff'
    },
    
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

    // The number of rows to be persisted in terminal buffer for scrolling
    scrollback: 500,
  },

  plugins: ["hypercwd", "hyper-omni-theme"],
}