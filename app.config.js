module.exports = ({ config }) => ({
  ...config,
  extra: {
    ...config.extra,
    revenueCatIosApiKey: process.env.REVENUECAT_IOS_API_KEY,
    revenueCatAndroidApiKey: process.env.REVENUECAT_ANDROID_API_KEY,
  },
});