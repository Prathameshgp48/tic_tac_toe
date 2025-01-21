import { User } from "../models/user.model.js"

const registerUser = async (req, res) => {
    const { username, email, password } = req.body.formData

    if (!username || !email || !password) {
        return res.status(400).json({ message: "All details are required" })
    }

    const existing = await User.findOne({ $or: [{ email }, { username }] })
    if (existing) {
        return res.status(400).json({ message: "User already exists" })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
        return res.status(400).json({ message: "Please enter valid email" })
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
    if (!passwordRegex.test(password)) {
        return res.status(400).json({ message: "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character" })
    }

    const user = await User.create({
        username,
        email,
        password,
    })

    const userData = {
        id: user._id,
        username: user.username,
        email: user.email,
    }

    return res.status(201).json({ message: "User registered successfully", data: userData })
}

const loginUser = async (req, res) => {
    const { email, password } = req.body.login;

    if (!email || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
        return res.status(400).json({ message: "User not found" });
    }

    const passwordMatch = await user.isPasswordMatch(password);
    if (!passwordMatch) {
        return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = await user.generateToken();
    if (!token) {
        return res.status(400).json({ message: "Something went wrong" });
    }

    // Setup cookie options
    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",  // Ensure the cookie is sent over HTTPS only in production
        sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax", // Make sure it's allowed cross-site in production
        maxAge: 7 * 24 * 60 * 60 * 1000,  // 1 week
    };

    // Send the cookie with the response
    res.cookie("token", token, options);

    // Mark user as online
    user.isOnline = true;
    await user.save();

    return res.status(200).json({ message: "Login Successful!🥳", success: true, token, username: user.username });
};


const logoutUser = async (req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                refreshToken: 1,
                isOnline: false
            }
        },
        {
            new: true,
        }
    )

    u

    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "none"
    }


    return res
        .status(200)
        .clearCookie("token", options)
        .json({ message: "Logged-out Sucessfully" })
}

const getUser = async (req, res) => {
    const userId = req.user._id
    try {
        const user = await User.findById(userId)
        return res.status(200).json(user)
    } catch (error) {
        console.log('Error', error)
        return res.status(500).json({ message: 'Something went wrong' })
    }
}

const updateUserProfile = async (req, res) => {
    const userId = req.user._id
    const { username, email, password } = req.body

    try {
        const user = await User.findById(userId)
        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }

        user.username = username || user.username
        user.email = email || user.email
        user.password = password || user.password
        await user.save()

        return res.status(200).json({ message: "Profile updated successfully", success: true })
    } catch (error) {
        return res.status(500).json({ message: "Something went wrong" })
    }
}

const isAuthenticated = async (req, res) => {
    try {
        return res.status(200).json({ success: true })
    } catch (error) {
        return res.status(200).json({ success: false, error: error.message })
    }
}

export {
    registerUser,
    loginUser,
    logoutUser,
    isAuthenticated,
    getUser,
    updateUserProfile
}