import EmailDTO from "../DTOs/EmailDTO";

interface IEmailsRepository {
  saveBatchEmails(emails: Array<EmailDTO>): Promise<void> 
}

export default IEmailsRepository;