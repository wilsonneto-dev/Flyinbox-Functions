import IEmailRepository from "../interfaces/IEmailRepository";
import IEmailServerProvider from "../interfaces/IEmailServerProvider";

class SaveEmail {
  constructor(
    private _emailServerProvider: IEmailServerProvider, 
    private _emailRepository: IEmailRepository
  ) {}

  public async execute(): Promise<boolean> {
    return true;
  }
}

export default SaveEmail;
