import axios, { AxiosResponse } from "axios";
import dotenv from "dotenv";
import OAuth from "oauth-1.0a";
import crypto from "crypto";

// Type declarations for oauth-1.0a
declare module "oauth-1.0a" {
  interface OAuthOptions {
    consumer: {
      key: string;
      secret: string;
    };
    signature_method: string;
    hash_function: (base_string: string, key: string) => string;
  }

  interface OAuthData {
    url: string;
    method: string;
    data?: Record<string, unknown>;
  }

  interface OAuthToken {
    key: string;
    secret: string;
  }

  interface OAuthHeaders {
    [key: string]: string;
  }

  class OAuth {
    constructor(options: OAuthOptions);
    toHeader(data: OAuthData): OAuthHeaders;
    authorize(request_data: OAuthData, token?: OAuthToken): OAuthData;
  }
}

// Custom error type for Twitter API errors
interface TwitterApiError extends Error {
  response?: {
    status: number;
    data: {
      detail: string;
    };
    headers: {
      "x-rate-limit-reset"?: string;
    };
  };
}

// Toast notification function
const showToast = (
  message: string,
  type: "info" | "warning" | "error" = "info"
) => {
  const colors = {
    info: "\x1b[36m", // Cyan
    warning: "\x1b[33m", // Yellow
    error: "\x1b[31m", // Red
  };
  console.log(`${colors[type]}[${type.toUpperCase()}] ${message}\x1b[0m`);
};

dotenv.config();

const data = {
  id: "1684871141956239361",
  name: "Tarun k saini",
  username: "imtarun_saini",
};

// OAuth credentials from environment variables
const CONSUMER_KEY = process.env.TWITTER_API_KEY;
const CONSUMER_SECRET = process.env.TWITTER_API_SECRET;
const ACCESS_TOKEN = process.env.TWITTER_ACCESS_TOKEN;
const ACCESS_TOKEN_SECRET = process.env.TWITTER_ACCESS_TOKEN_SECRET;

if (
  !CONSUMER_KEY ||
  !CONSUMER_SECRET ||
  !ACCESS_TOKEN ||
  !ACCESS_TOKEN_SECRET
) {
  showToast(
    "Error: Twitter OAuth credentials are not set in environment variables",
    "error"
  );
  process.exit(1);
}

// Rate limiting configuration
const RATE_LIMIT = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 180, // Twitter's standard rate limit
  currentRequests: 0,
  resetTime: Date.now(),
};

// Request queue to manage concurrent requests
const requestQueue: Array<() => Promise<void>> = [];
let isProcessing = false;

// Function to check and update rate limits
const checkRateLimit = async () => {
  const now = Date.now();

  // Reset counter if window has passed
  if (now > RATE_LIMIT.resetTime) {
    RATE_LIMIT.currentRequests = 0;
    RATE_LIMIT.resetTime = now + RATE_LIMIT.windowMs;
    showToast("Rate limit window reset", "info");
  }

  // If we've hit the rate limit, wait until the window resets
  if (RATE_LIMIT.currentRequests >= RATE_LIMIT.maxRequests) {
    const waitTime = RATE_LIMIT.resetTime - now;
    showToast(
      `Rate limit reached. Waiting ${Math.ceil(waitTime / 1000)} seconds...`,
      "warning"
    );
    await new Promise((resolve) => setTimeout(resolve, waitTime));
    RATE_LIMIT.currentRequests = 0;
    RATE_LIMIT.resetTime = Date.now() + RATE_LIMIT.windowMs;
    showToast("Rate limit window reset", "info");
  }

  RATE_LIMIT.currentRequests++;
  showToast(
    `Requests remaining: ${
      RATE_LIMIT.maxRequests - RATE_LIMIT.currentRequests
    }`,
    "info"
  );
};

// Process queue function
const processQueue = async () => {
  if (isProcessing || requestQueue.length === 0) return;

  isProcessing = true;
  try {
    while (requestQueue.length > 0) {
      await checkRateLimit();
      const request = requestQueue.shift();
      if (request) {
        await request();
      }
    }
  } finally {
    isProcessing = false;
  }
};

// Initialize OAuth 1.0a
const oauth = new OAuth({
  consumer: {
    key: CONSUMER_KEY,
    secret: CONSUMER_SECRET,
  },
  signature_method: "HMAC-SHA1",
  hash_function(base_string: string, key: string) {
    return crypto.createHmac("sha1", key).update(base_string).digest("base64");
  },
});

// Function to make authenticated requests with rate limiting
const makeRequest = async (url: string): Promise<AxiosResponse> => {
  return new Promise((resolve, reject) => {
    const requestFunction = async () => {
      try {
        const request_data = {
          url,
          method: "GET",
        };

        const oauthHeaders = oauth.toHeader(
          oauth.authorize(request_data, {
            key: ACCESS_TOKEN,
            secret: ACCESS_TOKEN_SECRET,
          })
        );

        const res = await axios.get(url, {
          headers: {
            ...oauthHeaders,
            "Content-Type": "application/json",
          },
        });

        // Check for rate limit headers
        const remainingRequests = res.headers["x-rate-limit-remaining"];
        const resetTime = parseInt(res.headers["x-rate-limit-reset"]) * 1000;

        if (remainingRequests && resetTime) {
          RATE_LIMIT.currentRequests =
            RATE_LIMIT.maxRequests - parseInt(remainingRequests);
          RATE_LIMIT.resetTime = resetTime;
          showToast(
            `API Rate Limit: ${remainingRequests} requests remaining`,
            "info"
          );
        }

        resolve(res);
      } catch (error: unknown) {
        const twitterError = error as TwitterApiError;
        if (twitterError.response?.status === 429) {
          // Rate limit exceeded, retry after delay
          const resetTime =
            parseInt(
              twitterError.response.headers["x-rate-limit-reset"] || "0"
            ) * 1000;
          const waitTime = resetTime - Date.now();
          showToast(
            `Rate limit exceeded. Waiting ${Math.ceil(
              waitTime / 1000
            )} seconds...`,
            "warning"
          );
          await new Promise((r) => setTimeout(r, waitTime));
          requestQueue.unshift(requestFunction);
          processQueue();
        } else {
          showToast(`Error: ${twitterError.message}`, "error");
          reject(twitterError);
        }
      }
    };

    requestQueue.push(requestFunction);
    processQueue();
  });
};

// Get user mentions with rate limiting
const getMentions = async () => {
  try {
    showToast("Fetching mentions...", "info");
    const url = `https://api.twitter.com/2/users/${data.id}/mentions`;
    const res = await makeRequest(url);
    console.log("Mentions:", res.data);
    showToast("Mentions fetched successfully!", "info");
  } catch (error: unknown) {
    const twitterError = error as TwitterApiError;
    if (twitterError.response) {
      showToast(
        `Twitter API Error: ${twitterError.response.data.detail}`,
        "error"
      );
    } else {
      showToast(`Error fetching mentions: ${twitterError.message}`, "error");
    }
  }
};

// Get user's recent likes with rate limiting
const getRecentLikes = async () => {
  try {
    showToast("Fetching recent likes...", "info");
    const url = `https://api.twitter.com/2/users/${data.id}/liked_tweets`;
    const res = await makeRequest(url);
    console.log("Recent Likes:", res.data);
    showToast("Recent likes fetched successfully!", "info");
  } catch (error: unknown) {
    const twitterError = error as TwitterApiError;
    if (twitterError.response) {
      showToast(
        `Twitter API Error: ${twitterError.response.data.detail}`,
        "error"
      );
    } else {
      showToast(
        `Error fetching recent likes: ${twitterError.message}`,
        "error"
      );
    }
  }
};

// Get user's followers with rate limiting
const getFollowers = async () => {
  try {
    showToast("Fetching followers...", "info");
    const url = `https://api.twitter.com/2/users/${data.id}/followers`;
    const res = await makeRequest(url);
    console.log("Followers:", res.data);
    showToast("Followers fetched successfully!", "info");
  } catch (error: unknown) {
    const twitterError = error as TwitterApiError;
    if (twitterError.response) {
      showToast(
        `Twitter API Error: ${twitterError.response.data.detail}`,
        "error"
      );
    } else {
      showToast(`Error fetching followers: ${twitterError.message}`, "error");
    }
  }
};

// Export functions for individual use
export { getMentions, getRecentLikes, getFollowers };
