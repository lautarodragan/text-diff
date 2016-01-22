# textdiff
An small line-by-line text diff that can be consumed by REST

The code could be much cleaner, but I've commented it explaining the most relevant parts of the process step by step. All the logic is in helpers/textdiff.js, the rest is just express.js boilerplate.

The project runs as a standalone REST app which you can POST to, sending a json in the body of the message in the form of

```{
"textA": "...",
"textB": "...."
}```

I've written some examples to start with, you can run them with the following command in your terminal:

`curl -d @example4.json http://localhost:3000 -H "Content-Type: application/json"`

To start the server:

`npm start`
