const { isCelebrateError } = require('celebrate');

const getCelebrateErrorMessage = (err) => {
  const errorBody = err.details.get('body');
  return errorBody.message;
};

module.exports.errorHandler = (err, req, res, next) => {
  if (isCelebrateError(err)) {
    res.status(400).send({ message: getCelebrateErrorMessage(err) });
  } else if (err.name === 'CastError') {
    res.status(400).send({ message: 'Во время обработки запроса произошла ошибка. Проверьте правильность запроса' });
  } else if (!err.code) {
    res.status(500)
      .send(
        { message: 'Произошла непредвиденная ошибка. Проверьте правильность запроса' },
      );
  } else {
    res.status(err.code).send({ message: err.message });
  }

  next();
};
