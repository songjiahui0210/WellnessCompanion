const createExpoWebpackConfigAsync = require('@expo/webpack-config');

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(env, argv);
  
  // Add polyfills for web
  if (config.resolve.alias) {
    config.resolve.alias['crypto'] = require.resolve('react-native-get-random-values');
  }

  return config;
};