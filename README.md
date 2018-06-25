# Simple application server that prints a message at a given time in the future.

The server has only 1 API:
echoAtTime - which receives two parameters, time and message, and writes that message to the server console at the given time.

Since we want the server to be able to withstand restarts it will use redis to persist the messages and the time they should be sent at.
In case the server was down when a message should have been printed, it should print it out when going back online.
