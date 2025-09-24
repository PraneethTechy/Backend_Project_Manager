import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
    projectName:{
        type:String,
        required:true,
        trim:true,
    },
    description:{
        type:String,
        required:true,
        trim:true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
    },
    todos:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Todo'
    }],

},{
    timestamps:true,
});

const Project = mongoose.model("Project",projectSchema);

export default Project;