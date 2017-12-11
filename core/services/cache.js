import redis from 'infrastructure/redis'

export function get(key) {
  return redis
    .get(`cache:${key}`)
}

export function set(key, value) {
  return redis
    .set(`cache:${key}`, value)
}

export function remove(key) {
  return redis
    .del(`cache:${key}`)
}
