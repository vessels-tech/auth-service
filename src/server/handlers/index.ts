import * as health from './health'

export default {
  // Map from operationIds in ./swagger.json to our handlers
  HealthGet: health.get
}