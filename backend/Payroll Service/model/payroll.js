const mongoose = require('mongoose');
const { Schema } = mongoose;

// Payroll Schema
const payrollSchema = new Schema(
  {
    employee_id: {
      type: mongoose.Schema.Types.ObjectId, // Reference to Employee model
      required: true,
      ref: 'Employee' // Reference to the Employee collection
    },
    employee_name: {
      type: String,
      required: true,
    },
    month: {
      type: Number,
      required: true,
      min: 1,
      max: 12
    },
    year: {
      type: Number,
      required: true,
      min: 2020 // Adjust the minimum year based on your business logic
    },
    gross_salary: {
      type: Number,
      required: true,
      default: 0
    },
    net_salary: {
      type: Number,
      required: true,
      default: 0
    },
    deductions: [
      {
        type: {
          type: String, // Deduction type (e.g., "Tax", "Health Insurance")
          required: true
        },
        amount: {
          type: Number,
          required: true,
          default: 0
        }
      }
    ],
    bonuses: {
      type: Number,
      default: 0 // Optional: Store bonuses separately (if applicable)
    },
    status: {
      type: String,
      required: true,
      enum: ['pending', 'processed', 'paid', 'failed'], // Enum of possible status values
      default: 'pending' // Default to 'pending' when payroll is first created
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true // Adds createdAt and updatedAt fields automatically
  }
);

// Payroll model
const Payroll = mongoose.model('Payroll', payrollSchema);

module.exports = Payroll;
