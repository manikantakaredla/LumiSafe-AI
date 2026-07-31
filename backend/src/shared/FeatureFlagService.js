class FeatureFlagService {
  constructor() {
    this.flags = {
      enableAIRecommendations: true,
      enableRouteOptimization: false,
      enableAutoClosure: true,
      enableVerificationEngine: true,
      enableOfflineMode: true
    };
  }

  isEnabled(flagName) {
    return !!this.flags[flagName];
  }

  toggleFlag(flagName, value) {
    this.flags[flagName] = value;
  }
}

export default new FeatureFlagService();
