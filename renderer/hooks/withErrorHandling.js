
// 
const withErrorHandling = (asyncFn, { label, onError, onFinally } = {}) => {
  if (typeof asyncFn !== "function") {
    throw new Error("withErrorHandling expects a function.");
  }

  return async (...args) => {
    try {
      /**
       * Debugging purpose only
       * ex) handleSelectSearchResult :
       *  async (entry) => {  == ...args
       */
      console.log("withErrorHandling ...args", ...args);
      
      return await asyncFn(...args);
    } catch (error) {
      if (label) {
        console.error(label, error);
      } else {
        console.error(error);
      }
      if (typeof onError === "function") {
        onError(error);
      }
      return undefined;
    } finally {
      if (typeof onFinally === "function") {
        onFinally();
      }
    }
  };
};

export default withErrorHandling;
