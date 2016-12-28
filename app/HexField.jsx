import React, {Component, PropTypes} from 'react';
import _ from 'lodash';
import './HexField.css';

function stringToHex(str) {
    const digits = str.replace(/ /g, '');
    let next = new Array();
    for (let i = 0; i < digits.length; i += 2) {
        next.push(digits.slice(i, i+2));
    }
    return next;
}

class HexField extends Component {
    constructor(props) {
        super(props);
        this.handleChange = this
            .handleChange
            .bind(this);
        this.handleFocus = this
            .handleFocus
            .bind(this);
    }

    state = {
        splitValue: ["00"]
    }

    static propTypes = {
        value: PropTypes.string.isRequired,
        update: PropTypes.func.isRequired
    }

    handleChange(event) {
        const {update} = this.props;
        let stateVals = this.state.splitValue;
        stateVals[event.target.dataset.bytenum] = event.target.value;
        this.setState({splitValue: stateVals});
        const hexString = stateVals.map((byteVal, byteIndex) => {
            switch(byteVal.length) {
                case 0:
                    return "00";
                case 1:
                    return "0" + byteVal;
                case 2:
                    return byteVal;
                default:
                    return byteVal.substr(byteVal.length - 2, byteVal.length);
            }
        }).join(" ");
        update("hex", hexString);
    }

    handleFocus(event) {
        event.target.setSelectionRange(0, event.target.value.length);
    }

    componentWillUpdate(nextProps, nextState) {
        const nextPropsValue = stringToHex(nextProps.value);
        const thisPropsValue = stringToHex(this.props.value);
        if (!_.isEqual(nextPropsValue, thisPropsValue) && !_.isEqual(nextPropsValue, this.state.splitValue)) {
            this.setState({splitValue: nextPropsValue});
        }
    }

    render() {
        const {splitValue} = this.state;
        const fields = splitValue.map((value, index) => {
            return <input
                className="HexField-byte-field"
                type="text"
                value={value}
                onChange={this.handleChange}
                onFocus={this.handleFocus}
                maxLength="2"
                data-bytenum={index}
                key={index}/>
        });
        return (
            <div>Hex: {fields}</div>
        )
    }
}

export default HexField;