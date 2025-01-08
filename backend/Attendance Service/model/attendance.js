const mongoose = require('mongoose');
const { Schema } = mongoose;

// Attendance Schema
const attendanceSchema = new Schema(
  {
    employee_id: {
      type: mongoose.Schema.Types.ObjectId, // You might use ObjectId to reference Employee schema
      required: true,
    },
    date: {
      type: Date,
      required: true,
      unique: true // Ensures only one record per employee per day
    },
    check_in_time: {
      type: Date,
      required: true
    },
    check_out_time: {
      type: Date,
      default: null 
    },
    worked_hours: {
      type: Number,
      default: 0
    },
    createdAt: {
      type: Date,
      default: Date.now, // Automatically set to the current date when created
      },
      updatedAt: {
       type: Date,
       default: Date.now, // Automatically set to the current date when updated
      },
  },
  {
    timestamps: true // Adds createdAt and updatedAt fields automatically
  }
);


// Calculate worked hours based on check-in and check-out time before saving
attendanceSchema.pre('save', function (next) {
  if (this.check_in_time && this.check_out_time) {
    const workedTimeInMillis = this.check_out_time - this.check_in_time;
    this.worked_hours = workedTimeInMillis / (1000 * 60 * 60); // Convert milliseconds to hours
  }
  next();
});

const Attendance = mongoose.model('Attendance', attendanceSchema);

module.exports = Attendance;
