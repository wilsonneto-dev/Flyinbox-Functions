import { createTableService, TableService, TableUtilities, TableBatch, TableQuery } from "azure-storage";

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

  async deleteOldEmails(): Promise<void> {
    return new Promise<void>(async (resolve, reject) => {
      try {
        this.connectAndInitialize();
        const oneHourAgo = new Date(Date.now() - 1000 * 60 * 60);
        const entityGenerator = TableUtilities.entityGenerator;
        const query = new TableQuery().where("Timestamp <= ?", oneHourAgo);
        
        const oldEmailEntities = await new Promise<any>((resolve, rejects) => {
          this._tableService.queryEntities(this._tableName, query, null, null, (error, entities) => {
            if(error) rejects(error);
            resolve(entities.entries);
          });
        });

        if(oldEmailEntities.length === 0)
          resolve();

        const batchOperation = new TableBatch();
        oldEmailEntities.forEach(emailEntity => batchOperation.deleteEntity(emailEntity));

        console.log(JSON.stringify(oldEmailEntities));

        this._tableService.executeBatch(this._tableName, batchOperation, function (error) {
          if(error) throw error;
          resolve();
        });
      }catch(error) {
        reject(error);
      }
    });
  }
}

export default AzTableStorageEmailsRepository;
