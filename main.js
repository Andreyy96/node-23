const express = require("express")
const {read, write} = require("./fs.service")

const app = express()

const PORT = 3000

app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.get('/users', async (req, res) => {
    try {
        const users = await read();
        res.json(users);
    } catch (e) {
        res.status(400).json(e.message)
    }
});

app.get('/users/:id', async (req, res) => {
    try {
        const {id} = req.params
        const users = await read();
        const user = users.find(user => user.id === +id)

        if(user) {
            res.status(200).json(user);
        }
        else {
            res.status(404).json({message: "user not found"})
        }
    } catch (e) {
        res.status(400).json(e.message)
    }
});

app.post('/users', async (req, res) => {
    try {
        const {name, email, password} = req.body;

        const users = await read();

        const newUser = {id: users[users.length - 1].id + 1, name, email, password}

        if (!newUser.name || !newUser.email || !newUser.password) {
            res.status(400).json({message: "newUsers doesn't have important field"})
        }
        else {
            users.push(newUser);
            await write(users);
            res.status(201).json(newUser);
        }
    } catch (e) {
        res.status(400).json(e.message)
    }
})

app.put('/users/:id', async (req, res) => {
    try {
        const {id} = req.params
        const {name, email, password} = req.body;
        const users = await read();
        const userIndex = users.findIndex((user) => user.id === +id)

        if(userIndex) {
            users[userIndex] = {...users[userIndex], name, email, password}
            await write(users)
            res.status(201).json(users[userIndex]);
        }
        else {
            res.status(404).json({message: "user not found"})
        }
    } catch (e) {
        res.status(400).json(e.message)
    }
});

app.delete('/users/:id', async (req, res) => {
    try {
        const {id} = req.params
        const users = await read();
        const userIndex = users.findIndex((user) => user.id === +id)

        if(userIndex && userIndex >= -1) {
            users.splice(userIndex, 1)
            await write(users)
            res.sendStatus(200);
        }
        else {
            res.status(404).json({message: "user not found"})
        }
    } catch (e) {
        res.status(400).json(e.message)
    }
});

app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server is running at http://0.0.0.0:${PORT}/`);
})