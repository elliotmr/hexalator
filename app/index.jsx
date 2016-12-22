import React from 'react';
import ReactDOM from 'react-dom';
import App from './App.jsx';
import $ from 'jquery';
import {remote} from 'electron';

let state = {
    type: "integer",
    endian: "little",
    num_bytes: 1,
    data: {
        unsigned_decimal: "0",
        signed_decimal: "0",
        binary: "0",
        hex: '00',
        string: ''
    }
}

function update(type, field, endian, num_bytes, value) {
    $.ajax({
        url: 'http://' + remote.getGlobal('host'),
        type: "POST",
        data: JSON.stringify({type, field, endian, num_bytes, value}),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (resp) {
            if (resp.success) {
                state.data = resp.result;
                state.num_bytes = resp.num_bytes;
                state.endian = resp.endian;
            }
            ReactDOM.render(
                <App state={state} update={update}/>, document.getElementById('root'));
        }
    });
}

update(state.type, "unsigned_decimal", state.endian, state.num_bytes, "0");
ReactDOM.render(
    <App state={state} update={update}/>, document.getElementById('root'))
