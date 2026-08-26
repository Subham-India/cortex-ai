import routerAgent from "../../agents/router/router.agent.js";

const routerNode = async (state) => {

    try {

        const selectedAgent = await routerAgent(
            state.userMessage
        );

        console.log(
            "Selected Agent:",
            selectedAgent
        );

        return {
            selectedAgent,
        };

    } catch (error) {

        console.error(
            "Router Node Error:",
            error
        );

        return {
            selectedAgent: "chat",
            error: error.message,
        };
    }
};

export default routerNode;