import bcrypt from 'bcryptjs';
import pool from '../config/db.js';
import { createUser, findUserByEmail } from '../model/userModel.js';
import { generateToken } from '../utils/generateToken.js';
import { ROLES, RECRUITER_STATUS } from '../constants/roles.js';


export const signup = async (req, res) => {
  const { email, password, role, fullName, ...roleSpecificData } = req.body;

  try {
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({ message: 'Email already registered' });
    }

   
    const passwordHash = await bcrypt.hash(password, 10);

    
    const newUser = await createUser({ email, passwordHash, role, fullName });

    if (role === ROLES.STUDENT) {
      const { branch, passingYear, cgpa } = roleSpecificData;
      await pool.query(
        `INSERT INTO student_profiles (user_id, branch, passing_year, cgpa)
         VALUES ($1, $2, $3, $4)`,
        [newUser.id, branch, passingYear, cgpa]
      );
    } else if (role === ROLES.RECRUITER) {
      const { companyName, companyWebsite, designation } = roleSpecificData;
      await pool.query(
        `INSERT INTO recruiter_profiles (user_id, company_name, company_website, designation, status)
         VALUES ($1, $2, $3, $4, $5)`,
        [newUser.id, companyName, companyWebsite, designation, RECRUITER_STATUS.PENDING]
      );
    }
    
    const token = generateToken(newUser.id, newUser.role);

   
    return res.status(201).json({
      message: 'Signup successful',
      token,
      user: {
        id: newUser.id,
        email: newUser.email,
        role: newUser.role,
        fullName: newUser.full_name,
      },
    });
  } catch (err) {
    console.error('Signup error:', err.message);
    return res.status(500).json({ message: 'Something went wrong during signup' });
  }
};


export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await findUserByEmail(email);


    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    if (!user.is_active) {
      return res.status(403).json({ message: 'Account has been deactivated' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = generateToken(user.id, user.role);

    return res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        fullName: user.full_name,
      },
    });
  } catch (err) {
    console.error('Login error:', err.message);
    return res.status(500).json({ message: 'Something went wrong during login' });
  }
};