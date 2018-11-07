import React, {Component} from 'react';
import './App.scss';
import {Route, Switch} from "react-router-dom";

import Header from './pages/Header';
import Footer from './pages/Footer';
import Main from './pages/Main';

class App extends Component {
    render() {
        return (
            <div className="App">
                <Header/>
                <div id="main">
                    <Switch>
                        <Route exact path="/" component={Main} />
                        <Route exact path="/:resource" component={Main} />
                    </Switch>
                </div>
                <Footer/>
            </div>
        );
    }
}

export default App;
