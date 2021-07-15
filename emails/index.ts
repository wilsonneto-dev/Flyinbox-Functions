import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import YapopleEmailImporter from "../src/infra/services/YapopleEmailImporter";

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {

  const emailImporter = new YapopleEmailImporter();
  const emails = await emailImporter.getNewEmails();

  context.res = {
    body: JSON.stringify(emails),
  };
};

export default httpTrigger;
