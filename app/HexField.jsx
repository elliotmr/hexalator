import React, {Component, PropTypes} from 'react';
import _ from 'lodash';

class HexField extends Component {
    constructor(props) {
        super(props);
        this.handleChange = this
            .handleChange
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
        update("hex", event.target.value);
    }

    componentWillUpdate(nextProps, nextState) {
        const split = nextProps
            .value
            .split(" ");
        if (!_.isEqual(split, this.props.value.split(" ")) && !_.isEqual(split, this.state.splitValue)) {

            this.setState({splitValue: split});
        }
    }

    render() {
        const {splitValue} = this.state;
        const fields = splitValue.map((value, index) => {
            return <input
                type="text"
                value={value}
                onChange={this.handleChange}
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