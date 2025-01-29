const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); // Import bcryptjs for hashing passwords

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
      enum: ['active', 'inactive'], // Define status values
      default: 'active', // Default status is active
    },
    password: {
      type: String,
      required: true,
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

// Pre-save hook to hash the password before saving to the database
employeeSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    try {
      // Generate a salt
      const salt = await bcrypt.genSalt(10);
      // Hash the password using the salt
      this.password = await bcrypt.hash(this.password, salt);
      next();
    } catch (error) {
      next(error); // Pass errors to the next middleware
    }
  } else {
    next(); // If password is not modified, skip the hashing process
  }
});

// Method to compare a provided password with the stored hashed password
employeeSchema.methods.comparePassword = async function (providedPassword) {
  try {
    return await bcrypt.compare(providedPassword, this.password);
  } catch (error) {
    throw new Error('Error comparing passwords');
  }
};



// const plainPassword = 'password';
// bcrypt.genSalt(10, (err, salt) => {
//   bcrypt.hash(plainPassword, salt, (err, hashedPassword) => {
//     console.log('Hashed password:', hashedPassword);
//   });
// });
// Static method to get employee count
employeeSchema.statics.getEmployeeCount = async function () {
  try {
    const count = await this.countDocuments();
    return count;
  } catch (error) {
    throw new Error('Error fetching employee count');
  }
};
// Create the Employee model from the schema
const Employee = mongoose.model('Employee', employeeSchema);

module.exports = Employee;
