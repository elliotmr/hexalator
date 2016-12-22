import React, {Component, PropTypes} from 'react';

class EndianSelect extends Component {
    constructor(props) {
        super(props);
        this.handleChange = this
            .handleChange
            .bind(this);
    }

    static propTypes = {
        value: PropTypes.string.isRequired,
        update: PropTypes.func.isRequired
    }

    handleChange(event) {
        const {update} = this.props;
        update(event.target.value);
    }

    render() {
        const {value} = this.props;
        return (
            <select value={value} onChange={this.handleChange}>
                <option value="big">Big</option>
                <option value="little">Little</option>
            </select>
        )
    }
}

export default EndianSelect;