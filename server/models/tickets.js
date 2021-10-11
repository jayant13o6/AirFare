import mongoose from "mongoose";

const tickets = mongoose.Schema({

    source:{type: String, required: true},
    destination: {type:String, required: true},
    departure_date: {type: Date, required:true},
    // arrival_date: {type: Date, required:true},
    email_id: {type:String, required:true},
    total_pass: {type: Number, required: true},
    total_cost: {type: Number, required: true}
}, {timestamps: true},);

const Tickets = mongoose.model('Tickets', tickets);
export default Tickets;