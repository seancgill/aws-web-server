module.exports = {
  handlePushRequest: (req, res, io) => {
    res.status(200).send('Push request placeholder');
  },
  handlePWACallRequest: (req, res, io) => {
    res.status(200).send('PWA call request placeholder');
  }
};
