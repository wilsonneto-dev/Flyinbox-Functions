import Email from "../entities/Email";

interface IEmailRepository {
  save(email: Email): () =>Promise<boolean>;
}

export default IEmailRepository;
