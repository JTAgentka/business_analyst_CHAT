const { createServer } = require('https');
const { parse } = require('url');
const next = require('next');
const fs = require('fs');
const path = require('path');

const dev = process.env.NODE_ENV !== 'production';
const hostname = '0.0.0.0';
const port = 3001;

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

const httpsOptions = {
  key: fs.readFileSync(path.join(__dirname, 'certificates/key.pem')),
  cert: fs.readFileSync(path.join(__dirname, 'certificates/cert.pem'))
};

app.prepare().then(() => {
  createServer(httpsOptions, async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true);
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error('Error occurred handling', req.url, err);
      res.statusCode = 500;
      res.end('internal server error');
    }
  })
    .once('error', (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, hostname, () => {
      console.log(`> Ready on https://${hostname}:${port}`);
      console.log(`> Also accessible at https://localhost:${port}`);
      console.log(`> Network: https://10.209.226.38:${port}`);
      console.log('\n⚠️  Note: This uses a self-signed certificate.');
      console.log('   You will need to accept the security warning in your browser.\n');
    });
});
