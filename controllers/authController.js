const supabase = require("../supabase"); // Import Supabase instance
const Joi = require("joi"); // Untuk validasi

// Skema validasi
const registerSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  username: Joi.string().min(3).max(50).required(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

// Fungsi register
const register = async (req, res) => {
  const { email, password, username } = req.body;

  // Validasi input
  const { error } = registerSchema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  try {
    const { user, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) {
      return res.status(400).json({ message: authError.message });
    }

    const { data, error: profileError } = await supabase
      .from("profiles")
      .insert([{ id: user.id, username, email }]);
      console.log('Profile Insert Result:', data);

    if (profileError) {
      console.error("Error inserting profile:", profileError);
      throw profileError;
    }

    res.status(201).json({
      message: "User registered successfully",
      user: { id: user.id, email, username },
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error registering user", error: error.message });
  }
};

// Fungsi login
const login = async (req, res) => {
  const { email, password } = req.body;

  // Validasi input
  const { error } = loginSchema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  try {
    const {
      user,
      session,
      error: authError,
    } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      return res.status(400).json({ message: authError.message });
    }

    const { data: userProfile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (profileError) {
      console.error("Error fetching profile:", profileError);
      throw profileError;
    }

    res.status(200).json({
      message: "Login successful",
      token: session.access_token, // Token untuk API
      user: { id: user.id, email, username: userProfile.username }, // Data profil
    });
  } catch (error) {
    res.status(500).json({ message: "Error logging in", error: error.message });
  }
};

module.exports = { register, login };
