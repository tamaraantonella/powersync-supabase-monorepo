export function rememberRoute() {
  const { pathname, search } = window.location

  const blacklisted = ['/login', '/logout']
  if (blacklisted.includes(pathname.toLowerCase())) return ''

  if (pathname.length > 1) {
    return `?redirect=${pathname}${search}`
  } else {
    return ''
  }
}
