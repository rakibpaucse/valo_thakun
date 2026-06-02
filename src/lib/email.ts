// Email/SMS stubs. Swap with Resend/Twilio/SSL Wireless in production.

type ConfirmationPayload = {
  to: string;
  patientName: string;
  doctorName: string;
  serviceName: string;
  startsAt: Date;
  cancelUrl: string;
};

export async function sendAppointmentConfirmation(p: ConfirmationPayload) {
  // TODO(prod): integrate Resend / SendGrid
  console.log(
    `[email-stub] → ${p.to}: Appointment with ${p.doctorName} for ${p.serviceName} confirmed for ${p.startsAt.toLocaleString()}. Manage: ${p.cancelUrl}`,
  );
  return { ok: true };
}

export async function sendAppointmentSms(phone: string, message: string) {
  // TODO(prod): integrate Twilio / SSL Wireless
  console.log(`[sms-stub] → ${phone}: ${message}`);
  return { ok: true };
}
