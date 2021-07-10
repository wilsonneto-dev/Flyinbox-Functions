class Email {
  private from: string;
  private to: string;
  private subject: string;
  private date: Date;
  private content: string;

  constructor(_from: string, _to: string, _subject: string, _date: Date, _content: string) {
    this.from = _from;
    this.to = _to;
    this.subject = _subject;
    this.date = _date;
    this.content = _content;
  }
}

export default Email;
