import React, { Component } from 'react';
import Climate from './components/Climate.js';
import Light from './components/Light.js';

const PAGE_LIGHT = "light";
const PAGE_CLIMATE = "climate";

class App extends Component {

    constructor() {
        super();
        this.reloadContent = this.reloadContent.bind(this);
        this.state = { page: PAGE_CLIMATE };
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
                <section id="nav" className="wrapcircles closed">
                    <div className="circle c-1" onClick={() => this.reloadContent(PAGE_CLIMATE)}>
                        <span className="link"></span>
                    </div>
                    <div className="circle c-2" onClick={() => this.reloadContent(PAGE_LIGHT)}>
                        <span className="link"></span>
                    </div>
                    {/* <div class="circle c-3">
                        <span className="link"></span>
                    </div>
                    <div class="circle c-4">
                        <span className="link"></span>
                    </div> */}
                    <div id="click" className="circle c-5" onClick={() => document.getElementById("nav").classList.toggle("closed")}>
                        <span></span>
                    </div>
                </section>
                <section className="content">
                    {this.state.page === PAGE_CLIMATE ? <Climate /> : null}
                    {this.state.page === PAGE_LIGHT ? <Light /> : null}
                </section>
            </div>
        );
    }
}

export default App;
