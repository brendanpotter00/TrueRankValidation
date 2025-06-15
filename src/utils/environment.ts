// Check if we're in development mode
export const isLocalEnv = process.env.NODE_ENV === "development";

// Utility function for logging that only works in local environment
export const devLog = (...args: any[]) => {
  if (isLocalEnv) {
    console.log(...args);
  }
};

// Utility function for error logging that only works in local environment
export const devErrorLog = (...args: any[]) => {
  if (isLocalEnv) {
    console.error(...args);
  }
};
