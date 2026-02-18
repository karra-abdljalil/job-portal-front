export const formatRelativeDate = (dateString) => {
  if (!dateString) return ""

  const now = new Date()
  const date = new Date(dateString)

  const diffInSeconds = Math.floor((now - date) / 1000)

  const intervals = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60,
  }

  for (const key in intervals) {
    const value = Math.floor(diffInSeconds / intervals[key])
    if (value >= 1) {
      return `${value} ${key}${value > 1 ? "s" : ""} ago`
    }
  }

  return "Just now"
}

export const formatDate = (dateString) => {
  if (!dateString) return ""

  const date = new Date(dateString)

  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

export const formatTime = (dateString) => {
  if (!dateString) return "";

  const date = new Date(dateString);

  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
};
