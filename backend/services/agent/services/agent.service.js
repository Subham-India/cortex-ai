const fs = require('fs');
const path = require('path');

class AgentService {
  async init() {
    // init connections to LLMs, etc.
    this.agents = {};
  }

  async run(agentName, payload) {
    // simple dispatch to an agent module if present
    try {
      const modPath = path.join(__dirname, '..', 'agents', agentName, `${agentName}.agent.js`);
      if (fs.existsSync(modPath)) {
        const mod = require(modPath);
        return await mod.run(payload);
      }
      return { error: 'agent_not_found', agentName };
    } catch (err) {
      throw err;
    }
  }
}

module.exports = AgentService;
