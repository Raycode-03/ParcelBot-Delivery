import validator from "validator"

export function validateuser(data) {
    const { email, password, name, address } = data  
    
    if (!email || !password) return "Please fill all the required fields";
    if (!validator.isEmail(email)) return "Invalid email format";
    if (password.length < 6) return "Password must be at least 6 characters";
    
    // Optional fields - basic checks
    if (name && name.trim().length < 2) return "Name must be at least 2 characters";
    if (address && address.trim().length < 5) return "Address must be at least 5 characters";
    
    return null;
}