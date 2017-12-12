import aws from 'aws-sdk'
import Bluebird from 'bluebird'

import config from 'infrastructure/config'

aws.config.update(config.s3)
aws.config.setPromisesDependency(Bluebird)

export default new aws.S3(config.s3)
