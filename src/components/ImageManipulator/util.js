export function luminance(c) {
  // return (c.r + c.b + c.g) / 3.0
  return c.r * 0.2126 + c.g * 0.7152 + c.b * 0.0722
}
