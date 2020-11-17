import React, { Component } from 'react';
import Nav from './components/Nav';
import LoginForm from './components/LoginForm';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      displayed_form: '',
      logged_in: localStorage.getItem('token') ? true : false,
      username: '',
      info: [],
      point_result: [],
      point_uri: 'http://localhost/api/get_points/?limit=10&offset=0',
      point_next: null,
      point_previous: null,
      track_result: [],
      track_uri: 'http://localhost/api/track/?limit=10&offset=0',
      track_next: null,
      track_previous: null,
      date: new Date(),
    };
  }

  componentDidMount() {
    if (this.state.logged_in) {
        this.getPointsData();
        this.getTrackData();
        this.getInfo();
        this.timerID = setInterval(
              () => this.getTrackData(),
              5000
            );
    }
  }

  componentWillUnmount() {
    clearInterval(this.timerID);
  }

  getInfo() {
      fetch('http://localhost/api/info/', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })
      .then(res => {
        if (res.status === 401 || res.status === 403) {
            this.catchError(res.status);
            throw new Error('Something went wrong');
        }
        return res.json()
      })
      .then(json => {
        this.setState({ username: json.me.username, info: json.info });
      })
      .catch(error => {
        this.setState({logged_in: false});
        localStorage.removeItem('token');
      })
  }

  getPointsData() {
      fetch(this.state.point_uri, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })
      .then(res => {
        if (res.status === 401 || res.status === 403) {
            this.catchError(res.status);
            throw new Error('Something went wrong');
        }
        return res.json()
      })
      .then(json => {
        this.setState({ point_result: json.results, point_next: json.next, point_previous: json.previous });
      })
      .catch(error => {
        this.setState({logged_in: false});
        localStorage.removeItem('token');
      })
  }

  getTrackData() {
      fetch(this.state.track_uri, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })
      .then(res => {
        if (res.status === 401 || res.status === 403) {
            this.catchError(res.status);
            throw new Error('Something went wrong');
        }
        return res.json()
      })
      .then(json => {
        this.setState({ track_result: json.results, track_next: json.next, track_previous: json.previous });
      })
      .catch(error => {
        this.setState({logged_in: false});
        localStorage.removeItem('token');
      })
  }

  addTrack() {
    let start_point = document.getElementById('start-track-point-id').value;
    let end_point = document.getElementById('end-track-point-id').value;
    var data = {first_point: start_point, end_point: end_point};
    fetch('http://localhost:80/api/track/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(data)
    })
      .then(res => {
        document.getElementById('start-track-point-id').value = '';
        document.getElementById('end-track-point-id').value = '';
      })
  }

  catchError = (e) => {
    this.setState({ logged_in: false, username: '', displayed_form: 'login' });
    localStorage.removeItem('token');
  }

  updateList = (e) => {
    if (e.target.id === 'previous-btn-id' && this.state.point_previous) {
        this.setState({point_uri: this.state.point_previous}, () => { this.getPointsData(); });
    }
    else if (e.target.id === 'next-btn-id' && this.state.point_next) {
        this.setState({point_uri: this.state.point_next}, () => { this.getPointsData(); });
    }
  }

  updateTrackList = (e) => {
    if (e.target.id === 'previous-track-btn-id' && this.state.point_previous) {
        this.setState({track_uri: this.state.track_previous}, () => { this.getTrackData(); });
    }
    else if (e.target.id === 'next-track-btn-id' && this.state.point_next) {
        this.setState({track_uri: this.state.track_next}, () => { this.getTrackData(); });
    }
  }

  renderInfo() {
    return (
        <div>
            <table>
                <thead>
                    <tr>
                        <th>№</th>
                        <th>Username</th>
                        <th>Tracks number</th>
                        <th>Tracks length</th>
                    </tr>
                </thead>
                <tbody>
                    {this.renderInfoBody()}
                </tbody>
            </table>
        </div>
    )
  }

  renderInfoBody() {
    return this.state.info.map((r) => {
        return (
            <tr>
                <th>{r.id}</th>
                <th>{r.username}</th>
                <th>{r.tracks}</th>
                <th>{r.sum_length}</th>
            </tr>
        )
    })
  }

  renderTable() {
    return (
        <div>
            <table>
                <thead>
                    <tr>
                        <th>№</th>
                        <th>Name</th>
                        <th>Coordinates</th>
                    </tr>
                </thead>
                <tbody>
                    {this.renderBody()}
                </tbody>
            </table>
            <input type='button' key='previous' id='previous-btn-id' onClick={this.updateList} value='<' />
            <input type='button' key='next' id='next-btn-id' onClick={this.updateList} value='>' />
        </div>
    )
  }

  renderBody() {
    return this.state.point_result.map((r) => {
        return (
            <tr>
                <th>{r.id}</th>
                <th>{r.name}</th>
                <th>{r.x_coord} {r.y_coord}</th>
            </tr>
        )
    })
  }

  renderTrackTable() {
    return (
        <div>
            <table>
                <thead>
                    <tr>
                        <th>№</th>
                        <th>Owner</th>
                        <th>Name</th>
                        <th>Track</th>
                    </tr>
                </thead>
                <tbody>
                    {this.renderTrackBody()}
                </tbody>
            </table>
            <input type='button' key='track-previous' id='previous-track-btn-id' onClick={this.updateTrackList} value='<' />
            <input type='button' key='track-next' id='next-track-btn-id' onClick={this.updateTrackList} value='>' />
            <div>
                <p>Start point id</p>
                <input type='number' key='track-point-start' id='start-track-point-id' />
                <p>End point id</p>
                <input type='number' key='track-point-end' id='end-track-point-id' />
                <div>
                    <input type='button' key='track-create' id='next-track-btn-id' onClick={this.addTrack} value='Create' />
                </div>
            </div>
        </div>
    )
  }

  renderTrackBody() {
    return this.state.track_result.map((r) => {
        return (
            <tr>
                <th>{r.id}</th>
                <th>{r.owner.username}</th>
                <th>{r.name}</th>
                <th>{this.renderTrackWay(r.points)}</th>
            </tr>
        )
    })
  }

  renderTrackWay(points) {
    return points.map((p) =>{
        return (
            <span>
                -> {p.name}
            </span>
        )
    })
  }

  renderPage() {
    return (
        <div>
            <h3>Hello, {this.state.username}</h3>
            {this.renderInfo()}
            <hr />
            {this.renderTable()}
            <hr />
            {this.renderTrackTable()}
        </div>
    )
  }

  handle_login = (e, data) => {
    e.preventDefault();
    fetch('http://localhost:80/api/token/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
      .then(res => res.json())
      .then(json => {
        localStorage.setItem('token', json.access);
        this.setState({
          logged_in: true,
          displayed_form: '',
        }, () => { this.getPointsData(); this.getTrackData(); this.getInfo(); });
      });
  };

  handle_logout = () => {
    localStorage.removeItem('token');
    this.setState({ logged_in: false, username: '' });
  };

  display_form = form => {
    this.setState({
      displayed_form: form
    });
  };

  render() {
    let form;
    switch (this.state.displayed_form) {
      case 'login':
        form = <LoginForm handle_login={this.handle_login} />;
        break;
      default:
        form = null;
    }

    return (
      <div className="App">
        <Nav
          logged_in={this.state.logged_in}
          display_form={this.display_form}
          handle_logout={this.handle_logout}
        />
        {form}
        <h3>
          {this.state.logged_in
            ? this.renderPage()
            : 'Please Log In'}
        </h3>
      </div>
    );
  }
}

export default App;