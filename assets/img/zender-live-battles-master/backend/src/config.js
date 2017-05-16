require('dotenv').config();

const config = {
	aws: {
		accessKeyId: process.env.AWS_ACCESS_KEY,
		secretAccessKey: process.env.AWS_SECRET_KEY,
		region: 'us-west-2',
		endpoint: process.env.AWS_DYNAMO
	},
	pusher: {
		appId: '317684',
		key: 'f81e5f8eedf682808b8e',
		secret: '7d71b6a5ea860baff39f',
		cluster: 'eu',
		encrypted: true,
	},
	server: {
		apiPortInternal: process.env.API_PORT,
		apiRoutePrefix: process.env.API_PREFIX
	}
};

module.exports = config;
