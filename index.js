const express = require('express')
const cors = require('cors')
const app = express()
let port = process.env.PORT;

if(port == null || port == ""){
	port = 4000;
}

const corsOptions = {
	origin: 'https://storage.googleapis.com',
	optionsSuccessStatus: 200
}
app.use(cors(corsOptions))
app.use(express.static('public'))

if(process.env.NODE_ENV === 'production') {
	app.use((req, res, next) => {
		if (req.header('x-forwarded-proto') !== 'https')
		res.redirect(`https://${req.header('host')}${req.url}`)
		else
		next()
	})
}

let happyMessages = [
	"Hello Uzoma, your day will be great today :)",
	"Hey Uzoma, smash this project!",
	"Ah my friend, thank you for bringing out the old server to play",
	"Guy you fully sat down to write console msgs for yourself lol",
	"i di too much!"
]

app.listen(port, () => console.log(happyMessages[Math.floor(5*Math.random(5))]))
