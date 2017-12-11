// const system = require('./core/main');
// const port = system.get('config').server.port;

// system.listen(port, () => console.log('Started at :%d', port));

import recursiveConfig from 'recursive-config'

const config = recursiveConfig.load({
  defaults: {}
})

console.log(config)
