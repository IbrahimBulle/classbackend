import express from "express";
import connectDB from "./db.js";
import reading from "./models/usermodels.js";
import { Server} from "socket.io";
import http from "http"
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json()); // Middleware to parse JSON
const server = http.createServer(app)

app.use(cors())
const io = new Server(server,  {
  cors: {
    origin: "http://localhost:5500",  
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
    credentials: true, 
  }
});

io.on("connection",(socket)=>{
	console.log("hello")
	socket.emit("message", "hello from server via socket");
	socket.on("greet",(msg)=>{
		console.log("client:" ,msg)
	})
	
       })

app.use(cors())


app.get('/', async (req, res) => {
	try {
		const data = await reading.find()
		io.emit("latestReading",data[data.length-1])
		res.json(data)
		
	} catch (error) {
		res.json({ message: error.message })
	}
});


app.get('/api/latest', async (req, res) => {
	try {
		const data = await reading.find()
		io.emit("lastReading",data[data.length-1])
		res.json(data[data.length-1])
		
	} catch (error) {
		res.json({ message: error.message })
	}
});


app.post('/api/readings', async (req, res) => {
	try {
		const { temp, humidity, soil_moisture, light_intensity } = req.body

		if (!temp || !humidity || !soil_moisture || !light_intensity) {
			return res.json({ Message: "All fields are required." })
		}

		const response = await reading.create({ temp, humidity, soil_moisture, light_intensity });
        io.emit("newReading", response);
		return res.json({ Message: "success", response })
	
	} catch (error) {
		console.log(error)
	}
});

app.delete('/api/readings/:id', async (req, res) => {
	try {
		const deleted = await reading.findByIdAndDelete(req.params.id)
		if (!deleted) {
			return res.status(500).json({ message: "item not found" })
		}
		res.json({ message: "item deleted", deleted })
	} catch (err) {
		if (err) throw err
	}
});

const port = 8000;
connectDB()
server.listen(port || 3000, () => console.log(`Server running on port ${port}`));
