const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const sendResponse = require('../utils/sendResponse');

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
exports.register = asyncHandler(async (req, res, next) => {
  const { name, email, password } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists) {
    return next(new ApiError('Email already registered', 400));
  }

  const user = await User.create({ name, email, password });
  const token = user.getSignedJwtToken();

  sendResponse(res, 201, true, 'User registered successfully', {
    token,
    user: { id: user._id, name: user.name, email: user.email, role: user.role },
  });
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    return next(new ApiError('Invalid credentials', 401));
  }

  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    return next(new ApiError('Invalid credentials', 401));
  }

  const token = user.getSignedJwtToken();

  sendResponse(res, 200, true, 'Login successful', {
    token,
    user: { id: user._id, name: user.name, email: user.email, role: user.role },
  });
});

// @desc    Get logged-in user profile
// @route   GET /api/auth/me
// @access  Private
exports.getMe = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  sendResponse(res, 200, true, 'User profile fetched', user);
});

// @desc    Logout (client-side token removal hint)
// @route   POST /api/auth/logout
// @access  Private
exports.logout = asyncHandler(async (req, res, next) => {
  sendResponse(res, 200, true, 'Logged out successfully');
});
