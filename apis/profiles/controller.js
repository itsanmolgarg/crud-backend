const Profile = require('../../models/profile');

const createProfile = async (req, res) => {
    try {
        const { name, description, mbti, enneagram, variant, tritype, socionics, sloan, psyche, image } = req.body;
    
        if (!name) {
            return res.status(400).json({ message: 'Name is required' });
        }
        // Create a new profile document
        const newProfile = new Profile({
          name,
          description,
          mbti,
          enneagram,
          variant,
          tritype,
          socionics,
          sloan,
          psyche,
          image
        });
    
        // Save the profile to the database
        const profile = await newProfile.save();
    
        res.status(201).json({ message: 'Profile created successfully', profile: profile });
      } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
      }
}

const getProfileById = async (req, res) => {
    try {
        const profileId = req?.params?.id;

        if (!profileId) {
            return res.status(400).json({ message: 'Profile id is required' });
        }

        const profile = await Profile.findOne({ _id: profileId });

        if (!profile) {
            return res.status(404).json({ message: 'Profile not found' });
        }

        res.status(200).json({ profile, message: 'Profile found' });
    }
    catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
}
const getAllProfiles = async (req, res) => {
    try {
        const profiles = await Profile.find();
        res.status(200).json({ profiles, message: 'All profiles found' });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
}


module.exports = {
    createProfile,
    getProfileById,
    getAllProfiles
}


