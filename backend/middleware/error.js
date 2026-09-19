export function errorHandler(err, _req, res, _next) {
  console.error(err);
  if (err.code === 11000) {
    return res.status(409).json({ message: "That record already exists." });
  }
  const status = err.status || 500;
  res.status(status).json({
    message: status >= 500 ? "Something went wrong. Please try again." : err.message,
  });
}

export function asyncHandler(fn) {
  return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
}
