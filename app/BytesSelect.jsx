import React, {Component, PropTypes} from 'react';

class BytesSelect extends Component {
    constructor(props) {
        super(props);
        this.handleChange = this
            .handleChange
            .bind(this);
    }

    static propTypes = {
        value: PropTypes.number.isRequired,
        update: PropTypes.func.isRequired
    }

    handleChange(event) {
        const {update} = this.props;
        update(parseInt(event.target.value));
    }

    render() {
        const {value} = this.props;
        return (
            <select value={value.toString()} onChange={this.handleChange}>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="4">4</option>
                <option value="8">8</option>
            </select>
        )
    }
}

export default BytesSelect;