export default {
  compress: {
    passes: 5,
    inline: 3,
    dead_code: true,
    drop_console: true,
    drop_debugger: true,
    unsafe: true,
  },
  mangle: {
    properties: false,
  },
  format: {
    comments: false,
  },
};
