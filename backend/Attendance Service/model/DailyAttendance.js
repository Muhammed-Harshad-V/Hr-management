const mongoose = require('mongoose');

const dailyAttendanceSchema = new mongoose.Schema({
    date: { type: String, required: true, unique: true }, // Date in YYYY-MM-DD format
    employees: [
        {
            employeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Attendance', required: true },
            name: { type: String, required: true },
            checkInTime: { type: String, required: true } // HH:MM:SS format
        }
    ]
});

const DailyAttendance = mongoose.model('DailyAttendance', dailyAttendanceSchema);

module.exports = DailyAttendance;
