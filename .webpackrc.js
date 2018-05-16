const path = require('path');

export default {
  entry: 'src/index.js',
  extraBabelPlugins: [
    ['import', { libraryName: 'antd', libraryDirectory: 'es', style: true }],
  ],
  env: {
    development: {
      extraBabelPlugins: ['dva-hmr'],
    },
  },
  alias: {
    components: path.resolve(__dirname, 'src/components/'),
  },
  ignoreMomentLocale: true,
  theme: './src/theme.js',
  "define": {
    "process.env.TEST": 1,
    "USE_COMMA": 2,
  },
  html: {
    template: './src/index.ejs',
  },
  disableDynamicImport: true,
  publicPath: '/',
  "proxy": {
    "/api2": {
      "target": "http://localhost:8085/",
      "changeOrigin": true,
      "pathRewrite": { "^/api2": "" }
    }
  },
  hash: true,
};