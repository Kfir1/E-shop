const asyncHandler = fn => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
}
// next will get the next piece of middleware
export default asyncHandler;