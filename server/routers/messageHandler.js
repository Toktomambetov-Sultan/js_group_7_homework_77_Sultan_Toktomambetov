class MessageHandler {
  constructor(data, params) {
    this.data = params.includeFields.reduce(
      (acc, includeField) => ({
        ...acc,
        [includeField.name]:
          includeField.path.reduce((acc, item) => acc && acc[item], data) || includeField.defaultValue,
      }),
      {},
    );
    this.errorProps = params.requiredFields.filter((requiredField) => !this.data[requiredField]);
  }
  getErrorProps = () => this.errorProps;
  getData = () => this.data;
}
module.exports = MessageHandler;
