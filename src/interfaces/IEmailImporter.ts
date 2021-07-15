import EmailDTO from "../DTOs/EmailDTO";

interface IEmailImporter {
  getNewEmails: () => Promise<Array<EmailDTO>>
}

export default IEmailImporter;
