class User {
  constructor(username, email, loggedIn) {
    this.username = username;
    this.email = email;
    this.loggedIn = loggedIn;
  }

  login() {
    // Implement login logic here
    // Set `this.loggedIn` to `true`
  }

  logout() {
    // Implement logout logic here
    // Set `this.loggedIn` to `false`
  }
}

module.exports = User;