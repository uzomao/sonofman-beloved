const express = require('express')
const cors = require('cors')
const app = express()
const port = 4000

const corsOptions = {
	origin: 'https://storage.googleapis.com',
	optionsSuccessStatus: 200
}
app.use(cors(corsOptions))
app.use(express.static('public'))

app.listen(port, () => console.log('Example app listening on port '+port))
