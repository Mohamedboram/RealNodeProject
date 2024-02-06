const wrappedError = (asyncfn) => {
  return (req, res, next) => {
    asyncfn(req, res, next).catch((err) => next(err));
  };
};
export default wrappedError;
