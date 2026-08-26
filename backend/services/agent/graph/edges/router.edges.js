const routeFromRouter = (state) => {

    if (state.selectedAgent === "photo") {
        return "photo";
    }

    if (state.selectedAgent === "search") {
        return "search";
    }

    if (state.selectedAgent === "rag") {
        return "rag";
    }

    return "chat";
};

export default routeFromRouter;