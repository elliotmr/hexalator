import React, {Component, PropTypes} from 'react';

class StringField extends Component {
    constructor(props) {
        super(props);
        this.handleChange = this
            .handleChange
            .bind(this);
    }

    state = {
        inputValue: ""
    }

    static propTypes = {
        value: PropTypes.string.isRequired,
        update: PropTypes.func.isRequired
    }

    handleChange(event) {
        const {update} = this.props;
        update("string", event.target.value);
        this.setState({inputValue: event.target.value});
    }

    componentWillUpdate(nextProps, nextState) {
        if ((nextProps.value !== this.props.value) && (nextProps.value !== this.state.inputValue)) {
            this.setState({inputValue: nextProps.value});
        }
    }

    render() {
        const {inputValue} = this.state;
        return (
            <div>
                String:
                <input type="text" value={inputValue} onChange={this.handleChange}/>
            </div>
        )
    }
}

export default StringField;