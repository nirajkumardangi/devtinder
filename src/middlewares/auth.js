const adminAuth = (req, res, next) => {
  console.log('admin auth is getting checked!');
  const token = 'xyz123';
  const isAdminAuthorized = token === 'xyz123';

  if (!isAdminAuthorized) {
    res.status(401).send('Unauthorized request');
  } else {
    next();
  }
};

const userAuth = (req, res, next) => {
  console.log('user auth is getting checked!');
  const token = 'abc123';
  const isUseruthorized = token === 'abc123';

  if (!isUseruthorized) {
    res.status(401).send('Unauthorized request');
  } else {
    next();
  }
};

module.exports = {
  adminAuth,
  userAuth,
};
