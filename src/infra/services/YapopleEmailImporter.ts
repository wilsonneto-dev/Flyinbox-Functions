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
      host: "mail.wilsonneto.com.br",
      port: 110,
      tls: false,
      mailparser: true,
      username: "flyinbox@wilsonneto.com.br",
      password: "@+r}N9F8AWPH"
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
      emailDTO.contentType = yapopleEmail.headers.contentType;
      emailDTO.receivedDate = yapopleEmail.receivedDate;
      newEmailsList.push(emailDTO);
    });
    return newEmailsList;
  }
}

export default YapopleEmailImporter;
