const logger = {
  info: (msg, meta = {}) => {
    console.log(JSON.stringify({ level: 'INFO', msg, timestamp: new Date().toISOString(), ...meta }));
  },
  error: (msg, meta = {}) => {
    console.error(JSON.stringify({ level: 'ERROR', msg, timestamp: new Date().toISOString(), ...meta }));
  },
  warn: (msg, meta = {}) => {
    console.warn(JSON.stringify({ level: 'WARN', msg, timestamp: new Date().toISOString(), ...meta }));
  }
};

export default logger;
