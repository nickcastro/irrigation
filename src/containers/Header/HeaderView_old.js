  <div id="header-container">
    <h1>React Redux Auth0 Kit</h1>

    <ul className="list-inline">
      <li><Link to='/'>Home</Link></li>
      <li><Link to='/about'>About</Link></li>
    </ul>

    { !isAuthenticated ? (
      <button
        onClick={() => {
          authService.login()
          loginRequest()
        }}
      >
        Login
      </button>
    ) : (
      <div>
        <img src={profile.picture} height="40px" alt="profile" />
        <span>Welcome, {profile.nickname}</span>
        <button 
          onClick={() => {
            logoutSuccess()
            AuthService.logout() // careful, this is a static method
            history.push({ pathname: '/login' })
          }}
        >
          Logout
        </button>
      </div>
    )}
    { error &&
      <p>{error}</p>
    }
  </div>