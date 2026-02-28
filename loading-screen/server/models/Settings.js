const mongoose = require('mongoose');

const SettingsSchema = new mongoose.Schema({
  key: { 
    type: String, 
    required: true, 
    unique: true,
    index: true
  },
  value: { 
    type: mongoose.Schema.Types.Mixed, 
    required: true 
  }
}, { timestamps: true });

// Static method to get a setting by key
SettingsSchema.statics.getSetting = async function(key) {
  const setting = await this.findOne({ key });
  return setting ? setting.value : null;
};

// Static method to set a setting
SettingsSchema.statics.setSetting = async function(key, value) {
  return await this.findOneAndUpdate(
    { key },
    { key, value },
    { upsert: true, new: true }
  );
};

// Static method to get all settings as object
SettingsSchema.statics.getAllSettings = async function() {
  const settings = await this.find({});
  return settings.reduce((acc, setting) => {
    acc[setting.key] = setting.value;
    return acc;
  }, {});
};

module.exports = mongoose.model('Settings', SettingsSchema);
