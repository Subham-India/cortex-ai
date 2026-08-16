export const groupConversationsByDate = (conversations) => {
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfYesterday = new Date(startOfToday);
  startOfYesterday.setDate(startOfYesterday.getDate() - 1);
  const sevenDaysAgo = new Date(startOfToday);
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const thirtyDaysAgo = new Date(startOfToday);
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const groups = {
    Today: [],
    Yesterday: [],
    "Previous 7 Days": [],
    "Previous 30 Days": [],
  };
  const monthGroups = {};

  const sorted = [...conversations].sort((a, b) => {
    const da = new Date(a.updatedAt || a.createdAt || 0);
    const db = new Date(b.updatedAt || b.createdAt || 0);
    return db - da;
  });

  sorted.forEach((conv) => {
    const d = new Date(conv.updatedAt || conv.createdAt || 0);

    if (d >= startOfToday) {
      groups.Today.push(conv);
    } else if (d >= startOfYesterday) {
      groups.Yesterday.push(conv);
    } else if (d >= sevenDaysAgo) {
      groups["Previous 7 Days"].push(conv);
    } else if (d >= thirtyDaysAgo) {
      groups["Previous 30 Days"].push(conv);
    } else {
      const label = d.toLocaleDateString("en-US", { month: "long", year: "numeric" });
      if (!monthGroups[label]) monthGroups[label] = [];
      monthGroups[label].push(conv);
    }
  });

  const result = Object.entries(groups).filter(([, items]) => items.length > 0);
  const monthResult = Object.entries(monthGroups);

  return [...result, ...monthResult];
};