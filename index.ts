import express, { Request, Response } from 'express';

const app = express();
console.log("Hello World");
app.get("/", (request: Request, response: Response) => {
    response.send("Hello World");
});

app.listen(3000,()=>{
    console.log("Hello World");

    console.log("Server is running on port 3000")
});


