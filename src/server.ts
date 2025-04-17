import express from "express";
import session from "express-session";
import passport from "passport";
import { Strategy as TwitterStrategy } from "passport-twitter";
import cors from "cors";
import dotenv from "dotenv";
import { prisma } from "./lib/prisma";

dotenv.config();

const app = express();
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
  })
);

// Session configuration
app.use(
  session({
    secret: process.env.SESSION_SECRET || "your-secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
  })
);

// Middleware
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());
app.use(passport.initialize());
app.use(passport.session());

// Passport configuration
passport.use(
  new TwitterStrategy(
    {
      consumerKey: process.env.TWITTER_CLIENT_ID!,
      consumerSecret: process.env.TWITTER_CLIENT_SECRET!,
      callbackURL: "http://localhost:3001/auth/twitter/callback",
      includeEmail: true,
    },
    async (
      token: string,
      tokenSecret: string,
      profile: passport.Profile,
      done: (error: Error | null, user?: any) => void
    ) => {
      try {
        console.log("Twitter profile:", profile);
        console.log("Token:", token);
        console.log("Token Secret:", tokenSecret);

        // Check if user exists
        let user = await prisma.user.findUnique({
          where: { email: profile.emails?.[0]?.value || "" },
        });

        if (!user) {
          // Create new user
          user = await prisma.user.create({
            data: {
              name: profile.displayName,
              email: profile.emails?.[0]?.value,
              image: profile.photos?.[0]?.value,
            },
          });
        }

        // Save login attempt
        await prisma.loginLog.create({
          data: {
            userId: user.id,
            provider: "twitter",
            success: true,
            ipAddress: "", // You would get this from the request in a real implementation
            userAgent: "", // You would get this from the request in a real implementation
          },
        });

        return done(null, user);
      } catch (error) {
        console.error("Authentication error:", error);
        return done(error as Error);
      }
    }
  )
);

// Serialize user
passport.serializeUser((user: Express.User, done) => {
  done(null, user.id);
});

// Deserialize user
passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await prisma.user.findUnique({ where: { id } });
    done(null, user);
  } catch (error) {
    done(error);
  }
});

// Routes
app.get("/auth/twitter", passport.authenticate("twitter"));

app.get(
  "/auth/twitter/callback",
  passport.authenticate("twitter", {
    successRedirect: "/dashboard",
    failureRedirect: "/login",
  })
);

app.get("/api/user", (req, res) => {
  if (req.isAuthenticated()) {
    res.json(req.user);
  } else {
    res.status(401).json({ error: "Not authenticated" });
  }
});

app.get("/api/logout", (req, res) => {
  req.logout(() => {
    res.redirect("/");
  });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
