export const removenullUndefined = (obj) => {
    return Object.fromEntries(
      Object.entries(obj).filter(([_, value]) => {
        if (value === null || value === undefined) return false;
        if (typeof value === "string" && value.trim() === "") return false;
        if (value instanceof Date && isNaN(value.getTime())) return false;
        return true;
      })
    );
  };
  