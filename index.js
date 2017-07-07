const container = require('./core/main');
const port = container.get('config').port;

container.listen(port, () => console.log('Started at :%d', port));
