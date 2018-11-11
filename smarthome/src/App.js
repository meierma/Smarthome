import React, {Component} from 'react';
import Climate from './components/Climate.js';
import Light from './components/Light.js';

const PAGE_LIGHT = "light";
const PAGE_CLIMATE = "climate";

class App extends Component {

    constructor() {
        super();
        this.reloadContent = this.reloadContent.bind(this);
        this.state = {page: PAGE_CLIMATE};
    }

    reloadContent(contentToLoad) {
        this.setState({
            page: contentToLoad,
        });
    }

    render() {
        return (
            <div className="App">
                <header>
                    Smarthome
                </header>
                <section className="navigation flex-container">
                    <div className="nav-item" onClick={() => this.reloadContent(PAGE_CLIMATE)}>
                        <i className="material-icons">whatshot</i>
                    </div>
                    <div className="nav-item" onClick={() => this.reloadContent(PAGE_LIGHT)}>
                        <i className="material-icons">lightbulb_outline</i>
                    </div>
                </section>
                <section className="content">
                    {this.state.page === PAGE_CLIMATE ? <Climate/> : null}
                    {this.state.page === PAGE_LIGHT ? <Light/> : null}
                </section>
            </div>
        );
    }
}

export default App;
