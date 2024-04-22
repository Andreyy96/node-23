const express = require("express")
const {read, write} = require("./fs.service")

const app = express()

const PORT = 3100

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

        if(!user) {
            throw new Error('user not found');
        }

        res.status(200).json(user);
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
            throw new Error("newUsers doesn't have important field")
        }

        users.push(newUser);
        await write(users);
        res.status(201).json(newUser);
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
        console.log(userIndex)

        if(userIndex === -1) {
            throw new Error('user not found');
        }
        if (!name || !email || !password){
            throw new Error("user doesn't have important field")
        }

        users[userIndex] = {...users[userIndex], name, email, password}
        await write(users)
        res.status(201).json(users[userIndex]);
    } catch (e) {
        res.status(400).json(e.message)
    }
});

app.delete('/users/:id', async (req, res) => {
    try {
        const {id} = req.params
        const users = await read();
        const userIndex = users.findIndex((user) => user.id === +id)

        if(!userIndex || userIndex === -1) {
            throw new Error('user not found');
        }

        users.splice(userIndex, 1)
        await write(users)
        res.sendStatus(200);
    } catch (e) {
        res.status(400).json(e.message)
    }
});

app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server is running at http://0.0.0.0:${PORT}/`);
})