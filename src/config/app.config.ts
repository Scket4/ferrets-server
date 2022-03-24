export default () => ({
  environment: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT, 10),
  secret_key: process.env.SECRET_KEY,
  base_url: process.env.BASE_URL,
});