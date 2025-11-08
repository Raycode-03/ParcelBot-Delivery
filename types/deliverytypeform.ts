export type DeliveryFormData = {
  deliveryType: string;
  pickup: string;
  destination: string;
  sender: {
    fullname: string;
    phoneNumber: string;
    email: string;
    password: string;
  };
  receiver: {
    fullname: string;
    phoneNumber: string;
    packageValue: string;
    packageDescription: string;
  };
};