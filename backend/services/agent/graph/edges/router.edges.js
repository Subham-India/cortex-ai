const routeFromRouter = (state) => {
  if (state.selectedAgent === "search") {
    return "search";
  }

  return "chat";
};

export default routeFromRouter;