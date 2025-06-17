module.exports = {
  getHttpOptions: () => ({
    key: null,  // Placeholder; needs a real key file
    cert: null  // Placeholder; needs a real cert file
  }),
  sniCallback: (domain, cb) => {
    cb(null, null);  // Placeholder; no SNI support
  }
};
