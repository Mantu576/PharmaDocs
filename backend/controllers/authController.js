const jwt = require('jsonwebtoken');
const SECRET = process.env.JWT_SECRET || 'supersecret';

exports.register = async (req, res) => {
  const { email, username, password } = req.body;
  const existingUser = await User.findOne({ email });
  if (existingUser) return res.status(400).json({ msg: 'User already exists' });

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new User({ email, username, password: hashedPassword });
  await newUser.save();

  res.status(201).json({ msg: 'User registered successfully' });
};

exports.login = async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user) return res.status(400).json({ msg: 'Invalid credentials' });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

  if (user.activeSession) return res.status(403).json({ msg: 'Already logged in on another device' });

  user.activeSession = true;
  await user.save();

  const token = jwt.sign({ userId: user._id }, SECRET, { expiresIn: '1h' });
  res.json({ token });
};
exports.logout = async (req, res) => {
  const userId = req.user?.userId;
  if (!userId) return res.status(401).json({ msg: 'Unauthorized' });

  const user = await User.findById(userId);
  if (!user) return res.status(404).json({ msg: 'User not found' });

  user.activeSession = false;
  await user.save();

  res.json({ msg: 'Logged out successfully' });
};
exports.subscribe = async (req, res) => {
  const userId = req.user?.userId;
  if (!userId) return res.status(401).json({ msg: 'Unauthorized' });

  const { plan } = req.body;
  const user = await User.findById(userId);
  if (!user) return res.status(404).json({ msg: 'User not found' });

  user.subscriptionPlan = plan;
  await user.save();

  res.json({ msg: 'Subscription updated successfully' });
};