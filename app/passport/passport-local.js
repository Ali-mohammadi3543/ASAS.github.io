const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const User = require('app/models/user');


passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(async function (id, done) {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

passport.use('local.register', new localStrategy({
  passReqToCallback: true
}, (req, number, password, done) => {
  console.log("im out register");
  console.log("im in ,register");
  if (err) return done(err);

  const newUser = new User({
    phone: Otpfind.phone
  });

  newUser.save(err => {
    if (err) return done(err, false, req.flash('errors', 'ثبت نام با موفقیت انجام نشد لطفا دوباره سعی کنید'));
    done(null, newUser);
  })


}))


// passport.use('local.login', new localStrategy({
//   usernameField: 'number'

// }, async (req, number, done) => {
//   try {
//     console.log(Otpfind.phone);
//     console.log(req.body.otp);
//     console.log(number);
//     const user = await User.findOne({ phone: Otpfind.phone });
//     if (!user) {
//       const user = new User({
//         phone: Otpfind.phone
//       })
//       await user.save();


//       console.log(user);
//       if (err) {
//         return next(err);
//       }
//       req.logIn(user, err => {
//         if (err) {
//           return res.json("first");
//         }

//         return res.redirect('/');
//       });
//     }

//     // Assuming password verification logic here
//     return done(null, user);
//   } catch (error) {
//     return res.json('konkash')
//   }
// }));
passport.use('local.login', new localStrategy({
  usernameField: 'number',
  passReqToCallback: true
}, (req, number, done) => {
  User.findOne({ 'phone': number }, (err, user) => {
    if (err) return done(err);


    done(null, user);
  })
}))