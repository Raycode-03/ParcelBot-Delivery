export function validateorder(data) {
    // Validate delivery type
    if (!data.deliveryType || data.deliveryType.trim() === "") {
        return "Delivery type is required";
    }

    // Validate pickup location
    if (!data.pickup || data.pickup.trim() === "") {
        return "Pickup location is required";
    }

    if (data.pickup.length < 3) {
        return "Pickup location must be at least 3 characters";
    }

    // Validate destination
    if (!data.destination || data.destination.trim() === "") {
        return "Destination is required";
    }

    if (data.destination.length < 3) {
        return "Destination must be at least 3 characters";
    }

    // Validate price
    if (!data.price || data.price <= 0) {
        return "Invalid price";
    }

    // Validate delivery speed
    if (!data.deliverySpeed || !["premium", "economy"].includes(data.deliverySpeed)) {
        return "Invalid delivery speed";
    }

    // Validate sender information
    if (!data.sender.fullname || data.sender.fullname.trim() === "") {
        return "Sender's full name is required";
    }

    if (!data.sender.phoneNumber || data.sender.phoneNumber.trim() === "") {
        return "Sender's phone number is required";
    }

    // Validate phone number format (Nigerian format)
    const phoneRegex = /^(\+234|0)[789][01]\d{8}$/;
    if (!phoneRegex.test(data.sender.phoneNumber.replace(/\s/g, ''))) {
        return "Invalid sender's phone number format";
    }

    if (!data.sender.email || data.sender.email.trim() === "") {
        return "Sender's email is required";
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.sender.email)) {
        return "Invalid sender's email format";
    }

    // Validate receiver information
    if (!data.receiver.fullname || data.receiver.fullname.trim() === "") {
        return "Receiver's full name is required";
    }

    if (!data.receiver.phoneNumber || data.receiver.phoneNumber.trim() === "") {
        return "Receiver's phone number is required";
    }

    // Validate receiver phone number
    if (!phoneRegex.test(data.receiver.phoneNumber.replace(/\s/g, ''))) {
        return "Invalid receiver's phone number format";
    }

    if (!data.receiver.packageValue || data.receiver.packageValue.trim() === "") {
        return "Package value is required";
    }

    if (!data.receiver.packageDescription || data.receiver.packageDescription.trim() === "") {
        return "Package description is required";
    }

    if (data.receiver.packageDescription.length > 300) {
        return "Package description must not exceed 300 characters";
    }

    // All validations passed
    return null;
}