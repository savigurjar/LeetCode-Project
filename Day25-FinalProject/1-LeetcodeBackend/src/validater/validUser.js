
const validator = require("validator");

async function validUser(data) {
  const mandatoryFields = ["FirstName", "EmailId", "Password"];

  // Check required fields exist
  const hasAllFields = mandatoryFields.every((k) => Object.keys(data).includes(k));
  if (!hasAllFields) throw new Error("Fields are missing");

  const { FirstName, EmailId, Password } = data;

  // Validate name length
  if (!(FirstName.length >= 3 && FirstName.length <= 20)) {
    throw new Error("Name must be between 3 and 20 characters");
  }

  // Validate email
  if (!validator.isEmail(EmailId)) {
    throw new Error("Enter a valid Email");
  }

  // Validate strong password
  if (!validator.isStrongPassword(Password)) {
    throw new Error("Enter a stronger Password");
  }

 
}

module.exports = validUser;
