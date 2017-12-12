import redis from 'infrastructure/redis'

export function get(key, json = true) {
  return redis
    .get(`cache:${key}`)
    .then(value => {
      return json ? JSON.parse(value) : value
    })
}

export function set(key, value, json = true) {
  return redis
    .set(`cache:${key}`, json ? JSON.stringify(value) : value)
}

export function remove(key) {
  return redis
    .del(`cache:${key}`)
}

export function incr(key) {
  return redis.incr(`cache:${key}`)
}
