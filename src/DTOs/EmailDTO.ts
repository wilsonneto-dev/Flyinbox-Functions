class EmailDTO {
  messageId: string;
  contentType: string;
  message: string;
  subject: string;
  from: string;
  fromName: string;
  to: string;
  receivedDate: Date;
}

export default EmailDTO;
