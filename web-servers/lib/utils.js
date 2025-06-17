module.exports = {
  getBugSnagOpts: (appVersion) => ({
    apiKey: 'placeholder-key',  // Bugsnag won’t work without a real key
    appVersion: appVersion
  }),
  debugOpts: {}
};
