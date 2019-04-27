import React from 'react';
import f from './res/f.svg';
import s from './res/s.svg';
import o from './res/o.svg';
import './App.css';
import { SketchPicker } from 'react-color';
// Color Picker Component

class LetterBorder extends React.Component {
    state = {
        id: this.props.id,
        displayColorPicker: false,
        color: {
          r: '241',
          g: '112',
          b: '19',
          a: '1',
        },
     };
    
      handleClick = () => {
        this.setState({ displayColorPicker: !this.state.displayColorPicker })
      };
    
      handleClose = () => {
        this.setState({ displayColorPicker: false })
      };
    
      handleChange = (color) => {
        var xhr = new XMLHttpRequest();
        xhr.open('POST', "http://laptop.ewitherington.me:8000", true);
        xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
        xhr.send(JSON.stringify({
            "letter": this.props.id,  //replace with active letter
            "red": color.rgb.r,
            "green": color.rgb.g,
            "blue": color.rgb.b
            })
        );
        this.setState({ color: color.rgb })
      };

      render() {
        return (
          <div>
            <div className='swatch' onClick={ this.handleClick } style={{ background: this.state.color }}>
                {this.props.children}
            </div>
            { this.state.displayColorPicker ? <div className="popover">
              <div className="cover" onClick={ this.handleClose }/>
              <SketchPicker color={ this.state.color } onChange={ this.handleChange } />
            </div> : null }
    
          </div>
        )
      }
}


class Letter extends React.Component {
    state = {
        id: this.props.id,
    }

    render() {
        return (
            <LetterBorder id={this.state.id}>
                <img src={this.props.lettersvg} alt="" />                        
            </LetterBorder>
        )
    }
}

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <div>
            <Letter lettersvg={f} id="0" />
            <Letter lettersvg={o} id="1" />
            <Letter lettersvg={s} id="2" />
            <Letter lettersvg={s} id="3" />
      </div>
      </header>
    </div>
  );
}

export default App;
