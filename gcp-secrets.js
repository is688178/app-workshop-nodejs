class SecretReader {
    constructor() {
        const {SecretManagerServiceClient} = require('@google-cloud/secret-manager');
        this.SecretManagerServiceClient = new SecretManagerServiceClient();
        this.GOOGLE__CLOUD_PROJECT = process.env.GOOGLE__CLOUD_PROJECT
    }

    async getSecretValue(secret, version = 'latest') {
        const [vs] = await this.SecretManagerServiceClient.accessSecretVersion({
            name: `projects/${this.GOOGLE_CLOUD_PROJECT}/secrets/${secret}/versions/${version}`,
        });

        const payload = vs.payload.data.toString('utf8');
        return payload
    }

    getAllValues(secrets) {
        let allCalls = secrets.map(async s => this.getSecretValue(s))
        return Promise.all(allCalls)
    }
}