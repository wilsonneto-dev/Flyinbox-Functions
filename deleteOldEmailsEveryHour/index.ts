import { AzureFunction, Context } from "@azure/functions"

import AzTableStorageEmailsRepository from "../src/infra/repositories/AzTableStorageEmailsRepository";

const timerTrigger: AzureFunction = async function (context: Context, myTimer: any): Promise<void> {
  const emailsRepository = new AzTableStorageEmailsRepository();
  await emailsRepository.deleteOldEmails();
  context.log('passou aqui...');
};

export default timerTrigger;
