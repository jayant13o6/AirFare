import mongoose from "mongoose";

const schedule = mongoose.Schema({

    flight_code:{type: String, required: true},
    source:{type: String, required: true},
    destination: {type:String, required: true},
    flight_date:{type:Date, required:true},
    departure_time: {type: String, required:true},
    arrival_time: {type: String, required:true},
    // admin_id: {type:String, required:true},
    ticketCost: {type: Number, required: true}
}, {timestamps: true},);

const Flights = mongoose.model('Flights', schedule);
export default Flights;