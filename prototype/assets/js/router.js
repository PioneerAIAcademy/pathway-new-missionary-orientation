// Simple router for screen navigation

class Router {
  constructor() {
    this.screens = new Map();
    this.currentScreen = null;
    this.history = [];
  }
  
  // Register a screen
  register(name, screen) {
    this.screens.set(name, screen);
  }
  
  // Navigate to a screen
  async navigate(name, data = {}) {
    const screen = this.screens.get(name);
    
    if (!screen) {
      console.error(`Screen "${name}" not found`);
      return;
    }
    
    // Hide current screen
    if (this.currentScreen) {
      await this.currentScreen.hide();
    }
    
    // Add to history
    this.history.push({ name, data });
    
    // Show new screen
    this.currentScreen = screen;
    await screen.show(data);
  }
  
  // Go back to previous screen
  async back() {
    if (this.history.length < 2) {
      console.warn('No screen history to go back to');
      return;
    }
    
    // Remove current from history
    this.history.pop();
    
    // Get previous screen
    const previous = this.history[this.history.length - 1];
    
    // Hide current screen
    if (this.currentScreen) {
      await this.currentScreen.hide();
    }
    
    // Show previous screen
    const screen = this.screens.get(previous.name);
    this.currentScreen = screen;
    await screen.show(previous.data);
  }
  
  // Replace current screen (no history)
  async replace(name, data = {}) {
    // Remove current from history
    if (this.history.length > 0) {
      this.history.pop();
    }
    
    await this.navigate(name, data);
  }
  
  // Clear history and navigate
  async reset(name, data = {}) {
    this.history = [];
    await this.navigate(name, data);
  }
}

// Export singleton instance
export const router = new Router();
