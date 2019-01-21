const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');
const config = require('../../config/environment');
const User = require('../user/user.model');
const { UserError } = require('graphql-errors');

const validateJwt = expressJwt({
  secret: config.secret.session,
});

exports.signToken = (id, role) => {
  return jwt.sign(
    {
      _id: id,
      role: role,
    },
    config.secret.session,
    {
      expiresIn: 60 * 60 * 5,
    },
  );
};

exports.validateAuthorization = async (req, res, next) => {
  if (req.headers.authorization) {
    return await validateJwt(req, res, next);
  }
  next();
};

exports.isAuthenticated = fn => async (_, args, ctx) => {
  if (!ctx.req.user) {
    throw new UserError('Access Denied / Forbidden');
  } else {
    if (config.userRoles.indexOf(ctx.req.user.role)) {
      return await fn(...[_, args, ctx]);
    } else {
      throw new UserError('Access Denied / Forbidden');
    }
  }
};

exports.hasRole = (role, fn) => async (_, args, ctx) => {
  if (!ctx.req.user) {
    throw new UserError('Access Denied / Forbidden');
  } else {
    if (
      config.userRoles.indexOf(ctx.req.user.role) >=
      config.userRoles.indexOf(role)
    ) {
      return await fn(...[_, args, ctx]);
    } else {
      throw new UserError('Access Denied / Forbidden');
    }
  }
};
