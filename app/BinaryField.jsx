import React, {Component, PropTypes} from 'react';
import _ from 'lodash';
import './BinaryField.css';

function stringToBin(str) {
    const digits = str
        .replace(/ /g, '')
        .split('');
    let next = new Array();
    for (let i = 0; i < Math.floor(digits.length / 8); i++) {
        next.push(digits.slice(i * 8, i * 8 + 8).map((value, index) => {
            return !(value === "0");
        }));
    }
    return next;
}

class BinaryField extends Component {
    constructor(props) {
        super(props);
        this.handleChange = this
            .handleChange
            .bind(this);
    }

    state = {
        binValue: stringToBin("00000000")
    }

    static propTypes = {
        value: PropTypes.string.isRequired,
        update: PropTypes.func.isRequired
    }

    handleChange(event) {
        const {update} = this.props;
        let binVal = this.state.binValue;
        let ds = event.target.dataset;
        binVal[ds.bytenum][ds.bitnum] = event.target.value;
        this.setState({binValue: binVal});
        const binString = binVal.map((byteVal, byteIndex) => {
            return byteVal.map((bitVal, bitIndex) => {
                return bitVal
                    ? "1"
                    : "0";
            }).join("");
        })
            .join(" ")
            .trim();
        update("binary", binString);
    }

    componentWillUpdate(nextProps, nextState) {
        const nextPropsValue = stringToBin(nextProps.value);
        const thisPropsValue = stringToBin(this.props.value);
        if (!_.isEqual(nextPropsValue, thisPropsValue) && !_.isEqual(nextPropsValue, this.state.binValue)) {
            this.setState({binValue: nextPropsValue});
        }
    }

    render() {
        const {binValue} = this.state;
        let fields = binValue.map((byteVal, byteIndex) => {
            const bytes = byteVal.map((bitVal, bitIndex) => {
                return (<input
                    className="BinaryField-bit-check"
                    type="checkbox"
                    checked={bitVal}
                    onChange={this.handleChange}
                    key={bitIndex}
                    data-bytenum={byteIndex}
                    data-bitnum={bitIndex}/>)
            })
            return (
                <div className="BinaryField-byte-div" key={byteIndex}>
                    {bytes}
                </div>
            )
        });
        return <div>Binary: {fields.reverse()}</div>;
    }
}

export default BinaryField;