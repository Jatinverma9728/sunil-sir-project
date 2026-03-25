const crypto = require('crypto');

const OTP_LENGTH = 6;

const generateNumericOTP = () => {
  const min = 10 ** (OTP_LENGTH - 1);
  const max = 10 ** OTP_LENGTH;
  return crypto.randomInt(min, max).toString();
};

const normalizeOTP = (otp) => (otp === undefined || otp === null ? '' : String(otp).trim());

const isValidOTPFormat = (otp) => /^\d{6}$/.test(normalizeOTP(otp));

const hashOTP = (otp) => crypto.createHash('sha256').update(normalizeOTP(otp)).digest('hex');

module.exports = {
  OTP_LENGTH,
  generateNumericOTP,
  normalizeOTP,
  isValidOTPFormat,
  hashOTP,
};
