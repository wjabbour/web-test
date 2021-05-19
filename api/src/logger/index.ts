import winston from "winston";

/*
  This logger will be useful for determining user interactions with our system:
  how many unique users interacted with our system today, this week, this month
  how many users used our service for the first time this month
  How frequently do users use our service

  We can have the frontend pass in email/uuid per user to collect this information

  For determing performance:
  What is the average latency of our database interactions?
  Error frequency?
  How are our compute instances performing in one AZ vs another?

*/
export const logger =  winston.createLogger({
  level: 'info',
  transports: [
    new winston.transports.Console()
  ]
});