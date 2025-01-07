const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true, // Remove extra spaces around the name
    },
    email: {
      type: String,
      required: true,
      unique: true, // Ensure the email is unique
      trim: true,
      validate: {
        validator: function (v) {
          // Simple regex to validate email format
          return /[a-z0-9]+@[a-z]+\.[a-z]{2,3}/.test(v);
        },
        message: (props) => `${props.value} is not a valid email!`,
      },
    },
    position: {
      type: String,
      required: true,
      trim: true, // Remove extra spaces around the position name
    },
    department: {
      type: String,
      required: true,
      trim: true, // Remove extra spaces around the department name
    },
    salary: {
      type: Number,
      required: true,
      min: 0, // Ensure salary is a positive number
    },
    hireDate: {
      type: Date,
      required: true,
      default: Date.now, // Default to current date if not provided
    },
    status: {
      type: String,
      enum: ['active', 'on_leave'], // Define status values
      default: 'active', // Default status is active
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
    timestamps: true, // Automatically create and update createdAt and updatedAt fields
  }
);

// Create the Employee model from the schema
const Employee = mongoose.model('Employee', employeeSchema);

module.exports = Employee;
