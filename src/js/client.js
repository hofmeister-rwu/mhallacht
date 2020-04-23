import React from "react";
import ReactDOM from "react-dom";
import Styles from "../stylesheets/custom.less";
import Layout from "./pages/Layout";
// Integration von Semantic UI
//
// 1. Schritt Auf der Kommandozeile.
// npm install semantic-ui-react –save
// npm install semantic-ui-css --save

// 2. Schritt: Import von Semantic UI
// import 'semantic-ui-css/semantic.min.css'

const app = document.getElementById('app');

ReactDOM.render(
        <Layout />,
    app);
