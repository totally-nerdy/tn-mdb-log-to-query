# MongoDBLogToQuery

This nifty little tool takes one line of MongoDB log output and converts it into an executable query. Only if the log
output contains a query of course, like a slow query log.

Go to https://totally-nerdy.github.io/tn-mdb-log-to-query/ to see it used in the context of a web form.

Especially useful in conjunction with our MongoDB Query
Analyzer (https://www.totally-nerdy.com/blog/post/22487/mongodb-query-analyser/).

## Requirements

- The log one-liner must be in JSON format; MongoDB versions >= 4.4 (before that it was just text)

## Notes

- ./docs/index.dev.html is used during local development and points to local dependencies
- ./docs/index.html is the public example page
