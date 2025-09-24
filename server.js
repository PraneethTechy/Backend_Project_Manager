import express from 'express';
import dotenv from "dotenv";
import connectDB from './config/db.js';
import userRoutes from './routes/user.route.js';
import projectRoutes from './routes/project.route.js';
import todoRoutes from './routes/todo.route.js';
import cors from 'cors';


dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());


const allowedOrigins = [
  "http://localhost:5173",
  "https://project-manager-henna.vercel.app"
];

app.use(
  cors({
    origin: function(origin, callback){
      if(!origin) return callback(null, true); // for tools like Postman
      if(allowedOrigins.indexOf(origin) === -1){
        return callback(new Error("CORS not allowed"), false);
      }
      return callback(null, true);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"]
  })
);



connectDB();

app.use('/user',userRoutes);
app.use('/project',projectRoutes);
app.use('/todo',todoRoutes);

app.get('/',(req,res) => {

    res.send("Ganesha Server is Running");
    
})

app.listen(PORT, () => {
    
    console.log("Server is running in 4000");

});

