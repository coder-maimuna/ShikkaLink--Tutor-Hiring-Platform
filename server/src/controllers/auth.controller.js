const authService = require('../services/auth.service');

exports.registerStudent = async (req, res) => {
  try {
    const result = await authService.registerStudent(req.body);

    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({
      message: error.message
    });
  }
};

exports.registerTutor = async (req, res) => {
  try {
    const result = await authService.registerTutor(req.body);

    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({
      message: error.message
    });
  }
};

exports.login = async (req, res) => {
  try {
    const result = await authService.login(req.body);

    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({
      message: error.message
    });
  }
};