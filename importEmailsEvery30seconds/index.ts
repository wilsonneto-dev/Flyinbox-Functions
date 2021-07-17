import { AzureFunction, Context } from "@azure/functions"

import YapopleEmailImporter from "../src/infra/services/YapopleEmailImporter";
import AzTableStorageEmailsRepository from '../src/infra/repositories/AzTableStorageEmailsRepository';

const timerTrigger: AzureFunction = async function (context: Context, myTimer: any): Promise<void> {
    var timeStamp = new Date().toISOString();
    const emailImporter = new YapopleEmailImporter();
    const emails = await emailImporter.getNewEmails();
    if(emails.length > 0) {
      const emailsRepository = new AzTableStorageEmailsRepository();
      await emailsRepository.saveBatchEmails(emails);
    }
    context.res = {
      body: JSON.stringify({ emails, success: true }),
    };
    context.log('Timer trigger function importEmailsEvery30seconds ran!', timeStamp);   
    context.log(`Imported ${emails.length}`);
};

export default timerTrigger;
