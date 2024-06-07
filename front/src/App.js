import React from 'react';

function App() {
  const [message, setMessage] = React.useState("");

  React.useEffect(() => {
    fetch('http://localhost:8000/')
      .then(response => response.json())
      .then(data => setMessage(data.Hello));
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <p>
          {message}
        </p>
      </header>
    </div>
  );
}

export default App;
