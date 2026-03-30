// backend/utils/auth.js

const jwt = require("jsonwebtoken");
const { jwtConfig } = require("../config");
const { User } = require("../db/models");

const { secret, expiresIn } = jwtConfig;

// AUTH FLOW:

// 1. User logs in or signs up successfully → setTokenCookie sends JWT cookie to client
// 2. Client makes subsequent requests with JWT cookie → restoreUser verifies JWT, sets req.user if valid
// 3. Protected routes use requireAuth → checks if req.user exists, allows access if authenticated, otherwise returns error

// Request
// → restoreUser
//    → valid token → req.user set
//    → invalid token → cleared
//    → no token → continue

// → requireAuth (only on protected routes)
//    → blocks if req.user is null


// Sends a JWT Cookie after login/signup*
const setTokenCookie = (res, user) => {
  // Create the token.
  const safeUser = {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    userName: user.userName
    // isAdmin: user.isAdmin
  };
  const token = jwt.sign(
    { data: safeUser },
    secret,
    { expiresIn: parseInt(expiresIn) } // 604,800 seconds = 1 week
  );

  const isProduction = process.env.NODE_ENV === "production";

  // Set the token cookie
  res.cookie("token", token, {
    maxAge: expiresIn * 1000, // maxAge in milliseconds
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction && "Lax"
  });

  return token;
};


// gets identity of current user**
const restoreUser = (req, res, next) => {
  const { token } = req.cookies;
  req.user = null;

  // skip verify if token cookie is not set
  if (!token) return next();

  return jwt.verify(token, secret, null, async (err, jwtPayload) => {
    if (err) {
      // log error for debugging
      if (process.env.NODE_ENV !== "production") {
        console.error("JWT verification failed:", err.message);
      }

      // clear invalid/expired token
      res.clearCookie("token");

      return next();
    }

    try {
      const { id } = jwtPayload.data;

      req.user = await User.unscoped().findByPk(id, {
        attributes: {
          include: ["email", "isAdmin", "createdAt", "updatedAt"]
        }
      });

    } catch (e) {
      console.error("Database error in restoreUser:", e);

      res.clearCookie("token");
      return next();
    }

    if (!req.user) {
      // log missing user case
      if (process.env.NODE_ENV !== "production") {
        console.warn("User not found for valid token");
      }

      res.clearCookie("token");
    }

    return next();
  });
};


// If there is no current user, return an error
const requireAuth = function (req, _res, next) {
  if (req.user) return next();

  const err = new Error("Authentication required");
  err.title = "Authentication required";
  err.errors = { message: "Authentication required" };
  err.status = 401;
  return next(err);
}


// ADVANCED: Admin authorization middleware

// If the current user is not an admin, return an error
const requireAdmin = function (req, _res, next) {
  if (req.user && req.user.isAdmin) return next();

  const err = new Error('Admin access required');
  err.title = 'Admin access required';
  err.errors = { message: 'You must be an admin to access this resource' };
  err.status = 403;
  return next(err);
};

// Direct database check for admin status (backup method)
const checkAdmin = async function (userId) {
  try {
    const user = await User.findByPk(userId);
    return user && user.isAdmin === true;
  } catch (error) {
    console.error(`Error checking admin status for user ${userId}:`, error);
    return false;
  }
};

module.exports = {
  setTokenCookie,
  restoreUser,
  requireAuth,
  requireAdmin,
  checkAdmin
};

// *setTokenCookie - setting the JWT cookie after a user is logged in or signed up. It takes in the response and the session user and generates a JWT using the imported secret. It is set to expire in however many seconds you set on the JWT_EXPIRES_IN key in the .env file. The payload of the JWT will be the user"s id, userName, and email attributes. Do NOT add the user"s hashedPassword attribute to the payload. After the JWT is created, it"s set to an HTTP-only cookie on the response as a token cookie.


// **restoreUser - Certain authenticated routes will require the identity of the current session user. Create and utilize a middleware function called restoreUser that will restore the session user based on the contents of the JWT cookie.

// Create a middleware function that will verify and parse the JWT"s payload and search the database for a User with the id in the payload. The default scope on the User model, however, prevents the hashedPassword, email, createdAt, and updatedAt attributes from returning from that search. You want to include the email, createdAt, and updatedAt attributes to be returned in the search (but not hashedPassword).

// If there is a User found in the search, then save the user to a key of user onto the Request (req.user). If there is an error verifying the JWT or a Usercannot be found with the id in the JWT payload, then clear the token cookie from the response and set req.user to null.

// If there is a User found in the search, then save the user to a key of user onto the Request (req.user). If there is an error verifying the JWT or a Usercannot be found with the id in the JWT payload, then clear the token cookie from the response and set req.user to null.

// The "restoreUser" middleware will be connected to the API router so that all API route handlers will check if there is a current user logged in or not.


// ***requireAuth - The last authentication middleware to add is for requiring a session user to be authenticated before accessing a route.

// Create an Express middleware called requireAuth. Define this middleware as an array with the restoreUser middleware function you just created as the first element in the array. This will ensure that if a valid JWT cookie exists, the session user will be loaded into the req.user attribute. The second middleware will check req.user and will go to the next middleware if there is a session user present there. If there is no session user, then an error will be created and passed along to the error-handling middlewares.

// "requireAuth" will be connected directly to route handlers where there needs to be a current user logged in for the actions in those route handlers.