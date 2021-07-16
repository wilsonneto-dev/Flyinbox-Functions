import { Client as YapopleClient, Message } from "yapople";

import EmailDTO from "../../DTOs/EmailDTO";
import IEmailImporter from "../../interfaces/IEmailImporter";

class YapopleEmailImporter implements IEmailImporter {
  private _yapopleClient: YapopleClient;

  public async getNewEmails(): Promise<Array<EmailDTO>> {
    await this.configureAndConnect();
    const yapopleEmails = await this._yapopleClient.retrieveAndDeleteAll();
    await this._yapopleClient.quit();
    return this.convertYapopleEmailsToEmailDTOs(yapopleEmails);
  }

  private async configureAndConnect() {
    this._yapopleClient = new YapopleClient({
      host: process.env.EMAIL_POP3_HOST,
      port: Number(process.env.EMAIL_POP3_PORT),
      tls: false,
      mailparser: true,
      username: process.env.EMAIL_POP3_USER,
      password: process.env.EMAIL_POP3_PASS,
    });
    await this._yapopleClient.connect();    
  }
  
  private convertYapopleEmailsToEmailDTOs(yapopleEmails: Array<Message>): Array<EmailDTO> {
    const newEmailsList: Array<EmailDTO> = [];
    yapopleEmails.forEach((yapopleEmail) => {
      const emailDTO = new EmailDTO();
      emailDTO.from = yapopleEmail.from[0].address;
      emailDTO.fromName = yapopleEmail.from[0].name;
      emailDTO.message = yapopleEmail.text;
      emailDTO.subject = yapopleEmail.subject;
      emailDTO.to = yapopleEmail.to[0].address;
      emailDTO.messageId = yapopleEmail.messageId;
      emailDTO.contentType = yapopleEmail.headers['content-type'];
      emailDTO.receivedDate = yapopleEmail.receivedDate;
      newEmailsList.push(emailDTO);
    });
    return newEmailsList;
  }
}

export default YapopleEmailImporter;
