export const CONFIG = {
    env: process.env.ENV!,
    client: process.env.CLIENT!,

    app: {
        baseUrl: process.env.BASE_URL!,
        email: process.env.EMAIL!,
        password: process.env.PASSWORD!,
        timeout: Number(process.env.TIMEOUT),
        retries: Number(process.env.RETRY_ATTEMPTS),
        headless: process.env.HEADLESS !== 'false',
    },

    crm: {
        type: process.env.CRM!,
        url: process.env.CRM_URL!,
        username: process.env.CRM_USERNAME,
        password: process.env.CRM_PASSWORD,
        apiKey: process.env.CRM_API_KEY,
    },
};
