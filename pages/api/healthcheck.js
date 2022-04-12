const healthcheck = (req, res) => {
  res.status(200).send({ success: true });
};

module.exports = healthcheck;
