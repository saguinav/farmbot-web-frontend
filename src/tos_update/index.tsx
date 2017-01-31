import * as React from "react";
import { render } from "react-dom";
import * as axios from "axios";
import { t, init } from "i18next";
import { AuthState } from "../auth/interfaces";
import { Session } from "../session";
import { error as log, init as logInit } from "../ui";
import { prettyPrintApiErrors } from "../util";
import "../npm_addons";
import { detectLanguage } from "../i18n";
import { API } from "../api";

import "../css/_index.scss";
import "../npm_addons";

interface Props { };
interface State {
    email: string;
    password: string;
    agree_to_terms: boolean;
    serverHost: string;
    serverPort: string;
};


export class Wow extends React.Component<Props, Partial<State>> {
    constructor() {
        super();
        this.submit = this.submit.bind(this);
        this.state = {
            serverHost: API.fetchHostName(),
            serverPort: API.inferPort()
        };
    }

    set(name: keyof State) {
        return function (event: React.FormEvent<HTMLInputElement>) {
            let state: { [name: string]: State[keyof State] } = {};
            state[name] = (event.currentTarget).value;
            this.setState(state);
        };
    }

    submit(e: React.SyntheticEvent<HTMLFormElement>) {
        e.preventDefault();
        let { email, password, agree_to_terms } = this.state;
        let payload = { user: { email, password, agree_to_terms } };
        let url = `//${this.state.serverHost}:${this.state.serverPort}`;
        API.setBaseUrl(url);
        axios
            .post<AuthState>(API.current.tokensPath, payload)
            .then(resp => {
                Session.put(resp.data);
                window.location.href = "/app/controls";
            })
            .catch(error => {
                log(prettyPrintApiErrors(error));
            });
    }

    componentDidMount() {
        logInit();
    }

    render() {
        return <div className="static-page">
            <div className="all-content-wrapper">
                <div className="row">
                    <div className={`widget-wrapper col-md-6 col-md-offset-3 
                        col-sm-6 col-sm-offset-3`}>
                        <div className="row">
                            <div className="col-sm-12">
                                <div className="widget-header">
                                    <h5>{t("Agree to Terms of Service")}</h5>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <form onSubmit={this.submit}>
                                <div className="col-sm-12">
                                    <div className="widget-content">
                                        <div className="input-group">
                                            <label> {t("Email")} </label>
                                            <input type="email"
                                                onChange={this.set("email").bind(this)}>
                                            </input>
                                            <label>{t("Password")}</label>
                                            <input type="password"
                                                onChange={this.set("password").bind(this)}>
                                            </input>
                                            <label>
                                                <input type="checkbox"
                                                    onChange={this.set("agree_to_terms").bind(this)} />
                                                {t("Accept")}
                                            </label>
                                            <div className="row">
                                                <div className="col-xs-12">
                                                    <button className="button-like button green login">
                                                        {t("I Agree to the Terms of Use")}
                                                    </button>
                                                </div>
                                            </div>
                                            <div>
                                                <label>{t("Server URL")}</label>
                                                <input type="text"
                                                    onChange={this.set("serverHost").bind(this)}
                                                    value={this.state.serverHost}>
                                                </input>
                                                <label>{t("Server Port")}</label>
                                                <input type="text"
                                                    onChange={this.set("serverPort").bind(this)}
                                                    value={this.state.serverPort}>
                                                </input>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>;
    }
}

detectLanguage().then((config) => {
    init(config, (err, t) => {
        let node = document.createElement("DIV");
        node.id = "root";
        document.body.appendChild(node);

        let reactElem = React.createElement(Wow, {});
        let domElem = document.getElementById("root");

        if (domElem) {
            render(reactElem, domElem);
        } else {
            throw new Error(t("Add a div with id `root` to the page first."));
        };
    });
});