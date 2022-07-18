const passport = require("passport");
const { Strategy: JwtStrategy, ExtractJwt } = require("passport-jwt");
const { User } = require("../models");
const JwtOption = {
  secretOrKey: process.env.JWT_SECRET_KEY || "undefineKey",
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
};

passport.use(
  new JwtStrategy(JwtOption, async (payload, done) => {
    try {
      const user = await User.findOne({ where: { id: payload.id } });

      if (!user) {
        return done(new Error("user not found"), false);
      }

      return done(null, { id: user.id });
    } catch (err) {
      done(err, false);
    }
  })
);
