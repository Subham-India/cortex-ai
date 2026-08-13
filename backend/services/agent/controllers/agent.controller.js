const AgentService = require('../services/agent.service');

async function handleRun(req, res) {
  const svc = new AgentService();
  const { agent, payload } = req.body || {};
  try {
    const out = await svc.run(agent, payload);
    res.json(out);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { handleRun };
