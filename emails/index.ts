import { createTableService, TableUtilities } from 'azure-storage';

import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import YapopleEmailImporter from "../src/infra/services/YapopleEmailImporter";
import AzTableStorageEmailsRepository from '../src/infra/repositories/AzTableStorageEmailsRepository';

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  const emailImporter = new YapopleEmailImporter();
  const emails = await emailImporter.getNewEmails();
  if(emails.length > 0) {
    const emailsRepository = new AzTableStorageEmailsRepository();
    await emailsRepository.saveBatchEmails(emails);
  }
  context.res = {
    body: JSON.stringify({ emails, success: true }),
  };
};

export default httpTrigger;
