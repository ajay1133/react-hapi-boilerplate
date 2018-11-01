import React, { Component }from 'react';
import './slider.css'
import PropTypes from 'prop-types';

export default class Slider extends Component {

  static propTypes = {
    slots: PropTypes.number,
    start: PropTypes.number,
    end: PropTypes.number,
    interval: PropTypes.number,
    onDrop: PropTypes.func,
  };

  constructor(props) {
    super(props);
    this.state = {
      slots: props.slots,
      start: props.start,
      end: props.end
    }
  }

  onDragOver = (e) => {
    e.preventDefault();
  }
  
  onDragStart = (e) => {
    let slider  = e.target.dataset.slider;
    this.sliderType = slider;
  }
  
  onDrag = (e) => {
  }

  onDrop = (e, target) => {
    let slot = Number(e.target.dataset.slot);
    if (isNaN(slot)) return;
    this.setState({
      start: slot
    })
    this.props.onDrop(slot)
  }
  

  MinSlider=()=> {
    return (
      <div data-slider="min" 
        onDragStart={this.onDragStart} 
        onTouchStart={this.onDragStart}
        onDrag = {this.onDrag}
        draggable className="slider-thumb slider-thumb-min">
      </div>
    );
  }

  render () {
    const { slots, start, end } = this.state;
    let slider=[];
    let minThumb = null;
    let maxThumb = null
    let interval = this.props.interval;
    let i = this.props.start;
    while (i <= slots) {
      if (i === start) {
        minThumb = <this.MinSlider />
      } else {
        minThumb = null;
        maxThumb = null;
      }
        
        
      let lineClass = "line";
      
      if (i > start && i <= end) {
         lineClass += " line-selected";
      }
      let name = "slot";
      if (i === start) {
        name = "slot selcted"
      }
      slider.push(
        <div 
        data-slot={i}
        onDragOver={this.onDragOver} 
        onTouchMove = {this.onDragOver}
        onTouchEnd = {this.onDrop}
        onDrop = {this.onDrop}
        key={i}
        className= {name } >
          <div  data-slot={i} className={lineClass}>{i}</div>
          <span className="scale-mark"></span>
          {minThumb}
          {maxThumb}
      </div>
      );
      i = i + interval
    }
    return (
      <div>
        <div className="example-1">
          <div className="slider-container">    
            <div className="slider">
              {slider}
            </div> 
            </div>
          </div>
        </div>  
    )
  }
}