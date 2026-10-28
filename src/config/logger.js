
const winston = require('winston');
const DailyRotateFile = require('winston-daily-rotate-file');
const path = require('node:path');
const config = require('./env.config');

const levels = {
  fatal: 0,
  error: 1,
  warning: 2,
  info: 3,
  http: 4,
  debug: 5
};

const logFormat = winston.format.printf(
  ({ timestamp, level, message }) =>
    `${timestamp} [${level}] ${message}`
);

const logger = winston.createLogger({
  levels,
  level: config.nodeEnv === 'production' ? 'info' : 'debug',
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    logFormat
  ),
  transports: [
    new winston.transports.Console(),

    new DailyRotateFile({
      filename: path.join('logs', 'error-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      level: 'error',
      maxSize: '10m',
      maxFiles: '14d'
    })
  ]
});

module.exports = logger;
