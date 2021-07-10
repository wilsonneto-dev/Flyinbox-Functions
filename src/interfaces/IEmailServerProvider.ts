import IEmailDTO from "../DTOs/IEmailDTO";

interface IEmailServerProvider {
  importEmails: () => Array<IEmailDTO>
}

export default IEmailServerProvider;
