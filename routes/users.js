const router = require('express').Router();
const {
  profileDataValidator,
  avatarDataValidator,
} = require('../validators/user');
const {
  getAllUsers,
  getUser,
  getCurrentUser,
  updateProfile,
  updateAvatar,
} = require('../controllers/users');

router.get('/', getAllUsers);
router.get('/me', getCurrentUser);
router.get('/:userId', getUser);
router.patch('/me', profileDataValidator, updateProfile);
router.patch('/me/avatar', avatarDataValidator, updateAvatar);

module.exports = router;
