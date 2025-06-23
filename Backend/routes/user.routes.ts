import { Router } from 'express';
import { setUserRole } from '../services/user.service';

const router = Router();

// Route to update a user's role
// PATCH /users/:userId/role
router.patch('/users/:userId/role', async (req, res) => {
  const { userId } = req.params;
  const { role } = req.body;

  if (!role) {
    return res.status(400).send({ error: 'Role is required' });
  }

  try {
    await setUserRole(userId, role);
    return res.status(200).send({ message: `Role updated successfully for user ${userId}` });
  } catch (error) {
    if (error instanceof Error) {
        return res.status(500).send({ error: error.message });
    }
    return res.status(500).send({ error: 'An unexpected error occurred' });
  }
});

export default router; 