import { createTableService, TableService, TableUtilities, TableBatch } from "azure-storage";

import EmailDTO from "../../DTOs/EmailDTO";
import IEmailsRepository from "../../interfaces/IEmailsRepository";

class AzTableStorageEmailsRepository implements IEmailsRepository {
  private _tableName = "emails";
  private _tableService: TableService;

  async saveBatchEmails(emailDTOs: Array<EmailDTO>): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      try {
        this.connectAndInitialize();
        const emails = this.convertDTOToAzureEntity(emailDTOs);
        const batchOperation = new TableBatch();
        emails.forEach(email => batchOperation.insertEntity(email, {echoContent: false}));
        this._tableService.executeBatch(this._tableName, batchOperation, function (error) {
          if (error) throw error;
          resolve();
        });
      }catch(error) {
        reject(error);
      }
    });
  }

  private async connectAndInitialize(): Promise<void> {
    this._tableService = createTableService(process.env.AzureWebJobsStorage);
    await new Promise<void>((resolve, reject) => {
      this._tableService.createTableIfNotExists(this._tableName, (error) => {
        if (!error)
          resolve();
        else
          reject("error on crate table: " + error.message);
      });
    });
  }

  private convertDTOToAzureEntity(emailDTOs: Array<EmailDTO>): Array<any> {
    const entityGenerator = TableUtilities.entityGenerator;
    return emailDTOs.map(emailDTO => {
      return {
        PartitionKey: entityGenerator.String(emailDTO.to),
        RowKey: entityGenerator.String(emailDTO.messageId),
        Date: entityGenerator.DateTime(new Date()),
        contentType: entityGenerator.String(emailDTO.contentType),
        subject: entityGenerator.String(emailDTO.subject),
        from: entityGenerator.String(emailDTO.from),
        fromName: entityGenerator.String(emailDTO.fromName),
        receivedDate: entityGenerator.DateTime(emailDTO.receivedDate),
      };
    });
  }
}

export default AzTableStorageEmailsRepository;
