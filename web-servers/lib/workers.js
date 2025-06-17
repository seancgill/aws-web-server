module.exports = {
  startWorkers: (callback) => {
    console.log('Starting workers (stub)');
    return [];  // Empty array of workers
  },
  getWorkers: () => [],
  updateWorker: (id, param, value) => {},
  incrementStatWorker: (id, stat, value) => {}
};
